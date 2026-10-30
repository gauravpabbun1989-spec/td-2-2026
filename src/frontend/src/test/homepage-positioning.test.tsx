import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderRoute } from "@/test/render-route";

describe("economy-first homepage positioning", () => {
  it("leads with individual economy travelers rather than group or corporate travel", async () => {
    renderRoute("/");
    await screen.findByRole("heading", { level: 1, name: /Need a Flight\?/i });

    const hero = document.querySelector('[data-ocid="home.hero_section"]');
    expect(hero).not.toBeNull();
    expect(hero).toHaveTextContent(/affordable economy options/i);
    expect(hero).toHaveTextContent(/individual travelers/i);
    expect(hero).not.toHaveTextContent(/group trips|group booking|corporate travel/i);
  });
});
