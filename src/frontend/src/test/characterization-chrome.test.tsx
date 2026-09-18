import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { SITE } from "@/lib/site";
import { renderRoute } from "@/test/render-route";

/**
 * Characterization baseline for site chrome and form validation branches that
 * the upcoming request does NOT intentionally change. The request expands the
 * callback form's field set, adds backend fields, changes the success state,
 * adds airline images, and expands SEO/structured data — none of that is frozen
 * here. What is frozen is adjacent working behavior: the persistent mobile call
 * bar, the desktop primary navigation, the footer's legal links, the homepage
 * service grid, and the return-date ordering rules the form already enforces.
 */

describe("persistent mobile call bar", () => {
  it("renders a fixed call bar with the tel: link and displayed number", async () => {
    renderRoute("/");
    await screen.findByRole("heading", { level: 1 });

    const bar = document.querySelector('[data-ocid="mobile_call.bar"]');
    expect(bar).not.toBeNull();

    const callLink = (bar as HTMLElement).querySelector(
      '[data-ocid="mobile_call.button"]',
    );
    expect(callLink).not.toBeNull();
    expect(callLink).toHaveAttribute("href", "tel:+18555449001");
    expect(callLink).toHaveTextContent(SITE.phoneDisplay);
    // The bar is the persistent mobile conversion control, so it must be
    // present on every route, not just the homepage.
    expect(callLink).toHaveAccessibleName(
      new RegExp(
        `${SITE.ctaLabel} at ${SITE.phoneDisplay.replace(/[+]/g, "\\+")}`,
        "i",
      ),
    );
  });

  it("stays present on a deeper route", async () => {
    renderRoute("/delta-airlines");
    await screen.findByRole("heading", { level: 1 });

    const callLink = document.querySelector('[data-ocid="mobile_call.button"]');
    expect(callLink).not.toBeNull();
    expect(callLink).toHaveAttribute("href", SITE.phoneHref);
  });
});

describe("desktop primary navigation", () => {
  it("links every primary nav item to its page", async () => {
    renderRoute("/");
    await screen.findByRole("heading", { level: 1 });

    const banner = document.querySelector('[data-ocid="site.header"]');
    expect(banner).not.toBeNull();
    const primaryNav = within(banner as HTMLElement).getByRole("navigation", {
      name: /primary/i,
    });

    for (const [label, href] of [
      ["Home", "/"],
      ["Flight Booking", "/flight-booking"],
      ["Delta", "/delta-airlines"],
      ["United", "/united-airlines"],
      ["American Airlines", "/american-airlines"],
      ["Contact", "/contact"],
    ] as const) {
      expect(
        within(primaryNav).getByRole("link", { name: label }),
      ).toHaveAttribute("href", href);
    }
  });

  it("navigates to the contact page from the desktop nav", async () => {
    const user = userEvent.setup();
    renderRoute("/");
    await screen.findByRole("heading", { level: 1 });

    const banner = document.querySelector('[data-ocid="site.header"]');
    const primaryNav = within(banner as HTMLElement).getByRole("navigation", {
      name: /primary/i,
    });
    await user.click(within(primaryNav).getByRole("link", { name: "Contact" }));

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /talk to a real travel specialist/i,
      }),
    ).toBeInTheDocument();
  });
});

describe("footer legal navigation", () => {
  it("links the privacy and terms pages", async () => {
    renderRoute("/");
    await screen.findByRole("heading", { level: 1 });

    const footer = screen.getByRole("contentinfo");
    expect(
      within(footer).getByRole("link", { name: "Privacy Policy" }),
    ).toHaveAttribute("href", "/privacy");
    expect(
      within(footer).getByRole("link", { name: "Terms of Service" }),
    ).toHaveAttribute("href", "/terms");
  });
});

describe("homepage service grid", () => {
  it("renders the six core service cards with substantive copy", async () => {
    renderRoute("/");
    await screen.findByRole("heading", { level: 1 });

    const section = document.querySelector(
      '[data-ocid="home.services_section"]',
    );
    expect(section).not.toBeNull();
    const scope = within(section as HTMLElement);

    for (const title of [
      "Flight booking assistance",
      "International travel",
      "Multi-city itineraries",
      "Business & first class",
      "Group travel",
      "Changes & rebooking",
    ]) {
      expect(scope.getByRole("heading", { name: title })).toBeInTheDocument();
    }

    // The airline cross-links are part of the working service grid.
    expect(
      scope.getByRole("link", { name: /delta flight booking help/i }),
    ).toHaveAttribute("href", "/delta-airlines");
    expect(
      scope.getByRole("link", { name: /united flight booking help/i }),
    ).toHaveAttribute("href", "/united-airlines");
    expect(
      scope.getByRole("link", {
        name: /american airlines flight booking help/i,
      }),
    ).toHaveAttribute("href", "/american-airlines");
  });
});

describe("return-date ordering rules", () => {
  async function fillThroughDeparture(
    user: ReturnType<typeof userEvent.setup>,
    tripType: string,
  ) {
    await user.type(screen.getByLabelText(/full name/i), "Jordan Ellis");
    await user.type(screen.getByLabelText(/^phone$/i), "3105550142");
    await user.type(screen.getByLabelText(/^email$/i), "jordan@example.com");
    await user.selectOptions(screen.getByLabelText(/trip type/i), tripType);
    await user.type(screen.getByLabelText(/flying from/i), "Los Angeles (LAX)");
    await user.type(screen.getByLabelText(/flying to/i), "Tokyo (HND)");
    await user.type(screen.getByLabelText(/departure date/i), "2026-03-14");
    await user.clear(screen.getByLabelText(/travelers/i));
    await user.type(screen.getByLabelText(/travelers/i), "2");
    await user.selectOptions(screen.getByLabelText(/cabin/i), "economy");
  }

  it("rejects a return date before the departure date", async () => {
    const user = userEvent.setup();
    renderRoute("/contact");
    await screen.findByRole("heading", {
      level: 1,
      name: /talk to a real travel specialist/i,
    });

    await fillThroughDeparture(user, "roundTrip");
    await user.type(screen.getByLabelText(/return date/i), "2026-03-01");
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    expect(
      await screen.findByText(
        /return date cannot be before the departure date/i,
      ),
    ).toBeInTheDocument();
  });

  it("requires a return date for a multi-city trip", async () => {
    const user = userEvent.setup();
    renderRoute("/contact");
    await screen.findByRole("heading", {
      level: 1,
      name: /talk to a real travel specialist/i,
    });

    await fillThroughDeparture(user, "multiCity");
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    expect(
      await screen.findByText(/add a return date for this trip type/i),
    ).toBeInTheDocument();
  });
});
