import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DEFAULT_SHARE_IMAGE } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { renderRoute } from "@/test/render-route";

const ROUTES = [
  "/",
  "/flight-booking",
  "/delta-airlines",
  "/united-airlines",
  "/american-airlines",
  "/contact",
  "/privacy",
  "/terms",
] as const;

/**
 * Routes that pass their own page image to `<Seo>`, mapped to the generated
 * asset that image must point at. Every other route falls back to the default
 * share image.
 */
const ROUTE_IMAGES: Partial<Record<(typeof ROUTES)[number], string>> = {
  "/": "/assets/generated/hero-flight.dim_1600x1100.jpg",
  "/delta-airlines":
    "/assets/generated/delta-terminal-concourse.dim_1200x800.jpg",
  "/united-airlines":
    "/assets/generated/united-terminal-concourse.dim_1536x864.jpg",
  "/american-airlines":
    "/assets/generated/american-terminal-concourse.dim_1600x900.jpg",
};

function canonicalHref(): string | null {
  return (
    document.head
      .querySelector<HTMLLinkElement>('link[rel="canonical"]')
      ?.getAttribute("href") ?? null
  );
}

function metaContent(selector: string): string | null {
  return (
    document.head
      .querySelector<HTMLMetaElement>(selector)
      ?.getAttribute("content") ?? null
  );
}

function jsonLdNodes(): Record<string, unknown>[] {
  // `Seo` serializes the whole `structuredData` array into one script tag, so
  // flatten each parsed payload before inspecting individual graph nodes.
  return Array.from(
    document.head.querySelectorAll('script[type="application/ld+json"]'),
  ).flatMap((script) => {
    const parsed = JSON.parse(script.textContent ?? "[]") as unknown;
    return Array.isArray(parsed)
      ? (parsed as Record<string, unknown>[])
      : [parsed as Record<string, unknown>];
  });
}

describe("per-route metadata", () => {
  it.each(ROUTES)(
    "sets a unique title, description, and canonical on %s",
    async (path) => {
      renderRoute(path);
      await screen.findAllByRole("heading", { level: 1 });

      const title = document.title;
      expect(title.length).toBeGreaterThan(0);
      expect(metaContent('meta[name="description"]')).toBeTruthy();
      expect(canonicalHref()).toContain(path === "/" ? "/" : path);
    },
  );

  it("keeps descriptions concise and does not append a duplicate phone CTA", async () => {
    renderRoute("/flight-booking");
    await screen.findAllByRole("heading", { level: 1 });
    const description = metaContent('meta[name="description"]') ?? "";
    expect(description.length).toBeLessThanOrEqual(155);
    expect(description.split(SITE.phoneDisplay).length - 1).toBeLessThanOrEqual(1);
  });

  it("gives each route a distinct title", async () => {
    const titles = new Set<string>();
    for (const path of ROUTES) {
      renderRoute(path);
      await screen.findAllByRole("heading", { level: 1 });
      titles.add(document.title);
    }
    expect(titles.size).toBe(ROUTES.length);
  });

  it.each(ROUTES)(
    "sets complete Open Graph and Twitter tags on %s",
    async (path) => {
      renderRoute(path);
      await screen.findAllByRole("heading", { level: 1 });

      expect(metaContent('meta[property="og:title"]')).toBeTruthy();
      expect(metaContent('meta[property="og:description"]')).toBeTruthy();
      expect(metaContent('meta[property="og:type"]')).toBe("website");
      expect(metaContent('meta[property="og:site_name"]')).toBe("TicketDepart");
      expect(metaContent('meta[property="og:locale"]')).toBe("en_US");
      expect(metaContent('meta[property="og:url"]')).toContain(
        path === "/" ? "/" : path,
      );
      expect(metaContent('meta[name="twitter:card"]')).toBe(
        "summary_large_image",
      );
      expect(metaContent('meta[name="twitter:site"]')).toBe("@ticketdepart");
      expect(metaContent('meta[name="twitter:title"]')).toBeTruthy();
      expect(metaContent('meta[name="twitter:description"]')).toBeTruthy();
    },
  );

  it.each(ROUTES)(
    "sets an absolute og:image and twitter:image on %s",
    async (path) => {
      renderRoute(path);
      await screen.findAllByRole("heading", { level: 1 });

      const ogImage = metaContent('meta[property="og:image"]');
      const twitterImage = metaContent('meta[name="twitter:image"]');
      // Absolute, not a bare path: social crawlers resolve relative URLs
      // against their own origin. jsdom's origin is http, so assert the
      // absolute form rather than a hard-coded https scheme.
      expect(ogImage).toMatch(/^https?:\/\/.+\/.+/);
      expect(twitterImage).toBe(ogImage);
      expect(metaContent('meta[property="og:image:alt"]')).toBeTruthy();
    },
  );

  it.each(Object.entries(ROUTE_IMAGES) as [(typeof ROUTES)[number], string][])(
    "uses the page's own image for og:image on %s",
    async (path, asset) => {
      renderRoute(path);
      await screen.findAllByRole("heading", { level: 1 });

      const ogImage = metaContent('meta[property="og:image"]');
      expect(ogImage).toContain(asset);
      // The page image replaces the generic default rather than sitting beside
      // it. The homepage's own hero is the same asset the default points at, so
      // the inequality only holds for routes whose page image differs from it.
      if (!DEFAULT_SHARE_IMAGE.endsWith(asset)) {
        expect(ogImage).not.toBe(DEFAULT_SHARE_IMAGE);
      }
      expect(metaContent('meta[name="twitter:image"]')).toBe(ogImage);
    },
  );

  it.each(ROUTES.filter((path) => !(path in ROUTE_IMAGES)))(
    "falls back to the default share image on %s",
    async (path) => {
      renderRoute(path);
      await screen.findAllByRole("heading", { level: 1 });

      expect(metaContent('meta[property="og:image"]')).toBe(
        DEFAULT_SHARE_IMAGE,
      );
      expect(metaContent('meta[name="twitter:image"]')).toBe(
        DEFAULT_SHARE_IMAGE,
      );
    },
  );

  it.each(ROUTES)(
    "sets a robots directive and hreflang alternates on %s",
    async (path) => {
      renderRoute(path);
      await screen.findAllByRole("heading", { level: 1 });

      expect(metaContent('meta[name="robots"]')).toMatch(/index/i);
      const alternates = Array.from(
        document.head.querySelectorAll<HTMLLinkElement>(
          'link[rel="alternate"][hreflang]',
        ),
      ).map((link) => link.getAttribute("hreflang"));
      expect(alternates).toContain("en-US");
      expect(alternates).toContain("x-default");
    },
  );
});

