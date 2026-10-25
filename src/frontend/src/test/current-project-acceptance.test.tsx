import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SITE } from "@/lib/site";
import { renderRoute } from "@/test/render-route";

const PUBLIC_ROUTES = [
  "/",
  "/flight-booking",
  "/flight-search",
  "/book-a-flight-by-phone",
  "/how-to-book-a-flight-by-phone",
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
  "/contact",
  "/privacy",
  "/terms",
  "/disclaimer",
  "/international-flight-booking",
  "/last-minute-flight-booking",
  "/multi-city-flight-booking",
  "/group-flight-booking",
  "/cheap-flight-booking-by-phone",
  "/business-class-flight-booking",
  "/corporate-flight-booking",
  "/same-day-flight-booking",
  "/family-flight-booking",
  "/pet-flight-booking",
  "/baggage-assistance",
  "/flight-change-assistance",
  "/flight-cancellation-assistance",
  "/airline-reservation-assistance",
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
  "/flights-san-francisco-to-tokyo",
] as const;

// Keep the route covered by route-level tests, but omit it from the curated sitemap.
const SITEMAP_ROUTES = PUBLIC_ROUTES.filter((path) => path !== "/flights-new-york-to-london");

const ALL_APP_PATHS = new Set([...PUBLIC_ROUTES, "/disclaimer", "/flight-search-results", "/admin/leads"]);

describe("current production route coverage", () => {
  it.each(PUBLIC_ROUTES)("renders %s with one H1, canonical metadata, and a working call target", async (path) => {
    renderRoute(path);
    expect(await screen.findAllByRole("heading", { level: 1 })).toHaveLength(1);
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    expect(new URL(canonical?.href ?? "http://localhost/").pathname).toBe(path === "/" ? "/" : `${path}/`);
    expect(document.head.querySelector<HTMLMetaElement>('meta[name="robots"]')?.content).toMatch(/index/i);
    expect(screen.getAllByRole("link").some((link) => link.getAttribute("href") === SITE.phoneHref)).toBe(true);
  });
});

describe("current internal-link contract", () => {
  it.each(["/", "/flight-booking", "/delta-airlines", "/united-airlines", "/american-airlines", "/contact"] as const)(
    "has no broken internal hrefs on %s", async (path) => {
      renderRoute(path);
      await screen.findAllByRole("heading", { level: 1 });
      const hrefs = screen.getAllByRole("link")
        .map((link) => link.getAttribute("href") ?? "")
        .filter((href) => href.startsWith("/"))
        .map((href) => href.split(/[?#]/)[0].replace(/\/$/, "") || "/");
      for (const href of hrefs) expect(ALL_APP_PATHS.has(href)).toBe(true);
    },
  );
});

describe("homepage booking engine", () => {
  it("is embedded on the homepage with airline-style search controls", async () => {
    renderRoute("/");
    await screen.findAllByRole("heading", { level: 1 });
    expect(screen.getByRole("button", { name: /search flights/i })).toBeInTheDocument();
    expect(screen.getByText("Round trip")).toBeInTheDocument();
    expect(screen.getByText("One way")).toBeInTheDocument();
    expect(screen.getByText("Economy")).toBeInTheDocument();
  });

  it("rejects an incomplete search without pretending a result exists", async () => {
    renderRoute("/");
    await screen.findAllByRole("heading", { level: 1 });
    screen.getByRole("button", { name: /search flights/i }).click();
    expect(await screen.findByRole("alert")).toHaveTextContent(/departure and destination/i);
    expect(screen.queryByText(/Call to Confirm \/ Book/i)).not.toBeInTheDocument();
  });
});

describe("private-route and SEO safety", () => {
  it("keeps the private admin route out of indexing", async () => {
    renderRoute("/admin/leads");
    await screen.findByRole("heading", { level: 1 });
    expect(document.head.querySelector<HTMLMetaElement>('meta[name="robots"]')?.content).toBe("noindex, nofollow");
  });

  it("does not expose an admin link in public navigation", async () => {
    renderRoute("/");
    await screen.findAllByRole("heading", { level: 1 });
    const header = document.querySelector('[data-ocid="site.header"]');
    expect(header).not.toBeNull();
    expect(within(header as HTMLElement).queryByRole("link", { name: /leads desk/i })).toBeNull();
  });
});

describe("static SEO assets", () => {
  const publicDir = resolve(process.cwd(), "public");
  const read = (name: string) => readFileSync(resolve(publicDir, name), "utf8");

  it("sitemap contains exactly the current public routes", () => {
    const locs = Array.from(read("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1]);
    expect(new Set(locs).size).toBe(SITEMAP_ROUTES.length);
    expect(locs).toEqual(SITEMAP_ROUTES.map((path) => `https://ticketdepart.com${path === "/" ? "/" : `${path}/`}`));
  });

  it("robots points to the canonical sitemap", () => {
    expect(read("robots.txt")).toContain("Sitemap: https://ticketdepart.com/sitemap.xml");
  });
});
