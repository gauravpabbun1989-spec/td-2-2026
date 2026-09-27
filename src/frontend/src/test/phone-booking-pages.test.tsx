import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const PUBLIC_DIR = resolve(process.cwd(), "public");

function readPublicFile(name: string): string {
  return readFileSync(resolve(PUBLIC_DIR, name), "utf8");
}

describe("sitemap.xml after the phone-booking route expansion", () => {
  it("is a well-formed urlset with the canonical origin", () => {
    const sitemap = readPublicFile("sitemap.xml");
    expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(sitemap).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    );
    expect(sitemap.trimEnd().endsWith("</urlset>")).toBe(true);

    const locs = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)).map(
      (match) => match[1],
    );
    expect(locs.length).toBeGreaterThan(2);
    expect(new Set(locs).size).toBe(locs.length);
    expect(locs.every((loc) => /^https:\/\/ticketdepart\.com\//.test(loc))).toBe(true);
  });

  it("includes both phone-booking routes with canonical URLs", () => {
    const sitemap = readPublicFile("sitemap.xml");
    expect(sitemap).toContain(
      "<loc>https://ticketdepart.com/book-a-flight-by-phone</loc>",
    );
    expect(sitemap).toContain(
      "<loc>https://ticketdepart.com/how-to-book-a-flight-by-phone</loc>",
    );
  });

  it("does not list the private admin route", () => {
    expect(readPublicFile("sitemap.xml")).not.toContain(
      "https://ticketdepart.com/admin/leads",
    );
  });

  it("keeps robots.txt crawl directives and sitemap pointer", () => {
    const robots = readPublicFile("robots.txt");
    expect(robots).toMatch(/User-agent:\s*\*/i);
    expect(robots).toMatch(/Allow:\s*\//i);
    expect(robots).toMatch(
      /Sitemap:\s*https:\/\/ticketdepart\.com\/sitemap\.xml/i,
    );
  });
});
