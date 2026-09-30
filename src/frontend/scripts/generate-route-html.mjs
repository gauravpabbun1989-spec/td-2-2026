import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const source = fs.readFileSync(path.join(distDir, "index.html"), "utf8");

const routes = {
  "/": {
    title: "Book Flights by Phone | 24/7 Flight Help | TicketDepart",
    description: "Book domestic or international flights by phone with TicketDepart. Discuss routes, dates, cabins, baggage, and fare rules with a travel specialist 24/7.",
    heading: "Book flights by phone with a travel specialist",
    text: "TicketDepart helps travelers work through flight booking questions by phone. You can discuss domestic or international trips, departure and arrival airports, travel dates, cabin preferences, connections, baggage questions, and applicable fare conditions before deciding how to proceed. If your itinerary is straightforward, you can start with the flight options on the site. If the trip involves multiple cities, tight schedules, family or group travel, or a premium cabin, a conversation can help you work through the details in one place. Before calling, it helps to have your preferred travel dates, departure city or airport, destination, number of travelers, and any important timing or cabin requirements ready. For international travel, you may also want to ask about connection points, baggage rules, and the booking conditions that apply to the itinerary you are considering. TicketDepart provides independent flight reservation assistance and is not an airline or an airline’s official customer-service department. Airline schedules, availability, baggage policies, and fare conditions can vary by route and ticket, so specific details should be reviewed before a booking is confirmed. The site also includes focused guides for international flights, business-class travel, group bookings, flight changes, cancellations, and airline-specific reservation assistance. If you are not sure which booking option fits your trip, you can review the booking guides first or contact a travel specialist. The goal is to make the practical details easier to understand before you confirm your travel plans.",
  },
  "/book-a-flight-by-phone": {
    title: "Book a Flight by Phone | 24/7 Flight Booking Help | TicketDepart",
    description: "Book a domestic or international flight by phone with an independent travel agency. Discuss routes, dates, cabins, baggage, and fare rules with a travel specialist 24/7.",
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
  "/corporate-flight-booking": {
    title: "Corporate Flight Booking by Phone | Business Travel | TicketDepart",
    description: "Get corporate and business travel flight booking assistance by phone. Discuss employee travel, executive trips, international itineraries, business-class options, schedules, and booking terms with an independent travel specialist.",
    heading: "Corporate flight booking by phone",
    text: "Discuss employee or executive travel, international business trips, business-class options, multiple travelers, flexible schedules, baggage, and booking terms with a travel specialist.",
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
    title: "Delta Airlines Flight Booking Assistance | 24/7 | TicketDepart",
    description: "Independent travel agency helping you book, change, and rebook Delta Airlines flights — domestic, international, multi-city, and premium cabins. Discuss Delta Airlines reservation assistance by phone 24/7.",
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
    description: "Independent travel agency for American Airlines bookings — domestic, international, multi-city, cabin options, and rebooking help. Discuss booking an American Airlines flight by phone.",
    heading: "American Airlines trips booked with a travel specialist",
    text: "Get independent travel assistance for American Airlines itineraries, including new bookings, changes, rebooking, multi-city trips, and cabin options by phone.",
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
    title: "Alaska Airlines Flight Booking & Reservation Assistance | TicketDepart",
    description: "Independent travel agency assistance for Alaska Airlines flight booking and reservation questions, changes, cancellations, family travel, and multi-city itineraries.",
    heading: "Alaska Airlines flight booking and reservation assistance",
    text: "Get independent travel assistance for Alaska Airlines itineraries, including booking, reservation questions, changes, family travel, international trips, and multi-city planning.",
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

  "/flights-from-new-york": {
    title: "Flights from New York | Flight Booking Assistance | TicketDepart",
    description: "Discuss flights from New York, nearby airports, international routes, connections, cabins, and fare conditions with a travel specialist.",
    heading: "Flights from New York with booking assistance",
    text: "Discuss New York departure airports, domestic and international routes, connections, flexible dates, cabins, and fare conditions.",
  },
  "/flights-from-los-angeles": {
    title: "Flights from Los Angeles | Flight Booking Assistance | TicketDepart",
    description: "Discuss flights from Los Angeles, nearby airports, international routes, connections, cabins, and fare conditions with a travel specialist.",
    heading: "Flights from Los Angeles with booking assistance",
    text: "Discuss Los Angeles departure airports, domestic and international routes, connections, flexible dates, cabins, and fare conditions.",
  },
  "/flights-from-chicago": {
    title: "Flights from Chicago | Flight Booking Assistance | TicketDepart",
    description: "Discuss flights from Chicago, nearby airports, international routes, connections, cabins, and fare conditions with a travel specialist.",
    heading: "Flights from Chicago with booking assistance",
    text: "Discuss Chicago departure airports, domestic and international routes, connections, flexible dates, cabins, and fare conditions.",
  },
  "/flights-from-miami": {
    title: "Flights from Miami | Flight Booking Assistance | TicketDepart",
    description: "Discuss flights from Miami, nearby airports, international routes, connections, cabins, and fare conditions with a travel specialist.",
    heading: "Flights from Miami with booking assistance",
    text: "Discuss Miami departure airports, domestic and international routes, connections, flexible dates, cabins, and fare conditions.",
  },
  "/flights-from-atlanta": {
    title: "Flights from Atlanta | Flight Booking Assistance | TicketDepart",
    description: "Discuss flights from Atlanta, nearby airports, international routes, connections, cabins, and fare conditions with a travel specialist.",
    heading: "Flights from Atlanta with booking assistance",
    text: "Discuss Atlanta departure airports, domestic and international routes, connections, flexible dates, cabins, and fare conditions.",
  },
  "/flights-from-dallas": {
    title: "Flights from Dallas | Flight Booking Assistance | TicketDepart",
    description: "Discuss flights from Dallas, nearby airports, international routes, connections, cabins, and fare conditions with a travel specialist.",
    heading: "Flights from Dallas with booking assistance",
    text: "Discuss Dallas departure airports, domestic and international routes, connections, flexible dates, cabins, and fare conditions.",
  },
  "/flights-from-orlando": {
    title: "Flights from Orlando | Flight Booking Assistance | TicketDepart",
    description: "Discuss flights from Orlando, nearby airports, international routes, connections, cabins, and fare conditions with a travel specialist.",
    heading: "Flights from Orlando with booking assistance",
    text: "Discuss Orlando departure airports, domestic and international routes, connections, flexible dates, cabins, and fare conditions.",
  },
  "/flights-from-san-francisco": {
    title: "Flights from San Francisco | Flight Booking Assistance | TicketDepart",
    description: "Discuss flights from San Francisco, nearby airports, international routes, connections, cabins, and fare conditions with a travel specialist.",
    heading: "Flights from San Francisco with booking assistance",
    text: "Discuss San Francisco departure airports, domestic and international routes, connections, flexible dates, cabins, and fare conditions.",
  },
  "/flights-new-york-to-london": {
    title: "New York to London Flights | Booking Assistance | TicketDepart",
    description: "Discuss New York to London flights, departure airports, connections, cabins, dates, baggage, and fare conditions with a travel specialist.",
    heading: "New York to London flight booking assistance",
    text: "Discuss New York to London routes, departure airports, schedules, connections, cabins, baggage, and fare conditions.",
  },
  "/flights-new-york-to-paris": {
    title: "New York to Paris Flights | Booking Assistance | TicketDepart",
    description: "Discuss New York to Paris flights, departure airports, connections, cabins, dates, baggage, and fare conditions with a travel specialist.",
    heading: "New York to Paris flight booking assistance",
    text: "Discuss New York to Paris routes, departure airports, schedules, connections, cabins, baggage, and fare conditions.",
  },
  "/flights-new-york-to-dubai": {
    title: "New York to Dubai Flights | Booking Assistance | TicketDepart",
    description: "Discuss New York to Dubai flights, departure airports, connections, cabins, dates, baggage, and fare conditions with a travel specialist.",
    heading: "New York to Dubai flight booking assistance",
    text: "Discuss New York to Dubai routes, departure airports, schedules, connections, cabins, baggage, and fare conditions.",
  },
  "/flights-los-angeles-to-tokyo": {
    title: "Los Angeles to Tokyo Flights | Booking Assistance | TicketDepart",
    description: "Discuss Los Angeles to Tokyo flights, departure airports, connections, cabins, dates, baggage, and fare conditions with a travel specialist.",
    heading: "Los Angeles to Tokyo flight booking assistance",
    text: "Discuss Los Angeles to Tokyo routes, departure airports, schedules, connections, cabins, baggage, and fare conditions.",
  },
  "/flights-los-angeles-to-london": {
    title: "Los Angeles to London Flights | Booking Assistance | TicketDepart",
    description: "Discuss Los Angeles to London flights, departure airports, connections, cabins, dates, baggage, and fare conditions with a travel specialist.",
    heading: "Los Angeles to London flight booking assistance",
    text: "Discuss Los Angeles to London routes, departure airports, schedules, connections, cabins, baggage, and fare conditions.",
  },
  "/flights-miami-to-cancun": {
    title: "Miami to Cancun Flights | Booking Assistance | TicketDepart",
    description: "Discuss Miami to Cancun flights, departure airports, connections, cabins, dates, baggage, and fare conditions with a travel specialist.",
    heading: "Miami to Cancun flight booking assistance",
    text: "Discuss Miami to Cancun routes, departure airports, schedules, connections, cabins, baggage, and fare conditions.",
  },
  "/flights-chicago-to-london": {
    title: "Chicago to London Flights | Booking Assistance | TicketDepart",
    description: "Discuss Chicago to London flights, departure airports, connections, cabins, dates, baggage, and fare conditions with a travel specialist.",
    heading: "Chicago to London flight booking assistance",
    text: "Discuss Chicago to London routes, departure airports, schedules, connections, cabins, baggage, and fare conditions.",
  },
  "/flights-san-francisco-to-tokyo": {
    title: "San Francisco to Tokyo Flights | Booking Assistance | TicketDepart",
    description: "Discuss San Francisco to Tokyo flights, departure airports, connections, cabins, dates, baggage, and fare conditions with a travel specialist.",
    heading: "San Francisco to Tokyo flight booking assistance",
    text: "Discuss San Francisco to Tokyo routes, departure airports, schedules, connections, cabins, baggage, and fare conditions.",
  },

  "/contact": {
    title: "Contact TicketDepart | Speak with a Travel Specialist",
    description: "Contact TicketDepart to plan your next flight. Call +1 888-958-0280 any time, or send your trip details and a travel specialist will follow up with options.",
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
  "/book-a-flight-by-phone": { eyebrow: "Phone-first flight booking", sections: [["Start with the basics", "Have your departure city, destination, dates, traveler count, and preferred cabin ready if you know them. You can start with less and work through the rest."],["Talk through practical options", "Discuss nearby airports, connections, schedules, cabin choices, baggage, and fare conditions before deciding."],["Review the terms", "Make sure the applicable price, baggage rules, change conditions, cancellation terms, and any disclosed service charges are understood before payment."]] },
  "/international-flight-booking": { eyebrow: "International flight planning", sections: [["Plan the whole itinerary", "Discuss departure airports, destination cities, connections, flexible dates, cabins, baggage, and multi-city or open-jaw routing."],["Long-haul connections", "Review connection airports, layovers, and routing trade-offs that can matter on international trips."],["Travel documents", "Ask questions about the itinerary, but verify current passport, visa, and entry requirements with the relevant government or consulate."]] },
  "/last-minute-flight-booking": { eyebrow: "Urgent flight planning", sections: [["Travel soon", "Discuss currently available itineraries when your departure is close and seats or fares may change quickly."],["Consider practical alternatives", "Nearby airports, flexible dates, or connecting routes can sometimes create additional options."],["Check ticketing timing", "Same-day and last-minute travel can have tighter ticketing and airport deadlines, so review the applicable timing before payment."]] },
  "/business-class-flight-booking": { eyebrow: "Business class and corporate travel", sections: [["Business travel planning", "Discuss meeting dates, preferred airports, traveler count, schedule priorities, and business-class cabin options."],["Aircraft and connections", "When information is available, compare aircraft, seat configuration, connection airports, layovers, and practical routing."],["Fare and baggage rules", "Review the baggage allowance, change and cancellation conditions, and other rules attached to the selected fare."]] },
  "/group-flight-booking": { eyebrow: "Group, family, and event travel", sections: [["Families and larger groups", "Discuss coordinated itineraries for families, sports teams, schools, organizations, events, and other groups."],["Corporate groups", "Work through traveler count, cities, dates, meeting timing, cabin preferences, and itinerary coordination for business travel."],["Seats and booking terms", "Discuss seating, baggage, deposits, name deadlines, ticketing schedules, changes, and other conditions that apply to the specific booking."]] },
  "/airline-reservation-assistance": { eyebrow: "Independent airline reservation assistance", sections: [["Airline-specific planning", "Discuss booking, changes, cancellations, connections, cabins, baggage, and itinerary questions for the airline you are considering."],["Independent service", "TicketDepart is an independent travel agency and is not the official customer service department of any airline named on the site."],["Verify airline requirements", "Airline policies, schedules, availability, and ticket rules can change. Review the applicable terms for your specific itinerary before payment."]] },
  "/flight-change-assistance": { eyebrow: "Flight change assistance", sections: [["Existing reservations", "Have your confirmation or ticket details available when possible so the applicable booking and fare rules can be reviewed."],["Change options", "Discuss date, routing, passenger, or other changes that may be possible under the ticket's rules and current availability."],["Check costs and restrictions", "Change fees, fare differences, deadlines, and eligibility depend on the ticket and provider."]] },
  "/flight-cancellation-assistance": { eyebrow: "Flight cancellation assistance", sections: [["Review the ticket first", "Cancellation options depend on how the ticket was issued, its fare rules, and the applicable provider policies."],["Understand the outcome", "Ask about refund eligibility, credits, deadlines, and any applicable charges before confirming a cancellation."],["Keep the records", "Have your confirmation and traveler details available so the correct reservation can be discussed."]] },
  "/flights-from-new-york": { eyebrow: "New York flight planning", sections: [["Compare departure airports", "Discuss practical options from the New York area and the airport that best fits your itinerary."],["Domestic and international routes", "Plan dates, connections, cabin preferences, baggage, and destination airports with the trip's timing in mind."],["Nearby alternatives", "When practical, consider alternate airports or flexible dates if they improve the available itinerary choices."]] }
};

function routeHtml(route, meta) {
  const publicPath = route === "/" ? "/" : `${route.replace(/\/+$/, "")}/`;
  const url = `https://ticketdepart.com${publicPath}`;
  const safeTitle = escapeHtml(meta.title);
  const safeDescription = escapeHtml(meta.description);
  const safeHeading = escapeHtml(meta.heading);
  const safeText = escapeHtml(meta.text);

  let html = source
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"[\s\S]*?\/>/i, `<meta name="description" content="${safeDescription}" />`)
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"[\s\S]*?\/>/i, `<meta property="og:title" content="${safeTitle}" />`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"[\s\S]*?\/>/i, `<meta property="og:description" content="${safeDescription}" />`)
    .replace(/<meta\s+property="og:url"\s+content="[^"]*"[\s\S]*?\/>/i, `<meta property="og:url" content="${url}" />`)
    .replace(/<link\s+rel="canonical"\s+href="[^"]*"[\s\S]*?\/>/i, `<link rel="canonical" href="${url}" />`)
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
    `<script type="application/ld+json">${JSON.stringify(schema)}</script>
  </head>`,
  );

  const staticContent = STATIC_SEO_CONTENT[route] ?? {
    eyebrow: meta.heading,
    sections: [
      ["Plan your trip", "Discuss your route, dates, travelers, cabin preferences, nearby airports, connections, baggage, and the booking terms that apply."],
      ["Talk with a specialist", "Call when you want help working through an itinerary or when the trip has details that are easier to explain by phone."],
      ["Review the details", "Availability, pricing, ticketing deadlines, baggage, changes, and cancellations depend on the specific itinerary and provider."]
    ]
  };
  const sectionHtml = staticContent.sections
    .map(([heading, text]) => `<section><h2>${escapeHtml(heading)}</h2><p>${escapeHtml(text)}</p></section>`)
    .join("");
  const fallback = `<main><nav aria-label="Breadcrumb"><a href="/">TicketDepart</a> / ${safeHeading}</nav><p><strong>${escapeHtml(staticContent.eyebrow)}</strong></p><h1>${safeHeading}</h1><p>${safeText}</p><p><a href="tel:+18889580280">Call +1 888-958-0280</a> — available 24/7.</p>
  ${sectionHtml}
  <section><h2>Related flight booking help</h2><ul>
    <li><a href="/flight-booking/">Flight booking assistance</a></li>
    <li><a href="/book-a-flight-by-phone/">Book a flight by phone</a></li>
    <li><a href="/international-flight-booking/">International flight booking</a></li>
    <li><a href="/business-class-flight-booking/">Business class flight booking</a></li>
    <li><a href="/group-flight-booking/">Group flight booking</a></li>
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
