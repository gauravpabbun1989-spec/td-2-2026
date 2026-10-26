import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const PUBLIC_DIR = resolve(process.cwd(), "public");

function readPublicFile(name: string): string {
  return readFileSync(resolve(PUBLIC_DIR, name), "utf8");
}

describe("static SEO assets", () => {
  it("keeps sitemap.xml well formed and canonical", () => {
    const sitemap = readPublicFile("sitemap.xml");
    const locs = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)).map(
      (match) => match[1],
    );
    expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(sitemap).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    );
    expect(sitemap.trimEnd().endsWith("</urlset>")).toBe(true);
    expect(locs.length).toBeGreaterThan(0);
    expect(new Set(locs).size).toBe(locs.length);
    expect(locs).not.toContain("https://ticketdepart.com/group-flight-booking/");
    expect(locs).not.toContain("https://ticketdepart.com/corporate-flight-booking/");
    expect(locs).not.toContain("https://ticketdepart.com/business-class-flight-booking/");
    expect(locs.every((loc) => /^https:\/\/ticketdepart\.com\//.test(loc))).toBe(true);
  });

  it("keeps robots.txt canonical", () => {
    const robots = readPublicFile("robots.txt");
    expect(robots).toBe("User-agent: *\nAllow: /\n\nSitemap: https://ticketdepart.com/sitemap.xml\n");
  });
});
