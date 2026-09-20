import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderRoute } from "@/test/render-route";

const AIRLINE_PAGES = [
  {
    path: "/delta-airlines",
    name: "Delta Airlines",
    heading: /delta bookings handled/i,
    // Delta's image sits below the fold, so it stays lazy-loaded.
    loading: "lazy",
  },
  {
    path: "/united-airlines",
    name: "United Airlines",
    heading: /united itineraries/i,
    // United's image is the above-the-fold hero, so it is loaded eagerly with
    // high fetch priority to avoid a late LCP.
    loading: "eager",
  },
  {
    path: "/american-airlines",
    name: "American Airlines",
    heading: /american airlines trips/i,
    // American's image sits below the fold, so it stays lazy-loaded.
    loading: "lazy",
  },
] as const;

describe("airline pages", () => {
  it.each(AIRLINE_PAGES)(
    "$path states no affiliation with $name",
    async ({ path, name, heading }) => {
      renderRoute(path);
      await screen.findByRole("heading", { level: 1, name: heading });

      const body = document.body.textContent ?? "";
      expect(body).toMatch(/independent travel agency/i);
      expect(body).toMatch(
        new RegExp(
          `not affiliated with, endorsed by, or sponsored by ${name}`,
          "i",
        ),
      );
    },
  );

  it("contains materially different copy across the three airline pages", async () => {
    const bodies: string[] = [];
    for (const { path, heading } of AIRLINE_PAGES) {
      const { unmount } = renderRoute(path);
      await screen.findByRole("heading", { level: 1, name: heading });
      bodies.push(document.body.textContent ?? "");
      // Unmount so the next page's text does not accumulate in `document.body`.
      unmount();
    }

    // Each page's H1 and body must be distinct, not a name substitution.
    expect(new Set(bodies).size).toBe(AIRLINE_PAGES.length);
    expect(bodies[0]).not.toContain(
      "United itineraries, planned and booked by phone",
    );
    expect(bodies[1]).not.toContain(
      "Delta bookings handled by a real travel specialist",
    );
  });

  it("shows a before-you-call checklist and FAQ on each airline page", async () => {
    for (const { path, heading } of AIRLINE_PAGES) {
      const { unmount } = renderRoute(path);
      await screen.findByRole("heading", { level: 1, name: heading });

      expect(screen.getAllByText(/before you call/i).length).toBeGreaterThan(0);
      expect(
        screen.getAllByText(
          /frequently asked questions|what travelers ask us most/i,
        ).length,
      ).toBeGreaterThan(0);
      unmount();
    }
  });

  it.each(AIRLINE_PAGES)(
    "$path carries one travel image with descriptive alt text",
    async ({ path, heading, loading }) => {
      renderRoute(path);
      await screen.findByRole("heading", { level: 1, name: heading });

      const images = screen.getAllByRole("img");
      expect(images).toHaveLength(1);
      const image = images[0];
      expect(image).toHaveAttribute("loading", loading);
      expect(image.getAttribute("alt")?.length ?? 0).toBeGreaterThan(20);
      // The image is an unbranded travel photo, not an airline logo.
      expect(image.getAttribute("alt")).not.toMatch(
        /logo|delta air lines|united airlines|american airlines/i,
      );
    },
  );

  it("loads the United above-the-fold hero eagerly with high priority", async () => {
    renderRoute("/united-airlines");
    await screen.findByRole("heading", {
      level: 1,
      name: /united itineraries/i,
    });

    const image = screen.getAllByRole("img")[0];
    expect(image).toHaveAttribute("loading", "eager");
    expect(image).toHaveAttribute("fetchpriority", "high");
  });

  it("does not link out to any airline booking site", async () => {
    // Airline booking domains that would take the conversion off-site. The
    // platform's own caffeine.ai footer link is not an airline site.
    const AIRLINE_BOOKING_HOSTS =
      /(^|\.)(delta\.com|united\.com|aa\.com|americanairlines\.com|airlines\.com)$/i;

    for (const { path, heading } of AIRLINE_PAGES) {
      const { unmount } = renderRoute(path);
      await screen.findByRole("heading", { level: 1, name: heading });

      const airlineLinks = screen
        .getAllByRole("link")
        .map((link) => link.getAttribute("href") ?? "")
        .filter((href) => {
          try {
            return AIRLINE_BOOKING_HOSTS.test(new URL(href).hostname);
          } catch {
            return false;
          }
        });
      expect(airlineLinks).toEqual([]);
      unmount();
    }
  });
});
