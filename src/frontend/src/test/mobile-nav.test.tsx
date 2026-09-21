import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { SITE } from "@/lib/site";
import { renderRoute } from "@/test/render-route";

describe("mobile navigation drawer", () => {
  it("opens and closes from the header toggle", async () => {
    const user = userEvent.setup();
    renderRoute("/");
    await screen.findByRole("heading", { level: 1 });

    const toggle = screen.getByRole("button", {
      name: /open navigation menu/i,
    });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("navigation", { name: /mobile/i }),
    ).not.toBeInTheDocument();

    await user.click(toggle);

    const drawerNav = screen.getByRole("navigation", { name: /mobile/i });
    expect(drawerNav).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /close navigation menu/i }),
    ).toHaveAttribute("aria-expanded", "true");

    await user.click(
      screen.getByRole("button", { name: /close navigation menu/i }),
    );
    expect(
      screen.queryByRole("navigation", { name: /mobile/i }),
    ).not.toBeInTheDocument();
  });

  it("contains every primary nav link and the call CTA", async () => {
    const user = userEvent.setup();
    renderRoute("/");
    await screen.findByRole("heading", { level: 1 });

    await user.click(
      screen.getByRole("button", { name: /open navigation menu/i }),
    );
    const drawerNav = screen.getByRole("navigation", { name: /mobile/i });

    for (const item of [
      "Home",
      "Flight Booking",
      "Delta Airlines",
      "United Airlines",
      "American Airlines",
      "Contact",
    ]) {
      expect(
        within(drawerNav).getByRole("link", { name: item }),
      ).toBeInTheDocument();
    }

    expect(
      within(drawerNav).getByRole("link", {
        name: new RegExp(SITE.ctaLabel, "i"),
      }),
    ).toHaveAttribute("href", SITE.phoneHref);
  });

  it("closes the drawer after a navigation link is chosen", async () => {
    const user = userEvent.setup();
    renderRoute("/");
    await screen.findByRole("heading", { level: 1 });

    await user.click(
      screen.getByRole("button", { name: /open navigation menu/i }),
    );
    const drawerNav = screen.getByRole("navigation", { name: /mobile/i });
    await user.click(within(drawerNav).getByRole("link", { name: "Contact" }));

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /talk to a real travel specialist/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", { name: /mobile/i }),
    ).not.toBeInTheDocument();
  });
});
