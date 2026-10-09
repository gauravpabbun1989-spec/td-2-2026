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

const sharedSections = [
  ["Plan the itinerary", "Before booking, review the departure city or airport, destination, travel dates, traveler count, cabin preference, connection needs, baggage questions, and any schedule constraints. A clear outline makes it easier to compare practical itinerary choices and identify details that need confirmation."],
  ["Review the booking details", "Flight availability, schedules, ticket conditions, baggage allowances, change rules, cancellation terms, and applicable charges depend on the specific itinerary and provider. Review the details that apply to the selected option before payment, especially when travel includes multiple carriers, international connections, family travelers, or a tight departure schedule."],
  ["Get independent assistance", "TicketDepart provides independent travel reservation assistance and is not an airline or the official customer-service department of any airline. A travel specialist can help you work through the information needed for a booking, but airline schedules, availability, policies, and entry requirements can change. Verify important travel-document requirements with the relevant government or official provider."],
  ["Related booking help", "Use the related guides to compare common booking situations, including phone booking, international travel, business-class trips, group travel, changes, cancellations, and airline-specific assistance. When you are ready to discuss an itinerary, the site provides a phone option for 24/7 reservation assistance."]
];

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
  html = html.replace(
    /(<meta\s+name=["']robots["']\s+content=["'])[^"']*(["'][^>]*>)/i,
    `$1index, follow, max-image-preview:large$2`,
  );

  const mainMatch = html.match(/<main>[\s\S]*?<\/main>/i);
  if (mainMatch && !/visibility\s*:\s*hidden/i.test(mainMatch[0])) {
    let main = mainMatch[0];
    if (!/<h1\b/i.test(main)) {
      const heading = (html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "Flight booking assistance")
        .replace(/\s*\|\s*TicketDepart\s*$/i, "");
      main = main.replace(/<main>/i, `<main><h1>${heading}</h1>`);
    }
    if (!/<h2\b/i.test(main)) {
      const sectionHtml = sharedSections.slice(0, 3).map(([h,p]) => `<section><h2>${h}</h2><p>${p}</p></section>`).join("");
      main = main.replace("</main>", sectionHtml + "</main>");
    }
    html = html.replace(mainMatch[0], main);
  }

  fs.writeFileSync(file, html);
  processed++;
}

console.log(`Hardened ${processed} static route HTML files for visible crawlable content, concise metadata, and canonical delivery.`);
