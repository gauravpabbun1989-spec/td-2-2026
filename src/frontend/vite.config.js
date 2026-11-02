import { fileURLToPath, URL } from "url";
import fs from "node:fs";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import environment from "vite-plugin-environment";

const ii_url =
  process.env.DFX_NETWORK === "local"
    ? `http://uqzsh-gqaaa-aaaaq-qaada-cai.localhost:8081/authorize`
    : `https://id.ai/authorize`;

process.env.II_URL = process.env.II_URL || ii_url;

function preloadMainEntry() {
  return {
    name: "ticketdepart-preload-main-entry",
    apply: "build",
    enforce: "post",
    writeBundle(options, bundle) {
      const main = Object.values(bundle).find(
        (item) =>
          item.type === "chunk" &&
          item.facadeModuleId
            ?.split(String.fromCharCode(92))
            .join("/")
            .endsWith("/src/main.tsx"),
      );
      const htmlAsset = bundle["index.html"];

      if (!main || !htmlAsset || htmlAsset.type !== "asset") {
        throw new Error(
          "Could not safely identify the emitted main application chunk and index.html.",
        );
      }

      const outputDir = options.dir
        ? path.resolve(options.dir)
        : fileURLToPath(new URL("./dist", import.meta.url));
      const htmlPath = path.join(outputDir, htmlAsset.fileName);
      const html = fs.readFileSync(htmlPath, "utf8");
      const preloadLink =
        '<link rel="modulepreload" crossorigin href="/' +
        main.fileName +
        '">';

      if (!html.includes(preloadLink)) {
        const headStart = html.toLowerCase().indexOf("<head");
        const headEnd = html.indexOf(">", headStart);

        if (headStart < 0 || headEnd < 0) {
          throw new Error("Cannot add the main-entry preload: index.html has no valid <head>.");
        }

        const updatedHtml =
          html.slice(0, headEnd + 1) +
          "\n" +
          preloadLink +
          "\n" +
          html.slice(headEnd + 1);
        fs.writeFileSync(htmlPath, updatedHtml);
      }
    },
  };
}

export default defineConfig({
  logLevel: "error",
  build: {
    emptyOutDir: true,
    sourcemap: false,
    // Minify production bundles to reduce transfer, parse, and execution costs on mobile.
    minify: "esbuild",
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    preloadMainEntry(),
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
    environment(["II_URL"]),
    react(),
  ],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(new URL("../declarations", import.meta.url)),
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
    dedupe: ["@icp-sdk/core"],
  },
});
