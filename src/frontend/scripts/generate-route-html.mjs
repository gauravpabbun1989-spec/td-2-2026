import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const source = fs.readFileSync(path.join(distDir, "index.html"), "utf8");

const routes = {
  "/": {
    title: "Make Flight Booking Easy | 24/7 Booking Assistance",
    description: "Book domestic or international flights by phone. Discuss routes, dates, cabins, baggage and fare rules with TicketDepart, 24/7.",
    heading: "Book flights by phone with a travel specialist",
    text: "TicketDepart helps travelers work through flight booking questions by phone. You can discuss domestic or international trips, departure and arrival airports, travel dates, cabin preferences, connections, baggage questions, and applicable fare conditions before deciding how to proceed. If your itinerary is straightforward, you can start with the flight options on the site. If the trip involves multiple cities, tight schedules, family or group travel, or a premium cabin, a conversation can help you work through the details in one place. Before calling, it helps to have your preferred travel dates, departure city or airport, destination, number of travelers, and any important timing or cabin requirements ready. For international travel, you may also want to ask about connection points, baggage rules, and the booking conditions that apply to the itinerary you are considering. TicketDepart provides independent flight reservation assistance and is not an airline or an airline’s official customer-service department. Airline schedules, availability, baggage policies, and fare conditions can vary by route and ticket, so specific details should be reviewed before a booking is confirmed. The site also includes focused guides for international flights, business-class travel, group bookings, flight changes, cancellations, and airline-specific reservation assistance. If you are not sure which booking option fits your trip, you can review the booking guides first or contact a travel specialist. The goal is to make the practical details easier to understand before you confirm your travel plans.",
  },
  "/flight-search": {
    title: "Search Flights | Flight Schedule Search | TicketDepart",
    description: "Search flight options by city or airport and travel date, then call TicketDepart to confirm booking details with a travel specialist.",
    heading: "Search flight options",
    text: "Search flight schedules by route and date, review available itinerary options, and continue by phone when you are ready to confirm booking details.",
  },
  "/flight-search-results": {
    title: "Flight Search Results | TicketDepart",
    description: "Review flight schedules for your selected route and date. Interactive results are excluded from search indexing.",
    heading: "Flight search results and itinerary planning",
    text: "Review flight schedule options and modify your itinerary before calling TicketDepart for reservation assistance.",
    indexable: false,
  },
  "/book-a-flight-by-phone": {
    title: "Book a Flight by Phone | 24/7 Booking Help",
    description: "Book a flight by phone. Compare routes, dates, cabins, baggage and fare rules with a travel specialist 24/7.",
    heading: "Book a flight by phone with a travel specialist",
    text: "Before calling, gather your departure city, destination, travel dates, number of travelers, and preferred cabin if known. Ask about the full price, baggage allowance, connection details, change and cancellation terms, and any agency service fee before authorizing payment. Fares and availability may change until ticketing is complete. TicketDepart is an independent travel agency, not an airline.",
  },
  "/how-to-book-a-flight-by-phone": {
    title: "How to Book a Flight by Phone | TicketDepart",
    description: "Learn what to prepare, how to compare flight itineraries, and which fare, baggage, and change terms to check before paying.",
    heading: "How to book a flight by phone",
    text: "Prepare your departure and arrival airports, dates, traveler count, and cabin preference. Compare the complete itinerary, including connections, baggage, total travel time, and applicable fare conditions. Before paying, confirm the total price, taxes, any disclosed agency service fee, ticketing status, change and cancellation terms, and refund eligibility. Airport services, airline booking channels, and independent travel agencies are different options; confirm which provider will issue and service the ticket. Phone booking is not always cheaper, and prices depend on availability and the specific fare rules.",
  },
  "/international-flight-booking": {
    title: "International Flight Booking Assistance | TicketDepart",
    description: "Plan international flights by phone. Review routes, connections, cabin options, travel dates, and fare conditions.",
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
  "/corporate-flight-booking": {
    title: "Corporate Flight Booking by Phone | Business Travel | TicketDepart",
    description: "Coordinate employee and executive flight planning by phone. Review travel policy, dates, connections, and ticket terms. Call +1-888-958-0280.",
    heading: "Corporate flight booking by phone",
    text: "Coordinate employee and executive trips by reviewing travel-policy requirements, traveler count, meeting times, departure airports, routing, approval steps, and receipt or billing needs. Compare schedule reliability, connection risk, baggage, flexibility, and total ticket cost across available itineraries. Business class is a cabin choice within a trip plan, not the same as coordinating company travel. Confirm any disclosed service fees and fare conditions before authorizing payment. TicketDepart is an independent travel agency; this page does not promise negotiated corporate rates or an existing company account.",
  },
  "/business-class-flight-booking": {
    title: "Business Class Flight Booking by Phone | TicketDepart",
    description: "Discuss business-class flights from U.S. airports, cabin options, connections, baggage, flexible dates, and fare rules with an independent travel specialist.",
    heading: "Business class flight booking by phone",
    text: "Plan business trips and premium-cabin itineraries by comparing departure airports, schedules, connections, total journey time, baggage, flexible dates, and fare conditions. Confirm what the fare includes, any applicable service fees, change and cancellation terms, and refund eligibility before payment. TicketDepart is an independent travel agency, not an airline.",
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
  "/pet-flight-booking": {
    title: "Pet Flight Booking Assistance | TicketDepart",
    description: "Plan pet-friendly flights by phone. Ask about carrier rules, pet documents, cabin or hold options, and connections.",
    heading: "Pet flight booking assistance by phone",
    text: "Discuss pet travel requirements, cabin or checked-pet questions, documentation, connections, and baggage considerations before booking.",
  },

  "/baggage-assistance": {
    title: "Flight Baggage Assistance by Phone | TicketDepart",
    description: "Get help understanding carry-on limits, checked bags, excess baggage, special items, and airline baggage rules.",
    heading: "Flight baggage assistance by phone",
    text: "Discuss carry-on, checked, excess, special-item, pet, infant, and multi-airline baggage questions for your itinerary.",
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
    description: "Get help with airline bookings, changes, cancellations, connections and baggage. Discuss ticket terms with TicketDepart at +1-888-958-0280, 24/7.",
    heading: "Airline reservation assistance by phone",
    text: "For a new trip or an existing ticket, have the airline, route, travel dates, and booking reference available if you have them. A specialist can discuss the ticket terms and possible next steps for changes, cancellations, connections, and baggage questions. Eligibility, fees, refunds, and credits depend on the ticket conditions and responsible airline or travel provider. TicketDepart is an independent travel agency and is not an airline’s official customer-service department.",
  },

  "/flight-booking": {
    title: "Flight Booking Assistance by Phone | TicketDepart",
    description: "Get U.S. and international flight booking help. Discuss routes, multi-city trips, cabins, baggage and fare rules 24/7.",
    heading: "Flight booking assistance by phone for U.S. travelers",
    text: "Plan a domestic or international trip by reviewing departure and arrival airports, dates, traveler count, cabin preferences, connections, baggage, and fare conditions. For multi-city routes, group travel, or premium cabins, discuss the details with a travel specialist before you decide. TicketDepart is an independent travel agency, not an airline or an airline’s official customer-service department. Review the applicable price and ticket terms before authorizing payment.",
  },
  "/delta-airlines": {
    title: "Delta Airlines Flight Booking Assistance | 24/7 | TicketDepart",
    description: "Discuss Delta Airlines flight bookings, changes, rebooking, multi-city trips, and premium cabins.",
    heading: "Delta Airlines flight bookings handled by a real travel specialist",
    text: "Get independent travel assistance for Delta Airlines itineraries, including new bookings, changes, rebooking, multi-city trips, premium cabins, and 24/7 reservation assistance.",
  },
  "/united-airlines": {
    title: "United Airlines Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency for United Airlines bookings — domestic, international, multi-city, premium cabins, and rebooking help. Call +1 888-958-0280.",
    heading: "United Airlines flight itineraries planned and booked by phone",
    text: "Get independent travel assistance for United Airlines itineraries, including new bookings, changes, rebooking, multi-city trips, and premium cabins.",
  },
  "/american-airlines": {
    title: "American Airlines Flight Booking Assistance | Book by Phone | TicketDepart",
    description: "Discuss American Airlines bookings, cabin options, multi-city trips, and rebooking with an independent travel agency.",
    heading: "American Airlines trips booked with a travel specialist",
    text: "Get independent travel assistance for American Airlines itineraries, including new bookings, changes, rebooking, multi-city trips, and cabin options by phone.",
  },
  "/southwest-airlines": {
    title: "Southwest Airlines Flight Booking Assistance | TicketDepart",
    description: "Get independent help with Southwest flight bookings, family trips, same-day travel, changes, and cancellations.",
    heading: "Southwest Airlines flight assistance, with a specialist on the phone",
    text: "Get independent travel assistance for Southwest Airlines itineraries, including new bookings, family travel, same-day trips, changes, cancellations, and multi-city planning.",
  },
  "/jetblue-airways": {
    title: "JetBlue Airways Flight Booking Assistance | TicketDepart",
    description: "Get independent help with JetBlue bookings, family trips, urgent travel, changes, and cancellations.",
    heading: "JetBlue Airways flight booking assistance",
    text: "Get independent travel assistance for JetBlue Airways itineraries, including booking, changes, family travel, international trips, and last-minute planning.",
  },
  "/alaska-airlines": {
    title: "Alaska Airlines Flight Booking & Reservation Assistance | TicketDepart",
    description: "Get independent help with Alaska Airlines bookings, family travel, multi-city trips, changes, and cancellations.",
    heading: "Alaska Airlines flight booking and reservation assistance",
    text: "Get independent travel assistance for Alaska Airlines itineraries, including booking, reservation questions, changes, family travel, international trips, and multi-city planning.",
  },
  "/british-airways": {
    title: "British Airways Flight Booking Assistance | TicketDepart",
    description: "Get independent help with British Airways international trips, premium cabins, changes, and multi-city bookings.",
    heading: "British Airways flight booking assistance",
    text: "Get independent travel assistance for British Airways international itineraries, premium cabins, connections, changes, and multi-city planning.",
  },
  "/lufthansa": {
    title: "Lufthansa Flight Booking Assistance | TicketDepart",
    description: "Get independent help with Lufthansa bookings, European routes, premium cabins, changes, and cancellations.",
    heading: "Lufthansa flight booking assistance",
    text: "Get independent travel assistance for Lufthansa itineraries, international connections, premium cabins, changes, and multi-city planning.",
  },
  "/air-canada": {
    title: "Air Canada Flight Booking Assistance | TicketDepart",
    description: "Get independent help with Air Canada bookings, family trips, international routes, and multi-city travel.",
    heading: "Air Canada flight booking assistance",
    text: "Get independent travel assistance for Air Canada itineraries, including Canada, international travel, family trips, changes, and multi-city planning.",
  },
  "/swiss-air": {
    title: "SWISS Flight Booking Assistance | TicketDepart",
    description: "Get independent help with SWISS bookings, European routes, premium cabins, and multi-city travel.",
    heading: "SWISS flight assistance with a travel specialist",
    text: "Get independent travel assistance for SWISS itineraries, international connections, premium cabins, changes, and multi-city planning.",
  },
  "/qatar-airways": {
    title: "Qatar Airways Flight Booking Assistance | TicketDepart",
    description: "Get independent help with Qatar Airways bookings, premium cabins, connections, and multi-city trips.",
    heading: "Qatar Airways flight assistance with a travel specialist",
    text: "Get independent travel assistance for Qatar Airways itineraries, long-haul connections, premium cabins, changes, and multi-city planning.",
  },
  "/emirates": {
    title: "Emirates Flight Booking Assistance | TicketDepart",
    description: "Get independent help with Emirates bookings, premium cabins, connections, changes, and multi-city trips.",
    heading: "Emirates flight assistance with a travel specialist",
    text: "Get independent travel assistance for Emirates itineraries, long-haul connections, premium cabins, changes, and multi-city planning.",
  },
  "/norse-atlantic-airways": {
    title: "Norse Atlantic Airways Flight Booking Assistance | TicketDepart",
    description: "Get independent help with Norse Atlantic Airways bookings, transatlantic routes, connections, and changes.",
    heading: "Norse Atlantic Airways flight assistance with a travel specialist",
    text: "Get independent travel assistance for Norse Atlantic Airways transatlantic itineraries, connections, changes, and multi-city planning.",
  },

  "/flights-usa-to-canada": {
    title: "USA to Canada Flights | Booking Assistance | TicketDepart",
    description: "Get help comparing flights from the USA to Canada by phone, including cities, airports, dates, connections, cabins, baggage, and fare conditions.",
    heading: "USA to Canada flight booking assistance",
    text: "Discuss USA-to-Canada routes, nearby airports, dates, connections, cabins, baggage, and fare conditions with a travel specialist.",
  },
  "/flights-usa-to-uk": {
    title: "USA to UK Flights | Booking Assistance | TicketDepart",
    description: "Plan flights from the USA to the UK. Compare routes, dates, connections, cabins, baggage, and fare conditions.",
    heading: "USA to UK flight booking assistance",
    text: "Discuss USA-to-UK routes, UK arrival airports, schedules, cabins, baggage, and fare conditions with a travel specialist.",
  },
  "/flights-usa-to-europe": {
    title: "USA to Europe Flights | Booking Assistance | TicketDepart",
    description: "Plan flights from the USA to Europe. Compare routes, dates, connections, cabins, baggage, and fare conditions.",
    heading: "USA to Europe flight booking assistance",
    text: "Discuss European destinations, connections, flexible dates, cabins, multi-city routing, baggage, and fare conditions.",
  },
  "/flights-usa-to-mexico": {
    title: "USA to Mexico Flights | Booking Assistance | TicketDepart",
    description: "Plan USA to Mexico flights by phone and discuss destinations, airports, dates, connections, cabins, baggage, and fare conditions.",
    heading: "USA to Mexico flight booking assistance",
    text: "Discuss USA-to-Mexico routes, destinations, nearby airports, family travel, cabins, baggage, and fare conditions.",
  },

  "/flights-from-new-york": {
    title: "Flights from New York | Flight Booking Assistance | TicketDepart",
    description: "Explore flights from New York. Compare nearby airports, international routes, connections, and cabin options.",
    heading: "Flights from New York with booking assistance",
    text: "Discuss New York departure airports, domestic and international routes, connections, flexible dates, cabins, and fare conditions.",
  },
  "/flights-from-los-angeles": {
    title: "Flights from Los Angeles | Flight Booking Assistance | TicketDepart",
    description: "Explore flights from Los Angeles. Compare nearby airports, international routes, connections, and cabin options.",
    heading: "Flights from Los Angeles with booking assistance",
    text: "Discuss Los Angeles departure airports, domestic and international routes, connections, flexible dates, cabins, and fare conditions.",
  },
  "/flights-from-chicago": {
    title: "Flights from Chicago | Flight Booking Assistance | TicketDepart",
    description: "Compare Chicago airports, connections, cabins, and fare terms with TicketDepart. Call +1-888-958-0280.",
    heading: "Flights from Chicago with booking assistance",
    text: "Discuss Chicago departure airports, domestic and international routes, connections, flexible dates, cabins, and fare conditions.",
  },
  "/flights-from-miami": {
    title: "Flights from Miami | Flight Booking Assistance | TicketDepart",
    description: "Explore flights from Miami. Compare nearby airports, international routes, connections, and cabin options.",
    heading: "Flights from Miami with booking assistance",
    text: "Discuss Miami departure airports, domestic and international routes, connections, flexible dates, cabins, and fare conditions.",
  },
  "/flights-from-atlanta": {
    title: "Flights from Atlanta | Flight Booking Assistance | TicketDepart",
    description: "Explore flights from Atlanta. Compare nearby airports, international routes, connections, and cabin options.",
    heading: "Flights from Atlanta with booking assistance",
    text: "Discuss Atlanta departure airports, domestic and international routes, connections, flexible dates, cabins, and fare conditions.",
  },
  "/flights-from-dallas": {
    title: "Flights from Dallas | Flight Booking Assistance | TicketDepart",
    description: "Explore flights from Dallas. Compare nearby airports, international routes, connections, and cabin options.",
    heading: "Flights from Dallas with booking assistance",
    text: "Discuss Dallas departure airports, domestic and international routes, connections, flexible dates, cabins, and fare conditions.",
  },
  "/flights-from-orlando": {
    title: "Flights from Orlando | Flight Booking Assistance | TicketDepart",
    description: "Explore flights from Orlando. Compare nearby airports, international routes, connections, and cabin options.",
    heading: "Flights from Orlando with booking assistance",
    text: "Discuss Orlando departure airports, domestic and international routes, connections, flexible dates, cabins, and fare conditions.",
  },
  "/flights-from-san-francisco": {
    title: "Flights from San Francisco | Flight Booking Assistance | TicketDepart",
    description: "Explore flights from San Francisco. Compare nearby airports, international routes, connections, and cabin options.",
    heading: "Flights from San Francisco with booking assistance",
    text: "Discuss San Francisco departure airports, domestic and international routes, connections, flexible dates, cabins, and fare conditions.",
  },
  "/flights-new-york-to-london": {
    title: "New York to London Flights | Booking Assistance | TicketDepart",
    description: "Explore New York to London flights. Compare departure airports, connections, cabin options, and baggage terms.",
    heading: "New York to London flight booking assistance",
    text: "Discuss New York to London routes, departure airports, schedules, connections, cabins, baggage, and fare conditions.",
  },


  "/flights-los-angeles-to-tokyo": {
    title: "Los Angeles to Tokyo Flights | Booking Assistance | TicketDepart",
    description: "Explore Los Angeles to Tokyo flights. Compare departure airports, connections, cabin options, and baggage terms.",
    heading: "Los Angeles to Tokyo flight booking assistance",
    text: "Discuss Los Angeles to Tokyo routes, departure airports, schedules, connections, cabins, baggage, and fare conditions.",
  },
  "/flights-los-angeles-to-london": {
    title: "Los Angeles to London Flights | Booking Assistance | TicketDepart",
    description: "Explore Los Angeles to London flights. Compare departure airports, connections, cabin options, and baggage terms.",
    heading: "Los Angeles to London flight booking assistance",
    text: "Discuss Los Angeles to London routes, departure airports, schedules, connections, cabins, baggage, and fare conditions.",
  },


  "/flights-san-francisco-to-tokyo": {
    title: "San Francisco to Tokyo Flights | Booking Assistance | TicketDepart",
    description: "Explore San Francisco to Tokyo flights. Compare departure airports, connections, cabin options, and baggage terms.",
    heading: "San Francisco to Tokyo flight booking assistance",
    text: "Discuss San Francisco to Tokyo routes, departure airports, schedules, connections, cabins, baggage, and fare conditions.",
  },

  "/contact": {
    title: "Contact TicketDepart | Speak with a Travel Specialist",
    description: "Contact TicketDepart about your trip. Call +1 888-958-0280 or send your travel details for follow-up.",
    heading: "Talk to a real travel specialist",
    text: "Call +1 888-958-0280 24/7 or send your trip details. TicketDepart is an independent travel agency.",
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

// Keep static crawlable HTML in sync with the canonical public sitemap.
// Existing hand-authored route metadata takes precedence; newly listed USA-to-country
// routes receive route-specific metadata and are emitted by the same hardened pipeline.
const sitemapSource = fs.readFileSync(path.resolve("public/sitemap.xml"), "utf8");
for (const match of sitemapSource.matchAll(/<loc>https:\/\/ticketdepart\.com(\/[^<]*)<\/loc>/g)) {
  const route = match[1] === "/" ? "/" : match[1].replace(/\/+$/, "");
  if (routes[route] || !route.startsWith("/flights-usa-to-")) continue;
  const country = route.slice("/flights-usa-to-".length).split("-")
    .map((word) => word === "usa" ? "USA" : word === "uae" ? "UAE" : word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const label = `USA to ${country} flights`;
  routes[route] = {
    title: `${label} | Flight Booking Assistance | TicketDepart`,
    description: `Discuss flights from the USA to ${country}, travel dates, airports, connections, cabins, baggage, and fare conditions with a travel specialist.`,
    heading: `${label} booking assistance`,
    text: `Discuss USA-to-${country} routes, departure and arrival airports, travel dates, connections, cabin options, baggage, and applicable fare conditions.`,
  };
}

// The sitemap is the single source of truth for indexable public routes.
// Keep the interactive results page available to users, but never emit it as an indexable URL.
const retainedPaths = new Set(
  [...sitemapSource.matchAll(/<loc>https:\/\/ticketdepart\.com(\/[^<]*)<\/loc>/g)]
    .map((match) => match[1] === "/" ? "/" : match[1].replace(/\/+$/, "")),
);
for (const route of Object.keys(routes)) {
  if (!retainedPaths.has(route) && route !== "/flight-search-results") delete routes[route];
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const STATIC_SEO_CONTENT = {
  "/flight-booking": { eyebrow: "Flight booking assistance", sections: [["Domestic and international booking", "Discuss routes, dates, travelers, cabin preferences, nearby airports, connections, baggage, and the fare conditions that apply to the itinerary."],["Booking by phone", "Call when you want to talk through a trip with a real specialist rather than work through every detail alone."],["Complex itineraries", "Ask about multi-city trips, flexible dates, international connections, family travel, or other itineraries that need more planning."]] },
  "/flight-search": { eyebrow: "Flight schedule search", sections: [["Search your route", "Choose a departure city or airport, destination, travel date, trip type, travelers, and cabin preference."],["Review the itinerary", "Compare available flight options, including airline, times, duration, stops, and cabin information returned for the selected route."],["Confirm by phone", "When you are ready to proceed, call a TicketDepart travel specialist to review current booking details and confirm the next step."]] },
  "/book-a-flight-by-phone": { eyebrow: "Phone-first flight booking", sections: [["Start with the basics", "Have your departure city, destination, dates, traveler count, and preferred cabin ready if you know them. You can start with less and work through the rest."],["Talk through practical options", "Discuss nearby airports, connections, schedules, cabin choices, baggage, and fare conditions before deciding."],["Review the terms", "Make sure the applicable price, baggage rules, change conditions, cancellation terms, and any disclosed service charges are understood before payment."]] },
  "/how-to-book-a-flight-by-phone": { eyebrow: "A practical phone-booking checklist", sections: [["Prepare your trip details", "Have departure and arrival cities or airport codes, preferred dates, traveler count, cabin preference, and any timing constraints ready. If dates or airports are flexible, say so before comparing options."],["Compare the full itinerary", "Review departure and arrival times, connection airports and layovers, total journey time, baggage allowance, seat conditions, and whether all segments are on one ticket. Compare the complete trip rather than the base fare alone."],["Confirm terms before payment", "Ask for the total price, taxes and charges, any disclosed agency service fee, ticketing status, change and cancellation rules, refund eligibility, and how confirmation will be delivered. Do not assume phone booking is always cheaper; pricing depends on live availability and the fare rules."],["Know who is handling the booking", "Airport services, airline booking channels, and independent travel agencies are different. Confirm which provider is arranging or issuing the ticket and who to contact for changes. TicketDepart is an independent travel agency and is not an airline's official customer-service department."]] },
  "/international-flight-booking": { eyebrow: "International flight planning", sections: [["Plan the whole itinerary", "Discuss departure airports, destination cities, connections, flexible dates, cabins, baggage, and multi-city or open-jaw routing."],["Long-haul connections", "Review connection airports, layovers, and routing trade-offs that can matter on international trips."],["Travel documents", "Ask questions about the itinerary, but verify current passport, visa, and entry requirements with the relevant government or consulate."]] },
  "/last-minute-flight-booking": { eyebrow: "Urgent flight planning", sections: [["Travel soon", "Discuss currently available itineraries when your departure is close and seats or fares may change quickly."],["Consider practical alternatives", "Nearby airports, flexible dates, or connecting routes can sometimes create additional options."],["Check ticketing timing", "Same-day and last-minute travel can have tighter ticketing and airport deadlines, so review the applicable timing before payment."]] },
  "/business-class-flight-booking": { eyebrow: "Business class flight planning", sections: [["Choose the cabin for the trip", "Compare the business-class options available for your route, including departure times, connection airports, total journey time, and the aircraft or seat details available for the specific flight."],["Check what the fare includes", "Before paying, confirm baggage allowance, seat selection, lounge access if relevant, change and cancellation rules, refund eligibility, and any service charges. Benefits differ by airline, route, aircraft, and fare."],["Plan around meetings and connections", "Allow realistic time between flights and meetings, compare arrival times, and review alternatives if a delay or missed connection would disrupt the trip. Confirm the final itinerary and ticket conditions before authorizing payment."]] },
  "/corporate-flight-booking": { eyebrow: "Corporate and business travel planning", sections: [["Coordinate employee and executive travel", "Start with the travel policy, traveler count, meeting locations, dates, preferred airports, approval steps, and any receipt or billing requirements before comparing itineraries."],["Balance schedule reliability and total cost", "Compare arrival times, connection risk, baggage, ticket flexibility, and the total ticket cost—not just the base fare. Choose around the business schedule and the conditions of the exact ticket."],["Separate corporate coordination from cabin choice", "Corporate travel planning coordinates travelers, schedules, approvals, and records. Business class is a cabin preference within that plan; it does not by itself provide corporate account benefits or negotiated rates."],["Confirm before ticketing", "Verify traveler details, itinerary, payment responsibility, change and cancellation rules, refund eligibility, receipt requirements, and any disclosed agency service fee before authorizing payment. TicketDepart is an independent travel agency, not an airline."]]},
  "/family-flight-booking": { eyebrow: "Family flight planning", sections: [["Prepare each traveler’s details", "Have each passenger’s name and date of birth available, including children and infants, and confirm that names match the required travel documents."],["Review seats, bags, and connections", "Ask what seating and baggage are included on the selected fare, how long each connection is, and whether the itinerary is practical for the family’s ages and needs. Seat assignments and adjacent seats depend on availability and ticket rules."],["Check documents and ticket terms", "For international trips, verify passport and entry requirements with official government sources. Before payment, review the full price, change and cancellation terms, and any applicable service charges."]] },
  "/group-flight-booking": { eyebrow: "Group, family, and event travel", sections: [["Families and larger groups", "Discuss coordinated itineraries for families, sports teams, schools, organizations, events, and other groups."],["Corporate groups", "Work through traveler count, cities, dates, meeting timing, cabin preferences, and itinerary coordination for business travel."],["Seats and booking terms", "Discuss seating, baggage, deposits, name deadlines, ticketing schedules, changes, and other conditions that apply to the specific booking."]] },
  "/airline-reservation-assistance": { eyebrow: "Independent airline reservation assistance", sections: [["Airline-specific planning", "Discuss booking, changes, cancellations, connections, cabins, baggage, and itinerary questions for the airline you are considering."],["Independent service", "TicketDepart is an independent travel agency and is not the official customer service department of any airline named on the site."],["Verify airline requirements", "Airline policies, schedules, availability, and ticket rules can change. Review the applicable terms for your specific itinerary before payment."]] },
  "/flight-change-assistance": { eyebrow: "Flight change assistance", sections: [["Existing reservations", "Have your confirmation or ticket details available when possible so the applicable booking and fare rules can be reviewed."],["Change options", "Discuss date, routing, passenger, or other changes that may be possible under the ticket's rules and current availability."],["Check costs and restrictions", "Change fees, fare differences, deadlines, and eligibility depend on the ticket and provider."]] },
  "/flight-cancellation-assistance": { eyebrow: "Flight cancellation assistance", sections: [["Review the ticket first", "Cancellation options depend on how the ticket was issued, its fare rules, and the applicable provider policies."],["Understand the outcome", "Ask about refund eligibility, credits, deadlines, and any applicable charges before confirming a cancellation."],["Keep the records", "Have your confirmation and traveler details available so the correct reservation can be discussed."]] },
  "/flights-from-new-york": { eyebrow: "New York flight planning", sections: [["Compare departure airports", "Discuss practical options from the New York area and the airport that best fits your itinerary."],["Domestic and international routes", "Plan dates, connections, cabin preferences, baggage, and destination airports with the trip's timing in mind."],["Nearby alternatives", "When practical, consider alternate airports or flexible dates if they improve the available itinerary choices."]] }
};

const RELATED_ROUTE_RULES = {
  "/": [
    "/flight-booking", "/book-a-flight-by-phone", "/flight-search",
    "/international-flight-booking", "/same-day-flight-booking",
    "/business-class-flight-booking",
  ],
  "/same-day-flight-booking": [
    "/flight-booking", "/book-a-flight-by-phone", "/last-minute-flight-booking",
    "/flight-search", "/flight-change-assistance", "/flight-cancellation-assistance",
  ],
  "/book-a-flight-by-phone": [
    "/flight-booking", "/how-to-book-a-flight-by-phone", "/flight-search",
    "/international-flight-booking", "/multi-city-flight-booking", "/same-day-flight-booking",
  ],
  "/flight-booking": [
    "/flight-booking-assistance", "/book-a-flight-by-phone", "/international-flight-booking",
    "/business-class-flight-booking", "/group-flight-booking", "/flight-search",
  ],
  "/flight-booking-assistance": [
    "/flight-booking", "/book-a-flight-by-phone", "/international-flight-booking",
    "/family-flight-booking", "/group-flight-booking", "/business-class-flight-booking",
  ],
  "/international-flight-booking": [
    "/flights-usa-to-canada", "/flights-usa-to-europe", "/flights-usa-to-uk",
    "/flights-usa-to-mexico", "/multi-city-flight-booking", "/business-class-flight-booking",
  ],
  "/business-class-flight-booking": [
    "/corporate-flight-booking", "/international-flight-booking", "/flight-booking",
    "/multi-city-flight-booking", "/flight-change-assistance", "/flight-search",
  ],
  "/group-flight-booking": [
    "/family-flight-booking", "/corporate-flight-booking", "/flight-booking",
    "/book-a-flight-by-phone", "/international-flight-booking",
  ],
  "/family-flight-booking": [
    "/group-flight-booking", "/infant-flight-booking", "/pet-flight-booking",
    "/flight-booking", "/international-flight-booking",
  ],
  "/last-minute-flight-booking": [
    "/same-day-flight-booking", "/flight-booking", "/book-a-flight-by-phone",
    "/flight-search", "/flight-change-assistance",
  ],
  "/flight-change-assistance": [
    "/flight-cancellation-assistance", "/flight-booking", "/book-a-flight-by-phone",
    "/flight-booking-assistance", "/contact",
  ],
  "/flight-cancellation-assistance": [
    "/flight-change-assistance", "/flight-booking", "/book-a-flight-by-phone",
    "/flight-booking-assistance", "/contact",
  ],
  "/airline-reservation-assistance": [
    "/flight-booking", "/book-a-flight-by-phone", "/flight-change-assistance",
    "/flight-cancellation-assistance", "/american-airlines", "/delta-airlines",
  ],
  "/american-airlines": [
    "/airline-reservation-assistance", "/flight-booking", "/book-a-flight-by-phone",
    "/international-flight-booking", "/multi-city-flight-booking",
  ],
  "/delta-airlines": [
    "/airline-reservation-assistance", "/flight-booking", "/book-a-flight-by-phone",
    "/international-flight-booking", "/same-day-flight-booking",
  ],
  "/united-airlines": [
    "/airline-reservation-assistance", "/flight-booking", "/book-a-flight-by-phone",
    "/international-flight-booking", "/multi-city-flight-booking",
  ],
  "/jetblue-airways": [
    "/airline-reservation-assistance", "/flight-booking", "/family-flight-booking",
    "/international-flight-booking", "/same-day-flight-booking",
  ],
  "/alaska-airlines": [
    "/airline-reservation-assistance", "/flight-booking", "/international-flight-booking",
    "/multi-city-flight-booking", "/flight-change-assistance",
  ],
  "/british-airways": [
    "/airline-reservation-assistance", "/international-flight-booking", "/business-class-flight-booking",
    "/flight-booking", "/multi-city-flight-booking",
  ],
  "/lufthansa": [
    "/airline-reservation-assistance", "/international-flight-booking", "/business-class-flight-booking",
    "/flight-booking", "/multi-city-flight-booking",
  ],
  "/swiss-air": [
    "/airline-reservation-assistance", "/international-flight-booking", "/business-class-flight-booking",
    "/flight-booking", "/multi-city-flight-booking",
  ],
  "/qatar-airways": [
    "/airline-reservation-assistance", "/international-flight-booking", "/business-class-flight-booking",
    "/flight-booking", "/multi-city-flight-booking",
  ],
  "/emirates": [
    "/airline-reservation-assistance", "/international-flight-booking", "/business-class-flight-booking",
    "/flight-booking", "/multi-city-flight-booking",
  ],
  "/norse-atlantic-airways": [
    "/airline-reservation-assistance", "/international-flight-booking", "/flights-usa-to-europe",
    "/flight-booking", "/multi-city-flight-booking",
  ],
  "/lot-polish-airlines": [
    "/airline-reservation-assistance", "/international-flight-booking", "/flights-usa-to-europe",
    "/flight-booking", "/multi-city-flight-booking",
  ],
  "/air-canada": [
    "/airline-reservation-assistance", "/flights-usa-to-canada", "/international-flight-booking",
    "/flight-booking", "/multi-city-flight-booking",
  ],
  "/flights-usa-to-canada": [
    "/air-canada", "/international-flight-booking", "/flight-booking",
    "/book-a-flight-by-phone", "/multi-city-flight-booking",
  ],
  "/flights-usa-to-europe": [
    "/international-flight-booking", "/british-airways", "/lufthansa",
    "/swiss-air", "/flight-booking",
  ],
  "/flights-usa-to-uk": [
    "/international-flight-booking", "/british-airways", "/flights-new-york-to-london",
    "/flight-booking", "/book-a-flight-by-phone",
  ],
  "/flights-usa-to-mexico": [
    "/international-flight-booking", "/flights-miami-to-cancun", "/flight-booking",
    "/book-a-flight-by-phone", "/family-flight-booking",
  ],
  "/flights-from-new-york": [
    "/flight-booking", "/book-a-flight-by-phone", "/flights-new-york-to-london",
    "/flights-new-york-to-paris", "/flights-new-york-to-dubai", "/international-flight-booking",
  ],
  "/flights-from-los-angeles": [
    "/flight-booking", "/flights-los-angeles-to-london", "/flights-los-angeles-to-tokyo",
    "/international-flight-booking", "/book-a-flight-by-phone",
  ],
  "/flights-from-chicago": [
    "/flight-booking", "/flights-chicago-to-london", "/international-flight-booking",
    "/book-a-flight-by-phone",
  ],
  "/flights-from-miami": [
    "/flight-booking", "/flights-miami-to-cancun", "/flights-usa-to-mexico",
    "/international-flight-booking",
  ],
  "/flights-from-dallas": [
    "/flight-booking", "/international-flight-booking", "/book-a-flight-by-phone",
    "/flight-search",
  ],
  "/flights-from-orlando": [
    "/flight-booking", "/international-flight-booking", "/book-a-flight-by-phone",
    "/flight-search",
  ],
  "/flights-from-san-francisco": [
    "/flight-booking", "/flights-san-francisco-to-tokyo", "/international-flight-booking",
    "/book-a-flight-by-phone",
  ],
  "/flights-new-york-to-london": [
    "/flights-from-new-york", "/flights-usa-to-uk", "/british-airways",
    "/international-flight-booking", "/flight-booking",
  ],
  "/flights-new-york-to-paris": [
    "/flights-from-new-york", "/flights-usa-to-europe", "/international-flight-booking",
    "/flight-booking",
  ],
  "/flights-new-york-to-dubai": [
    "/flights-from-new-york", "/international-flight-booking", "/emirates",
    "/business-class-flight-booking", "/flight-booking",
  ],
  "/flights-los-angeles-to-tokyo": [
    "/flights-from-los-angeles", "/international-flight-booking", "/flight-booking",
    "/book-a-flight-by-phone",
  ],
  "/flights-los-angeles-to-london": [
    "/flights-from-los-angeles", "/flights-usa-to-uk", "/british-airways",
    "/international-flight-booking", "/flight-booking",
  ],
  "/flights-miami-to-cancun": [
    "/flights-from-miami", "/flights-usa-to-mexico", "/international-flight-booking",
    "/flight-booking",
  ],
  "/flights-chicago-to-london": [
    "/flights-from-chicago", "/flights-usa-to-uk", "/british-airways",
    "/international-flight-booking", "/flight-booking",
  ],
  "/flights-san-francisco-to-tokyo": [
    "/flights-from-san-francisco", "/international-flight-booking", "/flight-booking",
    "/book-a-flight-by-phone",
  ],
};

// Do not create crawlable links to pages excluded from the sitemap. This keeps
// internal-link generation aligned with the same canonical indexed-page list.
for (const route of Object.keys(STATIC_SEO_CONTENT)) {
  if (!retainedPaths.has(route)) delete STATIC_SEO_CONTENT[route];
}
for (const route of Object.keys(RELATED_ROUTE_RULES)) {
  if (!retainedPaths.has(route)) {
    delete RELATED_ROUTE_RULES[route];
    continue;
  }
  RELATED_ROUTE_RULES[route] = RELATED_ROUTE_RULES[route].filter(
    (relatedRoute) => retainedPaths.has(relatedRoute),
  );
}

function routeLabel(route) {
  const meta = routes[route];
  if (meta?.heading) return meta.heading.replace(/\s+by phone$/i, "");
  return route
    .slice(1)
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function semanticExpansion(route, meta) {
  const excluded = new Set(["/terms", "/privacy", "/contact", "/about", "/404"]);
  if (excluded.has(route)) return "";

  // Route-specific editorial guidance adds real planning value beyond swapping
  // city names into a shared paragraph. Keep airport and service claims
  // conditional: availability and schedules must be checked for travel dates.
  const routeGuides = {
    "/flights-from-new-york": {
      title: "Choosing a New York departure airport",
      copy: "New York-area trips may involve JFK, LaGuardia, or Newark, and they are not interchangeable for every itinerary. Compare the full journey from home to the airport, departure time, baggage terms, and the cost and time of ground transport—not just the flight duration. For international journeys, check the exact arrival airport and leave enough time for any onward connection.",
      checklist: "Compare JFK and Newark when reviewing international options; consider LaGuardia mainly where the itinerary and carrier make it practical; confirm the airport code on every segment; and check connection and ground-transfer time before paying."
    },
    "/flights-from-los-angeles": {
      title: "Planning a departure from the Los Angeles area",
      copy: "Los Angeles itineraries can differ significantly depending on departure time, traffic to the airport, and whether a connection is involved. Compare the complete itinerary rather than treating a short connection or a distant airport as automatically better. For long-haul travel, check local arrival time, baggage through-checking, and the plan for reaching your final destination.",
      checklist: "Allow realistic time to reach LAX; compare total travel time and connection length; confirm whether bags are checked through; and check local arrival dates when the itinerary crosses time zones."
    },
    "/flights-from-chicago": {
      title: "Comparing Chicago departure options",
      copy: "When planning from Chicago, confirm whether the itinerary uses O'Hare or Midway and how you will reach that airport. The most convenient departure can depend on the destination, travel time, and available connections on your dates. For international trips, review the connection airport and the time between flights before comparing cabin or baggage options.",
      checklist: "Verify ORD versus MDW; compare ground travel as well as airfare; check connection time and terminal changes where relevant; and confirm the baggage allowance for every carrier on the ticket."
    },
    "/flights-from-miami": {
      title: "Planning from Miami and South Florida",
      copy: "For South Florida departures, compare the full journey from your starting point to the airport, not just the advertised flight time. If considering an alternate airport, include the extra ground travel in your decision. For trips to the Caribbean or Latin America, confirm destination airport, travel-document requirements, baggage terms, and any separate onward transport.",
      checklist: "Confirm MIA or any alternate airport; compare arrival airport with your hotel or onward plans; check passport and entry rules with official authorities; and verify whether baggage is included in the fare."
    },
    "/flights-from-atlanta": {
      title: "Making connections from Atlanta",
      copy: "Atlanta itineraries may be nonstop or connect through another airport depending on destination and date. A lower fare is not always the easiest trip if it creates a tight connection or a long wait. Review the full schedule, connection time, and what happens if a delay affects a later segment.",
      checklist: "Compare nonstop and connecting itineraries where offered; leave a sensible connection buffer; check whether the ticket protects onward segments; and review baggage and change rules before confirming."
    },
    "/flights-from-dallas": {
      title: "Choosing an airport for Dallas-area travel",
      copy: "Dallas-area plans may involve DFW or Dallas Love Field, and the right choice depends on the route and the carriers serving it. Include airport access, arrival location, and any connection in the comparison. If separate tickets are involved, understand that a delay on the first booking may not protect the next flight.",
      checklist: "Confirm DFW versus DAL; compare door-to-door time; avoid assuming separate tickets are protected as one itinerary; and check baggage and change conditions for each booking."
    },
    "/flights-from-orlando": {
      title: "Planning around an Orlando trip",
      copy: "Orlando travel often includes a ground journey after landing, so the arrival airport and time can matter as much as the flight itself. If the trip is tied to a resort, cruise, event, or family schedule, compare arrival times and allow room for delays before committing to onward plans.",
      checklist: "Match the arrival airport to your onward transport; leave a buffer before a cruise or fixed-time event; compare baggage and seat terms for each traveler; and check the ticket's change rules."
    },
    "/flights-from-san-francisco": {
      title: "Choosing a Bay Area departure",
      copy: "Bay Area travelers may compare San Francisco, Oakland, or San Jose depending on the destination and how far they are willing to travel to the airport. For long-haul itineraries, compare the arrival airport, total journey time, and local arrival date. A cheaper flight can be less convenient if ground transport or an overnight connection adds cost.",
      checklist: "Compare SFO, OAK, and SJC only where they serve the itinerary; add ground-transfer time and cost; check the destination airport carefully; and review long-haul connection and baggage details."
    },
    "/flights-new-york-to-london": {
      title: "Compare the whole New York–London journey",
      copy: "For a New York–London trip, compare departure options from JFK and Newark with the London airport shown on the itinerary. A nonstop option, if available for the date, may save connection time, while a connecting itinerary can change the total journey substantially. Check the local arrival time, onward transport, baggage allowance, and whether the ticket includes every segment.",
      checklist: "Confirm the departure and arrival airport codes; compare total travel time rather than flight time alone; check baggage and seat conditions; and verify current UK entry requirements with official government guidance."
    },
    "/flights-chicago-to-london": {
      title: "Plan the Chicago–London crossing",
      copy: "For Chicago to London, start by comparing the departure time from O'Hare, the London arrival airport, and the local arrival time. If an itinerary connects elsewhere, check the time between flights and whether you must change terminals or complete any transit formalities. The best fit depends on the dates, ticket terms, and your onward plans.",
      checklist: "Confirm ORD and the London arrival airport; compare nonstop availability with connecting alternatives for your dates; review baggage and change terms; and check current UK entry and transit rules with official sources."
    },
    "/flights-new-york-to-paris": {
      title: "Match your New York–Paris flight to your plans",
      copy: "When comparing New York and Paris itineraries, verify whether the flight arrives at Charles de Gaulle or Orly and how you will continue into the city or onward to another destination. Arrival time, transport, baggage, and the time needed for a connection can affect the real convenience of the trip.",
      checklist: "Check the Paris airport code; compare arrival time with hotel check-in or onward rail plans; confirm baggage and fare restrictions; and verify current French and Schengen entry requirements through official sources."
    },
    "/flights-new-york-to-dubai": {
      title: "Prepare for a long-haul New York–Dubai itinerary",
      copy: "For a New York–Dubai journey, compare the complete travel time, departure airport, Dubai arrival time, and any connection shown. On a long-haul itinerary, cabin, baggage, seat conditions, and the ability to change dates may matter more than a small difference in the listed journey time. Confirm the airport code and ticket conditions for every segment.",
      checklist: "Review the full journey and connection buffer; check cabin and baggage inclusions; account for the local arrival date; and confirm current UAE entry and transit requirements with official government guidance."
    },
    "/flights-los-angeles-to-tokyo": {
      title: "Check Tokyo airport and arrival-day details",
      copy: "For Los Angeles to Tokyo, check whether the itinerary arrives at Haneda or Narita and how that affects your onward journey. Crossing the Pacific and the International Date Line means the local arrival date can differ from what you expect, so match the flight to hotel reservations, transfers, and any connecting travel.",
      checklist: "Confirm HND versus NRT; check the local arrival date and time; compare nonstop and connecting options available on your dates; and verify Japan entry requirements with official sources."
    },
    "/flights-los-angeles-to-london": {
      title: "Compare the Los Angeles–London itinerary",
      copy: "For Los Angeles to London, compare the departure time, London arrival airport, and total time in transit. A connection can affect rest, baggage handling, and the chance of reaching onward transport on schedule. Review each segment and make sure the fare conditions match the flexibility you need.",
      checklist: "Confirm the London arrival airport; compare total journey time and connection length; review baggage and change conditions; and check current UK entry or transit rules through official sources."
    },
    "/flights-miami-to-cancun": {
      title: "Coordinate the Miami–Cancun flight with onward travel",
      copy: "For Miami to Cancun, consider the arrival time alongside airport transfers, accommodation check-in, and any pre-booked activities. Compare the full itinerary and confirm whether baggage and seat selection are included. If the trip is part of a larger plan, allow a buffer between arrival and any separately booked transfer or event.",
      checklist: "Confirm MIA and CUN; match arrival time to your transfer plans; check passport and entry requirements with official authorities; and review baggage, seat, and ticket-change conditions."
    },
    "/flights-san-francisco-to-tokyo": {
      title: "Plan the San Francisco–Tokyo long-haul trip",
      copy: "For San Francisco to Tokyo, compare the departure time, Tokyo arrival airport, and local arrival date. Haneda and Narita can lead to different onward journeys, so check the airport before arranging hotels or connections. For long-haul travel, review cabin and baggage inclusions along with the rules for changing the ticket.",
      checklist: "Confirm SFO and HND or NRT; check local arrival date and onward transport; compare total journey time and any connection; and verify Japan entry requirements through official sources."
    },
    "/flights-usa-to-canada": {
      title: "Compare the cross-border journey to Canada",
      copy: "For travel from the USA to Canada, compare the destination city and airport, not just the country. A trip to a major hub can be very different from reaching a smaller city that needs another flight or ground transfer. Check connection time, baggage rules, and the documents required for your citizenship and itinerary.",
      checklist: "Confirm the Canadian arrival airport; check whether onward travel is on the same ticket; review baggage and change rules; and verify passport and entry requirements through official Canadian guidance."
    },
    "/flights-usa-to-uk": {
      title: "Choose a UK arrival airport and onward plan",
      copy: "For USA–UK travel, the arrival airport can affect ground transport and onward connections. Compare total travel time, local arrival time, baggage conditions, and whether a connecting flight leaves enough time for the required airport process. Check entry and transit requirements using current official guidance before travel.",
      checklist: "Confirm the UK arrival airport; compare nonstop and connecting itineraries for your dates; review baggage and ticket-change rules; and verify entry requirements through official UK sources."
    },
    "/flights-usa-to-europe": {
      title: "Plan the first arrival and any onward European travel",
      copy: "Europe is a region rather than a single destination, so begin with the city where you actually need to arrive. If the trip includes multiple countries, compare an open-jaw or multi-city itinerary with separate flights and account for airport transfers and time between bookings. Entry and transit rules can depend on your passport and route.",
      checklist: "Choose the actual arrival city; check whether separate tickets require baggage collection or a new check-in; allow enough connection time; and verify current Schengen and destination-specific requirements with official sources."
    },
    "/flights-usa-to-mexico": {
      title: "Match the Mexico arrival airport to your destination",
      copy: "For USA–Mexico travel, choose the arrival city based on where you need to go next. Airport transfers can add significant time to a trip, especially when accommodation or an onward bus or domestic flight is in another area. Compare arrival time, baggage inclusions, and change conditions before choosing an itinerary.",
      checklist: "Confirm the Mexican arrival airport; plan ground transport; check baggage and ticket terms; and verify current entry and passport requirements through official Mexican and US government guidance."
    }
  };

  const guide = routeGuides[route];
  if (guide) {
    return [
      "<section><h2>" + escapeHtml(guide.title) + "</h2><p>" + escapeHtml(guide.copy) + "</p></section>",
      "<section><h2>Before you choose a ticket</h2><p>" + escapeHtml(guide.checklist) + "</p></section>"
    ].join("\n  ");
  }

  // USA-to-country pages are generated from the sitemap, so give each one
  // destination-specific planning guidance instead of a sitewide boilerplate
  // paragraph. The destination label is derived from that page's own heading.
  if (route.startsWith("/flights-usa-to-")) {
    const destination = meta.heading.match(/^USA to (.+?) flights/i)?.[1] ?? "your destination";
    return [
      "<section><h2>Planning a USA-to-" + escapeHtml(destination) + " itinerary</h2><p>Compare U.S. departure airports with arrival gateways in " + escapeHtml(destination) + ", then review travel dates, total journey time, connection points, baggage allowances, cabin options, and fare conditions together. Airport choices and schedules vary by itinerary, so confirm the airport codes and current ticket rules for your exact dates before deciding.</p></section>",
      "<section><h2>Details to confirm before booking</h2><p>Check whether each connection is on one ticket, whether baggage is checked through, and how any date or routing change would be handled under the fare rules. For international travel, verify passport, visa, and entry requirements with the appropriate official authorities. TicketDepart provides independent reservation assistance by phone; it is not an airline's official customer-service department.</p></section>",
    ].join("\n  ");
  }

  // Fill remaining commercial landing pages with route-aware guidance so the
  // static HTML fallback is useful before React hydrates. Avoid applying this to
  // legal/contact pages or the noindex results page.
  const airlineNames = {
    "/delta-airlines": "Delta Airlines",
    "/united-airlines": "United Airlines",
    "/american-airlines": "American Airlines",
    "/southwest-airlines": "Southwest Airlines",
    "/jetblue-airways": "JetBlue",
    "/alaska-airlines": "Alaska Airlines",
    "/british-airways": "British Airways",
    "/lufthansa": "Lufthansa",
    "/air-canada": "Air Canada",
    "/swiss-air": "SWISS",
    "/qatar-airways": "Qatar Airways",
    "/emirates": "Emirates",
    "/norse-atlantic-airways": "Norse Atlantic Airways",
    "/lot-polish-airlines": "LOT Polish Airlines",
  };
  const airline = airlineNames[route];
  if (airline) {
    return [
      "<section><h2>Planning a " + escapeHtml(airline) + " itinerary</h2><p>When comparing " + escapeHtml(airline) + " flights, start with the complete trip: departure and arrival airports, travel dates, connection time, cabin, baggage needs, and the time you need to arrive. The best itinerary depends on your route and dates, so compare available options rather than assuming one schedule or fare applies to every trip. If you are considering an international or multi-city journey, check each flight segment and allow enough time for connections and onward transport.</p></section>",
      "<section><h2>What to confirm before booking</h2><p>Review the total price and any disclosed agency service fee, the baggage allowance, seat-selection terms, ticketing status, and the rules for changes, cancellations, refunds, or credits. These conditions depend on the specific ticket and may differ between fare types or operating carriers. Confirm the passenger names and airport codes before authorizing payment, and keep the itinerary and confirmation details. For current airline-specific operating policies, verify the terms with the airline or the ticket issuer.</p></section>",
      "<section><h2>Independent reservation assistance</h2><p>TicketDepart is an independent travel agency, not " + escapeHtml(airline) + " and not its official customer-service department. A travel specialist can discuss itinerary choices and booking details; availability and final ticket conditions must be confirmed for the selected trip.</p></section>"
    ].join("\n  ");
  }

  const serviceGuides = {
    "/cheap-flight-booking-by-phone": {
      title: "Compare the full cost, not only the displayed fare",
      copy: "When looking for a lower-cost flight, compare nearby travel dates, practical departure airports, stop counts, total journey time, baggage, and seat-selection charges. A fare that appears cheaper may cost more after baggage or ground transport, and a longer connection may not suit every traveler. Prices and availability change, so confirm the current total and the conditions attached to the exact ticket.",
      checklist: "Ask for the total amount before payment; check baggage and seat inclusions; compare alternate dates or airports only when practical; and read the change, cancellation, and refund terms."
    },
    "/same-day-flight-booking": {
      title: "Check timing before choosing a same-day itinerary",
      copy: "Same-day travel depends on current seat availability, ticketing cutoffs, airport procedures, and how quickly you can reach the departure airport. Confirm the exact departure airport and local time, allow for transport and check-in, and do not rely on a schedule or fare until it has been checked for your travel date. Connecting flights can introduce additional timing risks.",
      checklist: "Confirm local departure time and airport code; ask whether ticketing can be completed in time; check connection buffers and baggage rules; and review the full fare conditions before authorizing payment."
    },
    "/pet-flight-booking": {
      title: "Confirm pet acceptance before you book",
      copy: "Pet travel rules can depend on the operating carrier, aircraft, route, destination, pet species and size, carrier dimensions, and whether the animal travels in the cabin or another approved arrangement. Some flights have limited pet capacity or restrictions, and international journeys may require documents or health checks. Never assume a pet is confirmed just because a passenger seat is available.",
      checklist: "Ask the operating carrier about pet availability and carrier dimensions; verify destination and transit requirements with official authorities; confirm fees and documentation deadlines; and obtain clear confirmation before finalizing the trip."
    },
    "/baggage-assistance": {
      title: "Check baggage rules for every flight segment",
      copy: "Baggage allowances may vary by airline, route, cabin, fare family, loyalty status, and operating carrier. A connecting itinerary can include different rules across segments, particularly when separate tickets are involved. Confirm the dimensions and weight limits for carry-on and checked bags, whether special items need approval, and whether fees are charged per bag or per segment.",
      checklist: "Check carry-on size and weight; confirm checked-bag allowance and fees; ask about special or oversized items; and verify whether baggage is checked through to the final destination."
    },
    "/multi-city-flight-booking": {
      title: "Build a multi-city itinerary around the whole trip",
      copy: "For a multi-city or open-jaw trip, list each city pair in travel order and note the dates and times you need to be in each place. Compare a single multi-city ticket with separate bookings only after considering baggage handling, airport transfers, missed-connection protection, and the rules that apply if plans change. Separate tickets can create extra risk when one delay affects a later departure.",
      checklist: "Confirm the order and date of every segment; check airport changes and overnight stops; understand whether segments are on one ticket; and compare total price and change rules across the complete itinerary."
    },
    "/family-flight-booking": {
      title: "Plan seats, passenger details, and connections together",
      copy: "For family travel, check that passenger names and dates of birth match the required documents, and confirm the rules for infants and children on the selected itinerary. Seat assignments, adjacent seats, baggage allowances, and boarding arrangements depend on the fare and availability. A connection that is manageable for one traveler may be difficult with children, strollers, or additional bags.",
      checklist: "Confirm each passenger's details; ask what seating and baggage are included; review connection length and airport changes; and verify passport and entry requirements with official authorities for international travel."
    },
    "/flight-booking-assistance": {
      title: "Choose the right booking support for your itinerary",
      copy: "The amount of help you need depends on the trip. A simple nonstop itinerary may need only a basic schedule and fare comparison, while multi-city travel, tight connections, premium cabins, family travel, or special baggage can require closer review. Keep the itinerary, total price, and ticket conditions together so you can compare the options on equal terms.",
      checklist: "Have your route and dates ready; explain any timing or cabin constraints; compare baggage and connection details; and confirm the booking provider, ticketing status, and change or cancellation conditions before payment."
    }
  };
  const serviceGuide = serviceGuides[route];
  if (serviceGuide) {
    return [
      "<section><h2>" + escapeHtml(serviceGuide.title) + "</h2><p>" + escapeHtml(serviceGuide.copy) + "</p></section>",
      "<section><h2>Practical checklist</h2><p>" + escapeHtml(serviceGuide.checklist) + "</p></section>",
      "<section><h2>Confirm the exact ticket conditions</h2><p>Schedules, inventory, baggage allowances, fees, and ticket rules depend on the selected itinerary and can change. Ask for the total price, any disclosed agency service fee, ticketing status, and the applicable change, cancellation, refund, or credit conditions before authorizing payment. TicketDepart provides independent travel reservation assistance and is not an airline's official customer-service department.</p></section>"
    ].join("\n  ");
  }

  // Use the actual route label to add destination-specific comparison guidance
  // to route pages that do not already have a hand-written editorial guide.
  if (/^\/flights-[a-z-]+-to-[a-z-]+$/.test(route)) {
    const routeName = meta.heading.replace(/\s+flight booking assistance$/i, "").replace(/\s+flights?$/i, "");
    return [
      "<section><h2>Compare the complete " + escapeHtml(routeName) + " journey</h2><p>For this route, compare the departure and arrival airport codes, local departure and arrival times, connection airports, total journey time, cabin options, and baggage conditions. If the itinerary connects through another city, check whether the connection is on one ticket and whether you need to change terminals or collect baggage. Availability and schedules vary by date, so review the itinerary for your intended travel day.</p></section>",
      "<section><h2>Before confirming your route</h2><p>Check the total price, any disclosed agency service fee, ticketing status, baggage allowance, and the rules for changes or cancellation. For international travel, verify current passport, visa, transit, and entry requirements with the relevant official authorities. Compare the arrival airport with your onward transport and accommodation plans, and keep enough time for connections or separately booked travel.</p></section>"
    ].join("\n  ");
  }

  // Keep existing route-specific summaries and editorial guidance without
  // adding near-identical boilerplate to unrelated URLs.
  return "";
}

function trimDescription(value, maxLength) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  // Cut on a word boundary, then remove any dangling conjunction, determiner,
  // preposition, or adjective before punctuation is added by the caller.
  let candidate = normalized.slice(0, maxLength + 1)
    .replace(/\s+\S*$/, "")
    .trim()
    .replace(/[|,:;\-]+$/, "")
    .trim();
  const danglingTail = /\b(?:and|or|with|for|from|to|of|in|on|at|by|the|a|an|as|including|that|which|who|whose|when|where|while|before|after|between|about|your|their|our|its|into|over|under|available|applicable|specific|different|current|complete|full|practical|appropriate|official|independent|international|domestic|flexible|additional|other|any|each|every)$/i;
  while (candidate && danglingTail.test(candidate)) {
    candidate = candidate
      .replace(/\s+\S+$/, "")
      .trim()
      .replace(/[|,:;\-]+$/, "")
      .trim();
  }
  return candidate;
}

function makeListingDescription(value) {
  const normalized = value
    .replace(/(?:\+?1[\s().-]*)?855[\s().-]*544[\s().-]*9001/g, "+1-888-958-0280")
    .replace(/\s+/g, " ")
    .trim();
  const phoneSuffix = " Call +1-888-958-0280.";
  const withoutPhone = normalized
    .replace(/\b(?:call|at)\s*\+?1[\s().-]*888[\s().-]*958[\s().-]*0280/gi, "")
    .replace(/\+?1[\s().-]*888[\s().-]*958[\s().-]*0280/g, "")
    .replace(/\s+([.,;:])/g, "$1")
    .replace(/\.\s*[,;:]/g, ".")
    .replace(/\s+/g, " ")
    .replace(/[.\s]+$/, "");
  // Removing a leading call instruction must not leave a dangling preposition
  // (for example, "to book" or "for U.S. flights") at the start of the snippet.
  const cleanedBase = withoutPhone.replace(/^(?:to|for|at)\s+/i, "").trim();
  const base = trimDescription(cleanedBase, 155 - phoneSuffix.length - 1);
  const capitalizedBase = base ? base[0].toUpperCase() + base.slice(1) : "Flight booking assistance";
  const punctuatedBase = /[.!?]$/.test(capitalizedBase) ? capitalizedBase : `${capitalizedBase}.`;
  return `${punctuatedBase}${phoneSuffix}`;
}

function routeHtml(route, meta) {
  const publicPath = route === "/" ? "/" : `${route.replace(/\/+$/, "")}/`;
  const url = "https://ticketdepart.com" + publicPath;
  const listingDescription = makeListingDescription(meta.description);
  const safeTitle = escapeHtml(meta.title);
  const safeDescription = escapeHtml(listingDescription);
  const safeHeading = escapeHtml(meta.heading);
  const safeText = escapeHtml(meta.text);
  const semanticContent = semanticExpansion(route, meta);

  let html = source
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"[\s\S]*?\/>/i, `<meta name="description" content="${safeDescription}" />`)
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"[\s\S]*?\/>/i, `<meta property="og:title" content="${safeTitle}" />`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"[\s\S]*?\/>/i, `<meta property="og:description" content="${safeDescription}" />`)
    .replace(/<meta\s+name="twitter:description"\s+content="[^"]*"[\s\S]*?\/>/i, `<meta name="twitter:description" content="${safeDescription}" />`)
    .replace(/<meta\s+property="og:url"\s+content="[^"]*"[\s\S]*?\/>/i, `<meta property="og:url" content="${url}" />`)
    .replace(/<link\s+rel="canonical"\s+href="[^"]*"[\s\S]*?\/>/i, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta\s+name="robots"\s+content="[^"]*"\s*\/>/i, `<meta name="robots" content="${meta.indexable === false ? "noindex, nofollow" : "index, follow, max-image-preview:large"}" />`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, "");

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: meta.title,
    description: listingDescription,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: "TicketDepart",
      url: "https://ticketdepart.com/",
    },
    about: {
      "@type": "TravelAgency",
      name: "TicketDepart",
      telephone: "+1-888-958-0280",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://ticketdepart.com/" },
      { "@type": "ListItem", position: 2, name: meta.heading, item: url },
    ],
  };

  html = html.replace(
    "</head>",
    `<script type="application/ld+json">${JSON.stringify(webPageSchema)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
  </head>`,
  );

  // Prefer editorial sections written for this route. If none exist, retain
  // the route-specific heading, summary, call action, and related links rather
  // than padding the page with the same generic sections used across URLs.
  const staticContent = STATIC_SEO_CONTENT[route] ?? {
    eyebrow: meta.heading,
    sections: [],
  };
  const sectionHtml = staticContent.sections
    .map(([heading, text]) => `<section><h2>${escapeHtml(heading)}</h2><p>${escapeHtml(text)}</p></section>`)
    .join("");
  const fallback = `<main><nav aria-label="Breadcrumb"><a href="/">TicketDepart</a> / ${safeHeading}</nav><p><strong>${escapeHtml(staticContent.eyebrow)}</strong></p><h1>${safeHeading}</h1><p>${safeText}</p><p><a href="tel:+18889580280">Call +1 888-958-0280</a> — available 24/7.</p>
  ${sectionHtml}
  ${semanticContent}
  <section><h2>Related flight booking help</h2><ul>
    ${(RELATED_ROUTE_RULES[route] ?? ["/flight-booking", "/book-a-flight-by-phone", "/international-flight-booking", "/contact"])
      .filter((relatedRoute, index, all) => relatedRoute !== route && all.indexOf(relatedRoute) === index && routes[relatedRoute])
      .slice(0, 6)
      .map((relatedRoute) => `<li><a href="${relatedRoute}/">${escapeHtml(routeLabel(relatedRoute))}</a></li>`)
      .join("")}
    <li><a href="/contact/">Contact a travel specialist</a></li>
  </ul></section>
  <p>TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or the official customer service of any airline.</p></main>`;

  return html.replace(/<div id="root"(?:\s+style="visibility:hidden")?><\/div>/i, `<div id="root" style="visibility:hidden">${fallback}</div>`);
}

for (const [route, meta] of Object.entries(routes)) {
  const dir = path.join(distDir, route.slice(1));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), routeHtml(route, meta));
}

console.log(`Generated ${Object.keys(routes).length} crawlable route entry points.`);