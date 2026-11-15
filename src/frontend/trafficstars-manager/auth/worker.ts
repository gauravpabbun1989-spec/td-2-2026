import { WorkerEntrypoint } from "cloudflare:workers";
import {
  AuthorizationError,
  OAuthAuthorizationServer,
  authorizationErrorRedirect,
  type AuthRequest,
  type AuthorizationErrorCode,
} from "@cloudflare/workers-oauth-provider";

interface Env {
  OAUTH_KV: KVNamespace;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}

const AUTH_ISSUER =
  "https://trafficstars-auth.gaurav-pabbun.workers.dev";
const MCP_RESOURCE =
  "https://trafficstars-mcp.gaurav-pabbun.workers.dev/mcp";
const READ_SCOPE = "trafficstars:read";

const GITHUB_LOGIN = "gauravpabbun";
const GITHUB_ID = 102061504;
const GITHUB_CALLBACK = `${AUTH_ISSUER}/github/callback`;

const authorizationServer = new OAuthAuthorizationServer<Env>({
  issuer: AUTH_ISSUER,
  resources: [MCP_RESOURCE],
  scopesSupported: [READ_SCOPE],
  disallowPublicClientRegistration: true,
});

interface UpstreamData {
  verifier: string;
}

function htmlEscape(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function htmlResponse(
  body: string,
  status = 200,
  suppliedHeaders?: Headers,
): Response {
  const headers = new Headers(suppliedHeaders);
  headers.set("Content-Type", "text/html; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "no-referrer");
  headers.set(
    "Content-Security-Policy",
    "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
  );

  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TrafficStars Manager authorization</title></head><body>${body}</body></html>`,
    { status, headers },
  );
}

function localError(message: string, status = 400): Response {
  return htmlResponse(
    `<main><h1>Authorization could not continue</h1><p>${htmlEscape(message)}</p></main>`,
    status,
  );
}

function oauthErrorRedirect(
  request: AuthRequest,
  code: AuthorizationErrorCode,
  description: string,
  suppliedHeaders?: Headers,
): Response {
  const headers = new Headers(suppliedHeaders);
  headers.set(
    "Location",
    authorizationErrorRedirect(request, code, description),
  );
  headers.set("Cache-Control", "no-store");
  return new Response(null, { status: 302, headers });
}

function isAllowedScope(scopes: string[]): boolean {
  return scopes.includes(READ_SCOPE) &&
    scopes.every((scope) => scope === READ_SCOPE);
}

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/u, "");
}

async function createPkcePair(): Promise<{
  verifier: string;
  challenge: string;
}> {
  const random = crypto.getRandomValues(new Uint8Array(48));
  const verifier = base64Url(random);
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );

  return {
    verifier,
    challenge: base64Url(new Uint8Array(digest)),
  };
}

function redirectWithHeaders(
  location: string,
  headers: Headers,
): Response {
  headers.set("Location", location);
  headers.set("Cache-Control", "no-store");
  return new Response(null, { status: 302, headers });
}

async function authorize(
  request: Request,
  env: Env,
): Promise<Response> {
  const oauth = authorizationServer.getOAuthApi(env);

  if (request.method === "GET") {
    try {
      const authRequest = await oauth.parseAuthRequest(request);

      if (!isAllowedScope(authRequest.scope)) {
        return oauthErrorRedirect(
          authRequest,
          "invalid_scope",
          "Only the trafficstars:read permission is supported.",
        );
      }

      const description = await oauth.describeConsent(authRequest);
      const consent = await oauth.beginConsent(authRequest);

      const scopeList = description.scope
        .map((scope) => `<li>${htmlEscape(scope)}</li>`)
        .join("");

      const loopbackWarning = description.redirectIsLoopback
        ? "<p><strong>Warning:</strong> This client redirects to a local address. A local process could receive the authorization response.</p>"
        : "";

      const body = `
        <main>
          <h1>Authorize TrafficStars Manager</h1>
          <p><strong>Application:</strong> ${htmlEscape(description.clientName)}</p>
          <p><strong>Redirect destination:</strong> ${htmlEscape(description.redirectHost)}</p>
          ${loopbackWarning}
          <p>This application is requesting permission to:</p>
          <ul>${scopeList}</ul>
          <p>Approval allows read-only access to the configured TrafficStars account through this MCP server.</p>
          <form method="post" action="/authorize">
            <input type="hidden" name="handle" value="${htmlEscape(consent.handle)}">
            <button type="submit" name="decision" value="allow">Continue with GitHub</button>
            <button type="submit" name="decision" value="deny">Deny</button>
          </form>
        </main>`;

      return htmlResponse(body, 200, consent.headers);
    } catch (error) {
      if (error instanceof AuthorizationError && error.redirectTo) {
        return new Response(null, {
          status: 302,
          headers: { Location: error.redirectTo, "Cache-Control": "no-store" },
        });
      }
      return localError("The authorization request could not be validated.");
    }
  }

  if (request.method === "POST") {
    try {
      const form = await request.formData();
      const handle = String(form.get("handle") ?? "");
      const decision = String(form.get("decision") ?? "");

      if (!handle || handle.length > 4096) {
        return localError("The consent form is invalid.");
      }

      if (decision === "deny") {
        const denied = await oauth.denyConsent(request, handle);
        return redirectWithHeaders(denied.redirectTo, denied.headers);
      }

      if (decision !== "allow") {
        return localError("The consent decision is invalid.");
      }

      const approved = await oauth.approveConsent(request, handle, {
        scope: [READ_SCOPE],
      });

      const pkce = await createPkcePair();
      const upstream = await oauth.beginUpstream(approved.request, {
        data: { verifier: pkce.verifier } satisfies UpstreamData,
        headers: approved.headers,
      });

      const githubUrl = new URL(
        "https://github.com/login/oauth/authorize",
      );
      githubUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
      githubUrl.searchParams.set("redirect_uri", GITHUB_CALLBACK);
      githubUrl.searchParams.set("state", upstream.state);
      githubUrl.searchParams.set("scope", "read:user");
      githubUrl.searchParams.set("code_challenge", pkce.challenge);
      githubUrl.searchParams.set("code_challenge_method", "S256");

      return redirectWithHeaders(
        githubUrl.toString(),
        upstream.headers,
      );
    } catch (error) {
      if (error instanceof AuthorizationError && error.redirectTo) {
        return new Response(null, {
          status: 302,
          headers: { Location: error.redirectTo, "Cache-Control": "no-store" },
        });
      }
      return localError(
        "Consent could not be verified. Restart the authorization process.",
      );
    }
  }

  return localError("Method not allowed.", 405);
}

async function revokeGitHubAccessToken(
  env: Env,
  accessToken: string,
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.github.com/applications/${encodeURIComponent(env.GITHUB_CLIENT_ID)}/token`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${btoa(`${env.GITHUB_CLIENT_ID}:${env.GITHUB_CLIENT_SECRET}`)}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
          "User-Agent": "TrafficStars-Manager",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({ access_token: accessToken }),
      },
    );

    return response.status === 204;
  } catch {
    return false;
  }
}

