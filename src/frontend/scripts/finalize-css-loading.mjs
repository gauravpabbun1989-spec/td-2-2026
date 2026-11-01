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

function optimizeHead(html, file) {
  let changed = false;
  const output = html.replace(
    /(<head\\b[^>]*>)([\\s\\S]*?)(<\\/head>)/i,
    (_document, openHead, headContent, closeHead) => {
      const stylesheets = headContent.match(
        /<link\\b(?=[^>]*\\brel=["']stylesheet["'])[^>]*>/gi,
      ) ?? [];
      if (stylesheets.length === 0) return openHead + headContent + closeHead;

      const remaining = headContent.replace(
        /<link\\b(?=[^>]*\\brel=["']stylesheet["'])[^>]*>/gi,
        "",
      );
      const firstScript = remaining.search(/<script\\b/i);
      const insertionPoint = firstScript < 0 ? 0 : firstScript;
      const earlyStylesheets = stylesheets.join("\\n    ");
      let head = remaining.slice(0, insertionPoint)
        + earlyStylesheets
        + "\\n    "
        + remaining.slice(insertionPoint);

      const stylesheet = stylesheets[0];
      const href = stylesheet.match(/\\bhref=["']([^"']+)["']/i)?.[1];
      const hasPreload = /<link\\b(?=[^>]*\\brel=["']preload["'])(?=[^>]*\\bas=["']style["'])[^>]*>/i.test(head);
      if (href && !hasPreload) {
        const crossorigin = stylesheet.match(/\\bcrossorigin(?:=["'][^"']*["'])?/i)?.[0];
        const integrity = stylesheet.match(/\\bintegrity=["']([^"']+)["']/i)?.[0];
        const preload = '<link rel="preload" as="style" href="' + href + '"'
          + (crossorigin ? " " + crossorigin : "")
          + (integrity ? " " + integrity : "")
          + " />";
        head = "\\n    " + preload + "\\n    " + head;
      }
      changed = true;
      return openHead + head + closeHead;
    },
  );

  if (changed) fs.writeFileSync(file, output);
  return changed;
}

const files = walk(distDir);
let updated = 0;
for (const file of files) {
  if (optimizeHead(fs.readFileSync(file, "utf8"), file)) updated++;
}
if (updated === 0) {
  throw new Error("No generated HTML documents contained a stylesheet link to optimize.");
}
console.log(`Optimized stylesheet priority in ${updated} generated HTML documents.`);
