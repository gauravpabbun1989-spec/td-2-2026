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
/* Responsive first paint mirrors the React header, hero, actions and mobile call bar. */
#root > .ticketdepart-home-fallback {
  box-sizing: border-box;
  width: 100%;
  max-width: none;
  min-height: 100vh;
  margin: 0;
  padding: 0 0 calc(5.5rem + env(safe-area-inset-bottom));
  overflow: hidden;
  background: #fbfaf6;
  color: #172b4d;
  font-family: "DM Sans", Arial, sans-serif;
}
#root > .ticketdepart-home-fallback .td-fallback-header {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  width: 100%;
  min-height: 68px;
  align-items: center;
  justify-content: space-between;
  gap: .5rem;
  margin: 0;
  padding: 0 1rem;
  border-bottom: 1px solid rgba(23,54,95,.1);
  background: rgba(255,255,255,.94);
  box-shadow: 0 4px 24px -18px rgba(8,24,48,.35);
  backdrop-filter: blur(18px);
}
#root > .ticketdepart-home-fallback .td-fallback-brand {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: .75rem;
  color: #172b4d;
  font-family: "Space Grotesk", Arial, sans-serif;
  font-size: 1.18rem;
  font-weight: 800;
  letter-spacing: -.04em;
  text-decoration: none;
}
#root > .ticketdepart-home-fallback .td-fallback-mark {
  display: grid;
  width: 2.5rem;
  height: 2.5rem;
  flex: 0 0 2.5rem;
  place-items: center;
  border-radius: 1rem;
  background: linear-gradient(135deg,#17365f,#102846);
  color: #fff;
  font-size: 1.2rem;
}
#root > .ticketdepart-home-fallback .td-fallback-header-actions {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: .5rem;
}
#root > .ticketdepart-home-fallback .td-fallback-header-call,
#root > .ticketdepart-home-fallback .td-fallback-menu {
  display: inline-flex;
  min-height: 2.5rem;
  align-items: center;
  justify-content: center;
  gap: .4rem;
  border-radius: 999px;
  text-decoration: none;
}
#root > .ticketdepart-home-fallback .td-fallback-header-call {
  padding: .5rem .85rem;
  background: #b94f08;
  color: #fff;
  font-size: .78rem;
  font-weight: 800;
}
#root > .ticketdepart-home-fallback .td-fallback-header-number { display: none; }

#root > .ticketdepart-home-fallback .td-fallback-menu {
  width: 2.5rem;
  border: 1px solid #e3eaf0;
  background: #fff;
  color: #172b4d;
  font-size: 1.3rem;
  line-height: 1;
}
#root > .ticketdepart-home-fallback .td-fallback-hero {
  position: relative;
  display: block;
  width: 100%;
  min-height: 0;
  margin: 0;
  padding: 3rem 1.25rem 2.5rem;
  overflow: hidden;
  isolation: isolate;
  background: #e9f7ff;
}
#root > .ticketdepart-home-fallback .td-fallback-hero::before {
  position: absolute;
  z-index: -1;
  inset: 0;
  background: linear-gradient(90deg,rgba(255,255,255,.98) 0%,rgba(255,255,255,.91) 32%,rgba(255,255,255,.65) 68%,rgba(255,255,255,.3) 100%);
  content: "";
}
#root > .ticketdepart-home-fallback .td-fallback-copy {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 44rem;
  min-width: 0;
  margin: 0 auto;
}
#root > .ticketdepart-home-fallback .td-fallback-hero h1 {
  max-width: 12ch;
  margin: 1.25rem 0 0;
  color: #0b3155;
  font-family: "Space Grotesk", Arial, sans-serif;
  font-size: clamp(2.75rem,10vw,3.25rem);
  font-weight: 750;
  letter-spacing: -.055em;
  line-height: 1.02;
}
#root > .ticketdepart-home-fallback .td-fallback-hero h1 span { color: #087fc1; }
#root > .ticketdepart-home-fallback .td-fallback-description {
  max-width: 36rem;
  margin: 1.25rem 0 0;
  color: #334155;
  font-size: 1rem;
  line-height: 1.75;
}
#root > .ticketdepart-home-fallback .td-fallback-visual {
  position: absolute;
  z-index: -2;
  inset: 0;
  min-width: 0;
  height: auto;
  overflow: hidden;
  border-radius: 0;
  background: #e9f7ff;
  box-shadow: none;
}
#root > .ticketdepart-home-fallback .td-fallback-visual img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 64% center;
}
#root > .ticketdepart-home-fallback .td-fallback-actions {
  display: grid;
  grid-template-columns: minmax(0,1fr);
  gap: .75rem;
  margin-top: 1.75rem;
}
#root > .ticketdepart-home-fallback .td-fallback-primary {
  display: grid;
  min-width: 0;
  min-height: 4rem;
  grid-template-columns: auto minmax(0,1fr);
  grid-template-rows: auto auto;
  align-items: center;
  justify-content: center;
  column-gap: .6rem;
  padding: .8rem 1rem;
  border: 0;
  border-radius: 999px;
  background: #b94f08;
  color: #fff;
  box-shadow: 0 10px 26px -14px rgba(8,24,48,.55);
  text-align: center;
  text-decoration: none;
}
#root > .ticketdepart-home-fallback .td-fallback-phone-icon {
  grid-column: 1;
  grid-row: 1 / span 2;
  font-size: 1rem;
}
#root > .ticketdepart-home-fallback .td-fallback-primary-label {
  grid-column: 2;
  grid-row: 1;
  font-size: 1rem;
  font-weight: 750;
  line-height: 1.2;
}
#root > .ticketdepart-home-fallback .td-fallback-primary-number {
  grid-column: 2;
  grid-row: 2;
  font-size: .88rem;
  font-weight: 700;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}
