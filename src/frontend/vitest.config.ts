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
