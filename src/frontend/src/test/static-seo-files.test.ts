import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The sitemap and robots file are static assets served from `public/`. They are
 * not rendered by React, so no component test reaches them; this reads them
 * from disk instead. Only the parts intended to stay stable are asserted here:
 * the canonical URL set and the robots crawl/sitemap directives. The
 * `lastmod` element is being added intentionally, so its absence is not frozen.
 *
 * Vitest runs with the frontend package as its working directory, so `public/`
 * resolves from there.
 */

const PUBLIC_DIR = resolve(process.cwd(), "public");

function readPublicFile(name: string): string {
  return readFileSync(resolve(PUBLIC_DIR, name), "utf8");
}

describe("sitemap.xml", () => {
  it("lists canonical HTTPS URLs without duplicates", () => {
    const sitemap = readPublicFile("sitemap.xml");
    const locs = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)).map(
      (match) => match[1],
    );

    expect(locs.length).toBeGreaterThan(0);
    expect(new Set(locs).size).toBe(locs.length);
    for (const loc of locs) {
      expect(loc).toMatch(/^https:\/\/ticketdepart\.com\//);
    }
  });

  it("is a well-formed urlset", () => {
    const sitemap = readPublicFile("sitemap.xml");
    expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(sitemap).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    );
    expect(sitemap.trimEnd().endsWith("</urlset>")).toBe(true);
  });
});

describe("robots.txt", () => {
  it("allows crawling and points to the sitemap", () => {
    const robots = readPublicFile("robots.txt");
    expect(robots).toMatch(/User-agent:\s*\*/i);
    expect(robots).toMatch(/Allow:\s*\//i);
    expect(robots).toMatch(
      /Sitemap:\s*https:\/\/ticketdepart\.com\/sitemap\.xml/i,
    );
  });
});
