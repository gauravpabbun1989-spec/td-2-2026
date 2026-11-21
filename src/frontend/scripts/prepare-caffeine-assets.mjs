import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const frontendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cloudflareDist = path.join(frontendRoot, "dist");
const caffeineDist = path.join(frontendRoot, "dist-caffeine");
const sourceLegacyConfig = path.join(frontendRoot, "public", ".ic-assets.json5");
const redirectRule = "/* /404.html 404\n";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(fs.existsSync(path.join(cloudflareDist, "index.html")), "Cloudflare dist is missing index.html");
assert(fs.existsSync(path.join(cloudflareDist, "404.html")), "Cloudflare dist is missing the branded 404.html");
assert(
  !fs.existsSync(path.join(cloudflareDist, "_redirects")),
  "Cloudflare dist must not contain a Caffeine-specific _redirects file",
);
assert(
  fs.existsSync(sourceLegacyConfig),
  "Missing public/.ic-assets.json5; legacy asset-canister routing configuration must be maintained as a frontend source asset",
);

const legacyConfig = JSON.parse(fs.readFileSync(sourceLegacyConfig, "utf8"));
assert(
  legacyConfig.length === 1 &&
    legacyConfig[0].match === "**/*" &&
    legacyConfig[0].enable_aliasing === false,
  "public/.ic-assets.json5 must disable the index.html SPA alias for every requested path",
);

const notFoundHtml = fs.readFileSync(path.join(cloudflareDist, "404.html"), "utf8");
assert(
  /<meta\\s+name=["']robots["']\\s+content=["']noindex, nofollow["']/i.test(notFoundHtml),
  "Caffeine 404 page must remain noindex, nofollow",
);
assert(
  Buffer.byteLength(notFoundHtml, "utf8") < 1_900_000,
  "Caffeine 404 page must remain a single-chunk file smaller than 1.9 MB",
);

fs.rmSync(caffeineDist, { recursive: true, force: true });
fs.cpSync(cloudflareDist, caffeineDist, { recursive: true });
fs.writeFileSync(path.join(caffeineDist, "_redirects"), redirectRule, "utf8");
// Keep this configuration in public/ so Caffeine's normal frontend build and
// asset-canister sync pipeline sees it as source metadata. Copy it unchanged
// into the configured Caffeine output directory. Do not place it in Cloudflare
// dist, whose Worker uses assets.not_found_handling = "404-page" instead.
fs.copyFileSync(sourceLegacyConfig, path.join(caffeineDist, ".ic-assets.json5"));

assert(
  fs.readFileSync(path.join(caffeineDist, "_redirects"), "utf8").trim() === "/* /404.html 404",
  "Caffeine output must contain the explicit branded HTTP 404 fallback",
);
assert(
  fs.readFileSync(path.join(caffeineDist, "404.html"), "utf8") === notFoundHtml,
  "Caffeine 404 page must match the source-generated branded document",
);
const builtLegacyConfig = JSON.parse(
  fs.readFileSync(path.join(caffeineDist, ".ic-assets.json5"), "utf8"),
);
assert(
  JSON.stringify(builtLegacyConfig) === JSON.stringify(legacyConfig),
  "Caffeine output must contain the exact legacy asset-canister source configuration",
);
console.log("Prepared Caffeine dist-caffeine with source-controlled legacy 404 alias configuration and branded 404 fallback; Cloudflare dist remains unchanged.");
