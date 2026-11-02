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
const staticFallbackCss = String.raw`
/* First-paint presentation for the static SEO fallback before React mounts. */
#root > .ticketdepart-static-fallback {
  box-sizing: border-box;
  width: min(100%, 1200px);
  min-height: 100vh;
  margin: 0 auto;
  padding: clamp(2.75rem, 7vw, 5.5rem) clamp(1.25rem, 4vw, 2.5rem) 4rem;
  color: #18233d;
  background: #fbfaf6;
  font-family: "DM Sans", Arial, sans-serif;
  font-size: 16px;
  line-height: 1.7;
}
#root > .ticketdepart-static-fallback > nav {
  margin: 0 0 1.75rem;
  color: #68758a;
  font-size: 0.82rem;
}
#root > .ticketdepart-static-fallback > nav a {
  color: inherit;
  font-weight: 600;
  text-decoration: none;
}
#root > .ticketdepart-static-fallback > p:first-of-type {
  margin: 0 0 0.75rem;
  color: #a75b25;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
#root > .ticketdepart-static-fallback h1 {
  max-width: 18ch;
  margin: 0 0 1.1rem;
  color: #172b4d;
  font-family: "Space Grotesk", Arial, sans-serif;
  font-size: clamp(2.15rem, 5.7vw, 4.15rem);
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 1.06;
}
#root > .ticketdepart-static-fallback p {
  max-width: 74ch;
  margin: 0.85rem 0;
  color: #536078;
  font-size: clamp(0.98rem, 1.5vw, 1.08rem);
}
#root > .ticketdepart-static-fallback a {
  color: #17365f;
  font-weight: 650;
  text-underline-offset: 3px;
}
#root > .ticketdepart-static-fallback > p a[href^="tel:"] {
  display: inline-flex;
  min-height: 2.9rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  margin-top: 0.4rem;
  padding: 0.75rem 1.25rem;
  border-radius: 999px;
  background: #17365f;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
}
#root > .ticketdepart-static-fallback section {
  max-width: 74rem;
  margin-top: 2.25rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e3e7ed;
}
#root > .ticketdepart-static-fallback section h2 {
  margin: 0 0 0.85rem;
  color: #172b4d;
  font-family: "Space Grotesk", Arial, sans-serif;
  font-size: clamp(1.25rem, 2.2vw, 1.7rem);
  font-weight: 650;
  letter-spacing: -0.025em;
  line-height: 1.2;
}
#root > .ticketdepart-static-fallback section p {
  margin: 0.55rem 0;
  font-size: 0.96rem;
}
#root > .ticketdepart-static-fallback ul {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr));
  gap: 0.6rem 1.5rem;
  margin: 0.75rem 0 0;
  padding: 0;
  list-style: none;
}
#root > .ticketdepart-static-fallback li {
  padding: 0.65rem 0;
  border-bottom: 1px solid #e8ebef;
}
#root > .ticketdepart-static-fallback li a {
  text-decoration: none;
}
#root > .ticketdepart-static-fallback strong {
  color: #172b4d;
}
@media (max-width: 640px) {
  #root > .ticketdepart-static-fallback {
    padding: 2rem 1.15rem 3rem;
  }
  #root > .ticketdepart-static-fallback h1 {
    font-size: clamp(2rem, 10vw, 3rem);
  }
  #root > .ticketdepart-static-fallback section {
    margin-top: 1.5rem;
  }
}
`;

const inlineCss = cssFiles
  .map((file) => fs.readFileSync(file, "utf8"))
  .join("\n")
  .concat("\n", staticFallbackCss)
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