async function githubCallback(
  request: Request,
  env: Env,
): Promise<Response> {
  const oauth = authorizationServer.getOAuthApi(env);

  let resumed;
  try {
    resumed = await oauth.finishUpstream<UpstreamData>(request);
  } catch {
    return localError(
      "The GitHub sign-in session is invalid or expired. Start again.",
    );
  }

  const callbackUrl = new URL(request.url);
  if (callbackUrl.searchParams.has("error")) {
    return oauthErrorRedirect(
      resumed.request,
      "access_denied",
      "GitHub sign-in was cancelled or denied.",
      resumed.headers,
    );
  }

  const code = callbackUrl.searchParams.get("code");
  if (!code || !resumed.data?.verifier) {
    return oauthErrorRedirect(
      resumed.request,
      "access_denied",
      "GitHub did not complete sign-in.",
      resumed.headers,
    );
  }

  try {
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: GITHUB_CALLBACK,
          code_verifier: resumed.data.verifier,
        }),
      },
    );

    if (!tokenResponse.ok) {
      return oauthErrorRedirect(
        resumed.request,
        "access_denied",
        "GitHub sign-in could not be verified.",
        resumed.headers,
      );
    }

    const tokenData = await tokenResponse.json() as {
      access_token?: unknown;
      error?: unknown;
    };

    if (
      typeof tokenData.access_token !== "string" ||
      tokenData.access_token.length === 0
    ) {
      return oauthErrorRedirect(
        resumed.request,
        "access_denied",
        "GitHub did not provide a valid sign-in token.",
        resumed.headers,
      );
    }

    let profileResponse: Response | null = null;
    let revocationSucceeded = false;

    try {
      profileResponse = await fetch(
        "https://api.github.com/user",
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            Accept: "application/vnd.github+json",
            "User-Agent": "TrafficStars-Manager",
            "X-GitHub-Api-Version": "2022-11-28",
          },
        },
      );
    } finally {
      revocationSucceeded = await revokeGitHubAccessToken(
        env,
        tokenData.access_token,
      );
    }

    if (!revocationSucceeded) {
      return oauthErrorRedirect(
        resumed.request,
        "server_error",
        "GitHub sign-in could not be securely completed. Please try again.",
        resumed.headers,
      );
    }

    if (!profileResponse) {
      return oauthErrorRedirect(
        resumed.request,
        "server_error",
        "GitHub sign-in could not be completed. Please try again.",
        resumed.headers,
      );
    }

    if (!profileResponse.ok) {
      return oauthErrorRedirect(
        resumed.request,
        "access_denied",
        "GitHub identity verification failed.",
        resumed.headers,
      );
    }

    const profile = await profileResponse.json() as {
      id?: unknown;
      login?: unknown;
    };

    if (
      profile.id !== GITHUB_ID ||
      profile.login !== GITHUB_LOGIN
    ) {
      return oauthErrorRedirect(
        resumed.request,
        "access_denied",
        "This GitHub account is not authorized to use this service.",
        resumed.headers,
      );
    }

    const result = await oauth.completeAuthorization({
      request: resumed.request,
      userId: `github-${GITHUB_ID}`,
      metadata: {
        provider: "github",
        login: GITHUB_LOGIN,
      },
      scope: [READ_SCOPE],
      props: {
        githubId: GITHUB_ID,
        githubLogin: GITHUB_LOGIN,
      },
    });

    return redirectWithHeaders(result.redirectTo, resumed.headers);
  } catch {
    return oauthErrorRedirect(
      resumed.request,
      "server_error",
      "The sign-in service encountered an error. Please try again.",
      resumed.headers,
    );
  }
}

export default class TrafficStarsAuthServer extends WorkerEntrypoint<Env> {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.origin !== AUTH_ISSUER) {
      return new Response("Not found", { status: 404 });
    }

    if (url.pathname === "/authorize") {
      return authorize(request, this.env);
    }

    if (url.pathname === "/github/callback") {
      if (request.method !== "GET") {
        return new Response("Method not allowed", { status: 405 });
      }
      return githubCallback(request, this.env);
    }

    return authorizationServer.fetch(request, this.env, this.ctx);
  }

  validateToken(resource: string, token: string) {
    return authorizationServer.validateToken(resource, token, this.env);
  }
}
