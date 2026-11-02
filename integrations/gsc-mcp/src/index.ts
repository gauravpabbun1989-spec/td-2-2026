import OAuthProvider from "@cloudflare/workers-oauth-provider";
import { McpServer } from "@modelcontextprotocol/server";
import { createMcpHandler, getMcpAuthContext } from "agents/mcp/server";
import { z } from "zod";

interface Env {
  OAUTH_KV: KVNamespace;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REDIRECT_URI: string;
  MCP_RESOURCE_URL: string;
  OAUTH_PROVIDER: { getOAuthApi(env: Env): any };
}
type GoogleProps = { googleRefreshToken: string };

async function exchangeGoogleToken(env: Env, body: URLSearchParams) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const result = await response.json() as {
    access_token?: string; refresh_token?: string; error?: string; error_description?: string;
  };
  if (!response.ok || !result.access_token) {
    throw new Error(`Google OAuth failed: ${result.error ?? response.status} ${result.error_description ?? ""}`);
  }
  return result;
}

async function getGoogleAccessToken(env: Env, refreshToken: string) {
  const result = await exchangeGoogleToken(env, new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  }));
  return result.access_token!;
}

async function gscRequest<T>(env: Env, props: GoogleProps, url: string, init: RequestInit = {}): Promise<T> {
  const token = await getGoogleAccessToken(env, props.googleRefreshToken);
  const response = await fetch(url, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      ...(init.body ? { "content-type": "application/json" } : {}),
      ...init.headers,
    },
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`Search Console API ${response.status}: ${body.slice(0, 1200)}`);
  return (body ? JSON.parse(body) : {}) as T;
}

