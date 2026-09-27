import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { SITE } from "@/lib/site";
import { renderRoute } from "@/test/render-route";

/**
 * Cover for the accepted phone-CTA contract:
 *
 *   1. the displayed business number `+1-888-958-0280` appears correctly
 *      wherever the call CTA is shown;
 *   2. the call CTA is a real `tel:` link wired to `tel:+18889580280`;
 *   3. activating the call CTA does not break navigation or the page.
 *
 * The existing suites already assert the `tel:` href on every route
 * (`routes.test.tsx`), the mobile call bar (`characterization-chrome.test.tsx`),
 * and the contact form's success/failure phone links (`contact-form*.test.tsx`).
 * This file adds the two things those do not cover: the *displayed* number on
 * the shared `CallCta` control (which renders the CTA label, not the number,
 * unless `showNumber` is set), and the observable effect of activating a call
 * CTA — the page stays mounted and navigation still works afterwards.
 *
 * Coverage limit: jsdom cannot perform real `tel:` navigation, so "does not
 * break navigation" is asserted as the page remaining intact and a subsequent
 * in-app navigation still succeeding. The backend is not involved in any of
 * these assertions.
 */

/** Routes that render the shared `CallCta` control. */
const ROUTES_WITH_CALL_CTA = [
  "/",
  "/flight-booking",
  "/delta-airlines",
  "/united-airlines",
  "/american-airlines",
  "/contact",
  "/privacy",
  "/terms",
] as const;

/** The exact accepted display string, asserted literally, not via `SITE`. */
const DISPLAYED_NUMBER = "+1-888-958-0280";
/** The exact accepted `tel:` target, asserted literally. */
const TEL_HREF = "tel:+18889580280";

describe("call CTA phone number", () => {
  it("keeps the canonical display string and tel: target in sync", () => {
    // The single source of truth must carry the accepted values; a drift here
    // would silently change every CTA on the site.
    expect(SITE.phoneDisplay).toBe(DISPLAYED_NUMBER);
    expect(SITE.phoneHref).toBe(TEL_HREF);
  });

  it.each(ROUTES_WITH_CALL_CTA)(
    "renders the displayed number on the call CTA on %s",
    async (path) => {
      renderRoute(path);
      await screen.findAllByRole("heading", { level: 1 });

      // The CTA's accessible name carries the displayed number, so a screen
      // reader announces the number the visitor is about to dial.
      const cta = screen
        .getAllByRole("link")
        .find((link) => link.getAttribute("href") === TEL_HREF);
      expect(cta).toBeDefined();
      expect(cta).toHaveAccessibleName(
        new RegExp(DISPLAYED_NUMBER.replace(/[+]/g, "\\+")),
      );
    },
  );

  it("shows the number as visible text on the CTAs that opt into showNumber", async () => {
    // The airline closing CTAs pass `showNumber`, so the number itself is the
    // visible label rather than the generic CTA copy.
    for (const path of [
      "/delta-airlines",
      "/united-airlines",
      "/american-airlines",
    ]) {
      const { unmount } = renderRoute(path);
      await screen.findAllByRole("heading", { level: 1 });

      const visible = screen
        .getAllByRole("link")
        .filter(
          (link) =>
            link.getAttribute("href") === TEL_HREF &&
            (link.textContent ?? "").includes(DISPLAYED_NUMBER),
        );
      expect(visible.length).toBeGreaterThan(0);
      unmount();
    }
  });

  it("renders the displayed number as a tel: link in the footer on every route", async () => {
    for (const path of ROUTES_WITH_CALL_CTA) {
      const { unmount } = renderRoute(path);
      await screen.findAllByRole("heading", { level: 1 });

      const footer = screen.getByRole("contentinfo");
      const phoneLink = within(footer).getByRole("link", {
        name: DISPLAYED_NUMBER,
      });
      expect(phoneLink).toHaveAttribute("href", TEL_HREF);
      unmount();
    }
  });
});

describe("activating the call CTA", () => {
  it("leaves the page intact and navigation working after a call CTA click", async () => {
    const user = userEvent.setup();
    renderRoute("/");
    await screen.findByRole("heading", { level: 1 });

    const cta = document.querySelector<HTMLAnchorElement>(
      '[data-ocid="home.hero_call_button"]',
    );
    expect(cta).not.toBeNull();
    expect(cta).toHaveAttribute("href", TEL_HREF);

    // jsdom cannot follow a `tel:` link; the click must not throw, unmount the
    // page, or leave the app in a broken state.
    await user.click(cta as HTMLAnchorElement);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Need a Flight\? We’re Here to Help\./i,
      }),
    ).toBeInTheDocument();

    // Navigation still works after the call CTA was activated.
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

  it("keeps the mobile call bar usable after activating it", async () => {
    const user = userEvent.setup();
    renderRoute("/");
    await screen.findByRole("heading", { level: 1 });

    const barLink = document.querySelector<HTMLAnchorElement>(
      '[data-ocid="mobile_call.button"]',
    );
    expect(barLink).not.toBeNull();
    expect(barLink).toHaveAttribute("href", TEL_HREF);
    expect(barLink).toHaveTextContent(DISPLAYED_NUMBER);

    await user.click(barLink as HTMLAnchorElement);

    // The persistent bar is still rendered and still points at the number.
    const afterClick = document.querySelector<HTMLAnchorElement>(
      '[data-ocid="mobile_call.button"]',
    );
    expect(afterClick).not.toBeNull();
    expect(afterClick).toHaveAttribute("href", TEL_HREF);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
