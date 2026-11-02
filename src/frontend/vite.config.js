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
      const normalizeModulePath = (value) =>
        value?.split(String.fromCharCode(92)).join("/").split("?")[0] ?? "";
      const chunks = Object.values(bundle).filter((item) => item.type === "chunk");
      const main = chunks.find(
        (item) =>
          item.name === "main" ||
          normalizeModulePath(item.facadeModuleId).endsWith("/src/main.tsx"),
      );

      const outputDir = options.dir
        ? path.resolve(options.dir)
        : fileURLToPath(new URL("./dist", import.meta.url));
      const htmlPath = path.join(outputDir, "index.html");

      if (!main || !fs.existsSync(htmlPath)) {
        const chunkSummary = chunks.map((item) => ({
          fileName: item.fileName,
          name: item.name,
          facadeModuleId: item.facadeModuleId,
        }));
        throw new Error(
          "Could not safely identify the main application chunk or emitted index.html. " +
            JSON.stringify({
              foundMainChunk: Boolean(main),
              foundIndexHtml: fs.existsSync(htmlPath),
              chunks: chunkSummary,
            }),
        );
      }

      const mainPath = path.join(outputDir, main.fileName);
      if (!fs.existsSync(mainPath)) {
        throw new Error("Main application chunk was not written: " + main.fileName);
      }

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

      const verifiedHtml = fs.readFileSync(htmlPath, "utf8");
      if (!verifiedHtml.includes(preloadLink)) {
        throw new Error("Main application preload link was not written to index.html.");
      }

      console.log("TicketDepart main application preload verified: " + main.fileName);
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