function createGscMcpServer(env: Env) {
  const server = new McpServer({ name: "ticketdepart-search-console", version: "1.0.0" });
  const props = getMcpAuthContext()?.props as GoogleProps | undefined;
  const connectedGoogle = () => {
    if (!props?.googleRefreshToken) throw new Error("Google Search Console is not connected. Re-authorize Google.");
    return props;
  };

  server.registerTool("gsc_list_sites", {
    description: "List Search Console properties accessible to the connected Google account. Read-only.",
    inputSchema: z.object({}),
  }, async () => {
    const result = await gscRequest<{ siteEntry?: Array<{ siteUrl: string; permissionLevel: string }> }>(
      env, connectedGoogle(), "https://searchconsole.googleapis.com/webmasters/v3/sites",
    );
    return { content: [{ type: "text", text: JSON.stringify(result.siteEntry ?? [], null, 2) }] };
  });

  server.registerTool("gsc_search_analytics", {
    description: "Read Search Console search analytics for a property and date range. This tool cannot modify data.",
    inputSchema: z.object({
      siteUrl: z.string().min(1),
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      dimensions: z.array(z.enum(["query", "page", "country", "device", "searchAppearance", "date"])).max(6).optional(),
      rowLimit: z.number().int().min(1).max(25000).optional(),
      type: z.enum(["web", "image", "video", "news", "discover", "googleNews"]).optional(),
    }),
  }, async ({ siteUrl, startDate, endDate, dimensions, rowLimit, type }) => {
    const endpoint = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
    const result = await gscRequest(env, connectedGoogle(), endpoint, {
      method: "POST",
      body: JSON.stringify({
        startDate, endDate, dimensions: dimensions ?? ["query"],
        rowLimit: rowLimit ?? 1000, type: type ?? "web",
      }),
    });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  });

  server.registerTool("gsc_list_sitemaps", {
    description: "List submitted sitemaps for a Search Console property. Read-only.",
    inputSchema: z.object({ siteUrl: z.string().min(1) }),
  }, async ({ siteUrl }) => {
    const endpoint = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`;
    const result = await gscRequest(env, connectedGoogle(), endpoint);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  });

  return server;
}

async function defaultHandler(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const oauth = env.OAUTH_PROVIDER.getOAuthApi(env);

  if (url.pathname === "/authorize" && request.method === "GET") {
    const authRequest = await oauth.parseAuthRequest(request);
    const details = await oauth.describeConsent(authRequest);
    const consent = await oauth.beginConsent(authRequest);
    const name = escapeHtml(details.clientName);
    const clientOrigin = details.clientDomain
      ? `Published by <strong>${escapeHtml(details.clientDomain)}</strong>.`
      : "This app registered itself; its name is not verified.";
    const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Authorize Search Console</title></head><body style="font:16px system-ui;max-width:560px;margin:48px auto;padding:0 20px"><h1>Connect Google Search Console</h1><p>Allow <strong>${name}</strong> (${clientOrigin}) to receive access at <strong>${escapeHtml(details.redirectHost)}</strong>?</p><p>This grants read-only Google Search Console access using <code>webmasters.readonly</code>. It cannot change properties, submit sitemaps, or remove URLs.</p><form method="post" action="/authorize"><input type="hidden" name="handle" value="${escapeHtml(consent.handle)}"><button name="decision" value="approve">Continue to Google</button> <button name="decision" value="deny">Deny</button></form></body></html>`;
    consent.headers.set("content-type", "text/html; charset=utf-8");
    return new Response(html, { headers: consent.headers });
  }

  if (url.pathname === "/authorize" && request.method === "POST") {
    const form = await request.formData();
    const handle = String(form.get("handle") ?? "");
    if (form.get("decision") !== "approve") {
      const denied = await oauth.denyConsent(request, handle);
      return new Response(null, { status: 302, headers: denied.headers });
    }
    const approved = await oauth.approveConsent(request, handle, { scope: ["mcp:read"] });
    const verifier = `${crypto.randomUUID()}-${crypto.randomUUID()}`;
    const upstream = await oauth.beginUpstream(approved.request, {
      data: { verifier }, headers: approved.headers,
    });
    const challenge = await pkceChallenge(verifier);
    const googleUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    googleUrl.search = new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      redirect_uri: env.GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      access_type: "offline",
      prompt: "consent",
      state: upstream.state,
      code_challenge: challenge,
      code_challenge_method: "S256",
    }).toString();
    upstream.headers.set("Location", googleUrl.toString());
    return new Response(null, { status: 302, headers: upstream.headers });
  }

  if (url.pathname === "/google/callback" && request.method === "GET") {
    const finished = await oauth.finishUpstream<{ verifier: string }>(request);
    const code = url.searchParams.get("code");
    if (!code || url.searchParams.has("error")) {
      return new Response("Google authorization was declined. Return to ChatGPT and try again.", {
        status: 400, headers: finished.headers,
      });
    }
    const tokens = await exchangeGoogleToken(env, new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      code,
      code_verifier: finished.data.verifier,
      grant_type: "authorization_code",
      redirect_uri: env.GOOGLE_REDIRECT_URI,
    }));
    if (!tokens.refresh_token) {
      throw new Error("Google did not issue a refresh token. Revoke the existing grant and reconnect with offline access.");
    }
    const completed = await oauth.completeAuthorization({
      request: finished.request,
      userId: "google-search-console-owner",
      metadata: {},
      scope: ["mcp:read"],
      props: { googleRefreshToken: tokens.refresh_token } satisfies GoogleProps,
    });
    finished.headers.set("Location", completed.redirectTo);
    return new Response(null, { status: 302, headers: finished.headers });
  }

  if (url.pathname === "/health") return Response.json({ ok: true, service: "ticketdepart-gsc-mcp" });
  return new Response("Not found", { status: 404 });
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]!);
}

async function pkceChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  let binary = "";
  for (const byte of new Uint8Array(digest)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export default new OAuthProvider({
  apiRoute: "/mcp",
  apiHandler: async (request: Request, env: Env, ctx: ExecutionContext) => {
    const handler = createMcpHandler(() => createGscMcpServer(env));
    return handler(request, env, ctx);
  },
  defaultHandler,
  authorizeEndpoint: "/authorize",
  tokenEndpoint: "/oauth/token",
  scopesSupported: ["mcp:read", "offline_access"],
  resourceMetadata: {
    resource: "https://ticketdepart-gsc-mcp.REPLACE_WITH_WORKERS_SUBDOMAIN.workers.dev/mcp",
    authorization_servers: ["https://ticketdepart-gsc-mcp.REPLACE_WITH_WORKERS_SUBDOMAIN.workers.dev"],
  },
  requiredScopes: ["mcp:read"],
  clientIdMetadataDocumentEnabled: true,
});
