import fs from "node:fs";
import path from "node:path";

const frontendRoot = path.resolve(".");
const publicDir = path.join(frontendRoot, "public");
const distDir = path.join(frontendRoot, "dist");

const requiredAssets = ["sitemap.xml", "robots.txt"];

for (const name of requiredAssets) {
  const source = path.join(publicDir, name);
  const destination = path.join(distDir, name);

  if (!fs.existsSync(source)) {
    throw new Error(`Missing required SEO asset: public/${name}`);
  }

  fs.copyFileSync(source, destination);
}

const sitemapPath = path.join(distDir, "sitemap.xml");
const sitemap = fs.readFileSync(sitemapPath, "utf8").trim();

if (!sitemap.startsWith('<?xml') || !sitemap.includes("<urlset") || !sitemap.includes("</urlset>")) {
  throw new Error("Generated dist/sitemap.xml is not a valid XML sitemap.");
}

console.log("Verified static SEO assets: dist/sitemap.xml and dist/robots.txt");
