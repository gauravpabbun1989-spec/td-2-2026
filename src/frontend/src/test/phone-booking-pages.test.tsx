import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Characterization baseline for the sitemap expansion that accompanied the
 * addition of the two phone-booking routes (`/book-a-flight-by-phone` and
 * `/how-to-book-a-flight-by-phone`). The upcoming "Fix all error" change is
 * expected to reconcile the older frozen-sitemap tests with the expanded URL
 * set; it must not change the sitemap's well-formedness, the canonical
 * origin, or the set of canonical paths the file now lists.
 *
 * The test router in `render-route.tsx` intentionally mirrors only 8 of the
 * 11 production routes and omits the three admin/phone-booking routes, so
 * the new pages cannot be rendered through it. This file therefore
 * characterizes the static asset that is reachable from disk: the sitemap
 * that was updated to include the new routes.
 */

const PUBLIC_DIR = resolve(process.cwd(), "public");

function readPublicFile(name: string): string {
  return readFileSync(resolve(PUBLIC_DIR, name), "utf8");
}

/** Every path the production router in `App.tsx` serves, in route order. */
const SERVED_PATHS = [
  "/",
  "/flight-booking",
  "/book-a-flight-by-phone",
  "/how-to-book-a-flight-by-phone",
  "/delta-airlines",
  "/united-airlines",
  "/american-airlines",
  "/contact",
  "/privacy",
  "/terms",
  "/admin/leads",
] as const;

/**
 * Paths the sitemap is expected to list. The admin route is not a public
 * landing page and is intentionally excluded from the sitemap.
 */
const SITEMAP_PATHS = SERVED_PATHS.filter((p) => p !== "/admin/leads");

describe("sitemap.xml after the phone-booking route expansion", () => {
  it("is a well-formed urlset with the canonical origin", () => {
    const sitemap = readPublicFile("sitemap.xml");
    expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(sitemap).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    );
    expect(sitemap.trimEnd().endsWith("</urlset>")).toBe(true);
  });

  it("lists every public canonical URL", () => {
    const sitemap = readPublicFile("sitemap.xml");
    const locs = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)).map(
      (match) => match[1],
    );

    expect(locs).toHaveLength(SITEMAP_PATHS.length);
    for (const path of SITEMAP_PATHS) {
      const expected = `https://ticketdepart.com${path === "/" ? "/" : path}`;
      expect(locs).toContain(expected);
    }
  });

  it("includes the two phone-booking routes with their canonical URLs", () => {
    const sitemap = readPublicFile("sitemap.xml");
    expect(sitemap).toContain(
      "<loc>https://ticketdepart.com/book-a-flight-by-phone</loc>",
    );
    expect(sitemap).toContain(
      "<loc>https://ticketdepart.com/how-to-book-a-flight-by-phone</loc>",
    );
  });

  it("does not list the admin-only route", () => {
    const sitemap = readPublicFile("sitemap.xml");
    expect(sitemap).not.toContain("/admin/leads");
  });

  it("keeps the robots.txt crawl directives and sitemap pointer", () => {
    const robots = readPublicFile("robots.txt");
    expect(robots).toMatch(/User-agent:\s*\*/i);
    expect(robots).toMatch(/Allow:\s*\//i);
    expect(robots).toMatch(
      /Sitemap:\s*https:\/\/ticketdepart\.com\/sitemap\.xml/i,
    );
  });
});
