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
  RESEND_API_KEY: string;
  ALLOWED_EMAIL: string;
}

const AUTH_ISSUER = "https://trafficstars-auth.gaurav-pabbun.workers.dev";
const MCP_RESOURCE = "https://trafficstars-mcp.gaurav-pabbun.workers.dev/mcp";
const READ_SCOPE = "trafficstars:read";
const MANAGE_SCOPE = "trafficstars:manage";
const AUTHORIZED_SCOPES = [READ_SCOPE, MANAGE_SCOPE];
const EMAIL_CALLBACK = `${AUTH_ISSUER}/email/callback`;
const EMAIL_FROM = "TrafficStars Manager <onboarding@resend.dev>";
const LOGIN_TTL_SECONDS = 600;

const authorizationServer = new OAuthAuthorizationServer<Env>({
  issuer: AUTH_ISSUER,
  resources: [MCP_RESOURCE],
  scopesSupported: AUTHORIZED_SCOPES,
  disallowPublicClientRegistration: true,
});

interface UpstreamData {
  email: string;
}

function htmlEscape(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function htmlResponse(body: string, status = 200, suppliedHeaders?: Headers): Response {
  const headers = new Headers(suppliedHeaders);
  headers.set("Content-Type", "text/html; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "no-referrer");
  headers.set(
    "Content-Security-Policy",
    "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
  );
  headers.set("X-Frame-Options", "DENY");
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TrafficStars Manager</title></head><body>${body}</body></html>`,
    { status, headers },
  );
}

function localError(message: string, status = 400): Response {
  return htmlResponse(`<main><h1>TrafficStars Manager</h1><p>${htmlEscape(message)}</p></main>`, status);
}

function oauthErrorRedirect(
  request: AuthRequest,
  code: AuthorizationErrorCode,
  description: string,
  suppliedHeaders?: Headers,
): Response {
  const headers = new Headers(suppliedHeaders);
  headers.set("Location", authorizationErrorRedirect(request, code, description));
  headers.set("Cache-Control", "no-store");
  return new Response(null, { status: 302, headers });
}

function isAllowedScope(scopes: string[]): boolean {
  return scopes.includes(READ_SCOPE) && scopes.includes(MANAGE_SCOPE) && scopes.every((scope) => AUTHORIZED_SCOPES.includes(scope));
}

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return base64Url(new Uint8Array(digest));
}

function randomToken(): string {
  return base64Url(crypto.getRandomValues(new Uint8Array(32)));
}

function redirectWithHeaders(location: string, headers: Headers): Response {
  headers.set("Location", location);
  headers.set("Cache-Control", "no-store");
  return new Response(null, { status: 302, headers });
}

async function sendLoginEmail(env: Env, email: string, loginUrl: string): Promise<boolean> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [email],
        subject: "Your TrafficStars Manager sign-in link",
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6"><h2>TrafficStars Manager</h2><p>Use this one-time link to finish signing in. It expires in 10 minutes.</p><p><a href="${htmlEscape(loginUrl)}">Sign in to TrafficStars Manager</a></p><p>If you did not request this email, you can ignore it.</p></div>`,
        text: `Sign in to TrafficStars Manager using this one-time link (expires in 10 minutes): ${loginUrl}\n\nIf you did not request this email, ignore this message.`,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function authorize(request: Request, env: Env): Promise<Response> {
  const oauth = authorizationServer.getOAuthApi(env);

  if (request.method === "GET") {
    try {
      const authRequest = await oauth.parseAuthRequest(request);
      if (!isAllowedScope(authRequest.scope)) {
        return oauthErrorRedirect(authRequest, "invalid_scope", "Read and campaign-management access is required.");
      }

      const description = await oauth.describeConsent(authRequest);
      const consent = await oauth.beginConsent(authRequest);
      const scopes = description.scope.map((scope) => `<li>${htmlEscape(scope)}</li>`).join("");
      const body = `
        <main>
          <h1>Authorize TrafficStars Manager</h1>
          <p><strong>Application:</strong> ${htmlEscape(description.clientName)}</p>
          <p><strong>Redirect destination:</strong> ${htmlEscape(description.redirectHost)}</p>
          <p>This application requests permission to view account data and edit or manage campaigns in your configured TrafficStars account. Campaign activation and budget changes still require separate explicit approval.</p>
          <ul>${scopes}</ul>
          <form method="post" action="/authorize">
            <input type="hidden" name="handle" value="${htmlEscape(consent.handle)}">
            <label for="email">Approved sign-in email</label>
            <input id="email" name="email" type="email" autocomplete="email" required maxlength="254">
            <button type="submit" name="decision" value="allow">Email me a sign-in link</button>
            <button type="submit" name="decision" value="deny">Deny</button>
          </form>
        </main>`;
      return htmlResponse(body, 200, consent.headers);
    } catch (error) {
      if (error instanceof AuthorizationError && error.redirectTo) {
        return new Response(null, { status: 302, headers: { Location: error.redirectTo, "Cache-Control": "no-store" } });
      }
      return localError("The authorization request could not be validated.");
    }
  }

  if (request.method === "POST") {
    try {
      const form = await request.formData();
      const handle = String(form.get("handle") ?? "");
      const decision = String(form.get("decision") ?? "");
      if (!handle || handle.length > 4096) return localError("The consent form is invalid.");

      if (decision === "deny") {
        const denied = await oauth.denyConsent(request, handle);
        return redirectWithHeaders(denied.redirectTo, denied.headers);
      }
      if (decision !== "allow") return localError("The consent decision is invalid.");

      const submittedEmail = String(form.get("email") ?? "").trim().toLowerCase();
      const approvedEmail = env.ALLOWED_EMAIL?.trim().toLowerCase();
      if (!approvedEmail || submittedEmail !== approvedEmail || submittedEmail.length > 254) {
        return localError("If the address is authorized, a sign-in email will be sent. Check the address and try again.", 200);
      }
      if (!env.RESEND_API_KEY) return localError("Email sign-in is not configured yet.", 503);

      const approved = await oauth.approveConsent(request, handle, { scope: AUTHORIZED_SCOPES });
      const upstream = await oauth.beginUpstream(approved.request, {
        data: { email: approvedEmail } satisfies UpstreamData,
        headers: approved.headers,
      });

      const token = randomToken();
      const tokenHash = await sha256(token);
      await env.OAUTH_KV.put(`email-login:${tokenHash}`, approvedEmail, {
        expirationTtl: LOGIN_TTL_SECONDS,
      });

      const callback = new URL(EMAIL_CALLBACK);
      callback.searchParams.set("state", upstream.state);
      callback.searchParams.set("token", token);
      const sent = await sendLoginEmail(env, approvedEmail, callback.toString());

      if (!sent) {
        await env.OAUTH_KV.delete(`email-login:${tokenHash}`);
        return localError("The sign-in email could not be sent. Please try again later.", 503);
      }

      return htmlResponse(
        "<main><h1>Check your email</h1><p>If the address is authorized, a one-time sign-in link has been sent. The link expires in 10 minutes. Open it in this same browser.</p></main>",
        200,
        upstream.headers,
      );
    } catch (error) {
      if (error instanceof AuthorizationError && error.redirectTo) {
        return new Response(null, { status: 302, headers: { Location: error.redirectTo, "Cache-Control": "no-store" } });
      }
      return localError("The sign-in request could not be completed. Please restart authorization.", 400);
    }
  }

  return localError("Method not allowed.", 405);
}

async function emailCallback(request: Request, env: Env): Promise<Response> {
  const oauth = authorizationServer.getOAuthApi(env);
  let resumed;
  try {
    resumed = await oauth.finishUpstream<UpstreamData>(request);
  } catch {
    return localError("This sign-in link is invalid, expired, or was opened in a different browser. Restart authorization.", 400);
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";
  if (!token || token.length > 128 || !resumed.data?.email) {
    return oauthErrorRedirect(resumed.request, "access_denied", "The email sign-in link is invalid.", resumed.headers);
  }

  try {
    const tokenHash = await sha256(token);
    const key = `email-login:${tokenHash}`;
    const storedEmail = await env.OAUTH_KV.get(key);
    await env.OAUTH_KV.delete(key);

    const approvedEmail = env.ALLOWED_EMAIL?.trim().toLowerCase();
    if (
      !storedEmail ||
      storedEmail !== approvedEmail ||
      storedEmail !== resumed.data.email
    ) {
      return oauthErrorRedirect(resumed.request, "access_denied", "The email sign-in link is invalid or expired.", resumed.headers);
    }

    const userHash = await sha256(storedEmail);
    const result = await oauth.completeAuthorization({
      request: resumed.request,
      userId: `email-${userHash}`,
      metadata: { provider: "email" },
      scope: AUTHORIZED_SCOPES,
      props: { email: storedEmail },
    });
    return redirectWithHeaders(result.redirectTo, resumed.headers);
  } catch {
    return oauthErrorRedirect(resumed.request, "server_error", "Email sign-in could not be completed. Please try again.", resumed.headers);
  }
}

export default class TrafficStarsAuthServer extends WorkerEntrypoint<Env> {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.origin !== AUTH_ISSUER) return new Response("Not found", { status: 404 });

    if (url.pathname === "/authorize") return authorize(request, this.env);
    if (url.pathname === "/email/callback") {
      if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });
      return emailCallback(request, this.env);
    }
    return authorizationServer.fetch(request, this.env, this.ctx);
  }

  validateToken(resource: string, token: string) {
    return authorizationServer.validateToken(resource, token, this.env);
  }
}
