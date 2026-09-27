import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SITE } from "@/lib/site";
import { renderRoute } from "@/test/render-route";

describe("homepage content", () => {
  it("renders the hero, services, how-it-works, checklist, FAQ, disclosure, and contact block", async () => {
    renderRoute("/");
    await screen.findByRole("heading", { level: 1 });

    expect(
      screen.getByRole("heading", {
        name: /Need a Flight\? We’re Here to Help\./i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /how it works/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /before you call/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /frequently asked questions/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /independent agency disclosure/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /talk to a real travel specialist/i }),
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

  it("states the independent-agency disclosure", async () => {
    renderRoute("/");
    await screen.findByRole("heading", { level: 1 });

    // The disclosure appears in both the homepage section and the footer.
    expect(screen.getAllByText(SITE.disclosure).length).toBeGreaterThan(0);
  });
});
