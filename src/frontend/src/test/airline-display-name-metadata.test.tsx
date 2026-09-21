import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderRoute } from "@/test/render-route";

/**
 * Characterization baseline for the airline display-name requirement.
 *
 * The accepted requirement is that every user-visible airline name reads
 * "Delta Airlines" and "United Airlines" in full, on all pages, navigation,
 * headings, body copy, and page metadata, while geography references such as
 * "United States" stay unchanged.
 *
 * The sibling files `airline-display-names.test.tsx` and
 * `airline-display-name-invariants.test.tsx` cover nav labels, headings, body
 * copy, FAQ text, breadcrumb schema names, related-link labels, and the frozen
 * route/asset/ocid contract. This file closes the remaining gaps:
 *
 *   - per-route document metadata (title, description, Open Graph, Twitter);
 *   - the American Airlines page's cross-links to the other two airlines;
 *   - a whole-page invariant that no bare "Delta"/"United" airline label
 *     survives anywhere in the rendered body of any route.
 *
 * It deliberately does not assert the bare short forms as correct, and it
 * allows the legitimate "Delta One" cabin name and "United States" geography.
 */

const AIRLINE_ROUTES = [
  {
    path: "/delta-airlines",
    full: "Delta Airlines",
    title: "Delta Airlines Flight Booking Assistance | TicketDepart",
  },
  {
    path: "/united-airlines",
    full: "United Airlines",
    title: "United Airlines Flight Booking Assistance | TicketDepart",
  },
] as const;

const ALL_ROUTES = [
  "/",
  "/flight-booking",
  "/delta-airlines",
  "/united-airlines",
  "/american-airlines",
  "/contact",
  "/privacy",
  "/terms",
] as const;

function metaContent(selector: string): string | null {
  return (
    document.head
      .querySelector<HTMLMetaElement>(selector)
      ?.getAttribute("content") ?? null
  );
}

/**
 * A bare airline short form: "Delta" or "United" not immediately followed by
 * " Airlines". "Delta One" is a legitimate cabin name, and "United States" is
 * a geography reference, so both are excluded explicitly.
 */
const BARE_AIRLINE_LABEL = /\b(Delta|United)\b(?! Airlines| States| One)/;

describe("airline page metadata uses the full airline names", () => {
  it.each(AIRLINE_ROUTES)(
    "$path sets the full name in the document title and social metadata",
    async ({ path, full, title }) => {
      renderRoute(path);
      await screen.findByRole("heading", { level: 1 });

      expect(document.title).toBe(title);
      expect(document.title).toContain(full);

      // Open Graph and Twitter titles mirror the document title.
      expect(metaContent('meta[property="og:title"]')).toContain(full);
      expect(metaContent('meta[name="twitter:title"]')).toContain(full);

      // The description carries the full name too.
      expect(metaContent('meta[name="description"]')).toContain(full);
      expect(metaContent('meta[property="og:description"]')).toContain(full);
      expect(metaContent('meta[name="twitter:description"]')).toContain(full);
    },
  );

  it.each(AIRLINE_ROUTES)(
    "$path does not put a bare short form in its metadata",
    async ({ path }) => {
      renderRoute(path);
      await screen.findByRole("heading", { level: 1 });

      const metadata = [
        document.title,
        metaContent('meta[name="description"]'),
        metaContent('meta[property="og:title"]'),
        metaContent('meta[property="og:description"]'),
        metaContent('meta[name="twitter:title"]'),
        metaContent('meta[name="twitter:description"]'),
      ]
        .filter((value): value is string => value !== null)
        .join(" ");

      expect(metadata).not.toMatch(BARE_AIRLINE_LABEL);
    },
  );
});

describe("the American Airlines page cross-links by full airline name", () => {
  it("labels its related links with the full Delta and United names", async () => {
    renderRoute("/american-airlines");
    await screen.findByRole("heading", { level: 1 });

    const related = document.querySelector('[data-ocid="american.related"]');
    expect(related, "missing american.related").not.toBeNull();

    const links = within(related as HTMLElement).getAllByRole("link");
    const byHref = new Map(
      links.map((link) => [link.getAttribute("href"), link.textContent ?? ""]),
    );

    expect(byHref.get("/delta-airlines")).toContain("Delta Airlines");
    expect(byHref.get("/united-airlines")).toContain("United Airlines");
    // The bare forms must not survive as related-link labels.
    expect(byHref.get("/delta-airlines")).not.toMatch(BARE_AIRLINE_LABEL);
    expect(byHref.get("/united-airlines")).not.toMatch(BARE_AIRLINE_LABEL);
  });
});

describe("no route renders a bare airline short form in its body", () => {
  it.each(ALL_ROUTES)(
    "%s renders only full airline names and geography references",
    async (path) => {
      const { unmount } = renderRoute(path);
      await screen.findByRole("heading", { level: 1 });

      const body = document.body.textContent ?? "";
      expect(body).not.toMatch(BARE_AIRLINE_LABEL);
      unmount();
    },
  );

  it("keeps the 'United States' geography reference on every route that uses it", async () => {
    // The geography wording must survive the rename untouched.
    const { unmount } = renderRoute("/united-airlines");
    await screen.findByRole("heading", { level: 1 });
    expect(document.body.textContent ?? "").toMatch(
      /within the United States/i,
    );
    unmount();

    const flightBooking = renderRoute("/flight-booking");
    await screen.findByRole("heading", { level: 1 });
    expect(document.body.textContent ?? "").toMatch(
      /inside the United States/i,
    );
    flightBooking.unmount();
  });
});
