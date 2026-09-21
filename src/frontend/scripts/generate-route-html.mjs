import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const source = fs.readFileSync(path.join(distDir, "index.html"), "utf8");

const routes = {
  "/international-flight-booking": {
    title: "International Flight Booking Assistance by Phone | TicketDepart",
    description: "Plan international flights with a travel specialist. Get help comparing routes, connections, cabins, and fare conditions by phone at +1 855-544-9001.",
    heading: "International flight booking with a real travel specialist",
    text: "Plan international itineraries with help comparing routing, connections, cabins, and fare conditions by phone.",
  },
  "/last-minute-flight-booking": {
    title: "Last-Minute Flight Booking Assistance | TicketDepart",
    description: "Need a flight soon? Speak with a TicketDepart travel specialist about available routing, connection, cabin, and fare options at +1 855-544-9001.",
    heading: "Last-minute flight booking help by phone",
    text: "Discuss practical routing options, schedule trade-offs, and fare conditions with a travel specialist.",
  },
  "/multi-city-flight-booking": {
    title: "Multi-City Flight Booking Assistance by Phone | TicketDepart",
    description: "Plan multi-city and open-jaw flights with a travel specialist. Compare city pairs, connections, cabins, and fare conditions by phone.",
    heading: "Multi-city flight booking without the guesswork",
    text: "Organize multiple city pairs and discuss routing, connections, cabins, and fare conditions with a specialist.",
  },
  "/group-flight-booking": {
    title: "Group & Family Flight Booking Assistance | TicketDepart",
    description: "Get phone assistance planning group and family flights. Discuss travelers, routing, cabins, connections, and booking details with TicketDepart.",
    heading: "Group and family flight booking help by phone",
    text: "Plan family and group itineraries with help organizing travelers, routing, cabins, connections, and booking details.",
  },
  "/flight-booking-assistance": {
    title: "Flight Booking Assistance by Phone | TicketDepart",
    description: "Need help booking a flight? Speak with an independent TicketDepart travel specialist about domestic, international, multi-city, and complex itineraries at +1 855-544-9001.",
    heading: "Flight booking assistance from a real travel specialist",
    text: "Discuss routes, dates, connections, cabins, travelers, and fare conditions with a TicketDepart specialist by phone.",
  },
  "/same-day-flight-booking": {
    title: "Same-Day Flight Booking Assistance by Phone | TicketDepart",
    description: "Need to travel today? Call TicketDepart for same-day flight booking assistance. Discuss routes, departure airports, connections, and fare conditions with a travel specialist.",
    heading: "Same-day flight booking help by phone",
    text: "Discuss urgent travel routing, departure options, connections, and fare conditions with a travel specialist.",
  },
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
