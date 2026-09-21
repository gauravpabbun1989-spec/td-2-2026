import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Characterization baseline for the static SEO assets.
 *
 * The upcoming change is purely additive: a new `.ic-assets.json5` asset-serving
 * configuration that declares the Content-Type for `/sitemap.xml` and
 * `/robots.txt` and excludes them from the SPA fallback. It must not alter the
 * bytes of either file. `static-seo-files.test.ts` asserts the structure (the
 * eight canonical URLs and the robots directives); this file freezes the exact
 * content so an accidental edit to `lastmod`, `changefreq`, `priority`, or the
 * robots directives fails loudly instead of shipping silently.
 *
 * Vitest runs with the frontend package as its working directory, so `public/`
 * resolves from there.
 */

const PUBLIC_DIR = resolve(process.cwd(), "public");

function readPublicFile(name: string): string {
  return readFileSync(resolve(PUBLIC_DIR, name), "utf8");
}

const EXPECTED_SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ticketdepart.com/</loc>
    <lastmod>2026-09-18</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://ticketdepart.com/flight-booking</loc>
    <lastmod>2026-09-18</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://ticketdepart.com/delta-airlines</loc>
    <lastmod>2026-09-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://ticketdepart.com/united-airlines</loc>
    <lastmod>2026-09-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://ticketdepart.com/american-airlines</loc>
    <lastmod>2026-09-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://ticketdepart.com/contact</loc>
    <lastmod>2026-09-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://ticketdepart.com/privacy</loc>
    <lastmod>2026-09-18</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://ticketdepart.com/terms</loc>
    <lastmod>2026-09-18</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
`;

const EXPECTED_ROBOTS = `User-agent: *
Allow: /

Sitemap: https://ticketdepart.com/sitemap.xml
`;

describe("frozen static SEO assets", () => {
  it("keeps sitemap.xml byte-for-byte unchanged", () => {
    expect(readPublicFile("sitemap.xml")).toBe(EXPECTED_SITEMAP);
  });

  it("keeps robots.txt byte-for-byte unchanged", () => {
    expect(readPublicFile("robots.txt")).toBe(EXPECTED_ROBOTS);
  });

  it("keeps exactly the eight canonical sitemap URLs in order", () => {
    const locs = Array.from(
      readPublicFile("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g),
    ).map((match) => match[1]);

    expect(locs).toEqual([
      "https://ticketdepart.com/",
      "https://ticketdepart.com/flight-booking",
      "https://ticketdepart.com/delta-airlines",
      "https://ticketdepart.com/united-airlines",
      "https://ticketdepart.com/american-airlines",
      "https://ticketdepart.com/contact",
      "https://ticketdepart.com/privacy",
      "https://ticketdepart.com/terms",
    ]);
  });

  it("keeps robots.txt pointing at the canonical sitemap URL", () => {
    const robots = readPublicFile("robots.txt");
    expect(robots).toContain("Sitemap: https://ticketdepart.com/sitemap.xml");
    expect(robots).not.toMatch(/Sitemap:\s*https?:\/\/(?!ticketdepart\.com)/i);
  });
});
