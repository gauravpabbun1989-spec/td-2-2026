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
assert(locs.length === 51, `expected 51 URLs matching the indexed-page keep list; found ${locs.length}`);
assert(new Set(locs).size === locs.length, "built sitemap contains duplicate URLs");
assert(!locs.some((url) => new URL(url).pathname.replace(/\/+$/, "") === "/flight-search-results"), "non-indexable flight search results route must not be in the sitemap");

const normalized = locs.map((url) => {
  const parsed = new URL(url);
  assert(parsed.origin === "https://ticketdepart.com", `unexpected sitemap origin: ${url}`);
  assert(parsed.search === "" && parsed.hash === "", `sitemap URL has query or fragment: ${url}`);
  assert(parsed.pathname === "/" || parsed.pathname.endsWith("/"), `sitemap URL is not slash-normalized: ${url}`);
  return parsed.pathname.replace(/\/+$/, "") || "/";
});
assert(new Set(normalized).size === normalized.length, "built sitemap contains duplicate paths after slash normalization");

// Audit every indexable sitemap URL, not only the country landing pages.
// This catches slash, case, encoded-character, and canonical drift across the
// entire site before a build can be published.
const canonicalOwners = new Map();
for (const url of locs) {
  const parsed = new URL(url);
  const pathname = parsed.pathname;
  assert(pathname === "/" || /^\/[a-z0-9-]+(?:\/[a-z0-9-]+)*\/$/.test(pathname),
    `sitemap path is not in the site's lowercase, single-trailing-slash format: ${url}`);
  const route = pathname === "/" ? "" : pathname.replace(/^\//, "").replace(/\/$/, "");
  const htmlPath = path.join(distDir, route, "index.html");
  assert(fs.existsSync(htmlPath), `missing static HTML for sitemap URL: ${url}`);
  const html = read(htmlPath);
  const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1]
    ?? html.match(/<link\s+href=["']([^"']+)["']\s+rel=["']canonical["']/i)?.[1];
  assert(canonical === url, `canonical does not exactly match sitemap URL; sitemap=${url}; canonical=${canonical ?? "missing"}`);
  const robots = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i)?.[1] ?? "";
  assert(!/noindex/i.test(robots), `indexable sitemap URL is marked noindex: ${url} (${robots || "missing robots meta"})`);
  const previous = canonicalOwners.get(canonical);
  assert(!previous, `multiple sitemap URLs share one canonical: ${previous} and ${url}`);
  canonicalOwners.set(canonical, url);
}


const resultsHtmlPath = path.join(distDir, "flight-search-results", "index.html");
assert(fs.existsSync(resultsHtmlPath), "missing static HTML for /flight-search-results");
const resultsHtml = read(resultsHtmlPath);
const resultsRobots = resultsHtml.match(/<meta\s+name="robots"\s+content="([^"]+)"/i)?.[1];
assert(resultsRobots === "noindex, nofollow", `flight-search-results must preserve noindex, nofollow after static hardening; found ${resultsRobots ?? "no robots meta"}`);

const homeHtml = read(path.join(distDir, "index.html"));
const homeDescription = homeHtml.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1] ?? "";
assert(homeDescription.includes("24/7") && homeDescription.includes("TicketDepart"), "built homepage meta description is missing expected service details");
assert(!/855[\s().-]*544[\s().-]*9001/.test(homeHtml), "old public phone number remains in built homepage HTML");

const contactHtml = read(path.join(distDir, "contact", "index.html"));
const contactDescription = contactHtml.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1] ?? "";
assert(contactDescription === "Contact TicketDepart about your flight plans. Call +1-888-958-0280 or send your trip details for a callback.", "Contact page static description is stale or awkward");

const legacyBookingPath = path.join(distDir, "flight-booking-assistance", "index.html");
assert(fs.existsSync(legacyBookingPath), "missing static HTML for legacy /flight-booking-assistance route");
const legacyBookingHtml = read(legacyBookingPath);
const legacyCanonical = legacyBookingHtml.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1] ?? "";
const legacyOgUrl = legacyBookingHtml.match(/<meta\s+property="og:url"\s+content="([^"]+)"/i)?.[1] ?? "";
assert(legacyCanonical === "https://ticketdepart.com/flight-booking/", `legacy booking canonical must point to /flight-booking/; found ${legacyCanonical || "missing"}`);
assert(legacyOgUrl === "https://ticketdepart.com/flight-booking/", `legacy booking Open Graph URL must point to /flight-booking/; found ${legacyOgUrl || "missing"}`);

