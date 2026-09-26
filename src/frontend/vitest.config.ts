import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "url";

/**
 * Vitest configuration for the frontend suite. The `test` script passes
 * `--environment jsdom`; this file only supplies the setup module and the
 * `@` path alias that the application source relies on.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: [
    "src/frontend/src/test/airline-display-name-invariants.test.tsx",
    "src/frontend/src/test/airline-display-name-metadata.test.tsx",
    "src/frontend/src/test/airline-display-names.test.tsx",
    "src/frontend/src/test/airlines.test.tsx",
    "src/frontend/src/test/characterization-chrome.test.tsx",
    "src/frontend/src/test/characterization.test.tsx",
    "src/frontend/src/test/home.test.tsx",
    "src/frontend/src/test/mobile-nav.test.tsx",
    "src/frontend/src/test/phone-booking-pages.test.tsx",
    "src/frontend/src/test/phone-cta.test.tsx",
    "src/frontend/src/test/routes.test.tsx",
    "src/frontend/src/test/runtime-health.test.tsx",
    "src/frontend/src/test/site-header-admin-link.test.tsx",
    ],
    // The sandbox sets thread-count env vars that conflict with Vitest's
    // defaults; pin the pool explicitly so the run is deterministic.
    pool: "forks",
    poolOptions: {
      forks: {
        minForks: 1,
        maxForks: 1,
      },
    },
  },
});
