import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AREA_SERVED } from "@/lib/site";
import { renderRoute } from "@/test/render-route";

/**
 * Characterization baseline for the airline display-name change.
 *
 * The upcoming request changes only the *display text* of the two airline
 * names: "Delta" -> "Delta Airlines" and "United" -> "United Airlines" in nav
 * labels, page headings, body copy, FAQ text, breadcrumb schema names, and
 * related-link labels. Everything that identifies a route, an asset, or a test
 * hook is intentionally frozen and must survive that rename:
 *
 *   - route paths (/delta-airlines, /united-airlines) in every link;
 *   - explicit `data-ocid` identifiers on the airline pages and cross-links;
 *   - generated image filenames;
 *   - the "United States" geography reference, which must not be caught by a
 *     naive "United" -> "United Airlines" substitution.
 *
 * This file deliberately does NOT assert the old bare labels ("Delta",
 * "United") anywhere, because those are the text the request intentionally
 * changes. It freezes the adjacent, non-textual contract instead.
 */

const AIRLINE_ROUTES = [
  { path: "/delta-airlines", slug: "delta" },
  { path: "/united-airlines", slug: "united" },
] as const;

describe("airline route paths stay frozen", () => {
  it("keeps the primary nav pointing at the airline route paths", async () => {
    renderRoute("/");
    await screen.findByRole("heading", { level: 1 });

    const banner = document.querySelector('[data-ocid="site.header"]');
    expect(banner).not.toBeNull();
    const primaryNav = within(banner as HTMLElement).getByRole("navigation", {
      name: /primary/i,
    });

    // Match by href rather than by label: the label is the text under change,
    // the href is the frozen contract.
    const hrefs = within(primaryNav)
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(hrefs).toContain("/delta-airlines");
    expect(hrefs).toContain("/united-airlines");
  });

  it("keeps the footer nav pointing at the airline route paths", async () => {
    renderRoute("/");
    await screen.findByRole("heading", { level: 1 });

    const footer = screen.getByRole("contentinfo");
    const hrefs = within(footer)
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(hrefs).toContain("/delta-airlines");
    expect(hrefs).toContain("/united-airlines");
  });

  it("keeps the homepage service-grid cross-links on their ocids and paths", async () => {
    renderRoute("/");
    await screen.findByRole("heading", { level: 1 });

    const section = document.querySelector(
      '[data-ocid="home.services_section"]',
    );
    expect(section).not.toBeNull();

    for (const [ocid, href] of [
      ["home.services_delta_link", "/delta-airlines"],
      ["home.services_united_link", "/united-airlines"],
    ] as const) {
      const link = (section as HTMLElement).querySelector(
        `[data-ocid="${ocid}"]`,
      );
      expect(link, `missing ${ocid}`).not.toBeNull();
      expect(link).toHaveAttribute("href", href);
    }
  });

  it("keeps the flight-booking airline cards on their path-derived ocids", async () => {
    renderRoute("/flight-booking");
    await screen.findByRole("heading", { level: 1 });

    for (const [ocid, href] of [
      ["flight_booking.airline_link.delta-airlines", "/delta-airlines"],
      ["flight_booking.airline_link.united-airlines", "/united-airlines"],
    ] as const) {
      const link = document.querySelector(`[data-ocid="${ocid}"]`);
      expect(link, `missing ${ocid}`).not.toBeNull();
      expect(link).toHaveAttribute("href", href);
    }
  });

  it("keeps the 404 recovery links on their ocids and paths", async () => {
    renderRoute("/this-page-does-not-exist");
    await screen.findByRole("heading", {
      level: 1,
      name: /this page has departed/i,
    });

    for (const [ocid, href] of [
      ["not_found.link.delta", "/delta-airlines"],
      ["not_found.link.united", "/united-airlines"],
    ] as const) {
      const link = document.querySelector(`[data-ocid="${ocid}"]`);
      expect(link, `missing ${ocid}`).not.toBeNull();
      expect(link).toHaveAttribute("href", href);
    }
  });
});

