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
  OAUTH_PROVIDER: {
    getOAuthApi(env: Env): any;
  };
}

type GoogleProps = { googleRefreshToken: string };

async function googleTokenRequest(env: Env, body: URLSearchParams) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const payload = await response.json() as {
    access_token?: string;
    refresh_token?: string;
    error?: string;
    error_description?: string;
  };
  if (!response.ok || !payload.access_token) {
    throw new Error(`Google OAuth failed: ${payload.error ?? response.status} ${payload.error_description ?? ""}`);
  }
  return payload;
}

async function googleAccessToken(env: Env, refreshToken: string) {
  const payload = await googleTokenRequest(env, new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  }));
  return payload.access_token!;
}

async function googleApi<T>(env: Env, props: GoogleProps, url: string, init: RequestInit = {}): Promise<T> {
  const accessToken = await googleAccessToken(env, props.googleRefreshToken);
  const response = await fetch(url, {
    ...init,
    headers: {
      authorization: `Bearer ${accessToken}`,
      ...(init.body ? { "content-type": "application/json" } : {}),
      ...init.headers,
    },
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Search Console API ${response.status}: ${text.slice(0, 1200)}`);
  return (text ? JSON.parse(text) : {}) as T;
}

function createMcpServer(env: Env) {
  const server = new McpServer({ name: "ticketdepart-search-console", version: "1.0.0" });
  const auth = getMcpAuthContext();
  const props = auth?.props as GoogleProps | undefined;

  const requireGoogle = () => {
    if (!props?.googleRefreshToken) throw new Error("Google Search Console is not connected. Reconnect Google authorization.");
    return props;
  };

  server.registerTool(
    "gsc_list_sites",
    {
      description: "List Search Console properties accessible to the connected Google account. Read-only.",
      inputSchema: z.object({}),
    },
    async () => {
      const data = await googleApi<{ siteEntry?: Array<{ siteUrl: string; permissionLevel: string }> }>(
        env, requireGoogle(), "https://searchconsole.googleapis.com/webmasters/v3/sites"
      );
      return { content: [{ type: "text", text: JSON.stringify(data.siteEntry ?? [], null, 2) }] };
    },
  );

  server.registerTool(
    "gsc_search_analytics",
    {
      description: "Read Search Console search analytics for a property and date range. Read-only; no data is changed.",
      inputSchema: z.object({
        siteUrl: z.string().min(1),
        startDate: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/),
        endDate: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/),
        dimensions: z.array(z.enum(["query", "page", "country", "device", "searchAppearance", "date"])).max(6).optional(),
        rowLimit: z.number().int().min(1).max(25000).optional(),
        type: z.enum(["web", "image", "video", "news", "discover", "googleNews"]).optional(),
      }),
    },
    async ({ siteUrl, startDate, endDate, dimensions, rowLimit, type }) => {
      const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
      const data = await googleApi(env, requireGoogle(), url, {
        method: "POST",
        body: JSON.stringify({
          startDate, endDate, dimensions: dimensions ?? ["query"],
          rowLimit: rowLimit ?? 1000, type: type ?? "web",
        }),
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.registerTool(
    "gsc_list_sitemaps",
    {
      description: "List submitted sitemaps for a Search Console property. Read-only.",
      inputSchema: z.object({ siteUrl: z.string().min(1) }),
    },
    async ({ siteUrl }) => {
      const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`;
      const data = await googleApi(env, requireGoogle(), url);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  return server;
}

const mcpHandler = createMcpHandler((_context) => {
  // The request context is populated by the OAuth provider middleware.
  // Env is captured by the wrapper below through the handler's request options.
  return createMcpServer((globalThis as unknown as { __gscEnv: Env }).__gscEnv);
});

async function defaultHandler(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const oauth = env.OAUTH_PROVIDER.getOAuthApi(env);

  if (url.pathname === "/authorize" && request.method === "GET") {
    const authRequest = await oauth.parseAuthRequest(request);
    const client = await oauth.lookupClient(authRequest.clientId);
    const consent = await oauth.beginConsent(authRequest);
    const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Authorize Search Console</title></head><body style="font:16px system-ui;max-width:560px;margin:48px auto;padding:0 20px"><h1>Connect Google Search Console</h1><p><b>${escapeHtml(client.clientName ?? client.clientId)}</b> is requesting read-only Search Console access.</p><p>Google permission: <code>webmasters.readonly</code>. This server exposes read-only reports and cannot change your Search Console settings.</p><form method="post" action="/authorize"><input type="hidden" name="handle" value="${escapeHtml(consent.handle)}"><button name="decision" value="allow">Continue to Google</button> <button name="decision" value="deny">Deny</button></form></body></html>`;
    return new Response(html, { headers: { ...Object.fromEntries(consent.headers), "content-type": "text/html; charset=utf-8" } });
  }

  if (url.pathname === "/authorize" && request.method === "POST") {
    const form = await request.formData();
    const handle = String(form.get("handle") ?? "");
    if (form.get("decision") !== "allow") {
      const denied = await oauth.denyConsent(request, handle);
      return Response.redirect(denied.redirectTo, 302);
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
      include_granted_scopes: "true",
      state: upstream.state,
      code_challenge: challenge,
      code_challenge_method: "S256",
    }).toString();
    upstream.headers.set("location", googleUrl.toString());
    return new Response(null, { status: 302, headers: upstream.headers });
  }

  if (url.pathname === "/google/callback" && request.method === "GET") {
    const finished = await oauth.finishUpstream<{ verifier: string }>(request);
    const code = url.searchParams.get("code");
    if (!code || url.searchParams.has("error")) {
      finished.headers.set("location", oauth.authorizationErrorRedirect(finished.request, "access_denied"));
      return new Response(null, { status: 302, headers: finished.headers });
    }
    const tokens = await googleTokenRequest(env, new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      code,
      code_verifier: finished.data.verifier,
      grant_type: "authorization_code",
      redirect_uri: env.GOOGLE_REDIRECT_URI,
    }));
    if (!tokens.refresh_token) {
      throw new Error("Google did not return a refresh token. Revoke the app grant and reconnect with offline access.");
    }
    const completed = await oauth.completeAuthorization({
      request: finished.request,
      userId: "google-search-console-user",
      metadata: {},
      scope: ["mcp:read"],
      props: { googleRefreshToken: tokens.refresh_token } satisfies GoogleProps,
    });
    finished.headers.set("location", completed.redirectTo);
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
  return btoa(binary).replace(/\\+/g, "-").replace(/\\//g, "_").replace(/=+$/g, "");
}

export default new OAuthProvider({
  apiRoute: "/mcp",
  apiHandler: async (request: Request, env: Env, ctx: ExecutionContext) => {
    (globalThis as unknown as { __gscEnv: Env }).__gscEnv = env;
    return mcpHandler(request, env, ctx);
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
  tokenExchangeCallback: async ({ grantType, props }: { grantType: string; props: GoogleProps }) => {
    if (grantType !== "refresh_token") return;
    // Google refresh tokens are long-lived; validate and refresh on each MCP token renewal.
    await googleAccessToken(
      { GOOGLE_CLIENT_ID: "", GOOGLE_CLIENT_SECRET: "" } as Env,
      props.googleRefreshToken,
    );
    return { newProps: props };
  },
});
