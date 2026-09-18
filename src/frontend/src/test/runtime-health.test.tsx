import { screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { renderRoute } from "@/test/render-route";

/**
 * Runtime-health cover for the acceptance criterion "No broken links or
 * console/runtime errors on any route". The other suites assert what each page
 * renders; this one asserts that rendering it is clean — no React key/act
 * warnings, no unhandled errors, and no internal link pointing at a route the
 * app does not serve.
 *
 * The InternetIdentity provider logs a known, benign configuration notice
 * (`CANISTER_ID_BACKEND is not set`) in the test environment; it is filtered
 * out so a real error is not hidden behind it.
 */

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

/** Paths the production router in `App.tsx` actually serves. */
const KNOWN_PATHS = new Set<string>(ROUTES);

const IGNORED_MESSAGES = [/CANISTER_ID_BACKEND is not set/];

function isIgnored(message: string): boolean {
  return IGNORED_MESSAGES.some((pattern) => pattern.test(message));
}

function formatArgs(args: unknown[]): string {
  return args
    .map((arg) => (arg instanceof Error ? arg.message : String(arg)))
    .join(" ");
}

describe("runtime health on every route", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it.each(ROUTES)(
    "renders %s without console errors or warnings",
    async (path) => {
      renderRoute(path);
      await screen.findAllByRole("heading", { level: 1 });

      const unexpected = [
        ...errorSpy.mock.calls.map((args) => formatArgs(args)),
        ...warnSpy.mock.calls.map((args) => formatArgs(args)),
      ].filter((message) => !isIgnored(message));

      expect(unexpected).toEqual([]);
    },
  );

  it.each(ROUTES)(
    "points every internal link on %s at a route the app serves",
    async (path) => {
      renderRoute(path);
      await screen.findAllByRole("heading", { level: 1 });

      const internalHrefs = screen
        .getAllByRole("link")
        .map((link) => link.getAttribute("href") ?? "")
        .filter((href) => href.startsWith("/"));

      // Every route links somewhere; an empty list would make the assertion
      // below vacuously true.
      expect(internalHrefs.length).toBeGreaterThan(0);

      for (const href of internalHrefs) {
        const pathname = href.split(/[?#]/)[0];
        expect(KNOWN_PATHS.has(pathname)).toBe(true);
      }
    },
  );

  it("does not leave an unhandled error behind after visiting every route", async () => {
    for (const path of ROUTES) {
      const { unmount } = renderRoute(path);
      await screen.findAllByRole("heading", { level: 1 });
      unmount();
    }

    const unexpected = errorSpy.mock.calls
      .map((args) => formatArgs(args))
      .filter((message) => !isIgnored(message));
    expect(unexpected).toEqual([]);
  });
});
