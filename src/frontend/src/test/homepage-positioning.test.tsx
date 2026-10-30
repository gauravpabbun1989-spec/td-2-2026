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
