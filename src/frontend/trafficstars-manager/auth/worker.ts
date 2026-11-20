// @ts-nocheck
import { WorkerEntrypoint as WorkerEntrypoint2 } from "cloudflare:workers";
import { AuthorizationError, OAuthAuthorizationServer, authorizationErrorRedirect } from "@cloudflare/workers-oauth-provider";

var AUTH_ISSUER = "https://trafficstars-auth.gaurav-pabbun.workers.dev";
var MCP_RESOURCE = "https://trafficstars-mcp.gaurav-pabbun.workers.dev/mcp";
var READ_SCOPE = "trafficstars:read";
var MANAGE_SCOPE = "trafficstars:manage";
var GOOGLE_CALLBACK = `${AUTH_ISSUER}/google/callback`;
var authorizationServer = new OAuthAuthorizationServer({
  issuer: AUTH_ISSUER,
  clientIdMetadataDocumentEnabled: true,
  resources: [MCP_RESOURCE],
  scopesSupported: [READ_SCOPE, MANAGE_SCOPE],
  disallowPublicClientRegistration: true
});
function htmlEscape(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function htmlResponse(body, status = 200, suppliedHeaders, scriptNonce) {
  const headers = new Headers(suppliedHeaders);
  headers.set("Content-Type", "text/html; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "no-referrer");
  headers.set(
    "Content-Security-Policy",
    scriptNonce ? `default-src 'none'; style-src 'unsafe-inline'; form-action 'self' https://accounts.google.com; base-uri 'none'; frame-ancestors 'none'; script-src 'nonce-${scriptNonce}'` : "default-src 'none'; style-src 'unsafe-inline'; form-action 'self' https://accounts.google.com; base-uri 'none'; frame-ancestors 'none'"
  );
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TrafficStars Manager authorization</title></head><body>${body}</body></html>`,
    { status, headers }
  );
}
function localError(message, status = 400) {
  return htmlResponse(
    `<main><h1>Authorization could not continue</h1><p>${htmlEscape(message)}</p></main>`,
    status
  );
}
function oauthErrorRedirect(request, code, description, suppliedHeaders) {
  const headers = new Headers(suppliedHeaders);
  headers.set(
    "Location",
    authorizationErrorRedirect(request, code, description)
  );
  headers.set("Cache-Control", "no-store");
  return new Response(null, { status: 302, headers });
}
function isAllowedScope(scopes) {
  return scopes.includes(READ_SCOPE) && scopes.includes(MANAGE_SCOPE) && scopes.every((scope) => scope === READ_SCOPE || scope === MANAGE_SCOPE);
}
function base64Url(bytes) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}
async function createPkcePair() {
  const random = crypto.getRandomValues(new Uint8Array(48));
  const verifier = base64Url(random);
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier)
  );
  return {
    verifier,
    challenge: base64Url(new Uint8Array(digest))
  };
}
function redirectWithHeaders(location, headers) {
  const responseHeaders = new Headers(headers);
  responseHeaders.set("Location", location);
  responseHeaders.set("Cache-Control", "no-store");
  responseHeaders.set("Pragma", "no-cache");
  const response = new Response(null, {
    status: 303,
    headers: responseHeaders
  });
  const actualLocation = response.headers.get("Location");
  let destination = { hostname: "missing", pathname: "missing" };
  try {
    const parsed = new URL(actualLocation || "");
    destination = {
      hostname: parsed.hostname,
      pathname: parsed.pathname
    };
  } catch {
  }
  console.log("OAUTH_DIAG: REDIRECT_RESPONSE_READY", {
    status: response.status,
    hasLocation: Boolean(actualLocation),
    destination,
    hasSetCookie: response.headers.has("Set-Cookie")
  });
  return response;
}
async function authorize(request, env) {
  const oauth = authorizationServer.getOAuthApi(env);
  if (request.method === "GET") {
    try {
      const authRequest = await oauth.parseAuthRequest(request);
      if (!isAllowedScope(authRequest.scope)) {
        return oauthErrorRedirect(
          authRequest,
          "invalid_scope",
          "Both read and campaign-management permissions are required."
        );
      }
      const description = await oauth.describeConsent(authRequest);
      const consent = await oauth.beginConsent(authRequest);
      const scopeList = description.scope.map((scope) => `<li>${htmlEscape(scope)}</li>`).join("");
      const submitNonce = base64Url(crypto.getRandomValues(new Uint8Array(18)));
      const loopbackWarning = description.redirectIsLoopback ? "<p><strong>Warning:</strong> This client redirects to a local address. A local process could receive the authorization response.</p>" : "";
      const body = `
        <main>
          <h1>Authorize TrafficStars Manager</h1>
          <p><strong>Application:</strong> ${htmlEscape(description.clientName)}</p>
          <p><strong>Redirect destination:</strong> ${htmlEscape(description.redirectHost)}</p>
          ${loopbackWarning}
          <p>This application is requesting permission to:</p>
          <ul>${scopeList}</ul>
          <p>Approval allows viewing account data and editing or managing campaigns. Campaign activation and budget changes still require separate explicit approval.</p>
          <form method="post" action="/authorize">
            <input type="hidden" name="handle" value="${htmlEscape(consent.handle)}">
            <button type="submit" name="decision" value="allow">Continue with Google</button>
            <button type="submit" name="decision" value="deny">Deny</button>
          </form>
          <script nonce="${submitNonce}">
            const consentForm = document.querySelector("form");
            let consentSubmitted = false;
            consentForm?.addEventListener("submit", (event) => {
              if (consentSubmitted) {
                event.preventDefault();
                return;
              }
              consentSubmitted = true;
              for (const button of consentForm.querySelectorAll("button")) {
                if (button !== event.submitter) button.disabled = true;
              }
            });
          <\/script>
        </main>`;
      return htmlResponse(body, 200, consent.headers, submitNonce);
    } catch (error) {
      if (error instanceof AuthorizationError && error.redirectTo) {
        return new Response(null, {
          status: 302,
          headers: { Location: error.redirectTo, "Cache-Control": "no-store" }
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
        scope: [READ_SCOPE, MANAGE_SCOPE]
      });
      const pkce = await createPkcePair();
      const upstream = await oauth.beginUpstream(approved.request, {
        data: { verifier: pkce.verifier },
        headers: approved.headers
      });
      const googleUrl = new URL(
        "https://accounts.google.com/o/oauth2/v2/auth"
      );
      googleUrl.searchParams.set("client_id", env.GOOGLE_CLIENT_ID);
      googleUrl.searchParams.set("redirect_uri", GOOGLE_CALLBACK);
      googleUrl.searchParams.set("response_type", "code");
      googleUrl.searchParams.set("scope", "openid email profile");
      googleUrl.searchParams.set("state", upstream.state);
      googleUrl.searchParams.set("code_challenge", pkce.challenge);
      googleUrl.searchParams.set("code_challenge_method", "S256");
      console.log("OAUTH_DIAG: GOOGLE_REDIRECT_READY", {
        hostname: googleUrl.hostname,
        pathname: googleUrl.pathname,
        hasState: Boolean(upstream.state),
        hasCookie: upstream.headers.has("Set-Cookie")
      });
      return redirectWithHeaders(
        googleUrl.toString(),
        upstream.headers
      );
    } catch (error) {
      if (error instanceof AuthorizationError && error.redirectTo) {
        return new Response(null, {
          status: 302,
          headers: { Location: error.redirectTo, "Cache-Control": "no-store" }
        });
      }
      return localError(
        "Consent could not be verified. Restart the authorization process."
      );
    }
  }
  return localError("Method not allowed.", 405);
}
async function googleCallback(request, env) {
  const oauth = authorizationServer.getOAuthApi(env);
  let diagStage = "callback_started";
  console.log("OAUTH_DIAG: CALLBACK_STARTED");
  let resumed;
  try {
    diagStage = "session_restore";
    resumed = await oauth.finishUpstream(request);
    console.log("OAUTH_DIAG: SESSION_RESTORED");
  } catch (error) {
    console.log("OAUTH_DIAG: SESSION_RESTORE_FAILED", {
      errorType: error instanceof Error ? error.name : "unknown"
    });
    return localError(
      "The Google sign-in session is invalid or expired. Start again."
    );
  }
  const callbackUrl = new URL(request.url);
  diagStage = "callback_parameters";
  if (callbackUrl.searchParams.has("error")) {
    console.log("OAUTH_DIAG: GOOGLE_RETURNED_ERROR");
    return oauthErrorRedirect(
      resumed.request,
      "access_denied",
      "Google sign-in was cancelled or denied.",
      resumed.headers
    );
  }
  const code = callbackUrl.searchParams.get("code");
  if (!code || !resumed.data?.verifier) {
    console.log("OAUTH_DIAG: CALLBACK_CODE_OR_VERIFIER_MISSING", {
      hasCode: Boolean(code),
      hasVerifier: Boolean(resumed.data?.verifier)
    });
    return oauthErrorRedirect(
      resumed.request,
      "access_denied",
      "Google did not complete sign-in.",
      resumed.headers
    );
  }
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.ALLOWED_EMAIL) {
    return oauthErrorRedirect(
      resumed.request,
      "server_error",
      "Google sign-in is not fully configured.",
      resumed.headers
    );
  }
  try {
    diagStage = "google_token_exchange";
    const tokenResponse = await fetch(
      "https://oauth2.googleapis.com/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json"
        },
        body: new URLSearchParams({
          client_id: env.GOOGLE_CLIENT_ID,
          client_secret: env.GOOGLE_CLIENT_SECRET,
          code,
          grant_type: "authorization_code",
          redirect_uri: GOOGLE_CALLBACK,
          code_verifier: resumed.data.verifier
        })
      }
    );
    let googleTokenErrorCode = "unavailable";
    if (!tokenResponse.ok) {
      try {
        const errorData = await tokenResponse.clone().json();
        if (typeof errorData.error === "string") {
          googleTokenErrorCode = errorData.error.slice(0, 80);
        }
      } catch {
        googleTokenErrorCode = "unparseable_error_response";
      }
    }
    console.log("OAUTH_DIAG: GOOGLE_TOKEN_RESULT", {
      status: tokenResponse.status,
      ok: tokenResponse.ok,
      errorCode: googleTokenErrorCode
    });
    if (!tokenResponse.ok) {
      return oauthErrorRedirect(
        resumed.request,
        "access_denied",
        "Google sign-in could not be verified.",
        resumed.headers
      );
    }
    const tokenData = await tokenResponse.json();
    if (typeof tokenData.access_token !== "string" || tokenData.access_token.length === 0) {
      return oauthErrorRedirect(
        resumed.request,
        "access_denied",
        "Google did not provide a valid sign-in token.",
        resumed.headers
      );
    }
    diagStage = "google_profile_verification";
    const profileResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: "application/json"
        }
      }
    );
    console.log("OAUTH_DIAG: GOOGLE_PROFILE_RESULT", {
      status: profileResponse.status,
      ok: profileResponse.ok
    });
    if (!profileResponse.ok) {
      return oauthErrorRedirect(
        resumed.request,
        "access_denied",
        "Google identity verification failed.",
        resumed.headers
      );
    }
    const profile = await profileResponse.json();
    if (typeof profile.sub !== "string" || !profile.sub || typeof profile.email !== "string" || profile.email_verified !== true) {
      return oauthErrorRedirect(
        resumed.request,
        "access_denied",
        "Google did not provide a verified account identity.",
        resumed.headers
      );
    }
    const email = profile.email.trim().toLowerCase();
    const allowedEmail = env.ALLOWED_EMAIL.trim().toLowerCase();
    console.log("OAUTH_DIAG: ALLOWED_ACCOUNT_CHECK", {
      configured: Boolean(allowedEmail),
      matched: Boolean(allowedEmail && email === allowedEmail)
    });
    if (!allowedEmail || email !== allowedEmail) {
      return oauthErrorRedirect(
        resumed.request,
        "access_denied",
        "This Google account is not authorized to use this service.",
        resumed.headers
      );
    }
    diagStage = "complete_authorization";
    console.log("OAUTH_DIAG: AUTHORIZATION_COMPLETION_STARTED");
    const result = await oauth.completeAuthorization({
      request: resumed.request,
      userId: `google-${profile.sub}`,
      metadata: {
        provider: "google",
        email
      },
      scope: [READ_SCOPE],
      props: {
        googleSub: profile.sub,
        email
      }
    });
    console.log("OAUTH_DIAG: AUTHORIZATION_COMPLETED");
    diagStage = "final_redirect";
    return redirectWithHeaders(result.redirectTo, resumed.headers);
  } catch (error) {
    console.log("OAUTH_DIAG: CALLBACK_FAILED", {
      stage: diagStage,
      errorType: error instanceof Error ? error.name : "unknown"
    });
    return oauthErrorRedirect(
      resumed.request,
      "server_error",
      "The Google sign-in service encountered an error. Please try again.",
      resumed.headers
    );
  }
}
var TrafficStarsAuthServer = class extends WorkerEntrypoint2 {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.origin !== AUTH_ISSUER) {
      return new Response("Not found", { status: 404 });
    }
    if (url.pathname === "/authorize") {
      return authorize(request, this.env);
    }
    if (url.pathname === "/google/callback") {
      if (request.method !== "GET") {
        return new Response("Method not allowed", { status: 405 });
      }
      return googleCallback(request, this.env);
    }
    return authorizationServer.fetch(request, this.env, this.ctx);
  }
  async validateToken(resource, token) {
    const parts = token.split(":");
    const tokenFormatValid = parts.length === 3;
    let recordFound = false;
    let expired = null;
    let audienceMatch = null;
    let stage = "kv_lookup";
    try {
      if (tokenFormatValid) {
        const digest = await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(token)
        );
        const tokenId = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
        const key = `token:${parts[0]}:${parts[1]}:${tokenId}`;
        const tokenData = await this.env.OAUTH_KV.get(key, { type: "json" });
        recordFound = tokenData !== null;
        if (tokenData) {
          const expiresAt = tokenData.expiresAt;
          expired = typeof expiresAt === "number" ? expiresAt < Math.floor(Date.now() / 1e3) : null;
          const audience = tokenData.audience;
          audienceMatch = audience === void 0 || audience === MCP_RESOURCE || Array.isArray(audience) && audience.includes(MCP_RESOURCE);
        }
      }
      stage = "provider_validation";
      const result = await authorizationServer.validateToken(
        resource,
        token,
        this.env
      );
      console.log("OAUTH_DIAG: TOKEN_VALIDATION", {
        tokenFormatValid,
        resourceMatchesExpected: resource === MCP_RESOURCE,
        recordFound,
        expired,
        audienceMatch,
        validationResult: result ? "valid" : "rejected"
      });
      return result;
    } catch (error) {
      console.log("OAUTH_DIAG: TOKEN_VALIDATION_ERROR", {
        stage,
        tokenFormatValid,
        recordFound,
        errorType: error instanceof Error ? error.name : "unknown"
      });
      throw error;
    }
  }
};
export {
  TrafficStarsAuthServer as default
};

--a8cbe812c458ed723c95b8282b593a27b3046dc476b1f42899b17e072a1b--