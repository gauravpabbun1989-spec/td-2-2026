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
    /(<head\b[^>]*>)([\s\S]*?)(<\/head>)/i,
    (_document, openHead, headContent, closeHead) => {
      const stylesheets = headContent.match(
        /<link\b(?=[^>]*\brel=["']stylesheet["'])[^>]*>/gi,
      ) ?? [];
      if (stylesheets.length === 0) return openHead + headContent + closeHead;

      const remaining = headContent.replace(
        /<link\b(?=[^>]*\brel=["']stylesheet["'])[^>]*>/gi,
        "",
      );
      const firstScript = remaining.search(/<script\b/i);
      const insertionPoint = firstScript < 0 ? 0 : firstScript;
      let head = remaining.slice(0, insertionPoint)
        + stylesheets.join("\n    ")
        + "\n    "
        + remaining.slice(insertionPoint);

      const stylesheet = stylesheets[0];
      const href = stylesheet.match(/\bhref=["']([^"']+)["']/i)?.[1];
      const hasPreload = /<link\b(?=[^>]*\brel=["']preload["'])(?=[^>]*\bas=["']style["'])[^>]*>/i.test(head);
      if (href && !hasPreload) {
        const crossorigin = stylesheet.match(/\bcrossorigin(?:=["'][^"']*["'])?/i)?.[0];
        const integrity = stylesheet.match(/\bintegrity=["']([^"']+)["']/i)?.[0];
        const preload = '<link rel="preload" as="style" href="' + href + '"'
          + (crossorigin ? " " + crossorigin : "")
          + (integrity ? " " + integrity : "")
          + " />";
        head = "\n    " + preload + "\n    " + head;
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
  // Some Vite builds leave the generated route documents without a stylesheet
  // tag (for example when CSS extraction is changed by the build pipeline).
  // Recover from the actual emitted CSS assets instead of failing the whole
  // production build or shipping route HTML without an early CSS request.
  function findCssFiles(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return findCssFiles(full);
      return entry.isFile() && entry.name.endsWith(".css") ? [full] : [];
    });
  }
  const cssFiles = findCssFiles(distDir);
  if (cssFiles.length === 0) {
    console.warn("No extracted CSS assets found; leaving generated HTML unchanged.");
  } else {
    for (const file of files) {
      let html = fs.readFileSync(file, "utf8");
      const links = cssFiles.map((cssFile) => {
        const href = "/" + path.relative(distDir, cssFile).split(path.sep).join("/");
        return '<link rel="stylesheet" href="' + href + '" />';
      }).join("\\n    ");
      html = html.replace(/<head\\b[^>]*>/i, (head) => head + "\\n    " + links);
      const cssHref = "/" + path.relative(distDir, cssFiles[0]).split(path.sep).join("/");
      const preload = '<link rel="preload" as="style" href="' + cssHref + '" />';
      html = html.replace(/<head\\b[^>]*>/i, (head) => head + "\\n    " + preload);
      fs.writeFileSync(file, html);
      updated++;
    }
  }
}
console.log("Optimized stylesheet priority in " + updated + " generated HTML documents.");
