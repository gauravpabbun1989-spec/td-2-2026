import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AREA_SERVED, NAV_ITEMS } from "@/lib/site";
import { renderRoute } from "@/test/render-route";

/**
 * Cover for the airline display-name change.
 *
 * The accepted request expands the two airline names to their full forms in
 * every user-visible string: "Delta" -> "Delta Airlines" and "United" ->
 * "United Airlines" in navigation labels, page headings, body copy, FAQ
 * questions and answers, breadcrumb schema names, related-link labels, airline
 * card labels, 404 guide labels, and the static route HTML titles,
 * descriptions, and headings.
 *
 * Everything that identifies a route, an asset, or a test hook is intentionally
 * frozen and must survive the rename. The adjacent frozen contract is covered
 * by `airline-display-name-invariants.test.tsx`; this file asserts the new
 * display text and re-checks the frozen identifiers that a naive
 * "United" -> "United Airlines" substitution would corrupt.
 */

const AIRLINES = [
  {
    path: "/delta-airlines",
    full: "Delta Airlines",
    slug: "delta",
    heading: /delta airlines bookings handled by a real travel specialist/i,
    image: "delta-terminal-concourse.dim_1200x800.jpg",
  },
  {
    path: "/united-airlines",
    full: "United Airlines",
    slug: "united",
    heading: /united airlines itineraries, planned and booked by phone/i,
    image: "united-terminal-concourse.dim_1536x864.jpg",
  },
] as const;

describe("navigation labels use the full airline names", () => {
  it("exposes the full names in the site navigation data", () => {
    const labels = NAV_ITEMS.map((item) => item.label);
    expect(labels).toContain("Delta Airlines");
    expect(labels).toContain("United Airlines");
    // The bare forms must not survive as nav labels.
    expect(labels).not.toContain("Delta");
    expect(labels).not.toContain("United");
  });

  it("renders the full names in the desktop primary nav", async () => {
    renderRoute("/");
    await screen.findByRole("heading", { level: 1 });

    const banner = document.querySelector('[data-ocid="site.header"]');
    expect(banner).not.toBeNull();
    const primaryNav = within(banner as HTMLElement).getByRole("navigation", {
      name: /primary/i,
    });

    expect(
      within(primaryNav).getByRole("link", { name: "Delta Airlines" }),
    ).toHaveAttribute("href", "/delta-airlines");
    expect(
      within(primaryNav).getByRole("link", { name: "United Airlines" }),
    ).toHaveAttribute("href", "/united-airlines");
  });

  it("renders the full names in the footer nav", async () => {
    renderRoute("/");
    await screen.findByRole("heading", { level: 1 });

    const footer = screen.getByRole("contentinfo");
    expect(
      within(footer).getByRole("link", { name: "Delta Airlines" }),
    ).toHaveAttribute("href", "/delta-airlines");
    expect(
      within(footer).getByRole("link", { name: "United Airlines" }),
    ).toHaveAttribute("href", "/united-airlines");
  });
});

describe("airline pages use the full names in headings and body copy", () => {
  it.each(AIRLINES)(
    "$path renders its full-name H1 and body copy",
    async ({ path, full, heading }) => {
      renderRoute(path);
      const h1 = await screen.findByRole("heading", {
        level: 1,
        name: heading,
      });
      expect(h1).toHaveTextContent(full);

      // The full name appears in the page body, not only the H1.
      const body = document.body.textContent ?? "";
      expect(body).toContain(full);
    },
  );

  it.each(AIRLINES)(
    "$path uses the full name in its FAQ questions and answers",
    async ({ path, full, slug }) => {
      renderRoute(path);
      await screen.findByRole("heading", { level: 1 });

      const faq = document.querySelector(`[data-ocid="${slug}.faq"]`);
      expect(faq, `missing ${slug}.faq`).not.toBeNull();
      const faqText = (faq as HTMLElement).textContent ?? "";
      expect(faqText).toContain(full);
    },
  );

  it.each(AIRLINES)(
    "$path uses the full name in its related-link labels",
    async ({ path, full, slug }) => {
      renderRoute(path);
      await screen.findByRole("heading", { level: 1 });

      const related = document.querySelector(`[data-ocid="${slug}.related"]`);
      expect(related, `missing ${slug}.related`).not.toBeNull();
      const labels = within(related as HTMLElement)
        .getAllByRole("link")
        .map((link) => link.textContent ?? "");
      // Each airline page cross-links to the other airline by its full name.
      const other =
        full === "Delta Airlines" ? "United Airlines" : "Delta Airlines";
      expect(labels.some((label) => label.includes(other))).toBe(true);
    },
  );

  it.each(AIRLINES)(
    "$path emits a breadcrumb schema name with the full airline name",
    async ({ path, full }) => {
      renderRoute(path);
      await screen.findByRole("heading", { level: 1 });

      const nodes = Array.from(
        document.head.querySelectorAll('script[type="application/ld+json"]'),
      ).flatMap((script) => {
        const parsed = JSON.parse(script.textContent ?? "[]") as unknown;
        return Array.isArray(parsed)
          ? (parsed as Record<string, unknown>[])
          : [parsed as Record<string, unknown>];
      });

      const breadcrumb = nodes.find(
        (node) => node["@type"] === "BreadcrumbList",
      );
      expect(breadcrumb, `missing BreadcrumbList on ${path}`).toBeDefined();

      const items = breadcrumb?.itemListElement as
        | { name?: string }[]
        | undefined;
      const names = (items ?? []).map((item) => item.name);
      expect(names).toContain(full);
      expect(names).not.toContain(full.replace(" Airlines", ""));
    },
  );
});

