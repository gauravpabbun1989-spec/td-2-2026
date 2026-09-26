import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const FRONTEND = join(ROOT, "src/frontend");
const DIST = join(FRONTEND, "dist");

const PUBLIC_ROUTES = [
  "/", "/flight-booking", "/book-a-flight-by-phone", "/how-to-book-a-flight-by-phone",
  "/delta-airlines", "/united-airlines", "/american-airlines", "/southwest-airlines",
  "/jetblue-airways", "/alaska-airlines", "/british-airways", "/lufthansa", "/air-canada",
  "/swiss-air", "/qatar-airways", "/emirates", "/norse-atlantic-airways", "/lot-polish-airlines",
  "/contact", "/privacy", "/terms", "/international-flight-booking", "/last-minute-flight-booking",
  "/multi-city-flight-booking", "/group-flight-booking", "/cheap-flight-booking-by-phone",
  "/business-class-flight-booking", "/same-day-flight-booking", "/family-flight-booking",
  "/flight-change-assistance", "/flight-cancellation-assistance", "/airline-reservation-assistance",
  "/flight-booking-assistance", "/flights-usa-to-canada", "/flights-usa-to-uk",
  "/flights-usa-to-europe", "/flights-usa-to-mexico",
  "/flights-from-new-york", "/flights-from-los-angeles", "/flights-from-chicago",
  "/flights-from-miami", "/flights-from-atlanta", "/flights-from-dallas",
  "/flights-from-orlando", "/flights-from-san-francisco",
  "/flights-new-york-to-london", "/flights-new-york-to-paris", "/flights-new-york-to-dubai",
  "/flights-los-angeles-to-tokyo", "/flights-los-angeles-to-london", "/flights-miami-to-cancun",
  "/flights-chicago-to-london", "/flights-san-francisco-to-tokyo",
];

function read(path) {
  return readFileSync(join(ROOT, path), "utf8");
}

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".git"].includes(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(path));
    else files.push(path);
  }
  return files;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function auditOnce() {
  const app = read("src/frontend/src/App.tsx");
  const site = read("src/frontend/src/lib/site.ts");
  const flightSearch = read("src/frontend/src/pages/FlightSearchPage.tsx");
  const backend = read("src/backend/main.mo");
  const seo = read("src/frontend/src/components/Seo.tsx");
  const robots = read("src/frontend/public/robots.txt");
  const sitemap = read("src/frontend/public/sitemap.xml");
  const caffeine = read("src/frontend/caffeine.toml");
  const backendCaffeine = read("src/backend/caffeine.toml");
  const wrangler = read("wrangler.jsonc");
  const buildWorkflow = read(".github/workflows/build.yml");

  assert(caffeine.includes('type = "assets"'), "frontend is not configured as an assets project");
  assert(caffeine.includes('out = "dist"'), "frontend output is not dist");
  assert(backendCaffeine.includes('type = "motoko"'), "backend is not configured as Motoko");
  assert(wrangler.includes('"directory": "./src/frontend/dist"'), "Cloudflare assets directory mismatch");
  assert(buildWorkflow.includes("pnpm --dir src/frontend typecheck"), "typecheck missing from CI");
  assert(buildWorkflow.includes("pnpm --dir src/frontend check"), "frontend check missing from CI");
  assert(buildWorkflow.includes("pnpm --dir src/frontend test"), "frontend tests missing from CI");
  assert(buildWorkflow.includes("pnpm --dir src/frontend build"), "frontend build missing from CI");
  assert(buildWorkflow.includes("pnpm test:backend"), "backend integration tests missing from CI");

  assert(site.includes('phoneDisplay: "+1 888-958-0280"'), "canonical phone display changed");
  assert(site.includes('phoneHref: "tel:+18889580280"'), "canonical phone href changed");
  assert(seo.includes("index, follow") && seo.includes("noindex, nofollow"), "SEO indexability control missing");

  assert(robots.includes("User-agent: *"), "robots user-agent missing");
  assert(robots.includes("Allow: /"), "robots allow directive missing");
  assert(robots.includes("Sitemap: https://ticketdepart.com/sitemap.xml"), "robots sitemap mismatch");

  const locs = [...sitemap.matchAll(new RegExp("<loc>([^<]+)</loc>", "g"))].map((m) => m[1]);
  const expectedLocs = PUBLIC_ROUTES.map((path) => `https://ticketdepart.com${path === "/" ? "/" : path}`);
  assert(JSON.stringify(locs) === JSON.stringify(expectedLocs), "sitemap does not exactly match current public route set");

  for (const path of PUBLIC_ROUTES) {
    assert(app.includes(`path: "${path}"`), `production route missing from App.tsx: ${path}`);
    const distPath = path === "/" ? join(DIST, "index.html") : join(DIST, path.slice(1), "index.html");
    assert(existsSync(distPath), `built route missing: ${path}`);
  }

  assert(app.includes('path: "/admin/leads"'), "admin route missing");
  assert(read("src/frontend/src/pages/AdminLeadsPage.tsx").includes("indexable={false}"), "admin route is not explicitly noindex");
  assert(flightSearch.includes("Search flights"), "booking engine search control missing");
  assert(flightSearch.includes("Call to Confirm / Book"), "booking result CTA missing");
  assert(flightSearch.includes("selectedOutbound"), "round-trip outbound state missing");
  assert(flightSearch.includes("selectedReturn"), "round-trip return state missing");
  assert(
    (flightSearch.includes("searchFlightConnections") && backend.includes("/api/connections?from=") && backend.includes("max_stops=2")) ||
    flightSearch.includes("max_stops=2"),
    "connecting-flight search missing",
  );

  const auditScript = relative(ROOT, new URL(import.meta.url).pathname);
  const textFiles = walk(ROOT).filter((file) =>
    file !== join(ROOT, auditScript) &&
    ["ts","tsx","js","mjs","mo","toml","json","jsonc","md","html","txt","css"].some((ext) => file.endsWith(`.${ext}`)),
  );
  const mergeStartMarker = "<".repeat(7) + " HEAD";
  const mergeEndMarker = ">".repeat(7) + " ";
  for (const file of textFiles) {
    const text = readFileSync(file, "utf8");
    assert(!text.includes(mergeStartMarker) && !text.includes(mergeEndMarker), `merge marker found in ${relative(ROOT, file)}`);
    assert(!text.includes("from Air-Routes") && !text.includes("free route reference data") && !text.includes("no fares are shown"), `customer-facing provider disclosure found in ${relative(ROOT, file)}`);
    assert(!text.includes("Amadeus"), `unapproved Amadeus integration reference found in ${relative(ROOT, file)}`);
  }
}

auditOnce();
console.log("Whole-project audit passed successfully.");
