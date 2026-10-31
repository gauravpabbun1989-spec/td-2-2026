import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const frontendRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: frontendRoot,
  build: {
    outDir: path.join(frontendRoot, "dist"),
    emptyOutDir: true,
  },
});
