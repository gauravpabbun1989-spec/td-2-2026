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

const enhancedFallbackCss = String.raw`
/* Branded, responsive first paint while the interactive React app starts. */
#root > .ticketdepart-home-fallback {
  width: 100%;
  max-width: none;
  min-height: 100vh;
  margin: 0;
  padding: 0 0 3rem;
  overflow: hidden;
  background: #fbfaf6;
  color: #172b4d;
  font-family: "DM Sans", Arial, sans-serif;
}
#root > .ticketdepart-home-fallback .td-fallback-header {
  position: relative;
  z-index: 2;
  display: flex;
  width: min(100%, 1280px);
  min-height: 72px;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin: 0 auto;
  padding: 0 clamp(1rem, 4vw, 2.5rem);
  border-bottom: 1px solid rgba(23, 54, 95, .1);
  background: rgba(255,255,255,.96);
}
#root > .ticketdepart-home-fallback .td-fallback-brand {
  display: inline-flex;
  align-items: center;
  gap: .7rem;
  color: #172b4d;
  font-family: "Space Grotesk", Arial, sans-serif;
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: -.04em;
  text-decoration: none;
}
#root > .ticketdepart-home-fallback .td-fallback-mark {
  display: grid;
  width: 2.5rem;
  height: 2.5rem;
  place-items: center;
  border-radius: .8rem;
  background: #17365f;
  color: #fff;
  font-size: 1.35rem;
}
#root > .ticketdepart-home-fallback .td-fallback-header-call,
#root > .ticketdepart-home-fallback .td-fallback-primary {
  display: inline-flex;
  min-height: 2.8rem;
  align-items: center;
  justify-content: center;
  padding: .7rem 1.1rem;
  border: 0;
  border-radius: 999px;
  background: #b94f08;
  color: #fff;
  font-size: .9rem;
  font-weight: 750;
  line-height: 1.2;
  text-align: center;
  text-decoration: none;
}
#root > .ticketdepart-home-fallback .td-fallback-hero {
  position: relative;
  display: grid;
  width: min(100%, 1280px);
  min-height: 480px;
  grid-template-columns: minmax(0, 1.08fr) minmax(260px, .92fr);
  align-items: center;
  gap: clamp(1.5rem, 4vw, 3.5rem);
  margin: 0 auto;
  padding: clamp(2.5rem, 6vw, 5rem) clamp(1rem, 4vw, 2.5rem);
  isolation: isolate;
}
#root > .ticketdepart-home-fallback .td-fallback-copy { position: relative; z-index: 1; min-width: 0; }
#root > .ticketdepart-home-fallback .td-fallback-eyebrow {
  margin: 0 0 .8rem;
  color: #a75b25;
  font-size: .75rem;
  font-weight: 800;
  letter-spacing: .16em;
  line-height: 1.4;
  text-transform: uppercase;
}
#root > .ticketdepart-home-fallback .td-fallback-hero h1 {
  max-width: 13ch;
  margin: 0;
  color: #0b3155;
  font-family: "Space Grotesk", Arial, sans-serif;
  font-size: clamp(2.4rem, 5vw, 4.2rem);
  font-weight: 750;
  letter-spacing: -.055em;
  line-height: 1.03;
}
#root > .ticketdepart-home-fallback .td-fallback-hero h1 span { color: #087fc1; }
#root > .ticketdepart-home-fallback .td-fallback-description {
  max-width: 58ch;
  margin: 1.25rem 0 0;
  color: #536078;
  font-size: clamp(.98rem, 1.5vw, 1.08rem);
  line-height: 1.7;
}
#root > .ticketdepart-home-fallback .td-fallback-actions {
  display: flex;
  flex-wrap: wrap;
  gap: .75rem;
  margin-top: 1.5rem;
}
#root > .ticketdepart-home-fallback .td-fallback-primary { min-height: 3.5rem; padding: .9rem 1.4rem; box-shadow: 0 10px 24px -12px rgba(0,0,0,.35); }
#root > .ticketdepart-home-fallback .td-fallback-secondary {
  display: inline-flex;
  min-height: 3.5rem;
  align-items: center;
  justify-content: center;
  padding: .9rem 1.4rem;
  border: 1px solid #c9dced;
  border-radius: 999px;
  background: #fff;
  color: #17436b;
  font-weight: 700;
  text-decoration: none;
}
#root > .ticketdepart-home-fallback .td-fallback-disclosure {
  margin: 1.25rem 0 0;
  color: #68758a;
  font-size: .76rem;
  line-height: 1.5;
}
#root > .ticketdepart-home-fallback .td-fallback-visual {
  position: relative;
  min-width: 0;
  height: 340px;
  overflow: hidden;
  border-radius: 2rem;
  background: linear-gradient(135deg,#eaf8ff,#cfefff);
  box-shadow: 0 24px 60px -30px rgba(20,74,120,.45);
}
#root > .ticketdepart-home-fallback .td-fallback-visual img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 58% center;
}
#root > .ticketdepart-home-fallback .td-fallback-benefits {
  display: grid;
  width: min(calc(100% - 2rem), 1200px);
  grid-template-columns: repeat(3,minmax(0,1fr));
  gap: .75rem;
  margin: 0 auto;
}
#root > .ticketdepart-home-fallback .td-fallback-benefits article {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: .85rem;
  padding: 1.1rem;
  border: 1px solid #e0eaf2;
  border-radius: 1rem;
  background: #fff;
}
#root > .ticketdepart-home-fallback .td-fallback-benefits article > span {
  display: grid;
  width: 2.5rem;
  height: 2.5rem;
  flex: 0 0 2.5rem;
  place-items: center;
  border-radius: .8rem;
  background: #eef8ff;
  color: #087fc1;
  font-size: 1.15rem;
}
#root > .ticketdepart-home-fallback .td-fallback-benefits strong,
#root > .ticketdepart-home-fallback .td-fallback-benefits small { display: block; }
#root > .ticketdepart-home-fallback .td-fallback-benefits strong { color: #172b4d; font-size: .88rem; line-height: 1.35; }
#root > .ticketdepart-home-fallback .td-fallback-benefits small { margin-top: .25rem; color: #68758a; font-size: .75rem; line-height: 1.4; }
#root > .ticketdepart-home-fallback .td-fallback-editorial {
  width: min(calc(100% - 2rem), 1200px);
  margin: 2.5rem auto 0;
}
#root > .ticketdepart-home-fallback .td-fallback-editorial section {
  max-width: none;
  margin-top: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #e3eaf0;
  border-radius: 1.25rem;
  background: #fff;
}
#root > .ticketdepart-home-fallback .td-fallback-editorial h2 {
  color: #172b4d;
  font-family: "Space Grotesk", Arial, sans-serif;
  font-size: clamp(1.25rem,2.2vw,1.7rem);
  font-weight: 700;
  letter-spacing: -.03em;
  line-height: 1.2;
}
#root > .ticketdepart-home-fallback .td-fallback-editorial p { color: #536078; font-size: .95rem; line-height: 1.7; }
#root > .ticketdepart-home-fallback .td-fallback-editorial ul { display: grid; grid-template-columns: repeat(auto-fit,minmax(min(100%,17rem),1fr)); gap: .5rem 1.5rem; }
#root > .ticketdepart-home-fallback .td-fallback-editorial li { border-bottom: 1px solid #e8ebef; }
@media (max-width: 760px) {
  #root > .ticketdepart-home-fallback .td-fallback-header { min-height: 64px; padding-inline: 1rem; }
  #root > .ticketdepart-home-fallback .td-fallback-header-call { min-height: 2.5rem; padding: .6rem .85rem; font-size: .78rem; }
  #root > .ticketdepart-home-fallback .td-fallback-hero {
    min-height: 0;
    grid-template-columns: minmax(0,1fr);
    gap: 1.25rem;
    padding: 2rem 1.15rem 1.5rem;
    background: linear-gradient(180deg,rgba(255,255,255,.95),rgba(239,249,255,.94));
  }
  #root > .ticketdepart-home-fallback .td-fallback-hero h1 { max-width: 12ch; font-size: clamp(2.35rem,10vw,3.15rem); }
  #root > .ticketdepart-home-fallback .td-fallback-description { margin-top: 1rem; font-size: .95rem; line-height: 1.6; }
  #root > .ticketdepart-home-fallback .td-fallback-actions { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: .55rem; margin-top: 1.15rem; }
  #root > .ticketdepart-home-fallback .td-fallback-primary,
  #root > .ticketdepart-home-fallback .td-fallback-secondary { min-width: 0; min-height: 3.1rem; padding: .7rem .6rem; font-size: .82rem; }
  #root > .ticketdepart-home-fallback .td-fallback-disclosure { margin-top: .9rem; font-size: .7rem; }
  #root > .ticketdepart-home-fallback .td-fallback-visual { height: 170px; border-radius: 1.1rem; }
  #root > .ticketdepart-home-fallback .td-fallback-benefits { grid-template-columns: minmax(0,1fr); gap: .55rem; margin-top: .25rem; }
  #root > .ticketdepart-home-fallback .td-fallback-benefits article { padding: .8rem; }
  #root > .ticketdepart-home-fallback .td-fallback-editorial { margin-top: 1.5rem; }
  #root > .ticketdepart-home-fallback .td-fallback-editorial section { padding: 1rem; }
}
`;

const inlineCss = cssFiles
  .map((file) => fs.readFileSync(file, "utf8"))
  .join("\n")
  .concat("\n", staticFallbackCss, "\n", enhancedFallbackCss)
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