const countryUrls = locs.filter((url) => new URL(url).pathname.startsWith("/flights-usa-to-"));
assert(countryUrls.length === 4, `expected exactly four USA-to-country URLs from the indexed keep list; found ${countryUrls.length}`);

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


// Every intended canonical page must be distinguishable in search metadata and
// reachable through an HTML link, not only listed in sitemap.xml.
function collectHtmlFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...collectHtmlFiles(fullPath));
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(fullPath);
  }
  return files;
}
const allHtmlFiles = collectHtmlFiles(distDir);
const allPageTitles = new Map();
const allPageHeadings = new Map();
const inboundLinks = new Map(locs.map((url) => [new URL(url).pathname, 0]));
for (const file of allHtmlFiles) {
  const html = read(file);
  for (const match of html.matchAll(/\bhref=["']([^"'#]+)["']/gi)) {
    try {
      const linked = new URL(match[1], "https://ticketdepart.com");
      if (linked.origin !== "https://ticketdepart.com") continue;
      const linkedPath = linked.pathname === "/" ? "/" : linked.pathname.replace(/\/+$/, "") + "/";
      if (inboundLinks.has(linkedPath)) inboundLinks.set(linkedPath, inboundLinks.get(linkedPath) + 1);
    } catch {
      // Ignore malformed href values; they cannot discover a canonical page.
    }
  }
}
for (const url of locs) {
  const pathname = new URL(url).pathname;
  const route = pathname === "/" ? "" : pathname.replace(/^\//, "").replace(/\/$/, "");
  const html = read(path.join(distDir, route, "index.html"));
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
  const heading = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  const description = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)?.[1]?.trim() ?? "";
  assert(title && title.length >= 20, "missing or weak title for " + url);
  assert(heading && heading.length >= 10, "missing or weak H1 for " + url);
  assert(description.length >= 60, "missing or weak meta description for " + url);
  const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i)?.[1]?.trim() ?? "";
  const twitterTitle = html.match(/<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i)?.[1]?.trim() ?? "";
  const ogDescription = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i)?.[1]?.trim() ?? "";
  const twitterDescription = html.match(/<meta\s+name=["']twitter:description["']\s+content=["']([^"']+)["']/i)?.[1]?.trim() ?? "";
  assert(ogTitle === title, "Open Graph title differs from page title: " + url);
  assert(twitterTitle === title, "Twitter title differs from page title: " + url);
  assert(ogDescription === description, "Open Graph description differs from meta description: " + url);
  assert(twitterDescription === description, "Twitter description differs from meta description: " + url);
  assert(description.length <= 160, "meta description exceeds 160 characters: " + url);
  assert(!/\bwith a travel\.?$/i.test(description), "meta description contains an awkward truncated phrase: " + url + ": " + description);
  assert(!/\b(?:and|or|with|for|from|to|of|in|on|at|by|the|a|an|as)\.$/i.test(description), "meta description ends with an incomplete phrase: " + url + ": " + description);
  assert(!/^(?:to|for|at)\b/i.test(description), "meta description starts with a dangling preposition: " + url);
  assert(!allPageTitles.has(title), "duplicate page title: " + title + " (" + allPageTitles.get(title) + " and " + url + ")");
  assert(!allPageHeadings.has(heading), "duplicate H1: " + heading + " (" + allPageHeadings.get(heading) + " and " + url + ")");
  allPageTitles.set(title, url);
  allPageHeadings.set(heading, url);
  assert((inboundLinks.get(pathname) ?? 0) > 0, "sitemap page has no crawlable internal link: " + url);
}

// Priority U.S. phone-booking pages must keep intended static metadata and useful guide content.
const businessHtml = read(path.join(distDir, "business-class-flight-booking", "index.html"));
const businessTitle = businessHtml.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() ?? "";
const businessHeading = businessHtml.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() ?? "";
const businessDescription = businessHtml.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1]?.trim() ?? "";
assert(businessTitle === "Business Class Flight Booking by Phone | TicketDepart", `business-class static title mismatch: ${businessTitle}`);
assert(businessHeading === "Business class flight booking by phone", `business-class static H1 mismatch: ${businessHeading}`);
assert(businessDescription.length >= 60 && businessDescription.length <= 160 && /[.!?]$/.test(businessDescription), "business-class meta description must be complete and 60–160 characters");
assert(!/855[\s().-]*544[\s().-]*9001/.test(businessHtml), "old public phone number remains on business-class page");

const corporateHtml = read(path.join(distDir, "corporate-flight-booking", "index.html"));
const corporateText = corporateHtml.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").toLowerCase();
for (const phrase of ["travel policy", "employee and executive", "receipt requirements", "business class is a cabin preference", "independent travel agency"]) {
  assert(corporateText.includes(phrase.toLowerCase()), "corporate flight page is missing distinct business-travel guidance: " + phrase);
}
assert(!/855[\s().-]*544[\s().-]*9001/.test(corporateHtml), "old public phone number remains on corporate flight page");

const chicagoHtml = read(path.join(distDir, "flights-from-chicago", "index.html"));
const chicagoText = chicagoHtml.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").toLowerCase();
for (const phrase of ["ord", "midway", "mdw", "connection", "ground travel"]) {
  assert(chicagoText.includes(phrase.toLowerCase()), "Chicago departure page is missing airport and itinerary guidance: " + phrase);
}

const corporateDescription = corporateHtml.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1]?.trim() ?? "";
const chicagoDescription = chicagoHtml.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1]?.trim() ?? "";
assert(!/with a travel\./i.test(chicagoDescription), `Chicago meta description is awkwardly truncated: ${chicagoDescription}`);
assert(/employee and executive/i.test(corporateDescription), `corporate meta description lost its intended audience: ${corporateDescription}`);
assert(/[.!?]\s+Call \+1-888-958-0280\.$/.test(corporateDescription), `corporate meta description lacks a complete phone CTA: ${corporateDescription}`);
assert(/[.!?]\s+Call \+1-888-958-0280\.$/.test(chicagoDescription), `Chicago meta description lacks a complete phone CTA: ${chicagoDescription}`);