describe("airline page test hooks and assets stay frozen", () => {
  it.each(AIRLINE_ROUTES)(
    "$path keeps its FAQ section ocid and FAQ item ocids",
    async ({ path, slug }) => {
      renderRoute(path);
      await screen.findByRole("heading", { level: 1 });

      const faq = document.querySelector(`[data-ocid="${slug}.faq"]`);
      expect(faq, `missing ${slug}.faq`).not.toBeNull();
      expect(
        (faq as HTMLElement).querySelectorAll('[data-ocid*=".faq_item."]')
          .length,
      ).toBeGreaterThan(0);
    },
  );

  it.each([
    { path: "/delta-airlines", slug: "delta", other: "/united-airlines" },
    { path: "/united-airlines", slug: "united", other: "/delta-airlines" },
  ] as const)(
    "$path keeps its related-link ocids pointing at the other airline routes",
    async ({ path, slug, other }) => {
      renderRoute(path);
      await screen.findByRole("heading", { level: 1 });

      const related = document.querySelector(`[data-ocid="${slug}.related"]`);
      expect(related, `missing ${slug}.related`).not.toBeNull();

      const hrefs = within(related as HTMLElement)
        .getAllByRole("link")
        .map((link) => link.getAttribute("href"));
      // Each airline page cross-links to the other airline and to the general
      // booking page; it does not link to itself.
      expect(hrefs).toContain(other);
      expect(hrefs).toContain("/american-airlines");
      expect(hrefs).toContain("/flight-booking");
    },
  );

  it("keeps the generated airline image filenames unchanged", async () => {
    const expected: Record<string, string> = {
      "/delta-airlines": "delta-terminal-concourse.dim_1200x800.jpg",
      "/united-airlines": "united-terminal-concourse.dim_1536x864.jpg",
    };

    for (const [path, filename] of Object.entries(expected)) {
      const { unmount } = renderRoute(path);
      await screen.findByRole("heading", { level: 1 });

      const image = screen.getAllByRole("img")[0];
      expect(image.getAttribute("src")).toContain(filename);
      unmount();
    }
  });

  it.each(AIRLINE_ROUTES)(
    "$path keeps its breadcrumb home-link ocid and href",
    async ({ path, slug }) => {
      renderRoute(path);
      await screen.findByRole("heading", { level: 1 });

      // The breadcrumb's *label* is display text under change; its ocid and
      // href are the frozen hook and destination.
      const homeLink = document.querySelector(
        `[data-ocid="${slug}.breadcrumb.home_link"]`,
      );
      expect(homeLink, `missing ${slug}.breadcrumb.home_link`).not.toBeNull();
      expect(homeLink).toHaveAttribute("href", "/");
    },
  );

  it.each([
    {
      path: "/delta-airlines",
      sections: [
        "delta.page",
        "delta.services",
        "delta.cabins",
        "delta.international",
        "delta.checklist",
        "delta.cta",
        "delta.faq",
        "delta.related",
      ],
    },
    {
      path: "/united-airlines",
      sections: [
        "united.page",
        "united.capabilities",
        "united.cabins",
        "united.international",
        "united.multicity",
        "united.changes",
        "united.checklist",
        "united.cta",
        "united.faq",
        "united.related",
      ],
    },
  ] as const)(
    "$path keeps its page section ocids",
    async ({ path, sections }) => {
      renderRoute(path);
      await screen.findByRole("heading", { level: 1 });

      // The section wrappers are the stable test hooks for each page band. A
      // display-name rename must not disturb them.
      for (const section of sections) {
        expect(
          document.querySelector(`[data-ocid="${section}"]`),
          `missing ${section}`,
        ).not.toBeNull();
      }
    },
  );
});

describe("geography references are not renamed", () => {
  it("keeps 'United States' in the served-area list", () => {
    expect(AREA_SERVED).toContain("United States");
  });

  it("keeps the United page's domestic-cabin geography wording", async () => {
    renderRoute("/united-airlines");
    await screen.findByRole("heading", { level: 1 });

    // A naive "United" -> "United Airlines" substitution would corrupt this
    // sentence into "within the United Airlines States".
    expect(document.body.textContent ?? "").toMatch(
      /within the United States/i,
    );
  });

  it("keeps the flight-booking domestic geography wording", async () => {
    renderRoute("/flight-booking");
    await screen.findByRole("heading", { level: 1 });

    expect(document.body.textContent ?? "").toMatch(
      /inside the United States/i,
    );
  });
});
