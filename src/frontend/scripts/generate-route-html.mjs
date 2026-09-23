import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const source = fs.readFileSync(path.join(distDir, "index.html"), "utf8");

const routes = {
  "/flight-booking": {
    title: "Flight Booking Assistance | TicketDepart",
    description: "Get help booking domestic, international, multi-city, business or first-class, and group flights. Speak with an independent travel specialist at +1 855-544-9001, 24/7.",
    heading: "Flight booking help from a real travel specialist",
    text: "Get practical help comparing flight options, complicated itineraries, premium cabins, group travel, and booking details by phone.",
  },
  "/delta-airlines": {
    title: "Delta Airlines Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency helping you book, change, and rebook Delta Airlines flights — domestic, international, multi-city, and premium cabins. Call +1 855-544-9001.",
    heading: "Delta Airlines flight bookings handled by a real travel specialist",
    text: "Get independent travel assistance for Delta Airlines itineraries, including new bookings, changes, rebooking, multi-city trips, and premium cabins.",
  },
  "/united-airlines": {
    title: "United Airlines Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency for United Airlines bookings — domestic, international, multi-city, premium cabins, and rebooking help. Call +1 855-544-9001.",
    heading: "United Airlines flight itineraries planned and booked by phone",
    text: "Get independent travel assistance for United Airlines itineraries, including new bookings, changes, rebooking, multi-city trips, and premium cabins.",
  },
  "/american-airlines": {
    title: "American Airlines Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency for American Airlines bookings — domestic, international, multi-city, cabin options, and rebooking help. Call +1 855-544-9001.",
    heading: "American Airlines trips booked with a travel specialist",
    text: "Get independent travel assistance for American Airlines itineraries, including new bookings, changes, rebooking, multi-city trips, and cabin options.",
  },
  "/southwest-airlines": {
    title: "Southwest Airlines Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency assistance for Southwest Airlines flight booking, family travel, same-day trips, changes, cancellations, and multi-city itineraries.",
    heading: "Southwest Airlines flight assistance, with a specialist on the phone",
    text: "Get independent travel assistance for Southwest Airlines itineraries, including new bookings, family travel, same-day trips, changes, cancellations, and multi-city planning.",
  },
  "/jetblue-airways": {
    title: "JetBlue Airways Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency assistance for JetBlue Airways flight booking, changes, cancellations, family trips, and urgent travel planning.",
    heading: "JetBlue Airways flight booking assistance",
    text: "Get independent travel assistance for JetBlue Airways itineraries, including booking, changes, family travel, international trips, and last-minute planning.",
  },
  "/alaska-airlines": {
    title: "Alaska Airlines Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency assistance for Alaska Airlines flight booking, changes, cancellations, family travel, and multi-city itineraries.",
    heading: "Alaska Airlines flight booking assistance",
    text: "Get independent travel assistance for Alaska Airlines itineraries, including booking, changes, family travel, international trips, and multi-city planning.",
  },
  "/british-airways": {
    title: "British Airways Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency assistance for British Airways international booking, premium cabins, changes, cancellations, and multi-city travel.",
    heading: "British Airways flight booking assistance",
    text: "Get independent travel assistance for British Airways international itineraries, premium cabins, connections, changes, and multi-city planning.",
  },
  "/lufthansa": {
    title: "Lufthansa Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency assistance for Lufthansa flight booking, Europe and international itineraries, premium cabins, changes, and cancellations.",
    heading: "Lufthansa flight booking assistance",
    text: "Get independent travel assistance for Lufthansa itineraries, international connections, premium cabins, changes, and multi-city planning.",
  },
  "/air-canada": {
    title: "Air Canada Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency assistance for Air Canada flight booking, Canada and international travel, family itineraries, changes, and multi-city trips.",
    heading: "Air Canada flight booking assistance",
    text: "Get independent travel assistance for Air Canada itineraries, including Canada, international travel, family trips, changes, and multi-city planning.",
  },
  "/swiss-air": {
    title: "SWISS Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency assistance for SWISS flight booking, Europe and international itineraries, premium cabins, changes, and multi-city travel.",
    heading: "SWISS flight assistance with a travel specialist",
    text: "Get independent travel assistance for SWISS itineraries, international connections, premium cabins, changes, and multi-city planning.",
  },
  "/qatar-airways": {
    title: "Qatar Airways Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency assistance for Qatar Airways flight booking, international itineraries, premium cabins, connections, changes, and multi-city trips.",
    heading: "Qatar Airways flight assistance with a travel specialist",
    text: "Get independent travel assistance for Qatar Airways itineraries, long-haul connections, premium cabins, changes, and multi-city planning.",
  },
  "/emirates": {
    title: "Emirates Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency assistance for Emirates flight booking, international itineraries, premium cabins, connections, changes, and multi-city trips.",
    heading: "Emirates flight assistance with a travel specialist",
    text: "Get independent travel assistance for Emirates itineraries, long-haul connections, premium cabins, changes, and multi-city planning.",
  },
  "/lot-polish-airlines": {
    title: "LOT Polish Airlines Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency assistance for LOT Polish Airlines flight booking, European and international itineraries, premium cabins, connections, changes, and multi-city trips.",
    heading: "LOT Polish Airlines flight assistance with a travel specialist",
    text: "Get independent travel assistance for LOT Polish Airlines itineraries, including European travel, transatlantic trips, connections, premium cabins, changes, and multi-city planning.",
  },
  "/contact": {
    title: "Contact TicketDepart | Speak with a Travel Specialist",
    description: "Contact TicketDepart to plan your next flight. Call +1 855-544-9001 any time, or send your trip details and a travel specialist will follow up with options.",
    heading: "Talk to a real travel specialist",
    text: "Call +1 855-544-9001 24/7 or send your trip details. TicketDepart is an independent U.S. travel agency.",
  },
  "/privacy": {
    title: "Privacy Policy | TicketDepart",
    description: "How TicketDepart collects, uses, and protects the personal information you share when you contact our travel specialists or book a flight.",
    heading: "Privacy Policy",
    text: "This policy explains what information TicketDepart collects when you contact us or book travel through this website, how we use it, and the choices you have.",
  },
  "/terms": {
    title: "Terms of Service | TicketDepart",
    description: "The terms that govern your use of the TicketDepart website and our independent travel agency booking services.",
    heading: "Terms of Service",
    text: "These terms govern your use of the TicketDepart website and the travel booking services provided by our independent travel agency.",
  },
};

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function routeHtml(route, meta) {
  const url = `https://ticketdepart.com${route}`;
  const safeTitle = escapeHtml(meta.title);
  const safeDescription = escapeHtml(meta.description);
  const safeHeading = escapeHtml(meta.heading);
  const safeText = escapeHtml(meta.text);

  let html = source
    .replace(/<title>[^<]*<\/title>/i, `<title>${safeTitle}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/i, `<meta name="description" content="${safeDescription}" />`)
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/i, `<meta property="og:title" content="${safeTitle}" />`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/i, `<meta property="og:description" content="${safeDescription}" />`)
    .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/i, `<meta property="og:url" content="${url}" />`)
    .replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/i, `<link rel="canonical" href="${url}" />`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, "");

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: meta.title,
    description: meta.description,
    url,
    isPartOf: { "@type": "WebSite", name: "TicketDepart", url: "https://ticketdepart.com/" },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://ticketdepart.com/" },
        { "@type": "ListItem", position: 2, name: meta.heading, item: url },
      ],
    },
  };

  html = html.replace(
    "</head>",
    `<script type="application/ld+json">${JSON.stringify(schema)}</script>\n  </head>`,
  );

  const fallback = `<main><nav aria-label="Breadcrumb"><a href="/">TicketDepart</a> / ${safeHeading}</nav><h1>${safeHeading}</h1><p>${safeText}</p><p><a href="tel:+18555449001">Call +1 855-544-9001</a> — available 24/7.</p><p>TicketDepart is an independent U.S. travel agency and is not affiliated with, endorsed by, or the official customer service of any airline.</p></main>`;

  return html.replace('<div id="root"></div>', `<div id="root">${fallback}</div>`);
}

for (const [route, meta] of Object.entries(routes)) {
  const dir = path.join(distDir, route.slice(1));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), routeHtml(route, meta));
}

console.log(`Generated ${Object.keys(routes).length} crawlable route entry points.`);
