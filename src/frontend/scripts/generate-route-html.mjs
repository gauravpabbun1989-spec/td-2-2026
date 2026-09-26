import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const source = fs.readFileSync(path.join(distDir, "index.html"), "utf8");

const routes = {
  "/book-a-flight-by-phone": {
    title: "Book a Flight by Phone | 24/7 Flight Booking Help | TicketDepart",
    description: "Book a domestic or international flight by phone with an independent U.S. travel agency. Discuss routes, dates, cabins, baggage, and fare rules with a travel specialist 24/7.",
    heading: "Book a flight by phone with a travel specialist",
    text: "Discuss domestic and international flight options, multi-city trips, premium cabins, family travel, and booking details with a travel specialist.",
  },
  "/how-to-book-a-flight-by-phone": {
    title: "How to Book a Flight by Phone | TicketDepart",
    description: "Learn how to prepare for a phone flight booking, compare itinerary details, review fare conditions, and confirm the final trip before payment.",
    heading: "How to book a flight by phone",
    text: "A practical guide to preparing your trip details, discussing flight options, reviewing terms, and confirming a booking by phone.",
  },
  "/international-flight-booking": {
    title: "International Flight Booking Assistance | TicketDepart",
    description: "Get help planning and booking international flights by phone. Discuss routes, connections, cabins, dates, and fare conditions with an independent travel specialist.",
    heading: "International flight booking assistance by phone",
    text: "Discuss international routes, connections, cabins, flexible dates, travel-document questions, and fare conditions before booking.",
  },
  "/last-minute-flight-booking": {
    title: "Last-Minute Flight Booking Assistance | TicketDepart",
    description: "Need a last-minute flight? Discuss available routes, nearby airports, flexible dates, connections, and fare conditions with a travel specialist.",
    heading: "Last-minute flight booking help when time matters",
    text: "Discuss urgent departures, nearby airports, flexible dates, connections, same-day questions, and fare conditions.",
  },
  "/multi-city-flight-booking": {
    title: "Multi-City Flight Booking Assistance | TicketDepart",
    description: "Plan a multi-city or open-jaw flight itinerary by phone. Discuss multiple stops, connections, flexible dates, cabins, and fare rules.",
    heading: "Multi-city flight booking for complex itineraries",
    text: "Discuss multiple city pairs, open-jaw routing, connections, mixed carriers, flexible dates, and fare rules.",
  },
  "/group-flight-booking": {
    title: "Group Flight Booking Assistance | TicketDepart",
    description: "Plan group flight travel by phone with help reviewing traveler details, routing, cabin options, baggage, and applicable booking terms.",
    heading: "Group flight booking assistance",
    text: "Discuss group traveler details, routing, cabin preferences, baggage needs, and applicable booking conditions.",
  },
  "/cheap-flight-booking-by-phone": {
    title: "Cheap Flight Booking by Phone | TicketDepart",
    description: "Discuss practical ways to compare flight options, flexible dates, nearby airports, baggage terms, and fare conditions by phone.",
    heading: "Cheap flight booking assistance by phone",
    text: "Discuss practical fare-comparison factors including flexible dates, nearby airports, itinerary trade-offs, and fare conditions.",
  },
  "/business-class-flight-booking": {
    title: "Business Class Flight Booking Assistance | TicketDepart",
    description: "Discuss business-class flight options, routes, schedules, connections, baggage, and fare conditions with an independent travel specialist.",
    heading: "Business class flight booking assistance",
    text: "Review business-class itinerary options, schedules, connections, baggage, and fare conditions before booking.",
  },
  "/same-day-flight-booking": {
    title: "Same-Day Flight Booking Assistance | TicketDepart",
    description: "Need to travel today? Discuss same-day flight options, departure airports, connections, ticketing deadlines, and fare conditions by phone.",
    heading: "Same-day flight booking assistance",
    text: "Discuss same-day options, nearby departure airports, connections, ticketing deadlines, and applicable fare conditions.",
  },
  "/family-flight-booking": {
    title: "Family Flight Booking Assistance | TicketDepart",
    description: "Plan family flights by phone and discuss traveler details, seats, baggage, routing, dates, and applicable booking terms.",
    heading: "Family flight booking assistance",
    text: "Discuss family traveler details, routing, cabin preferences, baggage, dates, and applicable booking conditions.",
  },
  "/flight-change-assistance": {
    title: "Flight Change Assistance by Phone | TicketDepart",
    description: "Need to change a flight? Discuss date, time, route, fare difference, and airline change rules with a TicketDepart travel specialist.",
    heading: "Flight change assistance by phone",
    text: "Review possible date, time, route, connection, and fare changes for an existing itinerary before authorizing a change.",
  },
  "/flight-cancellation-assistance": {
    title: "Flight Cancellation Assistance by Phone | TicketDepart",
    description: "Need to cancel a flight? Discuss cancellation rules, refunds, credits, deadlines, and replacement travel options with a TicketDepart specialist.",
    heading: "Flight cancellation assistance by phone",
    text: "Review cancellation timing, refund or credit questions, partial itinerary effects, and replacement travel options.",
  },
  "/airline-reservation-assistance": {
    title: "Airline Reservation Assistance by Phone | TicketDepart",
    description: "Need help with an airline reservation? Discuss booking, changes, cancellations, connections, baggage, and fare conditions with a TicketDepart travel specialist.",
    heading: "Airline reservation assistance by phone",
    text: "Discuss new or existing airline reservation questions, changes, cancellations, baggage, connections, and fare conditions with a travel specialist.",
  },
  "/flight-booking-assistance": {
    title: "Flight Booking Assistance by Phone | TicketDepart",
    description: "Get flight booking assistance by phone for domestic, international, multi-city, family, group, and premium-cabin travel with an independent travel specialist.",
    heading: "Flight booking assistance by phone",
    text: "Discuss routes, dates, airports, connections, cabins, traveler details, and fare conditions before you confirm a flight booking.",
  },
  "/flight-booking": {
    title: "Flight Booking Assistance | TicketDepart",
    description: "Get help booking domestic, international, multi-city, business or first-class, and group flights. Speak with an independent travel specialist at +1 888-958-0280, 24/7.",
    heading: "Flight booking help from a real travel specialist",
    text: "Get practical help comparing flight options, complicated itineraries, premium cabins, group travel, and booking details by phone.",
  },
  "/delta-airlines": {
    title: "Delta Airlines Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency helping you book, change, and rebook Delta Airlines flights — domestic, international, multi-city, and premium cabins. Call +1 888-958-0280.",
    heading: "Delta Airlines flight bookings handled by a real travel specialist",
    text: "Get independent travel assistance for Delta Airlines itineraries, including new bookings, changes, rebooking, multi-city trips, and premium cabins.",
  },
  "/united-airlines": {
    title: "United Airlines Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency for United Airlines bookings — domestic, international, multi-city, premium cabins, and rebooking help. Call +1 888-958-0280.",
    heading: "United Airlines flight itineraries planned and booked by phone",
    text: "Get independent travel assistance for United Airlines itineraries, including new bookings, changes, rebooking, multi-city trips, and premium cabins.",
  },
  "/american-airlines": {
    title: "American Airlines Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency for American Airlines bookings — domestic, international, multi-city, cabin options, and rebooking help. Call +1 888-958-0280.",
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
  "/norse-atlantic-airways": {
    title: "Norse Atlantic Airways Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency assistance for Norse Atlantic Airways flight booking, transatlantic itineraries, connections, changes, and multi-city travel.",
    heading: "Norse Atlantic Airways flight assistance with a travel specialist",
    text: "Get independent travel assistance for Norse Atlantic Airways transatlantic itineraries, connections, changes, and multi-city planning.",
  },
  "/lot-polish-airlines": {
    title: "LOT Polish Airlines Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency assistance for LOT Polish Airlines flight booking, European and international itineraries, premium cabins, connections, changes, and multi-city trips.",
    heading: "LOT Polish Airlines flight assistance with a travel specialist",
    text: "Get independent travel assistance for LOT Polish Airlines itineraries, including European travel, transatlantic trips, connections, premium cabins, changes, and multi-city planning.",
  },
  "/flights-usa-to-canada": {
    title: "USA to Canada Flights | Booking Assistance | TicketDepart",
    description: "Get help comparing flights from the USA to Canada by phone, including cities, airports, dates, connections, cabins, baggage, and fare conditions.",
    heading: "USA to Canada flight booking assistance",
    text: "Discuss USA-to-Canada routes, nearby airports, dates, connections, cabins, baggage, and fare conditions with a travel specialist.",
  },
  "/flights-usa-to-uk": {
    title: "USA to UK Flights | Booking Assistance | TicketDepart",
    description: "Plan USA to UK flights by phone and discuss destinations, dates, connections, cabins, baggage, and fare conditions with a travel specialist.",
    heading: "USA to UK flight booking assistance",
    text: "Discuss USA-to-UK routes, UK arrival airports, schedules, cabins, baggage, and fare conditions with a travel specialist.",
  },
  "/flights-usa-to-europe": {
    title: "USA to Europe Flights | Booking Assistance | TicketDepart",
    description: "Plan USA to Europe flights by phone and discuss destinations, connections, dates, cabins, baggage, and fare conditions with a travel specialist.",
    heading: "USA to Europe flight booking assistance",
    text: "Discuss European destinations, connections, flexible dates, cabins, multi-city routing, baggage, and fare conditions.",
  },
  "/flights-usa-to-mexico": {
    title: "USA to Mexico Flights | Booking Assistance | TicketDepart",
    description: "Plan USA to Mexico flights by phone and discuss destinations, airports, dates, connections, cabins, baggage, and fare conditions.",
    heading: "USA to Mexico flight booking assistance",
    text: "Discuss USA-to-Mexico routes, destinations, nearby airports, family travel, cabins, baggage, and fare conditions.",
  },
  "/contact": {
    title: "Contact TicketDepart | Speak with a Travel Specialist",
    description: "Contact TicketDepart to plan your next flight. Call +1 888-958-0280 any time, or send your trip details and a travel specialist will follow up with options.",
    heading: "Talk to a real travel specialist",
    text: "Call +1 888-958-0280 24/7 or send your trip details. TicketDepart is an independent U.S. travel agency.",
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

  const fallback = `<main><nav aria-label="Breadcrumb"><a href="/">TicketDepart</a> / ${safeHeading}</nav><h1>${safeHeading}</h1><p>${safeText}</p><p><a href="tel:+18889580280">Call +1 888-958-0280</a> — available 24/7.</p><p>TicketDepart is an independent U.S. travel agency and is not affiliated with, endorsed by, or the official customer service of any airline.</p></main>`;

  return html.replace('<div id="root"></div>', `<div id="root">${fallback}</div>`);
}

for (const [route, meta] of Object.entries(routes)) {
  const dir = path.join(distDir, route.slice(1));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), routeHtml(route, meta));
}

console.log(`Generated ${Object.keys(routes).length} crawlable route entry points.`);
