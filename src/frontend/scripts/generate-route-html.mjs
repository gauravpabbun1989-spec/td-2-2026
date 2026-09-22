import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const source = fs.readFileSync(path.join(distDir, "index.html"), "utf8");

const routes = {
  "/flight-booking-phone-number": {
    title: "Flight Booking Phone Number | TicketDepart",
    description: "Need a flight booking phone number? Call TicketDepart at +1 855-544-9001 for independent domestic or international booking assistance, 24/7.",
    heading: "Need a phone number to book a flight?",
    text: "Call TicketDepart at +1 855-544-9001 to discuss your route, dates, travelers, cabin, connections, and booking questions with an independent travel specialist.",
  },
  "/book-a-flight-by-phone": {
    title: "Book a Flight by Phone | TicketDepart 24/7",
    description: "Book a domestic or international flight by phone with TicketDepart. Discuss routes, dates, cabins, baggage, and fare rules with an independent specialist.",
    heading: "Book a flight by phone with a travel specialist",
    text: "Speak with a TicketDepart specialist about domestic or international flight booking, itinerary details, and fare conditions.",
  },
  "/how-to-book-a-flight-by-phone": {
    title: "How to Book a Flight by Phone | TicketDepart",
    description: "Learn how phone flight booking works, what details to prepare, and what questions to ask before confirming an itinerary with TicketDepart.",
    heading: "How to book a flight by phone",
    text: "Prepare your route, dates, travelers, cabin preferences, and questions before speaking with a TicketDepart travel specialist.",
  },
  "/book-flight-for-someone-else": {
    title: "Book a Flight for Someone Else | TicketDepart",
    description: "Need to book a flight for a family member, employee, friend, or client? Speak with a TicketDepart travel specialist about the traveler details and booking process.",
    heading: "Book a flight for someone else with phone assistance",
    text: "Discuss traveler details, routing, dates, cabin preferences, and the booking process with a TicketDepart specialist.",
  },
  "/travel-agent-by-phone": {
    title: "Travel Agent by Phone | Flight Booking Help | TicketDepart",
    description: "Speak with an independent travel agent by phone for flight booking help, complex itineraries, premium cabins, and urgent travel planning. TicketDepart is available 24/7.",
    heading: "Talk to a travel agent by phone about your flight",
    text: "Discuss your flight plans, traveler needs, itinerary details, and booking questions with a TicketDepart specialist.",
  },
  "/flight-change-rebooking": {
    title: "Flight Change & Rebooking Assistance by Phone | TicketDepart",
    description: "Need to change a flight? Speak with a TicketDepart travel specialist about date, time, route, and rebooking options. Independent phone assistance available 24/7.",
    heading: "Flight change and rebooking help by phone",
    text: "Review your existing ticket, preferred new travel details, fare conditions, and available rebooking options with a specialist.",
  },
  "/international-flight-booking": {
    title: "International Flight Booking by Phone | TicketDepart",
    description: "Book international flights by phone with an independent TicketDepart travel specialist. Discuss routes, connections, cabins, and fare conditions at +1 855-544-9001.",
    heading: "International flight booking with a real travel specialist",
    text: "Plan international itineraries with help comparing routing, connections, cabins, and fare conditions by phone.",
  },
  "/last-minute-flight-booking": {
    title: "Last-Minute Flight Booking by Phone | TicketDepart",
    description: "Need a flight soon? Call TicketDepart to discuss available routing, connections, cabins, and fare conditions with a travel specialist.",
    heading: "Last-minute flight booking help by phone",
    text: "Discuss practical routing options, schedule trade-offs, and fare conditions with a travel specialist.",
  },
  "/multi-city-flight-booking": {
    title: "Multi-City Flight Booking by Phone | TicketDepart",
    description: "Book multi-city and open-jaw flights by phone. Discuss city pairs, connections, cabins, and fare conditions with a TicketDepart specialist.",
    heading: "Multi-city flight booking without the guesswork",
    text: "Organize multiple city pairs and discuss routing, connections, cabins, and fare conditions with a specialist.",
  },
  "/group-flight-booking": {
    title: "Group Flight Booking by Phone | TicketDepart",
    description: "Plan group and family flights by phone with TicketDepart. Discuss travelers, routing, cabins, connections, and booking details with a specialist.",
    heading: "Group and family flight booking help by phone",
    text: "Plan family and group itineraries with help organizing travelers, routing, cabins, connections, and booking details.",
  },
  "/flight-cancellation-assistance": {
    title: "Flight Cancellation Assistance by Phone | TicketDepart",
    description: "Need help understanding a flight cancellation or refund request? Call TicketDepart to discuss your ticket, fare conditions, and available next steps with an independent travel specialist.",
    heading: "Flight cancellation and refund assistance by phone",
    text: "Discuss cancellation, refund, travel-credit, and ticket-condition questions with an independent TicketDepart specialist.",
  },
  "/missed-flight-rebooking": {
    title: "Missed Flight Rebooking Assistance by Phone | TicketDepart",
    description: "Missed your flight? Call TicketDepart to discuss rebooking information, itinerary details, and available options with an independent travel specialist.",
    heading: "Missed flight rebooking help by phone",
    text: "Discuss your missed flight, current itinerary, timing, and rebooking options with an independent travel specialist.",
  },
  "/flight-booking-assistance": {
    title: "Flight Booking Assistance by Phone | TicketDepart",
    description: "Need flight booking help? Call TicketDepart to discuss domestic, international, multi-city, and complex itineraries with an independent specialist.",
    heading: "Flight booking assistance from a real travel specialist",
    text: "Discuss routes, dates, connections, cabins, travelers, and fare conditions with a TicketDepart specialist by phone.",
  },
  "/same-day-flight-booking": {
    title: "Same-Day Flight Booking by Phone | TicketDepart",
    description: "Need to travel today? Call TicketDepart to discuss same-day routes, departure airports, connections, and fare conditions with a travel specialist.",
    heading: "Same-day flight booking help by phone",
    text: "Discuss urgent travel routing, departure options, connections, and fare conditions with a travel specialist.",
  },
  "/domestic-flight-booking": {
    title: "Domestic Flight Booking by Phone | TicketDepart",
    description: "Book a domestic U.S. flight by phone with an independent TicketDepart travel specialist. Discuss routes, dates, airports, and fare conditions.",
    heading: "Domestic flight booking help from a real travel specialist",
    text: "Get independent assistance for domestic U.S. flight routes, dates, airports, connections, cabins, and fare conditions.",
  },
  "/business-class-flight-booking": {
    title: "Business Class Flight Booking by Phone | TicketDepart",
    description: "Plan business class and premium-cabin flights by phone with TicketDepart. Discuss routes, schedules, connections, and fare conditions.",
    heading: "Business class flight booking assistance by phone",
    text: "Discuss premium-cabin routing, schedules, connections, and fare conditions with a travel specialist.",
  },
  "/one-way-flight-booking": {
    title: "One-Way Flight Booking by Phone | TicketDepart",
    description: "Need a one-way flight? Call TicketDepart to discuss routes, dates, connections, cabins, and fare conditions with a specialist.",
    heading: "One-way flight booking help by phone",
    text: "Plan a domestic or international one-way itinerary with help comparing routing, dates, connections, cabins, and fare conditions.",
  },
  "/family-flight-booking": {
    title: "Family Flight Booking by Phone | TicketDepart",
    description: "Plan family flights by phone with an independent TicketDepart specialist. Discuss travelers, schedules, connections, cabins, and fare conditions.",
    heading: "Family flight booking help from a travel specialist",
    text: "Organize family travelers, schedules, connections, cabins, seating preferences, and fare conditions with a specialist.",
  },
  "/flight-booking": {
    title: "Flight Booking by Phone | TicketDepart 24/7",
    description: "Book domestic, international, multi-city, premium-cabin, or group flights by phone with TicketDepart. Call +1 855-544-9001, 24/7.",
    heading: "Flight booking help from a real travel specialist",
    text: "Get practical help comparing flight options, complicated itineraries, premium cabins, group travel, and booking details by phone.",
  },
  "/delta-airlines": {
    title: "Delta Airlines Flight Booking by Phone | TicketDepart",
    description: "Book Delta Airlines flights by phone with an independent TicketDepart travel specialist. Discuss domestic, international, multi-city, and premium-cabin trips at +1 855-544-9001.",
    heading: "Delta Airlines flight bookings handled by a real travel specialist",
    text: "Get independent travel assistance for Delta Airlines itineraries, including new bookings, changes, rebooking, multi-city trips, and premium cabins.",
  },
  "/united-airlines": {
    title: "United Airlines Flight Booking by Phone | TicketDepart",
    description: "Book United Airlines flights by phone with an independent TicketDepart travel specialist. Discuss domestic, international, multi-city, and premium-cabin trips at +1 855-544-9001.",
    heading: "United Airlines flight itineraries planned and booked by phone",
    text: "Get independent travel assistance for United Airlines itineraries, including new bookings, changes, rebooking, multi-city trips, and premium cabins.",
  },
  "/american-airlines": {
    title: "American Airlines Flight Booking by Phone | TicketDepart",
    description: "Book American Airlines flights by phone with an independent TicketDepart travel specialist. Discuss domestic, international, multi-city, and cabin options at +1 855-544-9001.",
    heading: "American Airlines trips booked with a travel specialist",
    text: "Get independent travel assistance for American Airlines itineraries, including new bookings, changes, rebooking, multi-city trips, and cabin options.",
  },
  "/southwest-airlines": {
    title: "Southwest Airlines Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency assistance for Southwest Airlines flight planning and booking. Discuss routes, dates, travelers, and fare options by phone at +1 855-544-9001.",
    heading: "Southwest Airlines flight booking help by phone",
    text: "Discuss Southwest Airlines trip details, routing, dates, travelers, and fare questions with an independent TicketDepart travel specialist."
  },
  "/british-airways": {
    title: "British Airways Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency assistance for British Airways flight planning and booking. Discuss international routes, connections, cabins, and fare conditions by phone.",
    heading: "British Airways flight booking assistance by phone",
    text: "Discuss British Airways international routes, connections, cabins, and fare conditions with an independent TicketDepart travel specialist."
  },
  "/lufthansa": {
    title: "Lufthansa Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency assistance for Lufthansa flight planning and booking. Discuss international routes, connections, cabins, and fare conditions by phone.",
    heading: "Lufthansa flight booking assistance by phone",
    text: "Discuss Lufthansa international routes, connections, cabins, and fare conditions with an independent TicketDepart travel specialist."
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

  const relatedLinks = route === "/flight-booking"
    ? `<p><a href="/domestic-flight-booking">Domestic flight booking</a> · <a href="/international-flight-booking">International flight booking</a> · <a href="/business-class-flight-booking">Business class booking</a></p>`
    : `<p><a href="/flight-booking">Flight booking assistance</a> · <a href="/contact">Contact TicketDepart</a></p>`;

  const fallback = `<main><nav aria-label="Breadcrumb"><a href="/">TicketDepart</a> / ${safeHeading}</nav><h1>${safeHeading}</h1><p>${safeText}</p><h2>Flight booking assistance</h2><p>TicketDepart helps travelers plan and book domestic and international flights, one-way trips, same-day travel, multi-city itineraries, premium cabins, family travel, and group bookings by phone.</p><p><a href="tel:+18555449001">Call +1 855-544-9001</a> — available 24/7.</p>${relatedLinks}<p>TicketDepart is an independent U.S. travel agency and is not affiliated with, endorsed by, or the official customer service of any airline.</p></main>`;

  return html.replace('<div id="root"></div>', `<div id="root">${fallback}</div>`);
}

for (const [route, meta] of Object.entries(routes)) {
  const dir = path.join(distDir, route.slice(1));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), routeHtml(route, meta));
}

console.log(`Generated ${Object.keys(routes).length} crawlable route entry points.`);