describe("structured data", () => {
  it("emits TravelAgency and WebSite schema on the homepage", async () => {
    renderRoute("/");
    await screen.findAllByRole("heading", { level: 1 });

    const types = jsonLdNodes().map((node) => node["@type"]);
    expect(types).toContain("TravelAgency");
    expect(types).toContain("WebSite");
  });

  it("emits BreadcrumbList on deeper pages", async () => {
    renderRoute("/flight-booking");
    await screen.findAllByRole("heading", { level: 1 });

    const types = jsonLdNodes().map((node) => node["@type"]);
    expect(types).toContain("BreadcrumbList");
  });

  it("omits retired FAQPage schema even when an FAQ is visible", async () => {
    renderRoute("/delta-airlines");
    await screen.findAllByRole("heading", { level: 1 });
    expect(jsonLdNodes().map((node) => node["@type"])).not.toContain("FAQPage");
  });

  it("emits BreadcrumbList on the homepage and contact page", async () => {
    for (const path of ["/", "/contact"] as const) {
      const { unmount } = renderRoute(path);
      await screen.findAllByRole("heading", { level: 1 });
      expect(jsonLdNodes().map((node) => node["@type"])).toContain(
        "BreadcrumbList",
      );
      unmount();
    }
  });

  it("emits a ContactPoint with the phone number on the contact page", async () => {
    renderRoute("/contact");
    await screen.findAllByRole("heading", { level: 1 });

    const contactPoint = jsonLdNodes().find(
      (node) => node["@type"] === "ContactPoint",
    );
    expect(contactPoint).toBeDefined();
    expect(contactPoint?.telephone).toBe(SITE.phoneDisplay);
    expect(contactPoint?.areaServed).toContain("United States");
  });

  it("declares areaServed on the homepage organization node", async () => {
    renderRoute("/");
    await screen.findAllByRole("heading", { level: 1 });

    const organization = jsonLdNodes().find(
      (node) => node["@type"] === "TravelAgency",
    );
    expect(organization).toBeDefined();
    expect(organization?.areaServed).toContain("United States");
  });
});


describe("indexability controls", () => {
  it("marks the private admin route noindex", async () => {
    renderRoute("/admin/leads");
    await screen.findByRole("heading", { level: 1 });
    expect(metaContent('meta[name="robots"]')).toBe("noindex, nofollow");
  });
});
