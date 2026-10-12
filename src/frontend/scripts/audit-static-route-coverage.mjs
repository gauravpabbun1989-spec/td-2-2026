import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const distDir = path.join(root, "dist");
const sourceSitemapPath = path.join(publicDir, "sitemap.xml");
const builtSitemapPath = path.join(distDir, "sitemap.xml");
const sourceRobotsPath = path.join(publicDir, "robots.txt");
const builtRobotsPath = path.join(distDir, "robots.txt");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
}

const sourceSitemap = read(sourceSitemapPath).trim();
const builtSitemap = read(builtSitemapPath).trim();
assert(builtSitemap === sourceSitemap, "built sitemap differs from public/sitemap.xml");

const sourceRobots = read(sourceRobotsPath).trim();
const builtRobots = read(builtRobotsPath).trim();
assert(builtRobots === sourceRobots, "built robots.txt differs from public/robots.txt");
assert(builtRobots.includes("User-agent: *"), "robots.txt is missing a wildcard user-agent");
assert(builtRobots.includes("Allow: /"), "robots.txt does not allow public crawling");
assert(builtRobots.includes("Sitemap: https://ticketdepart.com/sitemap.xml"), "robots.txt sitemap URL is incorrect");

const locs = extractLocs(builtSitemap);
assert(locs.length > 0, "built sitemap contains no URLs");
assert(new Set(locs).size === locs.length, "built sitemap contains duplicate URLs");

const normalized = locs.map((url) => {
  const parsed = new URL(url);
  assert(parsed.origin === "https://ticketdepart.com", `unexpected sitemap origin: ${url}`);
  assert(parsed.search === "" && parsed.hash === "", `sitemap URL has query or fragment: ${url}`);
  assert(parsed.pathname === "/" || parsed.pathname.endsWith("/"), `sitemap URL is not slash-normalized: ${url}`);
  return parsed.pathname.replace(/\/+$/, "") || "/";
});
assert(new Set(normalized).size === normalized.length, "built sitemap contains duplicate paths after slash normalization");

const countryUrls = locs.filter((url) => new URL(url).pathname.startsWith("/flights-usa-to-"));
assert(countryUrls.length === 26, `expected 26 USA-to-country URLs in sitemap; found ${countryUrls.length}`);

const titles = new Set();
const headings = new Set();
for (const url of countryUrls) {
  const pathname = new URL(url).pathname;
  const route = pathname.replace(/\/+$/, "");
  const htmlPath = path.join(distDir, route.slice(1), "index.html");
  assert(fs.existsSync(htmlPath), `missing static HTML for ${route}`);
  const html = read(htmlPath);
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
  const heading = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, "").trim();
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
  assert(title && title.length >= 20, `missing or weak title for ${route}`);
  assert(heading && heading.length >= 12, `missing or weak H1 for ${route}`);
  assert(!titles.has(title), `duplicate title for ${route}: ${title}`);
  assert(!headings.has(heading), `duplicate H1 for ${route}: ${heading}`);
  titles.add(title);
  headings.add(heading);
  assert(canonical === `https://ticketdepart.com${route}/`, `incorrect canonical for ${route}: ${canonical}`);
  assert(!/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html), `country route is marked noindex: ${route}`);
  assert(html.includes('href="/contact/"') || html.includes('href="/contact"'), `missing contact internal link for ${route}`);
  assert(html.includes('href="/flight-booking/"') || html.includes('href="/book-a-flight-by-phone/"') || html.includes('href="/international-flight-booking/"'), `missing relevant booking internal link for ${route}`);
  const visibleText = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  assert(visibleText.length >= 900, `insufficient static visible content for ${route}: ${visibleText.length} characters`);
}

console.log(`Static SEO route audit passed: ${countryUrls.length} country pages, unique titles/H1s, canonicals, indexability, internal links, normalized sitemap, and robots.txt.`);
