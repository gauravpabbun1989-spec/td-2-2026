import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderRoute } from "@/test/render-route";

describe("homepage content", () => {
  it("renders the hero, services, how-it-works, checklist, FAQ, and contact block", async () => {
    renderRoute("/");
    await screen.findByRole("heading", { level: 1 });

    expect(
      screen.getByRole("heading", {
        name: /Need a Flight\? We’re Here to Help\./i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /from trip idea to itinerary, one clear step at a time/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /have these details ready/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /frequently asked questions/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /helpful flight guidance, without the pressure/i }),
    ).toBeInTheDocument();
  });

  it("shows an original travel image with descriptive alt text", async () => {
    renderRoute("/");
    await screen.findByRole("heading", { level: 1 });

    const image = screen.getByRole("img", {
      name: /commercial aircraft flying through a bright blue sky/i,
    });
    expect(image).toHaveAttribute(
      "src",
      expect.stringContaining("/assets/generated/"),
    );
    expect(image.getAttribute("alt")?.length ?? 0).toBeGreaterThan(20);
  });

  it("keeps the full airline-affiliation disclaimer off the homepage", async () => {
    renderRoute("/");
    await screen.findByRole("heading", { level: 1 });

    expect(screen.queryByText(/We are not affiliated with, endorsed by, or sponsored by any airline/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /disclaimer/i })).toHaveAttribute("href", "/disclaimer/");
  });
});