describe("cross-page airline labels use the full names", () => {
  it("uses the full names on the homepage service-grid airline links", async () => {
    renderRoute("/");
    await screen.findByRole("heading", { level: 1 });

    const section = document.querySelector(
      '[data-ocid="home.services_section"]',
    );
    expect(section).not.toBeNull();
    const scope = within(section as HTMLElement);

    expect(
      scope.getByRole("link", { name: /delta airlines flight booking help/i }),
    ).toHaveAttribute("href", "/delta-airlines");
    expect(
      scope.getByRole("link", { name: /united airlines flight booking help/i }),
    ).toHaveAttribute("href", "/united-airlines");
  });

  it("uses the full names on the flight-booking airline cards", async () => {
    renderRoute("/flight-booking");
    await screen.findByRole("heading", { level: 1 });

    const deltaCard = document.querySelector(
      '[data-ocid="flight_booking.airline_link.delta-airlines"]',
    );
    const unitedCard = document.querySelector(
      '[data-ocid="flight_booking.airline_link.united-airlines"]',
    );
    expect(deltaCard).not.toBeNull();
    expect(unitedCard).not.toBeNull();
    expect(deltaCard).toHaveTextContent("Delta Airlines");
    expect(unitedCard).toHaveTextContent("United Airlines");
  });

  it("uses the full names on the 404 recovery guide labels", async () => {
    renderRoute("/this-page-does-not-exist");
    await screen.findByRole("heading", {
      level: 1,
      name: /this page has departed/i,
    });

    const deltaLink = document.querySelector(
      '[data-ocid="not_found.link.delta"]',
    );
    const unitedLink = document.querySelector(
      '[data-ocid="not_found.link.united"]',
    );
    expect(deltaLink).not.toBeNull();
    expect(unitedLink).not.toBeNull();
    expect(deltaLink).toHaveTextContent("Delta Airlines");
    expect(unitedLink).toHaveTextContent("United Airlines");
  });
});

describe("frozen identifiers survive the display-name rename", () => {
  it.each(AIRLINES)(
    "$path keeps its route path, image filename, and section ocids",
    async ({ path, slug, image }) => {
      renderRoute(path);
      await screen.findByRole("heading", { level: 1 });

      // The route path is the URL, not the display name. The memory router
      // does not move `window.location`, so read the canonical link the page
      // emits for its own path.
      const canonical = document.head
        .querySelector<HTMLLinkElement>('link[rel="canonical"]')
        ?.getAttribute("href");
      expect(canonical).toContain(path);

      // The generated image filename is unchanged.
      const img = screen.getAllByRole("img")[0];
      expect(img.getAttribute("src")).toContain(image);

      // The page section ocids are unchanged.
      expect(
        document.querySelector(`[data-ocid="${slug}.page"]`),
      ).not.toBeNull();
      expect(
        document.querySelector(`[data-ocid="${slug}.faq"]`),
      ).not.toBeNull();
    },
  );

  it("keeps 'United States' geography references intact", async () => {
    expect(AREA_SERVED).toContain("United States");

    renderRoute("/united-airlines");
    await screen.findByRole("heading", { level: 1 });
    // A naive substitution would corrupt this into "the United Airlines States".
    expect(document.body.textContent ?? "").toMatch(
      /within the United States/i,
    );

    const { unmount } = renderRoute("/flight-booking");
    await screen.findByRole("heading", { level: 1 });
    expect(document.body.textContent ?? "").toMatch(
      /inside the United States/i,
    );
    unmount();
  });
});
