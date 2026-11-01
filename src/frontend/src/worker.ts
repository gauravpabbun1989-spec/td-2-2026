export type StaticAssetBinding = {
  fetch(request: Request): Promise<Response>;
};

export type Env = {
  ASSETS: StaticAssetBinding;
};

const BLOCKED_SEGMENTS = new Set([
  ".git",
  ".hg",
  ".svn",
  ".ssh",
  ".aws",
  ".dockerenv",
  ".bashrc",
  ".npmrc",
  ".zshrc",
  "wp-admin",
  "wp-includes",
  "wp-content",
  "phpmyadmin",
  "cgi-bin",
  "phpunit",
  "actuator",
]);

const EXACT_PROBE_PATHS = new Set([
  "/.env",
  "/.env::$data",
  "/.flaskenv",
  "/.git/config",
  "/.git-secret",
  "/.circleci/config.yml",
  "/.aws/credentials",
  "/id_rsa",
  "/etc/passwd",
  "/wp-login.php",
  "/wp-config.php",
  "/wp-json",
  "/xmlrpc.php",
  "/phpinfo.php",
  "/php-info.php",
  "/config.php",
  "/composer.json",
  "/database.sql",
  "/dump.sql",
  "/backup.sql",
  "/server-status",
  "/server.key",
  "/key.pem",
  "/aws-credentials.txt",
  "/webpack.config.js",
  "/debug/default/view",
  "/app_dev.php/_profiler/open",
  "/serverless.yaml",
  "/ssl/server.key",
  "/proc/self/environ",
  "/var/run/secrets/kubernetes.io/serviceaccount/token",
  "/.ds_store",
  "/dockerfile",
  "/secrets.env",
  "/api/proc/self/environ",
  "/api/fs/read",
  "/api/system/fileview",
  "/api/console/api_server",
]);

// Keep this allowlist aligned with the route definitions in scripts/generate-route-html.mjs.
// The static-route audit verifies every generated route is represented here.
const KNOWN_HTML_ROUTE_PATHS = new Set<string>([
  "/",
  "/flight-search",
  "/admin/leads",
  "/flight-search-results",
  "/book-a-flight-by-phone",
  "/how-to-book-a-flight-by-phone",
  "/international-flight-booking",
  "/last-minute-flight-booking",
  "/multi-city-flight-booking",
  "/group-flight-booking",
  "/cheap-flight-booking-by-phone",
  "/corporate-flight-booking",
  "/business-class-flight-booking",
  "/same-day-flight-booking",
  "/family-flight-booking",
  "/pet-flight-booking",
  "/baggage-assistance",
  "/flight-change-assistance",
  "/flight-cancellation-assistance",
  "/airline-reservation-assistance",
  "/flight-booking",
  "/flight-booking-assistance",
  "/delta-airlines",
  "/united-airlines",
  "/american-airlines",
  "/southwest-airlines",
  "/jetblue-airways",
  "/alaska-airlines",
  "/british-airways",
  "/lufthansa",
  "/air-canada",
  "/swiss-air",
  "/qatar-airways",
  "/emirates",
  "/norse-atlantic-airways",
  "/flights-usa-to-canada",
  "/flights-usa-to-uk",
  "/flights-usa-to-europe",
  "/flights-usa-to-mexico",
  "/flights-from-new-york",
  "/flights-from-los-angeles",
  "/flights-from-chicago",
  "/flights-from-miami",
  "/flights-from-atlanta",
  "/flights-from-dallas",
  "/flights-from-orlando",
  "/flights-from-san-francisco",
  "/flights-new-york-to-london",
  "/flights-los-angeles-to-tokyo",
  "/flights-los-angeles-to-london",
  "/flights-new-york-to-paris",
  "/flights-new-york-to-dubai",
  "/flights-chicago-to-london",
  "/flights-miami-to-cancun",
  "/flights-san-francisco-to-tokyo",
  "/contact",
  "/privacy",
  "/terms",
  "/disclaimer",
  "/404.html",
]);
/**
 * Decode bounded URL-encoding layers before applying path security rules.
 * Malformed escapes are left unchanged and still pass through the other checks.
 */
export function normalizeRequestPath(pathname: string) {
  let path = pathname.toLowerCase();

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const decoded = decodeURIComponent(path);
      if (decoded === path) break;
      path = decoded;
    } catch {
      break;
    }
  }

  return path.replace(/\\/g, "/").replace(/\/+$/, "") || "/";
}