const phoneGuideHtml = read(path.join(distDir, "how-to-book-a-flight-by-phone", "index.html"));
const phoneGuideText = phoneGuideHtml.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
for (const phrase of ["Prepare your trip details", "Compare the full itinerary", "Confirm terms before payment", "independent travel agency"]) {
  assert(phoneGuideText.toLowerCase().includes(phrase.toLowerCase()), `phone-booking guide is missing required useful content: ${phrase}`);
}
assert(phoneGuideText.length >= 1400, `phone-booking guide static content is too thin: ${phoneGuideText.length} characters`);

// Every sitemap description must be complete, bounded, and must not repeat the public phone number.
for (const url of locs) {
  const pathname = new URL(url).pathname;
  const route = pathname === "/" ? "" : pathname.replace(/^\//, "").replace(/\/$/, "");
  const html = read(path.join(distDir, route, "index.html"));
  const description = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)?.[1]?.trim() ?? "";
  assert(description.length >= 60 && description.length <= 160, `meta description length out of bounds for ${url}: ${description.length}`);
  assert(/[.!?]$/.test(description), `meta description ends mid-sentence for ${url}: ${description}`);
  assert(
    !/\b(?:and|or|with|for|from|to|of|in|on|at|by|the|a|an|as|including|that|which|who|whose|when|where|while|before|after|between|about|your|their|our|its|into|over|under|available|applicable|specific|different|current|complete|full|practical|appropriate|official|independent|international|domestic|flexible|additional|other|any|each|every)\.\s+Call\s+\+1-888-958-0280/i.test(description) && !/\bwith a travel\.\s+Call\s+\+1-888-958-0280/i.test(description),
    `meta description has a dangling phrase before the phone CTA for ${url}: ${description}`,
  );
  const phoneMatches = description.match(/(?:\+?1[\s().-]*)?888[\s().-]*958[\s().-]*0280/g) ?? [];
  assert(phoneMatches.length <= 1, `duplicate TicketDepart phone number in meta description for ${url}`);
}

console.log(`Static SEO route audit passed: all ${countryUrls.length} USA-to-country pages, priority phone-booking content, metadata quality, unique titles/H1s, canonicals, indexability, internal links, normalized sitemap, and robots.txt.`);
