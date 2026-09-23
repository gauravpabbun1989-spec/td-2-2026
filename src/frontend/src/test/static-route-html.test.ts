import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

/**
 * Cover for the static route HTML generator (`scripts/generate-route-html.mjs`).
 *
 * The generator writes crawlable entry points for the airline routes, and the
 * accepted request expands the airline display names in their titles,
 * descriptions, and headings. The generated files are build artifacts, so no
 * component test reaches them; this runs the real script against a minimal
 * `dist/index.html` fixture and asserts the emitted HTML.
 *
 * The fixture is written under the frontend package's `dist/` (the directory
 * the script resolves from `process.cwd()`) and removed afterwards. The script
 * is production code and is never modified.
 */

const FRONTEND_DIR = process.cwd();
const DIST_DIR = resolve(FRONTEND_DIR, "dist");
const SCRIPT = resolve(FRONTEND_DIR, "scripts/generate-route-html.mjs");

const INDEX_FIXTURE = `<!doctype html>
<html lang="en">
  <head>
    <title>TicketDepart</title>
    <meta name="description" content="default" />
    <meta property="og:title" content="default" />
    <meta property="og:description" content="default" />
    <meta property="og:url" content="https://ticketdepart.com/" />
    <link rel="canonical" href="https://ticketdepart.com/" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;

function readGenerated(route: string): string {
  return readFileSync(resolve(DIST_DIR, route.slice(1), "index.html"), "utf8");
}

describe("static route HTML uses the full airline names", () => {
  beforeAll(() => {
    mkdirSync(DIST_DIR, { recursive: true });
    writeFileSync(resolve(DIST_DIR, "index.html"), INDEX_FIXTURE);
    execFileSync("node", [SCRIPT], { cwd: FRONTEND_DIR, stdio: "pipe" });
  });

  afterAll(() => {
    rmSync(DIST_DIR, { recursive: true, force: true });
  });

  it("writes the Delta route with the full name in title, description, and heading", () => {
    const html = readGenerated("/delta-airlines");
    expect(html).toContain(
      "<title>Delta Airlines Flight Booking Assistance | TicketDepart</title>",
    );
    expect(html).toContain("Delta Airlines flights");
    expect(html).toContain(
      "<h1>Delta Airlines flight bookings handled by a real travel specialist</h1>",
    );
  });

  it("writes the United route with the full name in title, description, and heading", () => {
    const html = readGenerated("/united-airlines");
    expect(html).toContain(
      "<title>United Airlines Flight Booking Assistance | TicketDepart</title>",
    );
    expect(html).toContain("United Airlines bookings");
    expect(html).toContain(
      "<h1>United Airlines flight itineraries planned and booked by phone</h1>",
    );
  });

  it("keeps the route paths and canonical URLs unchanged", () => {
    for (const route of ["/delta-airlines", "/united-airlines"] as const) {
      const html = readGenerated(route);
      expect(html).toContain(
        `<link rel="canonical" href="https://ticketdepart.com${route}" />`,
      );
      expect(html).toContain(
        `<meta property="og:url" content="https://ticketdepart.com${route}" />`,
      );
    }
  });

  it("does not emit a bare 'Delta' or 'United' airline label in the generated HTML", () => {
    for (const route of ["/delta-airlines", "/united-airlines"] as const) {
      const html = readGenerated(route);
      // "United States" is a geography reference and is allowed; a bare
      // "United" or "Delta" airline label is not.
      expect(html).not.toMatch(/\bDelta\b(?! Airlines)/);
      expect(html).not.toMatch(/\bUnited\b(?! Airlines| States)/);
    }
  });

  it("still generates every route entry point", () => {
    for (const route of [
      "/flight-booking",
      "/delta-airlines",
      "/united-airlines",
      "/american-airlines",
      "/contact",
      "/privacy",
      "/terms",
    ] as const) {
      expect(existsSync(resolve(DIST_DIR, route.slice(1), "index.html"))).toBe(
        true,
      );
    }
  });
});
