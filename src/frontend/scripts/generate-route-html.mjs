import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");
const phoneConfig = JSON.parse(
  fs.readFileSync(path.join(repoRoot, "config/phone-number.json"), "utf8"),
);
const PHONE_DISPLAY = phoneConfig.display;
const PHONE_HREF = `tel:${phoneConfig.tel}`;

const RETIRED_PHONE_PATTERNS = phoneConfig.legacy.map((phone) => {
  const digits = phone.replace(/\D/g, "");
  const national = digits.startsWith("1") ? digits.slice(1) : digits;
  const countryPrefix = digits.startsWith("1")
    ? String.raw`(?:\+?1[\s().-]*)?`
    : "";
  const formattedNational = national.split("").join(String.raw`[\s().-]*`);
  return new RegExp(
    String.raw`(?<!\d)${countryPrefix}${formattedNational}(?!\d)`,
    "gi",
  );
});

const distDir = path.resolve("dist");
const source = fs.readFileSync(path.join(distDir, "index.html"), "utf8");

const routes = {
  "/": {
    title: "Make Flight Booking Easy | 24/7 Booking Assistance",
    description: "Call +1-833-225-0511 for 24/7 economy-first flight booking help with TicketDepart. Compare routes, dates, baggage, and fare rules.",
    heading: "Need a Flight? Call Now to Get Started.",
    text: "TicketDepart helps travelers departing from the United States and Canada discuss affordable economy flights to destinations worldwide. Call +1-833-225-0511 for 24/7 help with routes, travel dates, nearby airports, nonstop and connecting itineraries, baggage costs, and fare questions. Compare the full trip cost, including taxes, checked bags, seat fees, connection time, and airport transfers. Have your departure city, destination, travel dates, and traveler count ready; cabin class is optional. Before deciding, review the complete itinerary, total price, baggage allowance, connection details, and the fare rules for changes or cancellations. Our travel specialists can help you compare available options and understand any disclosed agency service fee before you authorize payment. Explore our guides to affordable flights, international flight booking, last-minute travel planning, booking by phone, flight changes, cancellations, refunds, and rebooking.",
  },
  "/flight-search": {
    title: "Search Flights | Flight Schedule Search | TicketDepart",
    description: "Search flights from the USA and Canada to destinations worldwide. Compare dates, stops, baggage, and fare rules with TicketDepart.",
    heading: "Search flight options",
    text: "Search flight schedules from U.S. and Canadian departure cities to destinations worldwide by route and date, then compare practical economy itinerary options. Check the departure and arrival airports, local departure and arrival times, number of stops, total journey duration, and whether a connection requires changing airports. Compare travel dates when your plans allow flexibility, and review baggage allowance, seat-selection costs, taxes, and other charges rather than relying on a headline fare alone. Flight schedules and fares can change as inventory updates; a search result is not a confirmed reservation. When you find an itinerary worth considering, call TicketDepart to discuss the route, travel dates, fare conditions, ticketing process, and any disclosed agency service fee before authorizing payment.",
  },
  "/admin/leads": {
    title: "Lead Dashboard | TicketDepart",
    description: "Private TicketDepart lead dashboard for authorized administrators.",
    heading: "Lead Dashboard",
    text: "This page is for authorized TicketDepart administrators. Sign in to review lead records.",
    indexable: false,
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
    description: "Affordable domestic and international economy options, flexible dates, nearby airports, baggage, and fare rules.",
    heading: "Book an Affordable Flight by Phone",
    text: "TicketDepart helps travelers discuss available economy flight options for domestic and international trips. Compare flexible dates, nearby airports, nonstop and connecting itineraries, baggage costs, and the full trip price before deciding. Have your departure city, destination, travel dates, and traveler count ready if possible. Confirm baggage allowance, connection details, change and cancellation terms, ticketing status, and any disclosed agency service fee before authorizing payment. TicketDepart is an independent travel agency, not an airline.",
  },
  "/how-to-book-a-flight-by-phone": {
    title: "How to Book a Flight by Phone | TicketDepart",
    description: "Learn how to book a flight by phone, compare affordable economy itineraries, and review baggage, fare, and change terms before paying.",
    heading: "How to Book a Flight by Phone",
    text: "To book a flight by phone, prepare your departure city, destination, preferred dates, and number of travelers; choosing a cabin class is optional. Compare the full itinerary, including nonstop or connecting flights, baggage, total travel time, and fare rules. Before paying, confirm the total price, taxes, any disclosed agency service fee, ticketing status, flight change and cancellation terms, refund eligibility, and who will issue and service the ticket. Travelers departing from the USA and Canada can ask about domestic or international routes, flexible dates, and affordable economy options. Phone booking is not automatically cheaper, so compare the full price and terms before deciding."
  },
  "/international-flight-booking": {
    title: "International Flight Booking Assistance | TicketDepart",
    description: "Compare international flights from the USA and Canada to worldwide destinations, including routes, connections, dates, baggage, and fare conditions.",
    heading: "International flight booking assistance by phone",
    text: "Looking for international flights from the USA or Canada? Compare routes to destinations worldwide, including Mexico, the Caribbean, Europe, the United Kingdom, Asia, Africa, and beyond. Start with your origin, destination, travel window, and number of travelers, then compare departure airports, flexible dates, nonstop versus connecting flights, baggage allowances, layover length, total journey time, and the complete fare. For affordable economy options, compare the full price after taxes, baggage, seat-selection charges, and ground transport—not just the advertised base fare. Nearby airports or shifting departure and return dates may reveal alternatives, but savings and availability are never guaranteed. For connecting itineraries, check whether a connection is protected, whether baggage is checked through, and whether a terminal or airport change is required. Confirm passport, visa, transit, and entry requirements with the relevant official authorities before booking. A specialist can help you review the route, ticketing status, baggage terms, and change or cancellation conditions before you authorize payment."
  },
  "/last-minute-flight-booking": {
    title: "Last-Minute Flight Booking Assistance | TicketDepart",
    description: "Need a last-minute flight? Compare available routes, flexible dates, stops, baggage, and total fares with TicketDepart before confirming.",
    heading: "Last-minute flight booking help when time matters",
    text: "Need last-minute flights or a flight departing soon? Compare available departures from U.S. and Canadian airports, nearby airports, alternate dates, nonstop and connecting itineraries, baggage costs, and the total fare. If your schedule is flexible, check nearby departure times and airports you can realistically reach, while accounting for ground transport and arrival time. For same-day or urgent international flights, check ticketing cutoffs, passport and transit requirements, minimum connection times, and whether a connection is practical. Ask when the ticket will be issued and how long the quoted fare can be held, if a hold is available. Availability and prices can change quickly, and a search does not guarantee a seat. Before paying, confirm the complete itinerary, baggage allowance, total charges, any disclosed agency service fee, and change or cancellation conditions."
  },
  "/multi-city-flight-booking": {
    title: "Multi-City Flight Booking Assistance | TicketDepart",
    description: "Plan a multi-city or open-jaw flight itinerary by phone. Discuss multiple stops, connections, flexible dates, cabins, and fare rules.",
    heading: "Multi-city flight booking for complex itineraries",
    text: "Planning a trip with several stops or different arrival and return cities? List each city, preferred travel date, and the order you want to visit destinations before comparing routes. Check whether each segment is on one ticket or separate tickets, how long each connection lasts, whether you must collect and recheck baggage, and whether an airport change is required. Compare the complete itinerary cost, not just the first flight, and leave realistic time for ground transport and delays between separately ticketed segments. Fare rules, change fees, missed-connection protections, and baggage terms can differ by carrier and segment. Before paying, confirm every flight number, airport, local departure time, traveler name, baggage allowance, ticketing status, and any disclosed agency service fee.",
  },
  "/group-flight-booking": {
    indexable: false,
    title: "Group Flight Booking Assistance | TicketDepart",
    description: "Plan group flight travel by phone with help reviewing traveler details, routing, cabin options, baggage, and applicable booking terms.",
    heading: "Group flight booking assistance",
    text: "Discuss group traveler details, routing, cabin preferences, baggage needs, and applicable booking conditions.",
  },
  "/cheap-flight-booking-by-phone": {
    title: "Cheap Economy Flights by Phone | TicketDepart",
    description: "Compare cheap economy flights from the USA and Canada. Review flexible dates, nearby airports, baggage costs, and fare rules.",
    heading: "Cheap flight booking assistance by phone",
    text: "Searching for cheap economy flights from the USA or Canada? Compare departure dates, nearby airports, one-stop and nonstop routes, layover times, baggage fees, seat-selection costs, and total trip cost. Flexible dates can broaden the available options, but no fare or saving is guaranteed. TicketDepart can discuss affordable economy flight booking by phone for domestic and international routes from U.S. and Canadian cities. Confirm the final fare, ticketing status, baggage allowance, change and cancellation terms, and any disclosed service fee before authorizing payment."
  },
  "/corporate-flight-booking": {
    indexable: false,
    title: "Corporate Flight Booking by Phone | Business Travel | TicketDepart",
    description: "Coordinate employee and executive flight planning by phone. Review travel policy, dates, connections, and ticket terms. Call +1-833-225-0511.",
    heading: "Corporate flight booking by phone",
    text: "Coordinate employee and executive trips by reviewing travel policy requirements, traveler count, meeting times, departure airports, routing, approval steps, receipt requirements, and billing needs. Compare schedule reliability, connection risk, baggage, flexibility, and total ticket cost across available itineraries. Business class is a cabin preference within a trip plan, not the same as coordinating company travel. Confirm any disclosed service fees and fare conditions before authorizing payment. TicketDepart is an independent travel agency; this page does not promise negotiated corporate rates or an existing company account.",
  },
  "/business-class-flight-booking": {
    indexable: false,
    title: "Business Class Flight Booking by Phone | TicketDepart",
    description: "Discuss business-class flights from U.S. airports, cabin options, connections, baggage, flexible dates, and fare rules with an independent travel specialist.",
    heading: "Business class flight booking by phone",
    text: "Plan business trips and premium-cabin itineraries by comparing departure airports, schedules, connections, total journey time, baggage, flexible dates, and fare conditions. Confirm what the fare includes, any applicable service fees, change and cancellation terms, and refund eligibility before payment. TicketDepart is an independent travel agency, not an airline.",
  },
  "/same-day-flight-booking": {
    title: "Same-Day Flight Booking Assistance | TicketDepart",
    description: "Need to travel today? Discuss same-day flight options, departure airports, connections, ticketing deadlines, and fare conditions by phone.",
    heading: "Same-day flight booking assistance",
    text: "If you need to fly today, start with your departure airport, destination, the latest time you can leave, and whether nearby airports are practical. Compare currently available departures, nonstop and connecting options, total journey time, baggage costs, and the complete fare. Check airport travel time, check-in deadlines, minimum connection times, terminal changes, and whether the itinerary is on one ticket. For international trips, confirm passport, visa, transit, and entry requirements with official authorities. Same-day availability and prices can change quickly, and a search does not reserve a seat. Before authorizing payment, ask when the ticket will be issued, confirm the complete itinerary and fare restrictions, and review any disclosed service fee and change or cancellation terms.",
  },
  "/family-flight-booking": {
    title: "Family Flight Booking Assistance | TicketDepart",
    description: "Plan family flights by phone and discuss traveler details, seats, baggage, routing, dates, and applicable booking terms.",
    heading: "Family flight booking assistance",
    text: "When planning a family flight, compare travel dates, total journey time, connections, baggage allowances, and the full fare for every traveler. Make sure names and dates of birth match required travel documents, and ask about the airline rules for infants, children, strollers, car seats, and unaccompanied minors when relevant. Seat assignments and adjacent seats depend on the airline, fare, aircraft, and availability, so confirm what is included and what may cost extra. For connecting itineraries, consider the time needed to move through the airport with children and bags, and check whether baggage is checked through. Before paying, verify each passenger’s details, the complete itinerary, total price, ticketing status, and change or cancellation conditions.",
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
    description: "Need to change a flight? Review date options, fare differences, ticket restrictions, and airline flight-change rules with TicketDepart.",
    heading: "Flight change assistance by phone",
    text: "Need to change a flight or change a plane ticket? Review available new dates, departure times, airports, routes, and connections, along with airline change fees, fare differences, ticket restrictions, and deadlines. Some fares may allow changes without an airline change fee, but a fare difference or other charge can still apply. Before changing the ticket, check whether the original fare is refundable, whether any segment has already been used, and whether the airline or ticket issuer must process the request. For international flights booked from the USA or Canada, rules depend on the airline, ticket type, seller, and whether travel has started. Compare the revised itinerary with the original schedule and confirm the new total cost, any service fee, and ticketing timeline before authorizing a flight change or rebooking. Do not assume a change request is complete until the revised ticket or confirmation is issued."
  },
  "/flight-cancellation-assistance": {
    title: "Flight Cancellation Assistance by Phone | TicketDepart",
    description: "Need to cancel a flight? Review cancellation rules, refund eligibility, credits, deadlines, and ticket conditions with TicketDepart.",
    heading: "Flight cancellation assistance by phone",
    text: "Need to cancel a flight, request a flight ticket refund, or rebook after cancelling? Review the ticket’s cancellation deadline, refund eligibility, refundable versus nonrefundable terms, possible airline credit or voucher, and the effect on remaining segments. Refunds depend on fare rules, airline policy, applicable regulations, and who issued the ticket; cancellation does not automatically mean a cash refund. If your trip has multiple legs, ask how cancelling one segment could affect the rest of the itinerary. If you still need to travel, compare replacement flights and rebooking costs before confirming a cancellation. Ask who will submit the request, what fees may apply, how any eligible refund or credit will be processed, and what confirmation to expect. Check the exact ticket conditions and total charges before proceeding, and keep the cancellation or refund reference for your records."
  },
  "/airline-reservation-assistance": {
    title: "Airline Reservation Assistance by Phone | TicketDepart",
    description: "Get help with airline bookings, changes, cancellations, connections and baggage. Discuss ticket terms with TicketDepart at +1-833-225-0511, 24/7.",
    heading: "Airline reservation assistance by phone",
    text: "For a new trip or an existing ticket, have the airline, route, travel dates, and booking reference available if you have them. A specialist can discuss the ticket terms and possible next steps for changes, cancellations, connections, and baggage questions. Eligibility, fees, refunds, and credits depend on the ticket conditions and responsible airline or travel provider. TicketDepart is an independent travel agency and is not an airline’s official customer-service department.",
  },

  "/flight-booking": {
    title: "Flight Booking Assistance by Phone | TicketDepart",
    description: "Get economy-first U.S. and international flight booking help. Compare dates, routes, baggage, and fare rules 24/7.",
    heading: "Flight booking assistance by phone for U.S. travelers",
    text: "Need flight booking assistance for a trip from the United States or Canada? Compare domestic and international flights to destinations worldwide by departure city, arrival airport, travel dates, number of travelers, connections, baggage, and total fare. If you are looking for cheap flights, consider flexible dates and nearby airports while checking the complete ticket conditions. Cabin class is optional, and you can discuss the preferences that matter for your trip. For an existing booking, ask about changing a flight, cancelling a ticket, refund eligibility, travel credits, or rebooking. TicketDepart is an independent travel agency, not an airline or an airline’s official customer-service department. Review the final price, any disclosed service fee, ticketing status, and fare rules before authorizing payment."
  },
  "/flight-booking-assistance": {
    title: "Flight Booking Assistance by Phone | TicketDepart",
    description: "Get economy-first U.S. and international flight booking help. Compare dates, routes, baggage, and fare rules 24/7.",
    heading: "Flight booking assistance by phone for U.S. travelers",
    text: "Plan a domestic or international economy trip by reviewing departure and arrival airports, dates, traveler count, connections, baggage, and fare conditions. For multi-city routes or optional premium cabins, discuss the details with a travel specialist before you decide. TicketDepart is an independent travel agency, not an airline or an airline’s official customer-service department. Review the applicable price and ticket terms before authorizing payment.",
    canonicalPath: "/flight-booking/",
  },
  "/delta-airlines": {
    title: "Delta Airlines Flight Booking Assistance | 24/7 | TicketDepart",
    description: "Discuss Delta Airlines flight bookings, changes, rebooking, multi-city trips, and premium cabins.",
    heading: "Delta Airlines flight bookings handled by a real travel specialist",
    text: "Get independent travel assistance for Delta Airlines itineraries, including new bookings, changes, rebooking, multi-city trips, premium cabins, and 24/7 reservation assistance.",
  },
  "/united-airlines": {
    title: "United Airlines Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency for United Airlines bookings — domestic, international, multi-city, premium cabins, and rebooking help. Call +1-833-225-0511.",
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
    text: "Plan a flight from New York by comparing JFK, LaGuardia (LGA), and Newark (EWR) against your destination, schedule, and ground journey. Check the airport code on every segment and account for transfers if an itinerary uses different airports. For domestic or international economy travel, compare total journey time, arrival airport, baggage allowance, connection details, and the fare rules for changes or cancellations. Flexible dates and airport choices can broaden the options, but a nearby airport is not automatically cheaper once transport is included.",
  },
  "/flights-from-los-angeles": {
    title: "Flights from Los Angeles | Flight Booking Assistance | TicketDepart",
    description: "Explore flights from Los Angeles. Compare nearby airports, international routes, connections, and cabin options.",
    heading: "Flights from Los Angeles with booking assistance",
    text: "Discuss Los Angeles departure airports, domestic and international routes, connections, flexible dates, cabins, and fare conditions.",
  },
  "/flights-from-chicago": {
    title: "Flights from Chicago | Flight Booking Assistance | TicketDepart",
    description: "Compare Chicago airports, connections, cabins, and fare terms with TicketDepart. Call +1-833-225-0511.",
    heading: "Flights from Chicago with booking assistance",
    text: "Compare Chicago departures from O'Hare (ORD) and Midway (MDW) based on the destination, schedule, and practical ground transport. Confirm the airport code on every segment, then review connection length, terminal changes, baggage terms, and whether all flights are issued on one ticket. For domestic and international economy trips, compare the full journey and fare conditions rather than the headline airfare alone. Flexible dates may show different schedules, but the best option depends on your route and travel day.",
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
    text: "Plan a departure from San Francisco by checking SFO first and considering Oakland (OAK) or San Jose (SJC) only when the route and ground journey make them practical. For Tokyo and other long-haul destinations, compare the arrival airport, local arrival date, total journey time, and connection details. Review baggage allowance, seat charges, and change or cancellation conditions for the exact economy fare. Include airport transfers in the total cost comparison rather than choosing by base fare alone.",
  },
  "/flights-new-york-to-london": {
    title: "New York to London Flights | Booking Assistance | TicketDepart",
    description: "Explore New York to London flights. Compare departure airports, connections, cabin options, and baggage terms.",
    heading: "New York to London flight booking assistance",
    text: "Compare New York to London flights from JFK or Newark with arrival at Heathrow (LHR) or Gatwick (LGW). The London arrival airport affects onward ground transport, so check it before arranging hotels or rail travel. Compare nonstop and connecting itineraries for the exact dates, including total travel time, local arrival time, baggage allowance, and whether every segment is on one ticket. Review the economy fare's seat, baggage, change, cancellation, and refund conditions before payment.",
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


  "/flights-new-york-to-paris": {
    title: "New York to Paris Flights | Booking Assistance | TicketDepart",
    description: "Compare New York to Paris airports, connections, baggage, and economy fare rules. Call +1-833-225-0511.",
    heading: "New York to Paris flight booking assistance",
    text: "Compare New York to Paris flights, arrival airports, local arrival times, connections, baggage, and economy fare conditions.",
  },
  "/flights-new-york-to-dubai": {
    title: "New York to Dubai Flights | Booking Assistance | TicketDepart",
    description: "Compare New York to Dubai departures, connections, arrival times, baggage, and economy fare rules. Call +1-833-225-0511.",
    heading: "New York to Dubai flight booking assistance",
    text: "Compare New York to Dubai flights from JFK or Newark, connection details, arrival times, baggage, and economy fare conditions.",
  },
  "/flights-chicago-to-london": {
    title: "Chicago to London Flights | Booking Assistance | TicketDepart",
    description: "Compare Chicago to London airports, connections, baggage, and economy fare rules. Call +1-833-225-0511.",
    heading: "Chicago to London flight booking assistance",
    text: "Compare Chicago to London flights from O'Hare, arrival airports, connections, baggage, and economy fare conditions.",
  },
  "/flights-miami-to-cancun": {
    title: "Miami to Cancun Flights | Booking Assistance | TicketDepart",
    description: "Compare Miami to Cancun nonstop and connecting flights, baggage, arrival times, and fare rules. Call +1-833-225-0511.",
    heading: "Miami to Cancun flight booking assistance",
    text: "Compare Miami to Cancun flights, nonstop and connecting options, arrival times, baggage, and economy fare conditions.",
  },

  "/flights-san-francisco-to-tokyo": {
    title: "San Francisco to Tokyo Flights | Booking Assistance | TicketDepart",
    description: "Explore San Francisco to Tokyo flights. Compare departure airports, connections, cabin options, and baggage terms.",
    heading: "San Francisco to Tokyo flight booking assistance",
    text: "Discuss San Francisco to Tokyo routes, departure airports, schedules, connections, cabins, baggage, and fare conditions.",
  },

  "/contact": {
    title: "Contact TicketDepart | Speak with a Travel Specialist",
    description: "Contact TicketDepart about your flight plans and callback requests.",
    heading: "Contact TicketDepart about your flight",
    text: "Contact TicketDepart for help planning an affordable domestic or international economy flight, reviewing an existing reservation, or understanding baggage and fare conditions. Call +1-833-225-0511 for 24/7 assistance, or use the callback form to share your departure city, destination, preferred dates, traveler count, and schedule flexibility. You do not need to have every detail finalized before contacting us. A specialist can discuss route options, connection times, nearby airports, baggage costs, the total quoted price, ticketing status, and applicable change or cancellation terms. Before authorizing a purchase, confirm the supplier or ticket issuer, the full amount due, and any agency service fee. A callback request is not a reservation or a guarantee that a fare remains available. Never submit payment-card details or sensitive identity documents through a general contact form. TicketDepart is an independent travel agency, not an airline or an airline's official customer-service department.",
  },
  "/privacy": {
    title: "Privacy Policy | TicketDepart",
    description: "Learn how TicketDepart uses contact, trip-request, and website analytics information and how to reach us about privacy.",
    heading: "Privacy Policy",
    text: "TicketDepart collects information you choose to provide when you call, email, or submit a trip request, such as your name, contact details, origin and destination, travel dates, traveler count, and optional trip preferences. We use these details to respond to your request, research flight options, communicate about a reservation, and provide customer service. When needed to arrange travel you request, relevant traveler and itinerary details may be shared with an airline, ticketing partner, or travel supplier. We do not sell personal information or share it with third parties for their independent marketing. Website analytics may record page views, device and browser details, approximate location, referral information, and interactions with site features; we do not intentionally send form names, phone numbers, or email addresses to analytics tools. We retain records for as long as reasonably needed to respond, service reservations, meet legal obligations, and resolve disputes, then delete or de-identify them when appropriate. You can contact us to ask about your information, request a correction, or raise a privacy concern. Do not send payment-card data or sensitive identity documents through a general contact form. Privacy rights and options may vary by location and applicable law; this summary does not limit rights provided by law.",
  },
  "/terms": {
    title: "Terms of Service | TicketDepart",
    description: "Review TicketDepart website terms, independent booking assistance, fare quotes, fees, ticketing, changes, and cancellations.",
    heading: "Terms of Service",
    text: "TicketDepart operates this website to provide travel information and independent flight-booking assistance. Using the website does not itself create a reservation or guarantee a fare, seat, schedule, or service. TicketDepart is an independent travel agency, not an airline or an airline's official customer-service department. Airline schedules, inventory, baggage rules, fare restrictions, and refund eligibility are set by the relevant airline or ticket issuer and may change. Before authorizing payment, review the complete itinerary, passenger details, total price including taxes and any disclosed agency service fee, supplier or ticket issuer, baggage terms, ticketing timeline, and applicable change or cancellation conditions. A quote is not a ticket; a reservation should be treated as ticketed only after issuance is confirmed and the relevant confirmation is provided. Changes, cancellations, credits, and refunds depend on the fare rules, applicable regulations, the airline, and the party responsible for issuing the ticket. You are responsible for providing accurate traveler information, checking passport and entry requirements with official authorities, and reviewing confirmations promptly. Do not use the site to submit unlawful content, interfere with its operation, or access systems without authorization. If any booking term, payment recipient, fee, or ticketing status is unclear, ask for clarification before paying. Contact TicketDepart if you have questions about these terms or a trip request.",
  },
  "/disclaimer": {
    title: "TicketDepart Disclaimer | Booking Information",
    description: "Understand TicketDepart's booking service, airline relationships, fare quotes, fees, ticketing, changes, and refunds.",
    heading: "Disclaimer",
    text: "TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by any airline. A quote is not a ticket or a guarantee that a fare remains available. Prices, schedules, seat availability, baggage allowances, and fare conditions may change before ticketing. A booking should be considered ticketed only after ticket issuance is confirmed and the relevant confirmation is received. Before authorizing payment, confirm the total price, any agency service fee, payment recipient, supplier or ticket issuer, and the terms that apply to the ticket.",
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
  if (!retainedPaths.has(route) && route !== "/flight-search-results" && route !== "/flights-new-york-to-london" && route !== "/group-flight-booking" && route !== "/corporate-flight-booking" && route !== "/business-class-flight-booking") delete routes[route];
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
  "/flight-booking": { eyebrow: "Economy flight booking assistance", sections: [["Find affordable flight options", "When looking for cheap flights or affordable economy airfare, compare nearby travel dates, departure airports you can realistically reach, nonstop and connecting routes, total journey time, and the full price after taxes and fees. The lowest advertised fare is not always the lowest total trip cost."],["Domestic and international flight booking", "Discuss routes within the United States, flights between the U.S. and Canada, and international destinations. Compare schedules, layovers, baggage allowances, seat-selection charges, and fare rules for the exact itinerary rather than assuming all economy tickets include the same benefits."],["Book a flight by phone when useful", "If you want help comparing flight options, dates, airports, or ticket conditions, you can discuss the details with a TicketDepart specialist. Phone booking is not automatically cheaper; confirm the total price, provider, and terms before deciding."],["What to check before paying", "Confirm passenger names, airport codes, local departure times, ticketing status, baggage, change and cancellation conditions, refund eligibility, and any disclosed service fee. Review the complete itinerary and fare terms before authorizing payment."]] },
  "/flight-search": { eyebrow: "Compare cheap and economy flight options", sections: [["Search domestic and international flights", "Enter your departure city or airport, destination, dates, trip type, number of travelers, and economy cabin preference. For cheap flights, flexible travel dates and practical alternate airports may reveal different options; compare nearby days rather than assuming one date is cheapest."],["Compare the full fare, not just the headline price", "Review departure and arrival times, stops, layover length, total journey time, baggage allowance, seat-selection charges, taxes, and ground transport. Compare nonstop flights with connecting itineraries and include realistic airport-transfer costs. A lower base fare is not always the lowest total trip cost."],["Last-minute flight searches", "For last-minute flights, review itinerary details and ticketing deadlines carefully. Compare the options currently returned for your route and dates, and confirm ticketing deadlines before relying on a same-day itinerary."],["Check change, cancellation, and baggage rules", "Baggage, seat selection, changes, cancellation, and refund eligibility depend on the specific airline and fare. Read the terms for the itinerary you choose rather than assuming every economy ticket has the same conditions."],["Confirm the exact itinerary before payment", "Search results are a starting point, not a ticket or a guarantee that a fare remains available. Confirm the current total price, taxes, airports, local times, ticketing provider, and ticketing status before authorizing payment."],["When phone booking help can be useful", "If you want help comparing dates, airports, connections, or fare restrictions, have your preferred route and dates ready and ask a specialist to explain the options. Phone booking is not automatically cheaper; compare the complete price and terms."]] },
  "/book-a-flight-by-phone": { eyebrow: "Affordable flight booking by phone", sections: [["Compare affordable economy flights", "Travelers departing from the United States or Canada can discuss domestic and international economy itineraries, flexible dates, nearby airports, nonstop or connecting flights, baggage allowances, and the total trip cost. Compare the full itinerary and fare conditions rather than judging an option by its headline price."],["Prepare your trip details", "Have your departure city, destination, preferred dates, and traveler count ready if possible. Cabin preference is optional. If your schedule is flexible, ask about alternate dates and nearby airports that could broaden the available options."],["Review the itinerary and fare", "Confirm local departure and arrival times, connection details, baggage allowance, ticketing status, total price, and any disclosed agency service fee before authorizing payment. Phone booking is not automatically cheaper than booking online."],["Understand the terms before payment", "Ask about changes, cancellations, refund eligibility, and the party responsible for issuing and servicing the ticket. Ticket rules and available options depend on the selected itinerary and fare."]] },
  "/how-to-book-a-flight-by-phone": { eyebrow: "A practical phone-booking checklist", sections: [["Prepare your trip details", "Have departure and arrival cities or airport codes, preferred dates, traveler count, cabin preference, and any timing constraints ready. If dates or airports are flexible, say so before comparing options."],["Compare the full itinerary", "Review departure and arrival times, connection airports and layovers, total journey time, baggage allowance, seat conditions, and whether all segments are on one ticket. Compare the complete trip rather than the base fare alone."],["Confirm terms before payment", "Ask for the total price, taxes and charges, any disclosed agency service fee, ticketing status, change and cancellation rules, refund eligibility, and how confirmation will be delivered. Do not assume phone booking is always cheaper; compare the full price and fare rules."],["Know who is handling the booking", "Airport services, airline booking channels, and independent travel agencies are different. Confirm which provider is arranging or issuing the ticket and who to contact for changes. TicketDepart is an independent travel agency and is not an airline's official customer-service department."]] },
  "/international-flight-booking": { eyebrow: "International economy flight booking", sections: [["Compare international flight prices", "For affordable international flights from the United States or Canada, compare travel dates, destination airports, connection cities, and total journey time. Check whether a lower base fare adds baggage, seat, or airport-transfer costs before judging value."],["Long-haul connections and alternate dates", "Review connection airports, layover length, arrival times, and alternate dates. Flexible dates may reveal different options, but no fare or saving is guaranteed until the current itinerary is confirmed."],["Baggage, changes, and entry rules", "Baggage, seat selection, flight changes, cancellations, and refunds depend on the ticket and airline. Verify passport, visa, and entry requirements with the relevant government or consulate before travel."],["Booking assistance", "A specialist can help discuss itinerary details and booking steps. Confirm who is arranging or issuing the ticket, the full price, and the applicable terms before payment."]] },
  "/last-minute-flight-booking": { eyebrow: "Last-minute and affordable flight options", sections: [["Search last-minute flights", "If you need to travel soon, compare currently available last-minute flights by departure time, destination airport, stops, and total journey time. Cheap last-minute flights are not guaranteed; fares can be higher or lower depending on demand, route, and remaining seats."],["Compare the complete cost", "Check nearby airports only when transport is practical, compare connecting flights with nonstop options, and include baggage, seat fees, and ground transport. A low headline fare may not be the most practical or affordable itinerary overall."],["Are last-minute flights cheaper?", "Not always. Last-minute fares depend on route, travel date, remaining seats, and demand. Compare the current total price across practical dates and itineraries rather than relying on a general rule or a promised discount."],["Same-day ticketing and timing", "Same-day and urgent bookings can have tighter ticketing cutoffs and airport deadlines. Confirm that the ticket can be issued in time, check local departure times and connection requirements, and verify the final fare and terms before payment."]] },
  "/business-class-flight-booking": { eyebrow: "Business class flight planning", sections: [["Choose the cabin for the trip", "Compare the business-class options available for your route, including departure times, connection airports, total journey time, and the aircraft or seat details available for the specific flight."],["Check what the fare includes", "Before paying, confirm baggage allowance, seat selection, lounge access if relevant, change and cancellation rules, refund eligibility, and any service charges. Benefits differ by airline, route, aircraft, and fare."],["Plan around meetings and connections", "Allow realistic time between flights and meetings, compare arrival times, and review alternatives if a delay or missed connection would disrupt the trip. Confirm the final itinerary and ticket conditions before authorizing payment."]] },
  "/corporate-flight-booking": { eyebrow: "Corporate and business travel planning", sections: [["Coordinate employee and executive travel", "Start with the travel policy, traveler count, meeting locations, dates, preferred airports, approval steps, and any receipt or billing requirements before comparing itineraries."],["Balance schedule reliability and total cost", "Compare arrival times, connection risk, baggage, ticket flexibility, and the total ticket cost—not just the base fare. Choose around the business schedule and the conditions of the exact ticket."],["Separate corporate coordination from cabin choice", "Corporate travel planning coordinates travelers, schedules, approvals, and records. Business class is a cabin preference within that plan; it does not by itself provide corporate account benefits or negotiated rates."],["Confirm before ticketing", "Verify traveler details, itinerary, payment responsibility, change and cancellation rules, refund eligibility, receipt requirements, and any disclosed agency service fee before authorizing payment. TicketDepart is an independent travel agency, not an airline."]]},
  "/family-flight-booking": { eyebrow: "Family flight planning", sections: [["Prepare each traveler’s details", "Have each passenger’s name and date of birth available, including children and infants, and confirm that names match the required travel documents."],["Review seats, bags, and connections", "Ask what seating and baggage are included on the selected fare, how long each connection is, and whether the itinerary is practical for the family’s ages and needs. Seat assignments and adjacent seats depend on availability and ticket rules."],["Check documents and ticket terms", "For international trips, verify passport and entry requirements with official government sources. Before payment, review the full price, change and cancellation terms, and any applicable service charges."]] },
  "/group-flight-booking": { eyebrow: "Group, family, and event travel", sections: [["Families and larger groups", "Discuss coordinated itineraries for families, sports teams, schools, organizations, events, and other groups."],["Corporate groups", "Work through traveler count, cities, dates, meeting timing, cabin preferences, and itinerary coordination for business travel."],["Seats and booking terms", "Discuss seating, baggage, deposits, name deadlines, ticketing schedules, changes, and other conditions that apply to the specific booking."]] },
  "/airline-reservation-assistance": { eyebrow: "Airline booking and reservation help", sections: [["Airline flight booking questions", "Compare available flight options, economy fares, schedules, connections, baggage, and ticket conditions for the airline and route you are considering. If you need help booking by phone, have your route and travel dates ready where possible."],["Changes, cancellations, and existing tickets", "For an existing reservation, the options depend on the ticket issuer, airline, and fare rules. Check whether your question concerns a new booking, a change, a cancellation, or a refund so you can confirm the correct provider and process."],["Independent service and accurate expectations", "TicketDepart is an independent travel agency, not an airline and not the official customer-service department of any airline named on the site. Airline policies and ticket terms vary; review the final conditions for your itinerary before payment."]] },
  "/flight-change-assistance": { eyebrow: "Flight change help and ticket options", sections: [["Help with changing a booked flight", "If you need to change a flight, have your booking confirmation or ticket number available where possible. The available options depend on who issued the ticket, the airline, the fare conditions, and the departure date."],["Dates, routes, and same-day changes", "Possible changes may include travel dates, flight times, routing, or connections, subject to the ticket rules and current availability. Ask whether a fare difference, change fee, or ticket reissue is involved before authorizing a change."],["Are flight changes free?", "Sometimes, but not always. A change may involve a service fee, fare difference, or ticket restriction, and rules vary by airline, ticket type, and issuer. Confirm the exact cost and eligibility for your reservation before authorizing a change."],["Confirm eligibility and cost", "Flight changes are not always free, and some restricted fares may have limited options. Confirm the total cost, deadlines, updated itinerary, and how the change will be ticketed. For a cancellation or refund instead, review the applicable cancellation rules before taking action."]] },
  "/flight-cancellation-assistance": { eyebrow: "Flight cancellation and refund assistance", sections: [["Understand flight cancellation options", "If you need to cancel a flight, first check the ticket conditions, airline policy, and the provider that issued the reservation. A cancellation does not automatically mean a full refund."],["Will I get a refund if I cancel my flight?", "A refund is not automatic. Eligibility can depend on the fare rules, reason for cancellation, ticket issuer, timing, and applicable airline or legal policies. Ask about refund, credit, and fee outcomes before confirming cancellation."],["Refunds, credits, and cancellation fees", "Ask whether the ticket may qualify for a refund, travel credit, or other option, and confirm any applicable fees, deadlines, and fare differences. Eligibility depends on the specific ticket and circumstances; do not cancel until you understand the likely outcome."],["Keep booking details available", "Have the confirmation, traveler name, and ticket details ready when discussing the reservation. If you are considering changing dates instead, compare change options and costs before choosing cancellation."]] },
  "/flights-from-new-york": { eyebrow: "New York flight planning", sections: [["Compare departure airports", "Discuss practical options from the New York area and the airport that best fits your itinerary."],["Domestic and international routes", "Plan dates, connections, cabin preferences, baggage, and destination airports with the trip's timing in mind."],["Nearby alternatives", "When practical, consider alternate airports or flexible dates if they improve the itinerary choices."]] },
  "/disclaimer": { eyebrow: "Important booking information", sections: [["Independent travel agency", "TicketDepart is an independent travel agency. We are not affiliated with, endorsed by, or sponsored by any airline. Airline names and trademarks belong to their respective owners."],["Quotes, fares, and ticket issuance", "A quote is not a ticket or a guarantee that a fare remains available. Prices, schedules, seat availability, baggage allowances, and fare conditions may change before ticketing. A booking should be considered ticketed only after ticket issuance is confirmed and the relevant confirmation is received."],["Pricing and agency fees", "Before authorizing payment, confirm the total price, taxes, any agency service fee, what the fare includes, the payment recipient, and the supplier or ticket issuer. Any agency service fee must be disclosed before purchase authorization."],["Changes, cancellations, and refunds", "Change, cancellation, refund, and credit eligibility depends on the ticket issuer, fare conditions, payment method, and applicable law. Some fares are non-refundable or non-changeable. A refund request is not an approval; the responsible supplier must confirm the outcome."],["Contact", "For questions, contact TicketDepart at support@ticketdestinations.com or +1-833-225-0511."]]}
};

const RELATED_ROUTE_RULES = {
  "/": [
    "/flight-booking", "/cheap-flight-booking-by-phone", "/book-a-flight-by-phone",
    "/flight-search", "/last-minute-flight-booking", "/international-flight-booking",
    "/flight-change-assistance", "/flight-cancellation-assistance",
  ],
  "/same-day-flight-booking": [
    "/flight-booking", "/book-a-flight-by-phone", "/last-minute-flight-booking",
    "/flight-search", "/flight-change-assistance", "/flight-cancellation-assistance",
  ],
  "/book-a-flight-by-phone": [
    "/cheap-flight-booking-by-phone", "/flight-booking", "/international-flight-booking",
    "/last-minute-flight-booking", "/how-to-book-a-flight-by-phone", "/flight-search",
    "/same-day-flight-booking",
  ],
  "/flight-booking": [
    "/flight-booking-assistance", "/cheap-flight-booking-by-phone", "/book-a-flight-by-phone",
    "/flight-search", "/last-minute-flight-booking", "/international-flight-booking",
    "/flight-change-assistance", "/flight-cancellation-assistance",
  ],
  "/flight-booking-assistance": [
    "/flight-booking", "/cheap-flight-booking-by-phone", "/book-a-flight-by-phone",
    "/flight-search", "/international-flight-booking", "/last-minute-flight-booking",
    "/flight-change-assistance", "/flight-cancellation-assistance",
  ],
  "/international-flight-booking": [
    "/flights-usa-to-canada", "/flights-usa-to-europe", "/flights-usa-to-uk",
    "/flights-usa-to-mexico", "/flight-search", "/cheap-flight-booking-by-phone",
    "/flight-booking", "/book-a-flight-by-phone",
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
    "/group-flight-booking", "/book-a-flight-by-phone", "/pet-flight-booking",
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
      copy: "New York-area trips may involve JFK, LaGuardia, or Newark, and they are not interchangeable for every itinerary. Compare the full journey from home to the airport, departure time, baggage terms, and the cost and time of ground transport—not just the flight duration. Check the airport code on every outbound and return segment; if the itinerary arrives at one airport and departs from another, allow for a cross-city transfer. For international journeys, compare Heathrow or Gatwick arrivals with your final London-area destination, and leave enough time for any onward connection. A lower base fare may not be the better economy choice once transport, baggage, seat charges, and total journey time are included.",
      checklist: "Compare JFK and Newark when reviewing international options; consider LaGuardia mainly where the itinerary and carrier make it practical; confirm the airport code on every segment; and check connection and ground-transfer time before paying."
    },
    "/flights-from-los-angeles": {
      title: "Planning a departure from the Los Angeles area",
      copy: "Los Angeles itineraries can differ significantly depending on departure time, traffic to the airport, and whether a connection is involved. Compare the complete itinerary rather than treating a short connection or a distant airport as automatically better. For long-haul travel, check local arrival time, baggage through-checking, and the plan for reaching your final destination.",
      checklist: "Allow realistic time to reach LAX; compare total travel time and connection length; confirm whether bags are checked through; and check local arrival dates when the itinerary crosses time zones."
    },
    "/flights-from-chicago": {
      title: "Comparing Chicago departure options",
      copy: "When planning from Chicago, confirm whether the itinerary uses O'Hare (ORD) or Midway (MDW) and how you will reach that airport. The most convenient departure can depend on the destination, carrier, travel time, and available connections on your dates. For international trips, compare the London arrival airport when relevant, review the connection airport and time between flights, and confirm whether all segments are on one ticket. Include airport transport, baggage, seat charges, and fare flexibility in the total cost rather than comparing base fares alone.",
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
      copy: "Bay Area travelers may compare San Francisco (SFO), Oakland (OAK), or San Jose (SJC) depending on the destination and how far they are willing to travel to the airport. For long-haul itineraries to Tokyo, compare Haneda (HND) and Narita (NRT), the local arrival date across the International Date Line, and the onward ground journey. Check whether baggage is through-checked, review connection time, and compare the full economy fare after airport transfers, baggage, and seat charges. An alternate airport is useful only when the route and schedule make the extra ground travel worthwhile.",
      checklist: "Compare SFO, OAK, and SJC only where they serve the itinerary; add ground-transfer time and cost; check the destination airport carefully; and review long-haul connection and baggage details."
    },
    "/flights-new-york-to-london": {
      title: "Compare the whole New York–London journey",
      copy: "For a New York–London trip, compare departure options from JFK and Newark with the London airport shown on the itinerary. Heathrow (LHR) and Gatwick (LGW) can lead to different onward journeys, so check the arrival airport before arranging ground transport, rail, or a hotel. A nonstop option, if available for the date, may save connection time, while a connecting itinerary can change the total journey substantially. Check the local arrival time, whether baggage is checked through, and whether all segments are issued on one ticket. Compare economy fare inclusions and change or cancellation conditions before paying.",
      checklist: "Confirm the departure and arrival airport codes; compare total travel time rather than flight time alone; check baggage and seat conditions; and verify current UK entry requirements with official government guidance."
    },
    "/flights-chicago-to-london": {
      title: "Plan the Chicago–London crossing",
      copy: "For Chicago to London, compare the departure time from O'Hare (ORD), the London arrival airport, and the local arrival time. Heathrow (LHR) and Gatwick (LGW) can lead to different onward journeys, so include ground transport in the comparison. If an itinerary connects elsewhere, check the layover, terminal change, transit requirements, and whether every segment is on one ticket. Review baggage, seat charges, and the economy fare's change, cancellation, and refund conditions for the dates you intend to travel.",
      checklist: "Confirm ORD and the London arrival airport; compare nonstop options with connecting alternatives for your dates; review baggage and change terms; and check current UK entry and transit rules with official sources."
    },
    "/flights-new-york-to-paris": {
      title: "Match your New York–Paris flight to your plans",
      copy: "When comparing New York and Paris itineraries, verify whether the flight arrives at Charles de Gaulle (CDG) or Orly (ORY) and how you will continue into the city or onward to another destination. Compare the airport transfer, local arrival time, and any onward rail or hotel plans before choosing. For connecting itineraries, check the layover, terminal transfer, and whether the segments share one ticket. Review baggage allowance, seat charges, and the exact economy fare's change, cancellation, and refund conditions.",
      checklist: "Check the Paris airport code; compare arrival time with hotel check-in or onward rail plans; confirm baggage and fare restrictions; and verify current French and Schengen entry requirements through official sources."
    },
    "/flights-new-york-to-dubai": {
      title: "Prepare for a long-haul New York–Dubai itinerary",
      copy: "For a New York–Dubai journey, compare the complete travel time, JFK or Newark departure, Dubai arrival time, and any connection shown. Check the local arrival date, connection airport, layover duration, and whether baggage is transferred between segments. On a long-haul economy itinerary, baggage, seat conditions, and the ability to change dates may matter more than a small difference in listed journey time. Confirm the airport code and ticket conditions for every segment before authorizing payment.",
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
      copy: "For Miami to Cancun, consider the MIA departure and CUN arrival time alongside airport transfers, accommodation check-in, and any pre-booked activities. Compare nonstop and connecting options for your dates and confirm whether baggage and seat selection are included in the fare. If the trip is part of a larger plan, allow a buffer between arrival and any separately booked transfer or event. Check the ticket's change and cancellation conditions and current entry requirements before travel.",
      checklist: "Confirm MIA and CUN; match arrival time to your transfer plans; check passport and entry requirements with official authorities; and review baggage, seat, and ticket-change conditions."
    },
    "/flights-san-francisco-to-tokyo": {
      title: "Plan the San Francisco–Tokyo long-haul trip",
      copy: "For San Francisco to Tokyo, compare the SFO departure time, Tokyo arrival airport, and local arrival date. Haneda (HND) and Narita (NRT) can lead to different onward journeys, so check the airport before arranging hotels or connections. Crossing the International Date Line can move the arrival to the next calendar day. For long-haul economy travel, review total journey time, connection length, baggage inclusions, seat charges, and the rules for changing or cancelling the ticket.",
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
      "<section><h2>Independent reservation assistance</h2><p>TicketDepart is an independent travel agency, not " + escapeHtml(airline) + " and not its official customer-service department. A travel specialist can discuss itinerary choices and booking details; the itinerary details and applicable ticket conditions should be reviewed before deciding.</p></section>"
    ].join("\n  ");
  }

  const serviceGuides = {
    "/cheap-flight-booking-by-phone": {
      title: "Compare the full cost, not only the displayed fare",
      copy: "For an economy flight, compare the total trip cost rather than the headline fare alone. Check nearby dates, alternate airports you can realistically reach, nonstop versus connecting itineraries, layover length, arrival time, baggage allowance, and seat-selection fees. Include ground transport and the time cost of a long connection when comparing options. A low displayed fare is not proof that the same price will remain available at checkout.",
      checklist: "Before payment, confirm the current total including taxes and any disclosed service fee; the exact airports and local times; stops and connection details; baggage and seat inclusions; ticketing status; and the fare's change, cancellation, and refund conditions. Do not assume phone booking is always cheaper or that every economy fare includes a checked bag."
    },
    "/same-day-flight-booking": {
      title: "Check timing before choosing a same-day itinerary",
      copy: "Same-day travel requires attention to ticketing cutoffs, airport procedures, and how quickly you can reach the departure airport. Confirm the exact departure airport and local time, allow for transport and check-in, and do not rely on a schedule or fare until it has been checked for your travel date. Connecting flights can introduce additional timing risks.",
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
      "<section><h2>Compare the complete " + escapeHtml(routeName) + " journey</h2><p>For this route, compare the departure and arrival airport codes, local departure and arrival times, connection airports, total journey time, cabin options, and baggage conditions. If the itinerary connects through another city, check whether the connection is on one ticket and whether you need to change terminals or collect baggage. Schedules vary by date, so review the itinerary for your intended travel day.</p></section>",
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
  const danglingTail = /\b(?:and|or|with|for|from|to|of|in|on|at|by|the|a|an|as|including|that|which|who|whose|when|where|while|before|after|between|about|your|their|our|its|into|over|under|available|applicable|specific|different|current|complete|full|practical|appropriate|official|independent|international|domestic|flexible|additional|other|any|each|every|travel)$/i;
  const danglingPhrase = /\b(?:with a travel|applicable booking)$/i;
  while (candidate && (danglingTail.test(candidate) || danglingPhrase.test(candidate))) {
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
    .replace(/(?:\+?1[\s().-]*)?855[\s().-]*544[\s().-]*9001/g, "+1-833-225-0511")
    .replace(/\s+/g, " ")
    .trim();
  const phoneSuffix = ` Call ${PHONE_DISPLAY}.`;
  const withoutPhone = RETIRED_PHONE_PATTERNS
    .reduce((text, pattern) => text.replace(pattern, ""), normalized)
    .replaceAll(`Call ${PHONE_DISPLAY}`, "")
    .replaceAll(PHONE_DISPLAY, "")
    .replace(/\s+([.,;:])/g, "$1")
    .replace(/\.\s*[,;:]/g, ".")
    .replace(/\s+/g, " ")
    .replace(/[.\s]+$/, "");
  // Removing a leading call instruction must not leave a dangling preposition
  // (for example, "to book" or "for U.S. flights") at the start of the snippet.
  const cleanedBase = withoutPhone.trim().replace(/^(?:to|for|at)\s+/i, "").trim();
  const base = trimDescription(cleanedBase, 155 - phoneSuffix.length - 1);
  const capitalizedBase = base ? base[0].toUpperCase() + base.slice(1) : "Flight booking assistance";
  const punctuatedBase = /[.!?]$/.test(capitalizedBase) ? capitalizedBase : `${capitalizedBase}.`;
  const description = `${punctuatedBase}${phoneSuffix}`;
  if (new RegExp(String.raw`\b(?:with a travel|applicable booking)\.\s+Call ${PHONE_DISPLAY.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\.$`, "i").test(description)) {
    throw new Error(`Generated an incomplete meta description: ${description}`);
  }
  return description;
}

function routeHtml(route, meta) {
  meta = Object.fromEntries(
    Object.entries(meta).map(([key, value]) => [
      key,
      typeof value === "string"
        ? value.replaceAll("+1-833-225-0511", PHONE_DISPLAY)
        : value,
    ]),
  );
  const publicPath = route === "/" ? "/" : `${route.replace(/\/+$/, "")}/`;
  const canonicalPath = meta.canonicalPath ?? publicPath;
  const url = "https://ticketdepart.com" + (canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`);
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
      telephone: PHONE_DISPLAY,
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
  const homeGuideLink = route === "/" ? `<section><h2>Affordable economy flight booking</h2><p><a href="/cheap-flight-booking-by-phone/">Cheap economy flights by phone</a></p><p><a href="/how-to-book-a-flight-by-phone/">How to book a flight by phone</a></p></section>` : "";
  const fallback = `<main><nav aria-label="Breadcrumb"><a href="/">TicketDepart</a> / ${safeHeading}</nav><p><strong>${escapeHtml(staticContent.eyebrow)}</strong></p><h1>${safeHeading}</h1><p>${safeText}</p><p><a href="${PHONE_HREF}">Call ${PHONE_DISPLAY}</a> — available 24/7.</p>${homeGuideLink}
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
</main>`;

  return html.replace(/<div id="root"(?:\s+style="visibility:hidden")?><\/div>/i, `<div id="root" style="visibility:hidden">${fallback}</div>`);
}

for (const [route, meta] of Object.entries(routes)) {
  const dir = path.join(distDir, route.slice(1));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), routeHtml(route, meta));
}

// The legacy alias is intentionally excluded from the sitemap, but it must
// still have a static document for direct visits and consistent canonical and
// Open Graph metadata. Keep this explicit write as a guard against route-list
// refactors accidentally omitting the compatibility URL from the generation
// map.
// Keep the private admin route's static shell explicit as well. With 404-page
// handling enabled, this file is required for the application router to load the
// protected route; its metadata remains noindex and it is not added to the sitemap.
const adminRoute = "/admin/leads";
// Keep the admin shell generation resilient when this script is exercised by
// isolated route-generator tests that intentionally provide a reduced route map.
// Production builds use the explicit route metadata above.
const adminMeta = routes[adminRoute] ?? {
  title: "Lead Dashboard | TicketDepart",
  description: "Private TicketDepart lead dashboard for authorized administrators.",
  heading: "Lead Dashboard",
  text: "This page is for authorized TicketDepart administrators. Sign in to review lead records.",
  indexable: false,
};
const adminDir = path.join(distDir, adminRoute.slice(1));
fs.mkdirSync(adminDir, { recursive: true });
fs.writeFileSync(path.join(adminDir, "index.html"), routeHtml(adminRoute, adminMeta));

const legacyRoute = "/flight-booking-assistance";
const legacyMeta = routes[legacyRoute] ?? routes["/flight-booking"];
if (legacyMeta) {
  const legacyDir = path.join(distDir, legacyRoute.slice(1));
  fs.mkdirSync(legacyDir, { recursive: true });
  fs.writeFileSync(
    path.join(legacyDir, "index.html"),
    routeHtml(legacyRoute, { ...legacyMeta, canonicalPath: "/flight-booking/" }),
  );
} else {
  throw new Error("Cannot generate legacy /flight-booking-assistance static HTML: booking route metadata is missing");
}

console.log(`Generated ${Object.keys(routes).length} crawlable route entry points.`);