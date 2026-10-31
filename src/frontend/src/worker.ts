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

async function notFoundResponse(request: Request, env: Env) {
  const notFoundUrl = new URL("/404.html", request.url);
  const notFoundAsset = await env.ASSETS.fetch(
    new Request(notFoundUrl, { method: "GET" }),
  );
  const headers = new Headers(notFoundAsset.headers);
  headers.set("Cache-Control", "no-store");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Robots-Tag", "noindex, nofollow");
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "text/html; charset=utf-8");
  }

  return new Response(request.method === "HEAD" ? null : notFoundAsset.body, {
    status: 404,
    statusText: "Not Found",
    headers,
  });
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (isRejectedRequestPath(pathname)) {
      return notFoundResponse(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

export default worker;
