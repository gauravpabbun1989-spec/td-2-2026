import { execFileSync } from "node:child_process";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    emptyOutDir: true,
  },
  plugins: [
    {
      name: "ticketdepart-generate-static-route-html",
      closeBundle() {
        execFileSync("node", ["scripts/generate-route-html.mjs"], {
          stdio: "inherit",
          cwd: process.cwd(),
        });
      },
    },
  ],
});
