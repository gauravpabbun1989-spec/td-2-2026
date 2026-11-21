import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const frontendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cloudflareDist = path.join(frontendRoot, "dist");
const caffeineDist = path.join(frontendRoot, "dist-caffeine");
const redirectRule = "/* /404.html 404\n";
const legacyAssetCanisterConfig = `${JSON.stringify(
  [{ match: "**/*", enable_aliasing: false }],
  null,
  2,
)}\n`;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(fs.existsSync(path.join(cloudflareDist, "index.html")), "Cloudflare dist is missing index.html");
assert(fs.existsSync(path.join(cloudflareDist, "404.html")), "Cloudflare dist is missing the branded 404.html");
assert(
  !fs.existsSync(path.join(cloudflareDist, "_redirects")),
  "Cloudflare dist must not contain a Caffeine-specific _redirects file",
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
// Caffeine projects may still be served by the legacy ICP asset canister. Its
// SPA aliasing fallback answers unknown URLs with index.html (HTTP 200), so
// explicitly disable aliasing there. The generated public pages are already
// static files; unsupported paths should reach the canister's 404.html handler.
// The _redirects rule above remains the equivalent rule for certified-assets.
fs.writeFileSync(
  path.join(caffeineDist, ".ic-assets.json5"),
  legacyAssetCanisterConfig,
  "utf8",
);

assert(
  fs.readFileSync(path.join(caffeineDist, "_redirects"), "utf8").trim() === "/* /404.html 404",
  "Caffeine output must contain the explicit branded HTTP 404 fallback",
);
assert(
  fs.readFileSync(path.join(caffeineDist, "404.html"), "utf8") === notFoundHtml,
  "Caffeine 404 page must match the source-generated branded document",
);
const legacyConfig = JSON.parse(
  fs.readFileSync(path.join(caffeineDist, ".ic-assets.json5"), "utf8"),
);
assert(
  legacyConfig.length === 1 &&
    legacyConfig[0].match === "**/*" &&
    legacyConfig[0].enable_aliasing === false,
  "Legacy ICP asset-canister output must disable the index.html SPA alias for every path",
);
console.log("Prepared Caffeine dist-caffeine with a branded 404 fallback and disabled legacy SPA aliasing; Cloudflare dist remains unchanged.");
