import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name === "index.html" ? [full] : [];
  });
}

function findCssFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return findCssFiles(full);
    return entry.isFile() && entry.name.endsWith(".css") ? [full] : [];
  });
}

const htmlFiles = walk(distDir);
const cssFiles = findCssFiles(distDir);

if (cssFiles.length === 0) {
  throw new Error("Cannot inline critical styles: no emitted CSS assets found in dist.");
}

// Caffeine may rebuild/rewrite the document and append its external asset links
// after scripts. An inline copy in <head> is applied by the HTML parser before
// any scripts run, so the first paint does not depend on the host's link order.
const inlineCss = cssFiles
  .map((file) => fs.readFileSync(file, "utf8"))
  .join("\n")
  .replace(/<\/style/gi, "<\\/style");
const inlineStyleTag = '<style id="ticketdepart-inline-css">' + inlineCss + "</style>";

let updated = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  if (/id=["']ticketdepart-inline-css["']/i.test(html)) continue;

  if (!/<head\b[^>]*>/i.test(html)) {
    throw new Error("Cannot inline critical styles: missing <head> in " + file);
  }

  const output = html.replace(/<head\b[^>]*>/i, (head) => head + "\n" + inlineStyleTag + "\n");
  fs.writeFileSync(file, output);
  updated++;
}

console.log(
  "Inlined " + inlineCss.length + " CSS characters into " + updated
  + " generated HTML documents before scripts and first paint.",
);
