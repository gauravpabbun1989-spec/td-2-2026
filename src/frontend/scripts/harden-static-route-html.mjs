import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");

function trimTitle(title) {
  const raw = title.replace(/\s+/g, " ").trim();
  const withoutBrand = raw.replace(/\s*\|\s*TicketDepart\s*$/i, "").trim();
  const brand = " | TicketDepart";
  if ((withoutBrand + brand).length <= 60) return withoutBrand + brand;
  if (withoutBrand.length <= 60) return withoutBrand;
  const words = withoutBrand.split(" ");
  let out = "";
  for (const word of words) {
    const next = out ? out + " " + word : word;
    if (next.length > 55) break;
    out = next;
  }
  return (out || withoutBrand.slice(0, 55)).replace(/[|,:;-]+$/, "").trim();
}

function trimDescription(description) {
  const raw = description.replace(/\s+/g, " ").trim();
  if (raw.length <= 160) return raw;
  const cut = raw.slice(0, 157);
  const boundary = cut.lastIndexOf(" ");
  return (boundary > 100 ? cut.slice(0, boundary) : cut).replace(/[,:;\-]+$/, "") + ".";
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.name === "index.html") files.push(full);
  }
  return files;
}

let processed = 0;
for (const file of walk(distDir)) {
  let html = fs.readFileSync(file, "utf8");

  // Keep generated SEO fallback content hidden until React has rendered.
  // main.tsx reveals #root after its first render; stripping this style here
  // caused static page content to flash before the application loaded.

  html = html.replace(/<title>([\s\S]*?)<\/title>/i, (_, value) =>
    `<title>${trimTitle(value.replace(/<[^>]+>/g, ""))}</title>`
  );

  html = html.replace(/(<meta\s+name="description"\s+content=")([^"]*)(")/i, (_, a, value, c) =>
    `${a}${trimDescription(value)}${c}`
  );
  
  // Keep social previews aligned with the final, trimmed page metadata. The
  // previous hardener changed only the standard description, leaving stale or
  // overlong Open Graph/Twitter values in the same static document.
  const finalTitle = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "";
  const finalDescription = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1]?.trim() ?? "";
  const escapeAttribute = (value) => value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  const replaceMetaContent = (source, selector, attributes, value) => {
    const existing = source.match(selector)?.[0];
    if (existing) {
      return source.replace(selector, (tag) =>
        tag.replace(/content="[^"]*"/i, `content="${escapeAttribute(value)}"`),
      );
    }
    return source.replace(
      "</head>",
      `<meta ${attributes} content="${escapeAttribute(value)}" />\n</head>`,
    );
  };
  if (finalTitle) {
    html = replaceMetaContent(html, /<meta\s+property="og:title"[^>]*>/i, 'property="og:title"', finalTitle);
    html = replaceMetaContent(html, /<meta\s+name="twitter:title"[^>]*>/i, 'name="twitter:title"', finalTitle);
  }
  if (finalDescription) {
    html = replaceMetaContent(html, /<meta\s+property="og:description"[^>]*>/i, 'property="og:description"', finalDescription);
    html = replaceMetaContent(html, /<meta\s+name="twitter:description"[^>]*>/i, 'name="twitter:description"', finalDescription);
  }

  const rel = path.relative(distDir, path.dirname(file)).replaceAll(path.sep, "/");
  const route = rel ? `https://ticketdepart.com/${rel}/` : "https://ticketdepart.com/";
  const canonicalTag = `<link rel="canonical" href="${route}" />`;
  if (/<link\s+rel=["']canonical["']/i.test(html)) {
    html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, canonicalTag);
  } else {
    html = html.replace("</head>", canonicalTag + "\n</head>");
  }
  html = html.replace(
    /(<meta\s+property=["']og:url["']\s+content=["'])[^"']*(["'][^>]*>)/i,
    `$1${route}$2`,
  );
  const robotsMatch = html.match(/<meta\s+name="robots"\s+content="([^"]*)"[^>]*>/i);
  const robotsContent = robotsMatch && /noindex/i.test(robotsMatch[1])
    ? robotsMatch[1]
    : "index, follow, max-image-preview:large";
  if (robotsMatch) {
    html = html.replace(robotsMatch[0], robotsMatch[0].replace(robotsMatch[1], robotsContent));
  } else {
    html = html.replace("</head>", `<meta name="robots" content="${robotsContent}" />\n</head>`);
  }

  const mainMatch = html.match(/<main>[\s\S]*?<\/main>/i);
  if (mainMatch && !/visibility\s*:\s*hidden/i.test(mainMatch[0])) {
    let main = mainMatch[0];
    if (!/<h1\b/i.test(main)) {
      const heading = (html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "Flight booking assistance")
        .replace(/\s*\|\s*TicketDepart\s*$/i, "");
      main = main.replace(/<main>/i, `<main><h1>${heading}</h1>`);
    }

    html = html.replace(mainMatch[0], main);
  }

  fs.writeFileSync(file, html);
  processed++;
}

console.log(`Hardened ${processed} static route HTML files for visible crawlable content, concise metadata, and canonical delivery.`);
