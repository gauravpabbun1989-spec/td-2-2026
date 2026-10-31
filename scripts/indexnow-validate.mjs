import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const script = fs.readFileSync(path.join(ROOT, "scripts/indexnow.mjs"), "utf8");
const sitemap = fs.readFileSync(path.join(ROOT, "src/frontend/public/sitemap.xml"), "utf8");
const keyMatch = script.match(/const KEY = "([A-Za-z0-9-]+)";/);
if (!keyMatch) throw new Error("IndexNow submission script is missing its configured key.");
const key = keyMatch[1];
const keyFile = path.join(ROOT, "src/frontend/public", `${key}.txt`);
if (!fs.existsSync(keyFile)) throw new Error("The configured IndexNow key file is missing from public assets.");
if (fs.readFileSync(keyFile, "utf8").trim() !== key) {
  throw new Error("The public IndexNow key file does not match the submission script.");
}
if (!script.includes("https://api.indexnow.org/indexnow")) {
  throw new Error("IndexNow submission endpoint is missing or invalid.");
}
if (!script.includes("${BASE_URL}/${KEY}.txt")) {
  throw new Error("IndexNow keyLocation must point to the matching public key file.");
}

const urls = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)]
  .map((match) => match[1].trim())
  .map((value) => value.replaceAll("&amp;", "&"));
if (urls.length === 0 || urls.length > 10000) {
  throw new Error(`Sitemap URL count is outside IndexNow limits: ${urls.length}`);
}
const normalized = urls.map((value) => {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.hostname !== "ticketdepart.com" || url.username || url.password) {
    throw new Error(`Unexpected URL in sitemap: ${value}`);
  }
  return url.href;
});
if (new Set(normalized).size !== normalized.length) {
  throw new Error("The sitemap contains duplicate URLs.");
}
const excludedPaths = new Set([
  "/group-flight-booking/",
  "/corporate-flight-booking/",
  "/business-class-flight-booking/",
  "/flight-search-results/",
  "/404/",
]);
for (const value of normalized) {
  const pathname = new URL(value).pathname;
  if (excludedPaths.has(pathname)) {
    throw new Error(`A non-indexable route is present in the IndexNow sitemap: ${pathname}`);
  }
}
console.log(`PASS: IndexNow key file matches; ${normalized.length} unique, same-host HTTPS sitemap URLs are valid.`);
