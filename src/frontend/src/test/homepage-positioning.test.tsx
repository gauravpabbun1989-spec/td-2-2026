import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderRoute } from "@/test/render-route";

describe("economy-first homepage positioning", () => {
  it("leads with individual economy travelers rather than group or corporate travel", async () => {
    renderRoute("/");
    await screen.findByRole("heading", { level: 1, name: /Need a Flight\?/i });

    const hero = document.querySelector('[data-ocid="home.hero_section"]');
    if (!hero) throw new Error("Homepage hero was not rendered");
    expect(hero).toHaveTextContent(/affordable economy options/i);
    expect(hero).toHaveTextContent(/individual travelers/i);
    expect(hero).not.toHaveTextContent(/group trips|group booking|corporate travel/i);
  });

  it("replaces the airline-status FAQ with useful booking information", async () => {
    renderRoute("/");
    expect(
      await screen.findByText("What can TicketDepart help me with?"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Is TicketDepart an airline?"),
    ).not.toBeInTheDocument();
    const faqSection = document.querySelector('[data-ocid="home.faq_section"]');
    if (!faqSection) throw new Error("Homepage FAQ section was not rendered");
    expect(faqSection).not.toHaveTextContent(
      /independent travel agency|not affiliated with, endorsed by/i,
    );

    const footer = document.querySelector('[data-ocid="site.footer"]');
    if (!footer) throw new Error("Site footer was not rendered");
    expect(footer).toHaveTextContent(
      /independent travel agency and is not affiliated with any airline/i,
    );
  });

  it("makes economy the first service on the main flight-booking page", async () => {
    renderRoute("/flight-booking");
    await screen.findByRole("heading", {
      level: 1,
      name: /flight booking assistance by phone for u\.s\. travelers/i,
    });

    expect(screen.getByText("Economy flight booking")).toBeInTheDocument();
    expect(screen.getByText("Optional premium cabins")).toBeInTheDocument();
    expect(screen.queryByText("Group flight booking")).not.toBeInTheDocument();
    expect(screen.queryByText(/group and family bookings/i)).not.toBeInTheDocument();
  });
});