#root > .ticketdepart-home-fallback .td-fallback-secondary {
  display: inline-flex;
  min-width: 0;
  min-height: 3rem;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  padding: .75rem 1.25rem;
  border: 1px solid #c9dced;
  border-radius: 999px;
  background: rgba(255,255,255,.94);
  color: #17436b;
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
}
#root > .ticketdepart-home-fallback .td-fallback-search {
  border-color: #087fc1;
  background: #087fc1;
  color: #fff;
}
#root > .ticketdepart-home-fallback .td-fallback-points {
  display: flex;
  flex-wrap: wrap;
  gap: .65rem 1.15rem;
  margin-top: 1.5rem;
  color: #334155;
  font-size: .82rem;
  font-weight: 700;
}
#root > .ticketdepart-home-fallback .td-fallback-points span {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
}
#root > .ticketdepart-home-fallback .td-fallback-points b {
  color: #059669;
  font-size: 1rem;
}
#root > .ticketdepart-home-fallback .td-fallback-benefits {
  display: grid;
  width: calc(100% - 2rem);
  max-width: 1200px;
  grid-template-columns: minmax(0,1fr);
  gap: .55rem;
  margin: 0 auto;
  padding-top: .25rem;
}
#root > .ticketdepart-home-fallback .td-fallback-benefits article {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: .85rem;
  padding: .85rem;
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
#root > .ticketdepart-home-fallback .td-fallback-quick-links {
  display: grid;
  width: calc(100% - 2rem);
  max-width: 1200px;
  grid-template-columns: minmax(0,1fr);
  gap: .65rem;
  margin: 1.25rem auto 0;
}
#root > .ticketdepart-home-fallback .td-fallback-quick-links a {
  display: flex;
  min-height: 2.9rem;
  align-items: center;
  justify-content: space-between;
  gap: .5rem;
  padding: .7rem 1rem;
  border: 1px solid #e0eaf2;
  border-radius: .8rem;
  background: rgba(255,255,255,.94);
  color: #172b4d;
  font-size: .88rem;
  font-weight: 700;
  text-decoration: none;
}
#root > .ticketdepart-home-fallback .td-fallback-quick-links a span { color: #087fc1; }
#root > .ticketdepart-home-fallback .td-fallback-disclosure {
  width: calc(100% - 2rem);
  max-width: 1200px;
  margin: 1rem auto 0;
  color: #68758a;
  font-size: .75rem;
  line-height: 1.6;
}
#root > .ticketdepart-home-fallback .td-fallback-start {
  margin-top: 1.5rem;
  padding: 2.5rem 1.25rem;
  border-top: 1px solid #e3eaf0;
  border-bottom: 1px solid #e3eaf0;
  background: #fff;
}
#root > .ticketdepart-home-fallback .td-fallback-start > div {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
#root > .ticketdepart-home-fallback .td-fallback-start-eyebrow {
  margin: 0;
  color: #a75b25;
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: .15em;
  text-transform: uppercase;
}
#root > .ticketdepart-home-fallback .td-fallback-start h2 {
  margin: .5rem 0 0;
  color: #172b4d;
  font-size: 1.5rem;
  font-weight: 700;
}
#root > .ticketdepart-home-fallback .td-fallback-start p:not(.td-fallback-start-eyebrow) {
  margin: .5rem 0 0;
  color: #536078;
  font-size: .9rem;
  line-height: 1.7;
}
#root > .ticketdepart-home-fallback .td-fallback-start-actions {
  display: grid;
  grid-template-columns: minmax(0,1fr);
  gap: .5rem;
  margin-top: 1rem;
}
#root > .ticketdepart-home-fallback .td-fallback-start-actions a {
  display: flex;
  min-height: 2.75rem;
  align-items: center;
  justify-content: center;
  padding: .6rem .8rem;
  border: 1px solid #e3eaf0;
  border-radius: 999px;
  background: #fff;
  color: #17365f;
  font-size: .82rem;
  font-weight: 700;
  text-decoration: none;
}
#root > .ticketdepart-home-fallback .td-fallback-start-actions a:first-child {
  border-color: #b94f08;
  background: #b94f08;
  color: #fff;
}
#root > .ticketdepart-home-fallback .td-fallback-editorial {
  width: min(calc(100% - 2rem), 1200px);
  margin: 2.5rem auto 0;
  padding-bottom: 2rem;
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
#root > .ticketdepart-home-fallback .td-fallback-mobile-callbar {
  position: fixed;
  z-index: 70;
  right: 0;
  bottom: 0;
  left: 0;
  padding: .75rem 1rem calc(.75rem + env(safe-area-inset-bottom));
  border-top: 1px solid rgba(255,255,255,.1);
  background: rgba(7,26,53,.97);
  box-shadow: 0 -12px 40px -20px rgba(0,0,0,.5);
  backdrop-filter: blur(18px);
}
#root > .ticketdepart-home-fallback .td-fallback-mobile-callbar > a {
  display: flex;
  width: 100%;
  min-height: 3rem;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  padding: .65rem .75rem;
  border-radius: 999px;
  background: #b94f08;
  color: #fff;
  font-size: .76rem;
  font-weight: 800;
  line-height: 1.2;
  text-align: center;
  text-decoration: none;
}
#root > .ticketdepart-home-fallback .td-fallback-mobile-callbar strong { font-size: .75rem; font-variant-numeric: tabular-nums; }
#root > .ticketdepart-home-fallback .td-fallback-related { padding-bottom: 1rem; }
@media (min-width: 640px) {
  #root > .ticketdepart-home-fallback .td-fallback-header { min-height: 72px; padding-inline: 2rem; }
  #root > .ticketdepart-home-fallback .td-fallback-header-call { min-height: 2.75rem; padding-inline: 1rem; font-size: .875rem; }
  #root > .ticketdepart-home-fallback .td-fallback-header-number { display: inline; }

  #root > .ticketdepart-home-fallback .td-fallback-menu { display: none; }
  #root > .ticketdepart-home-fallback .td-fallback-hero {
    display: grid;
    min-height: 560px;
    grid-template-columns: minmax(0,1fr) minmax(0,.9fr);
    align-items: center;
    gap: 2.5rem;
    padding: 4rem 2rem;
  }
  #root > .ticketdepart-home-fallback .td-fallback-hero h1 { max-width: 13ch; font-size: clamp(3rem,5vw,4rem); }
  #root > .ticketdepart-home-fallback .td-fallback-description { font-size: 1.08rem; }
  #root > .ticketdepart-home-fallback .td-fallback-actions { grid-template-columns: minmax(0,1fr) minmax(0,1fr); }
  #root > .ticketdepart-home-fallback .td-fallback-primary { grid-column: 1 / -1; }
  #root > .ticketdepart-home-fallback .td-fallback-points { gap: .75rem 1.25rem; font-size: .875rem; }
  #root > .ticketdepart-home-fallback .td-fallback-benefits { grid-template-columns: repeat(3,minmax(0,1fr)); gap: .75rem; }
  #root > .ticketdepart-home-fallback .td-fallback-benefits article { padding: 1.1rem; }
  #root > .ticketdepart-home-fallback .td-fallback-quick-links { grid-template-columns: repeat(2,minmax(0,1fr)); gap: .75rem; margin-top: 1.25rem; }
  #root > .ticketdepart-home-fallback .td-fallback-disclosure { font-size: .8rem; }
  #root > .ticketdepart-home-fallback .td-fallback-start-actions { grid-template-columns: repeat(3,minmax(0,1fr)); }
  #root > .ticketdepart-home-fallback .td-fallback-mobile-callbar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-height: 5rem;
    padding: .75rem 2rem;
  }
  #root > .ticketdepart-home-fallback .td-fallback-mobile-callbar::before {
    margin-right: auto;
    color: rgba(255,255,255,.8);
    content: "Travel specialists available 24/7";
    font-size: .85rem;
    font-weight: 600;
  }
  #root > .ticketdepart-home-fallback .td-fallback-mobile-callbar > a { width: auto; min-width: 17rem; font-size: .875rem; }
}
@media (min-width: 1024px) {
  #root > .ticketdepart-home-fallback .td-fallback-hero { gap: 3rem; padding-inline: 2.5rem; }
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
