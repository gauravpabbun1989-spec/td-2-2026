import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SITE } from "@/lib/site";
import { renderRoute } from "@/test/render-route";

const ROUTES = [
  { path: "/", heading: /flight booking help from a real travel specialist/i },
  { path: "/flight-booking", heading: /flight booking help for trips/i },
  {
    path: "/delta-airlines",
    heading: /delta airlines bookings handled by a real travel specialist/i,
  },
  {
    path: "/united-airlines",
    heading: /united airlines itineraries, planned and booked by phone/i,
  },
  {
    path: "/american-airlines",
    heading: /american airlines trips, booked with a specialist/i,
  },
  { path: "/contact", heading: /talk to a real travel specialist/i },
  { path: "/privacy", heading: /^privacy policy$/i },
  { path: "/terms", heading: /^terms of service$/i },
] as const;

describe("route rendering", () => {
  it.each(ROUTES)(
    "renders $path with exactly one H1",
    async ({ path, heading }) => {
      renderRoute(path);

      const h1s = await screen.findAllByRole("heading", { level: 1 });
      expect(h1s).toHaveLength(1);
      expect(h1s[0]).toHaveTextContent(heading);
    },
  );

  it("renders the custom 404 page for an unknown URL", async () => {
    renderRoute("/this-page-does-not-exist");

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /this page has departed/i,
      }),
    ).toBeInTheDocument();
    // The 404 offers navigation back to key pages and its own phone CTA.
    expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute(
      "href",
      "/",
    );
    const notFoundCta = document.querySelector(
      '[data-ocid="not_found.call_button"]',
    );
    expect(notFoundCta).not.toBeNull();
    expect(notFoundCta).toHaveAttribute("href", SITE.phoneHref);
  });

  it("offers navigation links back to the key pages on the 404", async () => {
    renderRoute("/this-page-does-not-exist");
    await screen.findByRole("heading", {
      level: 1,
      name: /this page has departed/i,
    });

    // The 404 lists every primary destination except Home (which has its own
    // "Back to home" link), so a lost visitor can recover without the back
    // button. The recovery links carry descriptive labels rather than the bare
    // nav names, so assert them by their stable test ids and hrefs. Scope to
    // the 404 section: the header and footer repeat these destinations.
    const notFound = document.querySelector('[data-ocid="not_found.page"]');
    expect(notFound).not.toBeNull();
    const scope = within(notFound as HTMLElement);
    for (const [ocid, href] of [
      ["not_found.link.flight_booking", "/flight-booking"],
      ["not_found.link.delta", "/delta-airlines"],
      ["not_found.link.united", "/united-airlines"],
      ["not_found.link.american", "/american-airlines"],
      ["not_found.link.contact", "/contact"],
    ] as const) {
      const link = (notFound as HTMLElement).querySelector(
        `[data-ocid="${ocid}"]`,
      );
      expect(link).not.toBeNull();
      expect(link).toHaveAttribute("href", href);
    }
    expect(
      scope.getByRole("link", { name: SITE.phoneDisplay }),
    ).toHaveAttribute("href", SITE.phoneHref);
  });
});

describe("site chrome on every route", () => {
  it.each(ROUTES)(
    "shows the phone number and 24/7 hours on $path",
    async ({ path }) => {
      renderRoute(path);
      await screen.findAllByRole("heading", { level: 1 });

      // The footer carries the phone number and the 24/7 statement on every page.
      const footer = screen.getByRole("contentinfo");
      expect(within(footer).getByText(SITE.phoneDisplay)).toBeInTheDocument();
      expect(
        within(footer).getByText(/open 24 hours, 7 days a week/i),
      ).toBeInTheDocument();
    },
  );

  it.each(ROUTES)(
    "renders the TicketDepart wordmark and primary nav on $path",
    async ({ path }) => {
      renderRoute(path);
      await screen.findAllByRole("heading", { level: 1 });

      // `SectionHeading` also renders a `<header>`, so target the site header by
      // its stable test id rather than the ambiguous `banner` role.
      const banner = document.querySelector('[data-ocid="site.header"]');
      expect(banner).not.toBeNull();
      expect(
        within(banner as HTMLElement).getByText("TicketDepart"),
      ).toBeInTheDocument();
      expect(
        within(banner as HTMLElement).getByRole("navigation", {
          name: /primary/i,
        }),
      ).toBeInTheDocument();
    },
  );

  it("carries the full contact block and disclosure in the footer", async () => {
    renderRoute("/");
    await screen.findAllByRole("heading", { level: 1 });

    const footer = screen.getByRole("contentinfo");
    expect(
      within(footer).getByRole("link", { name: SITE.email }),
    ).toHaveAttribute("href", SITE.emailHref);
    expect(
      within(footer).getByText(/444 Alaska Avenue, Torrance, CA 90503/i),
    ).toBeInTheDocument();
    expect(within(footer).getByText(SITE.disclosure)).toBeInTheDocument();
  });
});

describe("phone conversion control", () => {
  it.each(ROUTES)(
    "links every call CTA to tel:+18555449001 on $path",
    async ({ path }) => {
      renderRoute(path);
      await screen.findAllByRole("heading", { level: 1 });

      const callLinks = screen
        .getAllByRole("link")
        .filter((link) => link.getAttribute("href") === SITE.phoneHref);

      expect(callLinks.length).toBeGreaterThan(0);
      for (const link of callLinks) {
        expect(link).toHaveAttribute("href", "tel:+18555449001");
      }
    },
  );
});
