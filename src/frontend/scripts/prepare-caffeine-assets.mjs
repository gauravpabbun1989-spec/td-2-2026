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
// Vite may copy dotfiles from public/ into dist. The legacy canister config is
// Caffeine-only metadata, so remove it from the Cloudflare artifact explicitly.
fs.rmSync(path.join(cloudflareDist, ".ic-assets.json5"), { force: true });
assert(
  !fs.existsSync(path.join(cloudflareDist, ".ic-assets.json5")),
  "Cloudflare dist must not contain the Caffeine-only legacy asset-canister config",
);
assert(
  fs.existsSync(sourceLegacyConfig),
  "Missing public/.ic-assets.json5; legacy asset-canister routing configuration must be maintained as a frontend source asset",
);

const legacyConfig = JSON.parse(fs.readFileSync(sourceLegacyConfig, "utf8"));
const ruleByMatch = new Map(legacyConfig.map((rule) => [rule.match, rule]));
assert(
  legacyConfig.length === 4 &&
    legacyConfig[0].match === "sitemap.xml" &&
    legacyConfig[1].match === "robots.txt" &&
    legacyConfig[2].match === "index.html" &&
    legacyConfig[3].match === "**/*",
  "public/.ic-assets.json5 must contain the two exact SEO-file rules, an explicit index.html alias rule, and a final global rule",
);
assert(
  ruleByMatch.get("sitemap.xml")?.headers?.["Content-Type"] === "application/xml; charset=utf-8" &&
    ruleByMatch.get("sitemap.xml")?.enable_aliasing === false,
  "sitemap.xml must retain its XML Content-Type and disable SPA aliasing",
);
assert(
  ruleByMatch.get("robots.txt")?.headers?.["Content-Type"] === "text/plain" &&
    ruleByMatch.get("robots.txt")?.enable_aliasing === false,
  "robots.txt must retain its plain-text Content-Type and disable SPA aliasing",
);
assert(
  ruleByMatch.get("index.html")?.enable_aliasing === false,
  "index.html must explicitly disable SPA aliasing so unmatched requests cannot resolve to the app shell",
);
assert(
  ruleByMatch.get("**/*")?.enable_aliasing === false,
  "the global asset rule must disable SPA aliasing for every asset",
);

const notFoundHtml = fs.readFileSync(path.join(cloudflareDist, "404.html"), "utf8");
assert(
  /<meta\s+name=["']robots["']\s+content=["']noindex, nofollow["']/i.test(notFoundHtml),
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