/** Paths that must never be served as application routes or static assets. */
export function isRejectedRequestPath(pathname: string) {
  const path = normalizeRequestPath(pathname);

  if (/\/null$/i.test(path) || path.startsWith("//")) return true;
  if (EXACT_PROBE_PATHS.has(path)) return true;

  const segments = path.split("/").filter(Boolean);
  if (
    segments.some(
      (segment) =>
        BLOCKED_SEGMENTS.has(segment) ||
        /^\.env(?:\.|$)/i.test(segment) ||
        /^\.git(?:-|$)/i.test(segment),
    )
  ) {
    return true;
  }

  if (
    /^\/api\/(?:proc\/self|fs\/read|system\/fileview|console\/api_server)(?:\/|$)/i.test(
      path,
    )
  ) {
    return true;
  }

  return (
    /(?:^|\/)(?:config|credentials|secrets?|database|dump|backup|wp-config|phpinfo|php-info)\.(?:php|txt|json|sql|bak|old|save|yml|yaml)$/i.test(
      path,
    ) ||
    /(?:^|\/)(?:var\/log|proc\/self|etc\/passwd|debug\/default\/view|app_dev\.php\/_profiler|_next\/webpack-hmr|webpack-hmr)(?:\/|$)/i.test(
      path,
    ) ||
    /\.(?:php|sql|tfstate|tfvars|toml|ini|conf|sh|lock|log|pem|key|bak|old|save|yaml|yml)$/i.test(
      path,
    ) ||
    /(?:^|\/)(?:package\.json|docker-compose\.yml|serverless\.yml|webpack\.config\.js|terraform\.lock\.hcl)(?:\/|$)/i.test(
      path,
    )
  );
}

function isPotentialHtmlRoute(pathname: string) {
  const normalizedPath = normalizeRequestPath(pathname);
  if (normalizedPath.startsWith("/api/")) return false;
  const lastSegment = normalizedPath.split("/").at(-1) ?? "";
  return !lastSegment.includes(".") || lastSegment.endsWith(".html");
}

const LEGACY_CANONICAL_PATHS = new Map<string, string>([
  ["/flight-booking-assistance", "/flight-booking/"],
]);

// Pin this affected public route to its generated document. This avoids an
// SPA fallback document being selected for the trailing-slash navigation URL.
const STATIC_DOCUMENT_PATHS = new Map<string, string>([
  ["/flights-from-new-york/", "/flights-from-new-york/index.html"],
  ["/how-to-book-a-flight-by-phone/", "/how-to-book-a-flight-by-phone/index.html"],
]);

/** Return the preferred trailing-slash URL for public HTML routes. */
export function canonicalRedirectPath(pathname: string): string | null {
  const normalizedPath = normalizeRequestPath(pathname);
  if (
    normalizedPath === "/" ||
    pathname.endsWith("/") ||
    normalizedPath.startsWith("/api/") ||
    normalizedPath.split("/").at(-1)?.includes(".")
  ) {
    return null;
  }

  const legacyPath = LEGACY_CANONICAL_PATHS.get(normalizedPath);
  if (legacyPath) return legacyPath;
  return KNOWN_HTML_ROUTE_PATHS.has(normalizedPath) ? `${normalizedPath}/` : null;
}

function notFoundResponse(request: Request) {
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Page Not Found | TicketDepart</title>
  <meta name="description" content="This TicketDepart page could not be found. Return to flight booking or contact a travel specialist.">
</head>
<body>
  <main>
    <h1>This page has departed</h1>
    <p>The page you were looking for could not be found. Check the address or return to TicketDepart.</p>
    <p><a href="tel:+1-833-225-0511">Call +1-833-225-0511 — available 24/7</a></p>
    <p><a href="/">Back to TicketDepart home</a></p>
    <p><a href="/flight-booking/">Flight booking assistance</a></p>
    <p><a href="/contact/">Contact a travel specialist</a></p>
  </main>
</body>
</html>`;
  return new Response(request.method === "HEAD" ? null : html, {
    status: 404,
    statusText: "Not Found",
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/html; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow",
      "X-TicketDepart-Worker": "edge",
    },
  });
}

async function fetchAssetResponse(request: Request, env: Env): Promise<Response> {
  const response = await env.ASSETS.fetch(request);
  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";

  // HTML is the mutable app shell; hashed JS/CSS/assets remain safely cacheable.
  if (!contentType.includes("text/html")) return response;

  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
  headers.set("CDN-Cache-Control", "no-store");
  headers.set("X-TicketDepart-Worker", "edge");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (isRejectedRequestPath(pathname)) {
      return notFoundResponse(request);
    }

    if (request.method === "GET" || request.method === "HEAD") {
      const canonicalPath = canonicalRedirectPath(pathname);
      if (canonicalPath) {
        const canonicalUrl = new URL(request.url);
        canonicalUrl.pathname = canonicalPath;
        return new Response(null, {
          status: 301,
          headers: {
            Location: canonicalUrl.toString(),
            "X-TicketDepart-Worker": "edge",
          },
        });
      }

      const normalizedPath = normalizeRequestPath(pathname);
      if (
        isPotentialHtmlRoute(pathname) &&
        !KNOWN_HTML_ROUTE_PATHS.has(normalizedPath)
      ) {
        return notFoundResponse(request);
      }
    }

    const staticDocumentPath = STATIC_DOCUMENT_PATHS.get(pathname);
    if (staticDocumentPath && (request.method === "GET" || request.method === "HEAD")) {
      const assetUrl = new URL(request.url);
      assetUrl.pathname = staticDocumentPath;
      return fetchAssetResponse(
        new Request(assetUrl, {
          method: request.method,
          headers: request.headers,
        }),
        env,
      );
    }

    return fetchAssetResponse(request, env);
  },
};

export default worker;
