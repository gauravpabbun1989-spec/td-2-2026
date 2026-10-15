import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { breadcrumbSchema, serviceSchema, webPageSchema } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

type CountryPage = {
  path: string;
  country: string;
  title: string;
  description: string;
  heading: string;
  intro: string;
  hub: string;
  airports: string[];
  airlines: string[];
  routes: string[];
  services: [string, string][];
  faqs: [string, string][];
};

const PAGES: CountryPage[] = [
  {
    path: "/flights-usa-to-italy",
    country: "Italy",
    title: "USA to Italy Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "U.S. travelers planning Italy flights can discuss booking, changes, cancellations, rebooking, Rome, Milan and other Italian gateways by phone with an independent travel specialist.",
    heading: "USA to Italy flight booking assistance",
    intro: "Planning a trip from the United States to Italy? Discuss Rome, Milan, Venice, Florence and other Italian destinations, U.S. departure airports, connections, cabins, baggage, and fare conditions with a TicketDepart travel specialist by phone.",
    hub: "Rome Fiumicino (FCO) and Milan Malpensa (MXP)",
    airports: ["Rome Fiumicino (FCO)", "Milan Malpensa (MXP)", "Venice Marco Polo (VCE)", "Naples (NAP)", "Florence (FLR)"],
    airlines: ["ITA Airways", "Delta Air Lines", "United Airlines", "American Airlines", "Lufthansa"],
    routes: ["New York to Rome", "New York to Milan", "Miami to Rome", "Chicago to Rome", "Los Angeles to Rome"],
    services: [
      ["Italy flight booking by phone", "Discuss U.S. departure cities, Italian arrival airports, dates, cabin preference, connections, baggage, and the fare conditions that apply before booking."],
      ["Italy flight change assistance", "Review an existing itinerary and discuss possible date, time, routing, or connection changes under the applicable ticket rules."],
      ["Italy flight cancellation assistance", "Discuss cancellation timing, refund or credit possibilities, and ticket conditions before authorizing a cancellation."],
      ["Italy flight rebooking and rescheduling", "Compare replacement dates and routings when travel plans change, including possible fare differences and availability."],
      ["Rome and Milan gateway planning", "Use FCO or MXP as practical international gateways and discuss onward Italian travel, connection timing, and airport choices."],
      ["Italy multi-city travel", "Plan open-jaw or multi-city trips such as Rome, Florence, Venice, and Milan while reviewing the complete itinerary before booking."],
    ],
    faqs: [
      ["Can I book a flight from the USA to Italy by phone?", "Yes. A TicketDepart specialist can discuss U.S. departure airports, Italian destinations, dates, cabins, connections, and available booking options."],
      ["Can you help change a USA to Italy flight?", "We can review the reservation and discuss possible changes or rebooking. Eligibility and costs depend on the ticket rules, airline policy, availability, and how the ticket was issued."],
      ["Which Italian airports can I discuss?", "Common international gateways include Rome Fiumicino and Milan Malpensa, with other airports such as Venice, Naples, and Florence depending on the itinerary."],
      ["Is TicketDepart affiliated with an Italian airline?", "No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by any airline mentioned on this page."],
    ],
  },
  {
    path: "/flights-usa-to-france",
    country: "France",
    title: "USA to France Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "Plan flights from the USA to France with phone assistance for booking, changes, cancellations, rebooking, Paris Charles de Gaulle, Orly, connections, and fare questions.",
    heading: "USA to France flight booking assistance",
    intro: "Planning travel from the United States to France? Discuss Paris, Nice and other French destinations, U.S. gateways, connections, cabins, baggage, and fare conditions with an independent travel specialist.",
    hub: "Paris Charles de Gaulle (CDG)",
    airports: ["Paris Charles de Gaulle (CDG)", "Paris Orly (ORY)", "Nice Côte d'Azur (NCE)", "Lyon–Saint Exupéry (LYS)", "Marseille Provence (MRS)"],
    airlines: ["Air France", "Delta Air Lines", "United Airlines", "American Airlines", "Lufthansa"],
    routes: ["New York to Paris", "Los Angeles to Paris", "Miami to Paris", "Chicago to Paris", "Atlanta to Paris"],
    services: [
      ["France flight booking by phone", "Discuss U.S. departure airports, French destinations, dates, cabins, nonstop or connecting options, baggage, and fare terms."],
      ["France flight change assistance", "Review possible itinerary changes, including dates, times, connections, and routing, subject to ticket and airline rules."],
      ["France cancellation assistance", "Discuss cancellation terms, refund or credit possibilities, deadlines, and the effect on other itinerary segments."],
      ["France rebooking and rescheduling", "Compare replacement flights and dates when plans change and review possible fare differences before processing."],
      ["Paris gateway planning", "Discuss CDG and ORY options and how arrival airport choice affects the onward trip."],
      ["France multi-city travel", "Plan itineraries involving Paris, Nice, Lyon, Marseille, or onward European destinations when the fare structure permits."],
    ],
    faqs: [
      ["Can I book USA to France flights by phone?", "Yes. You can discuss route, dates, U.S. departure city, French arrival airport, cabin, and itinerary options with a specialist."],
      ["Can you help reschedule a flight to France?", "We can review the ticket and discuss available replacement options. Exact eligibility and costs depend on the ticket terms and live availability."],
      ["What is the main Paris gateway?", "Paris Charles de Gaulle (CDG) is the major international gateway. Paris Orly (ORY) is another airport to consider depending on the itinerary."],
      ["Are you Air France customer service?", "No. TicketDepart is an independent travel agency and is not Air France's official customer service or affiliated with the airline."],
    ],
  },
  {
    path: "/flights-usa-to-germany",
    country: "Germany",
    title: "USA to Germany Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "Get U.S. to Germany flight assistance by phone for booking, changes, cancellations, rebooking, Frankfurt, Munich, Berlin and international connections.",
    heading: "USA to Germany flight booking assistance",
    intro: "Planning travel from the United States to Germany? Discuss Frankfurt, Munich, Berlin and other German destinations, U.S. gateways, connections, cabins, baggage, and fare conditions by phone.",
    hub: "Frankfurt (FRA) and Munich (MUC)",
    airports: ["Frankfurt (FRA)", "Munich (MUC)", "Berlin Brandenburg (BER)", "Düsseldorf (DUS)", "Hamburg (HAM)"],
    airlines: ["Lufthansa", "United Airlines", "Delta Air Lines", "American Airlines", "SWISS"],
    routes: ["New York to Frankfurt", "New York to Munich", "Chicago to Frankfurt", "Los Angeles to Frankfurt", "Washington to Frankfurt"],
    services: [
      ["Germany flight booking by phone", "Discuss U.S. departure cities, German airports, dates, cabins, connections, baggage, and fare conditions."],
      ["Germany flight change assistance", "Review possible date, time, routing, or connection changes for an existing reservation under the applicable ticket rules."],
      ["Germany cancellation assistance", "Discuss cancellation deadlines, possible refunds or credits, and ticket conditions before action is taken."],
      ["Germany rebooking and rescheduling", "Compare alternative dates and routings when a German itinerary needs to be changed."],
      ["Frankfurt and Munich hub planning", "Discuss FRA and MUC as major international gateways and consider onward European connections."],
      ["Germany multi-city travel", "Work through itineraries involving Frankfurt, Munich, Berlin, or onward European destinations while considering the complete route."],
    ],
    faqs: [
      ["Can I book a flight from the USA to Germany by phone?", "Yes. A specialist can discuss your route, dates, departure airport, destination airport, cabin, and available itinerary options."],
      ["Can you help change a Lufthansa flight?", "Ticket-specific assistance can be discussed, but eligibility and costs depend on how the ticket was issued, its fare rules, airline policy, and availability."],
      ["Which German airports are useful for international travel?", "Frankfurt (FRA) and Munich (MUC) are major international gateways; Berlin, Düsseldorf, and Hamburg can also be relevant depending on the trip."],
      ["Are you Lufthansa official customer service?", "No. TicketDepart is an independent travel agency and is not Lufthansa's official customer service or affiliated with the airline."],
    ],
  },
  {
    path: "/flights-usa-to-spain",
    country: "Spain",
    title: "USA to Spain Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "Plan USA to Spain flights by phone with assistance for booking, flight changes, cancellations, rebooking, Madrid, Barcelona, connections, baggage, and fare conditions.",
    heading: "USA to Spain flight booking assistance",
    intro: "Planning travel from the United States to Spain? Discuss Madrid, Barcelona and other Spanish destinations, U.S. departure airports, connections, cabin options, baggage, and fare conditions with a travel specialist.",
    hub: "Madrid-Barajas (MAD) and Barcelona-El Prat (BCN)",
    airports: ["Madrid-Barajas (MAD)", "Barcelona-El Prat (BCN)", "Palma de Mallorca (PMI)", "Málaga (AGP)", "Valencia (VLC)"],
    airlines: ["Iberia", "American Airlines", "Delta Air Lines", "United Airlines", "Air Europa"],
    routes: ["New York to Madrid", "New York to Barcelona", "Miami to Madrid", "Los Angeles to Madrid", "Chicago to Madrid"],
    services: [
      ["Spain flight booking by phone", "Discuss U.S. departure airports, Spanish destinations, dates, cabins, nonstop or connecting flights, baggage, and fare terms."],
      ["Spain flight change assistance", "Review possible changes to dates, times, routing, and connections under the applicable reservation rules."],
      ["Spain cancellation assistance", "Discuss cancellation conditions, refund or credit possibilities, and the effect on connecting segments."],
      ["Spain rebooking and rescheduling", "Compare replacement dates and routes when plans change and review fare differences before processing."],
      ["Madrid and Barcelona gateway planning", "Discuss MAD and BCN as major international gateways and consider onward domestic or European connections."],
      ["Spain multi-city itineraries", "Plan combinations such as Madrid and Barcelona or Spain plus another European country when supported by the fare."],
    ],
    faqs: [
      ["Can I book USA to Spain flights by phone?", "Yes. Discuss your U.S. departure city, Spanish destination, dates, travelers, cabin, and connection preferences with a specialist."],
      ["Can you help change a flight to Spain?", "We can review the reservation and discuss possible changes or rebooking. Exact outcomes depend on the ticket and current availability."],
      ["Which Spanish airports should I consider?", "Madrid-Barajas and Barcelona-El Prat are major international gateways, with Málaga, Palma de Mallorca, and Valencia useful for specific trips."],
      ["Is TicketDepart affiliated with Iberia?", "No. TicketDepart is an independent travel agency and is not Iberia's official customer service or affiliated with the airline."],
    ],
  },
  {
    path: "/flights-usa-to-japan",
    country: "Japan",
    title: "USA to Japan Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "Get USA to Japan flight assistance by phone for Tokyo, Osaka and other destinations, including booking, changes, cancellations, rebooking, baggage and connections.",
    heading: "USA to Japan flight booking assistance",
    intro: "Planning a trip from the United States to Japan? Discuss Tokyo, Osaka and other Japanese destinations, U.S. gateways, airport choices, connections, cabins, baggage, and fare conditions by phone.",
    hub: "Tokyo Haneda (HND) and Narita (NRT)",
    airports: ["Tokyo Haneda (HND)", "Tokyo Narita (NRT)", "Osaka Kansai (KIX)", "Nagoya Chubu (NGO)", "Fukuoka (FUK)"],
    airlines: ["ANA", "Japan Airlines", "United Airlines", "Delta Air Lines", "American Airlines"],
    routes: ["New York to Tokyo", "Los Angeles to Tokyo", "San Francisco to Tokyo", "Seattle to Tokyo", "Chicago to Tokyo"],
    services: [
      ["Japan flight booking by phone", "Discuss U.S. departure gateways, Tokyo or other Japanese airports, dates, cabins, nonstop or connecting options, and baggage."],
      ["Japan flight change assistance", "Review possible itinerary changes and discuss applicable fare rules, availability, and any fare difference."],
      ["Japan cancellation assistance", "Discuss cancellation terms, deadlines, refunds or credits, and the effect on connected segments."],
      ["Japan rebooking and rescheduling", "Compare replacement dates and routes when plans change, including alternative Tokyo airports when practical."],
      ["Tokyo gateway planning", "Discuss Haneda and Narita based on the itinerary, arrival time, onward travel, and available schedules."],
      ["Japan multi-city travel", "Plan Tokyo, Osaka, Kyoto-region access, or other Japanese stops while reviewing the complete itinerary."],
    ],
    faqs: [
      ["Can I book a USA to Japan flight by phone?", "Yes. A specialist can discuss U.S. departure airports, Japanese destinations, dates, travelers, cabin, and itinerary options."],
      ["Should I compare Haneda and Narita?", "Yes. Airport choice can affect ground transportation and schedule convenience. Discuss both when the available itineraries make that practical."],
      ["Can you help change an ANA or Japan Airlines itinerary?", "We can discuss possible changes or rebooking, subject to ticket rules, how the reservation was issued, airline policy, and live availability."],
      ["Are you ANA or Japan Airlines customer service?", "No. TicketDepart is an independent travel agency and is not official airline customer service or affiliated with either airline."],
    ],
  },
  {
    path: "/flights-usa-to-china",
    country: "China",
    title: "USA to China Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "Plan USA to China flights by phone with assistance for Beijing, Shanghai, Guangzhou, connections, booking, changes, cancellations, rebooking, baggage and fare conditions.",
    heading: "USA to China flight booking assistance",
    intro: "Planning travel from the United States to China? Discuss Beijing, Shanghai, Guangzhou and other destinations, U.S. gateways, connections, cabin options, baggage, and fare conditions with an independent travel specialist.",
    hub: "Shanghai Pudong (PVG), Guangzhou Baiyun (CAN), and Beijing Capital (PEK)",
    airports: ["Shanghai Pudong (PVG)", "Guangzhou Baiyun (CAN)", "Beijing Capital (PEK)", "Beijing Daxing (PKX)", "Shenzhen Bao'an (SZX)"],
    airlines: ["China Eastern", "China Southern", "Air China", "United Airlines", "Delta Air Lines"],
    routes: ["New York to Shanghai", "Los Angeles to Shanghai", "San Francisco to Beijing", "Los Angeles to Guangzhou", "New York to Beijing"],
    services: [
      ["China flight booking by phone", "Discuss U.S. departure gateways, Chinese destinations, dates, cabins, connections, baggage, and fare conditions before booking."],
      ["China flight change assistance", "Review possible changes to dates, times, routes, or connections subject to the ticket and airline rules."],
      ["China cancellation assistance", "Discuss cancellation terms, refund or credit possibilities, deadlines, and itinerary effects before authorizing action."],
      ["China rebooking and rescheduling", "Compare alternative flights and dates when plans change and review applicable fare differences."],
      ["Shanghai, Guangzhou and Beijing gateway planning", "Discuss PVG, CAN, PEK, and PKX as major international gateways and consider the best airport for the final destination."],
      ["China multi-city itineraries", "Work through itineraries involving multiple Chinese cities or onward international travel while considering the full routing."],
    ],
    faqs: [
      ["Can I book a flight from the USA to China by phone?", "Yes. Discuss your U.S. departure, Chinese destination, dates, travelers, cabin, and connection preferences with a specialist."],
      ["Can you help change a China flight?", "We can review the reservation and discuss possible changes or rebooking. Eligibility and cost depend on the ticket, airline rules, and availability."],
      ["Which China airports are major international gateways?", "Shanghai Pudong, Guangzhou Baiyun, and Beijing Capital are major gateways, with Beijing Daxing and Shenzhen also relevant for some itineraries."],
      ["Do I need to verify entry requirements?", "Yes. Travelers should verify current passport, visa, transit, entry, and other requirements with official government and airline sources for their specific itinerary."],
    ],
  },
  {
    path: "/flights-usa-to-brazil",
    country: "Brazil",
    title: "USA to Brazil Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "Plan USA to Brazil flights by phone for São Paulo, Rio de Janeiro and other destinations, including booking, changes, cancellations, rebooking and baggage questions.",
    heading: "USA to Brazil flight booking assistance",
    intro: "Planning travel from the United States to Brazil? Discuss São Paulo, Rio de Janeiro and other Brazilian destinations, U.S. departure airports, connections, cabins, baggage, and fare conditions by phone.",
    hub: "São Paulo Guarulhos (GRU)",
    airports: ["São Paulo Guarulhos (GRU)", "Rio de Janeiro Galeão (GIG)", "Brasília (BSB)", "Salvador (SSA)", "Fortaleza (FOR)"],
    airlines: ["LATAM", "GOL", "American Airlines", "Delta Air Lines", "United Airlines"],
    routes: ["Miami to São Paulo", "Orlando to São Paulo", "New York to São Paulo", "Miami to Rio de Janeiro", "Atlanta to São Paulo"],
    services: [
      ["Brazil flight booking by phone", "Discuss U.S. gateways, Brazilian destinations, dates, cabins, connections, baggage, and applicable fare conditions."],
      ["Brazil flight change assistance", "Review possible date, time, route, and connection changes under the ticket terms."],
      ["Brazil cancellation assistance", "Discuss cancellation deadlines, refund or credit possibilities, and any impact on the rest of the itinerary."],
      ["Brazil rebooking and rescheduling", "Compare replacement dates and routes when travel plans change and review fare differences."],
      ["São Paulo and Rio gateway planning", "Discuss GRU and GIG as international gateways and consider onward Brazilian connections."],
      ["Brazil multi-city travel", "Plan combinations such as São Paulo and Rio or onward South American travel when supported by the fare."],
    ],
    faqs: [
      ["Can I book USA to Brazil flights by phone?", "Yes. A specialist can discuss your U.S. departure, Brazilian destination, dates, travelers, cabin, and available itinerary options."],
      ["Can you help change a Brazil flight?", "We can review the ticket and discuss possible changes or rebooking. Exact eligibility and cost depend on ticket rules and availability."],
      ["What is Brazil's major international gateway?", "São Paulo Guarulhos (GRU) is a major international gateway, while Rio de Janeiro Galeão (GIG) is also important for international itineraries."],
      ["Are you affiliated with LATAM or GOL?", "No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by the airlines mentioned."],
    ],
  },
  {
    path: "/flights-usa-to-colombia",
    country: "Colombia",
    title: "USA to Colombia Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "Get USA to Colombia flight assistance by phone for Bogotá, Medellín, Cartagena and other destinations, including booking, changes, cancellations and rebooking.",
    heading: "USA to Colombia flight booking assistance",
    intro: "Planning travel from the United States to Colombia? Discuss Bogotá, Medellín, Cartagena and other destinations, U.S. departure airports, connections, baggage, cabins, and fare conditions with a travel specialist.",
    hub: "Bogotá El Dorado (BOG)",
    airports: ["Bogotá El Dorado (BOG)", "Medellín José María Córdova (MDE)", "Cartagena (CTG)", "Cali (CLO)", "Barranquilla (BAQ)"],
    airlines: ["Avianca", "LATAM", "American Airlines", "Delta Air Lines", "JetBlue"],
    routes: ["Miami to Bogotá", "New York to Bogotá", "Fort Lauderdale to Medellín", "Miami to Cartagena", "Atlanta to Bogotá"],
    services: [
      ["Colombia flight booking by phone", "Discuss U.S. departure airports, Colombian destinations, dates, cabins, baggage, connections, and fare conditions."],
      ["Colombia flight change assistance", "Review possible changes to dates, times, routing, or connections under the applicable ticket rules."],
      ["Colombia cancellation assistance", "Discuss cancellation terms, possible refund or credit outcomes, and deadlines before processing."],
      ["Colombia rebooking and rescheduling", "Compare replacement flights when plans change and review availability and fare differences."],
      ["Bogotá gateway planning", "Discuss BOG as a major international gateway and consider onward domestic connections to Medellín, Cartagena, Cali, or other cities."],
      ["Colombia multi-city travel", "Plan combinations of Colombian cities or Colombia plus another international destination when supported by the fare."],
    ],
    faqs: [
      ["Can I book a USA to Colombia flight by phone?", "Yes. Discuss your U.S. departure, Colombian destination, dates, traveler count, cabin, and itinerary preferences with a specialist."],
      ["Can you help change an Avianca flight?", "We can discuss possible reservation changes or rebooking, subject to the ticket rules, how it was issued, airline policy, and availability."],
      ["Which Colombian airport is the main international gateway?", "Bogotá El Dorado (BOG) is the principal international gateway, with Medellín, Cartagena, Cali, and Barranquilla serving other travel needs."],
      ["Are you Avianca customer service?", "No. TicketDepart is an independent travel agency and is not Avianca's official customer service or affiliated with the airline."],
    ],
  },
  {
    path: "/flights-usa-to-greece",
    country: "Greece",
    title: "USA to Greece Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "Plan USA to Greece flights by phone for Athens, islands and other destinations, including booking, changes, cancellations, rebooking, connections and baggage assistance.",
    heading: "USA to Greece flight booking assistance",
    intro: "Planning a trip from the United States to Greece? Discuss Athens and island gateways, U.S. departure airports, connections, cabin choices, baggage, and fare conditions with an independent travel specialist.",
    hub: "Athens International (ATH)",
    airports: ["Athens International (ATH)", "Thessaloniki (SKG)", "Heraklion (HER)", "Rhodes (RHO)", "Santorini (JTR)"],
    airlines: ["Aegean Airlines", "Delta Air Lines", "United Airlines", "American Airlines", "Lufthansa"],
    routes: ["New York to Athens", "Chicago to Athens", "Boston to Athens", "Philadelphia to Athens", "Atlanta to Athens"],
    services: [
      ["Greece flight booking by phone", "Discuss U.S. departure gateways, Athens or island destinations, dates, cabins, connections, baggage, and fare conditions."],
      ["Greece flight change assistance", "Review possible date, time, route, or connection changes subject to the ticket and airline rules."],
      ["Greece cancellation assistance", "Discuss cancellation terms, refund or credit possibilities, and itinerary effects before action is taken."],
      ["Greece rebooking and rescheduling", "Compare replacement flights and dates when plans change, including connections through Athens."],
      ["Athens gateway planning", "Discuss ATH as the main international gateway and how onward domestic or regional flights fit the itinerary."],
      ["Greek island travel planning", "Work through Athens plus island combinations such as Santorini, Rhodes, or Crete when the itinerary supports them."],
    ],
    faqs: [
      ["Can I book USA to Greece flights by phone?", "Yes. A specialist can discuss U.S. departure cities, Athens or island destinations, dates, travelers, cabin, and routing."],
      ["Can you help with a Greece flight change?", "We can review the reservation and discuss possible changes or rebooking. Exact terms depend on the ticket and availability."],
      ["What is Greece's main international gateway?", "Athens International (ATH) is the principal international gateway and a common connection point for onward Greek destinations."],
      ["Can I combine Athens with a Greek island?", "Yes. Multi-city or connected itineraries can be discussed when schedules and fare rules support the trip."],
    ],
  },
  {
    path: "/flights-usa-to-switzerland",
    country: "Switzerland",
    title: "USA to Switzerland Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "Get USA to Switzerland flight assistance by phone for Zurich, Geneva and other destinations, including booking, changes, cancellations, rebooking, baggage and connections.",
    heading: "USA to Switzerland flight booking assistance",
    intro: "Planning travel from the United States to Switzerland? Discuss Zurich, Geneva and other Swiss destinations, U.S. departure airports, connections, cabins, baggage, and fare conditions by phone.",
    hub: "Zurich (ZRH) and Geneva (GVA)",
    airports: ["Zurich (ZRH)", "Geneva (GVA)", "Basel (BSL)", "Bern (BRN)", "Lugano (LUG)"],
    airlines: ["SWISS", "United Airlines", "Delta Air Lines", "American Airlines", "Lufthansa"],
    routes: ["New York to Zurich", "New York to Geneva", "Chicago to Zurich", "Boston to Zurich", "Los Angeles to Zurich"],
    services: [
      ["Switzerland flight booking by phone", "Discuss U.S. departure gateways, Swiss destinations, dates, cabins, connections, baggage, and fare conditions."],
      ["Switzerland flight change assistance", "Review possible changes to dates, times, routing, or connections under the applicable ticket rules."],
      ["Switzerland cancellation assistance", "Discuss cancellation conditions, refund or credit possibilities, and deadlines before authorizing action."],
      ["Switzerland rebooking and rescheduling", "Compare replacement dates and routes when travel plans change and review fare differences."],
      ["Zurich and Geneva gateway planning", "Discuss ZRH and GVA as international gateways and consider the best airport for the trip."],
      ["Switzerland plus Europe travel", "Plan Swiss stops plus France, Italy, Germany, or other European destinations when supported by the itinerary."],
    ],
    faqs: [
      ["Can I book a USA to Switzerland flight by phone?", "Yes. Discuss your U.S. departure, Swiss destination, dates, cabin, travelers, and connection preferences with a specialist."],
      ["Can you help change a SWISS flight?", "We can review the reservation and discuss possible changes or rebooking, subject to ticket rules, airline policy, availability, and how the ticket was issued."],
      ["Which Swiss airports are useful for international travel?", "Zurich (ZRH) is the primary international gateway, while Geneva (GVA) is important for western Switzerland and other specific itineraries."],
      ["Are you SWISS official customer service?", "No. TicketDepart is an independent travel agency and is not SWISS official customer service or affiliated with the airline."],
    ],
  },
  {
    path: "/flights-usa-to-netherlands",
    country: "Netherlands",
    title: "USA to Netherlands Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "U.S. travelers can discuss Netherlands flight booking, changes, cancellations, rebooking, major gateways, airlines, connections, and baggage by phone with an independent travel specialist.",
    heading: "USA to Netherlands flight booking assistance",
    intro: "Planning travel from the United States to Netherlands? Discuss major destinations, U.S. departure airports, connections, cabins, baggage, and fare conditions with an independent travel specialist by phone.",
    hub: "Amsterdam Schiphol (AMS)",
    airports: ["Amsterdam Schiphol (AMS)","Rotterdam The Hague (RTM)","Eindhoven (EIN)"],
    airlines: ["KLM","Delta Air Lines","United Airlines","American Airlines","Lufthansa"],
    routes: ["New York to Amsterdam","Atlanta to Amsterdam","Chicago to Amsterdam","Los Angeles to Amsterdam","Boston to Amsterdam"],
    services: [["Netherlands flight booking by phone","Discuss U.S. departure airports, Netherlands destinations, dates, cabins, connections, baggage, and applicable fare conditions before booking."],["Netherlands flight change assistance","Review possible date, time, route, or connection changes for an existing reservation under the applicable ticket rules."],["Netherlands flight cancellation assistance","Discuss cancellation timing, refund or credit possibilities, deadlines, and effects on connected itinerary segments before action."],["Netherlands flight rebooking and rescheduling","Compare replacement dates and routes when plans change and review availability and possible fare differences."],["Netherlands gateway planning","Discuss Amsterdam Schiphol (AMS) and other major gateways and how airport choice can affect connections and onward travel."],["Netherlands multi-city travel","Plan combinations involving major cities in Netherlands or onward international destinations when supported by the itinerary."]],
    faqs: [["Can I book a flight from the USA to Netherlands by phone?","Yes. A specialist can discuss your U.S. departure, Netherlands destination, dates, travelers, cabin, and itinerary preferences."],["Can you help change a Netherlands flight?","We can review the reservation and discuss possible changes or rebooking. Exact eligibility and cost depend on the ticket rules, airline policy, availability, and how it was issued."],["What are the main Netherlands international gateways?","Common gateways include Amsterdam Schiphol (AMS) and Rotterdam The Hague (RTM). The best airport depends on the final destination and available itinerary."],["Is TicketDepart official airline customer service for Netherlands?","No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by any airline mentioned on this page."]],
  },
  {
    path: "/flights-usa-to-uae",
    country: "UAE",
    title: "USA to UAE Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "U.S. travelers can discuss UAE flight booking, changes, cancellations, rebooking, major gateways, airlines, connections, and baggage by phone with an independent travel specialist.",
    heading: "USA to UAE flight booking assistance",
    intro: "Planning travel from the United States to UAE? Discuss major destinations, U.S. departure airports, connections, cabins, baggage, and fare conditions with an independent travel specialist by phone.",
    hub: "Dubai International (DXB) and Abu Dhabi (AUH)",
    airports: ["Dubai International (DXB)","Abu Dhabi (AUH)","Sharjah (SHJ)","Ras Al Khaimah (RKT)"],
    airlines: ["Emirates","Etihad Airways","United Airlines","Delta Air Lines","Qatar Airways"],
    routes: ["New York to Dubai","Los Angeles to Dubai","Chicago to Dubai","Washington to Dubai","New York to Abu Dhabi"],
    services: [["UAE flight booking by phone","Discuss U.S. departure airports, UAE destinations, dates, cabins, connections, baggage, and applicable fare conditions before booking."],["UAE flight change assistance","Review possible date, time, route, or connection changes for an existing reservation under the applicable ticket rules."],["UAE flight cancellation assistance","Discuss cancellation timing, refund or credit possibilities, deadlines, and effects on connected itinerary segments before action."],["UAE flight rebooking and rescheduling","Compare replacement dates and routes when plans change and review availability and possible fare differences."],["UAE gateway planning","Discuss Dubai International (DXB) and Abu Dhabi (AUH) and other major gateways and how airport choice can affect connections and onward travel."],["UAE multi-city travel","Plan combinations involving major cities in UAE or onward international destinations when supported by the itinerary."]],
    faqs: [["Can I book a flight from the USA to UAE by phone?","Yes. A specialist can discuss your U.S. departure, UAE destination, dates, travelers, cabin, and itinerary preferences."],["Can you help change a UAE flight?","We can review the reservation and discuss possible changes or rebooking. Exact eligibility and cost depend on the ticket rules, airline policy, availability, and how it was issued."],["What are the main UAE international gateways?","Common gateways include Dubai International (DXB) and Abu Dhabi (AUH). The best airport depends on the final destination and available itinerary."],["Is TicketDepart official airline customer service for UAE?","No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by any airline mentioned on this page."]],
  },
  {
    path: "/flights-usa-to-qatar",
    country: "Qatar",
    title: "USA to Qatar Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "U.S. travelers can discuss Qatar flight booking, changes, cancellations, rebooking, major gateways, airlines, connections, and baggage by phone with an independent travel specialist.",
    heading: "USA to Qatar flight booking assistance",
    intro: "Planning travel from the United States to Qatar? Discuss major destinations, U.S. departure airports, connections, cabins, baggage, and fare conditions with an independent travel specialist by phone.",
    hub: "Hamad International (DOH)",
    airports: ["Hamad International (DOH)"],
    airlines: ["Qatar Airways","American Airlines","British Airways","United Airlines","Emirates"],
    routes: ["New York to Doha","Chicago to Doha","Dallas to Doha","Los Angeles to Doha","Washington to Doha"],
    services: [["Qatar flight booking by phone","Discuss U.S. departure airports, Qatar destinations, dates, cabins, connections, baggage, and applicable fare conditions before booking."],["Qatar flight change assistance","Review possible date, time, route, or connection changes for an existing reservation under the applicable ticket rules."],["Qatar flight cancellation assistance","Discuss cancellation timing, refund or credit possibilities, deadlines, and effects on connected itinerary segments before action."],["Qatar flight rebooking and rescheduling","Compare replacement dates and routes when plans change and review availability and possible fare differences."],["Qatar gateway planning","Discuss Hamad International (DOH) and other major gateways and how airport choice can affect connections and onward travel."],["Qatar multi-city travel","Plan combinations involving major cities in Qatar or onward international destinations when supported by the itinerary."]],
    faqs: [["Can I book a flight from the USA to Qatar by phone?","Yes. A specialist can discuss your U.S. departure, Qatar destination, dates, travelers, cabin, and itinerary preferences."],["Can you help change a Qatar flight?","We can review the reservation and discuss possible changes or rebooking. Exact eligibility and cost depend on the ticket rules, airline policy, availability, and how it was issued."],["What are the main Qatar international gateways?","Common gateways include Hamad International (DOH). The best airport depends on the final destination and available itinerary."],["Is TicketDepart official airline customer service for Qatar?","No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by any airline mentioned on this page."]],
  },
  {
    path: "/flights-usa-to-saudi-arabia",
    country: "Saudi Arabia",
    title: "USA to Saudi Arabia Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "U.S. travelers can discuss Saudi Arabia flight booking, changes, cancellations, rebooking, major gateways, airlines, connections, and baggage by phone with an independent travel specialist.",
    heading: "USA to Saudi Arabia flight booking assistance",
    intro: "Planning travel from the United States to Saudi Arabia? Discuss major destinations, U.S. departure airports, connections, cabins, baggage, and fare conditions with an independent travel specialist by phone.",
    hub: "King Khalid (RUH) and King Abdulaziz (JED)",
    airports: ["King Khalid (RUH)","King Abdulaziz (JED)","King Fahd (DMM)","Prince Mohammad bin Abdulaziz (MED)"],
    airlines: ["Saudia","flynas","American Airlines","United Airlines","Qatar Airways"],
    routes: ["New York to Riyadh","Washington to Riyadh","New York to Jeddah","Los Angeles to Riyadh","Chicago to Jeddah"],
    services: [["Saudi Arabia flight booking by phone","Discuss U.S. departure airports, Saudi Arabia destinations, dates, cabins, connections, baggage, and applicable fare conditions before booking."],["Saudi Arabia flight change assistance","Review possible date, time, route, or connection changes for an existing reservation under the applicable ticket rules."],["Saudi Arabia flight cancellation assistance","Discuss cancellation timing, refund or credit possibilities, deadlines, and effects on connected itinerary segments before action."],["Saudi Arabia flight rebooking and rescheduling","Compare replacement dates and routes when plans change and review availability and possible fare differences."],["Saudi Arabia gateway planning","Discuss King Khalid (RUH) and King Abdulaziz (JED) and other major gateways and how airport choice can affect connections and onward travel."],["Saudi Arabia multi-city travel","Plan combinations involving major cities in Saudi Arabia or onward international destinations when supported by the itinerary."]],
    faqs: [["Can I book a flight from the USA to Saudi Arabia by phone?","Yes. A specialist can discuss your U.S. departure, Saudi Arabia destination, dates, travelers, cabin, and itinerary preferences."],["Can you help change a Saudi Arabia flight?","We can review the reservation and discuss possible changes or rebooking. Exact eligibility and cost depend on the ticket rules, airline policy, availability, and how it was issued."],["What are the main Saudi Arabia international gateways?","Common gateways include King Khalid (RUH) and King Abdulaziz (JED). The best airport depends on the final destination and available itinerary."],["Is TicketDepart official airline customer service for Saudi Arabia?","No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by any airline mentioned on this page."]],
  },
  {
    path: "/flights-usa-to-turkiye",
    country: "Türkiye",
    title: "USA to Türkiye Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "U.S. travelers can discuss Türkiye flight booking, changes, cancellations, rebooking, major gateways, airlines, connections, and baggage by phone with an independent travel specialist.",
    heading: "USA to Türkiye flight booking assistance",
    intro: "Planning travel from the United States to Türkiye? Discuss major destinations, U.S. departure airports, connections, cabins, baggage, and fare conditions with an independent travel specialist by phone.",
    hub: "Istanbul Airport (IST)",
    airports: ["Istanbul Airport (IST)","Sabiha Gökçen (SAW)","Antalya (AYT)","Izmir Adnan Menderes (ADB)"],
    airlines: ["Turkish Airlines","United Airlines","Delta Air Lines","American Airlines","Lufthansa"],
    routes: ["New York to Istanbul","Chicago to Istanbul","Miami to Istanbul","Los Angeles to Istanbul","Washington to Istanbul"],
    services: [["Türkiye flight booking by phone","Discuss U.S. departure airports, Türkiye destinations, dates, cabins, connections, baggage, and applicable fare conditions before booking."],["Türkiye flight change assistance","Review possible date, time, route, or connection changes for an existing reservation under the applicable ticket rules."],["Türkiye flight cancellation assistance","Discuss cancellation timing, refund or credit possibilities, deadlines, and effects on connected itinerary segments before action."],["Türkiye flight rebooking and rescheduling","Compare replacement dates and routes when plans change and review availability and possible fare differences."],["Türkiye gateway planning","Discuss Istanbul Airport (IST) and other major gateways and how airport choice can affect connections and onward travel."],["Türkiye multi-city travel","Plan combinations involving major cities in Türkiye or onward international destinations when supported by the itinerary."]],
    faqs: [["Can I book a flight from the USA to Türkiye by phone?","Yes. A specialist can discuss your U.S. departure, Türkiye destination, dates, travelers, cabin, and itinerary preferences."],["Can you help change a Türkiye flight?","We can review the reservation and discuss possible changes or rebooking. Exact eligibility and cost depend on the ticket rules, airline policy, availability, and how it was issued."],["What are the main Türkiye international gateways?","Common gateways include Istanbul Airport (IST) and Sabiha Gökçen (SAW). The best airport depends on the final destination and available itinerary."],["Is TicketDepart official airline customer service for Türkiye?","No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by any airline mentioned on this page."]],
  },
  {
    path: "/flights-usa-to-morocco",
    country: "Morocco",
    title: "USA to Morocco Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "U.S. travelers can discuss Morocco flight booking, changes, cancellations, rebooking, major gateways, airlines, connections, and baggage by phone with an independent travel specialist.",
    heading: "USA to Morocco flight booking assistance",
    intro: "Planning travel from the United States to Morocco? Discuss major destinations, U.S. departure airports, connections, cabins, baggage, and fare conditions with an independent travel specialist by phone.",
    hub: "Mohammed V International (CMN)",
    airports: ["Mohammed V International (CMN)","Marrakesh Menara (RAK)","Agadir-Al Massira (AGA)","Tangier Ibn Battuta (TNG)"],
    airlines: ["Royal Air Maroc","Delta Air Lines","Air France","United Airlines","Iberia"],
    routes: ["New York to Casablanca","Washington to Casablanca","New York to Marrakesh","Miami to Casablanca","Los Angeles to Casablanca"],
    services: [["Morocco flight booking by phone","Discuss U.S. departure airports, Morocco destinations, dates, cabins, connections, baggage, and applicable fare conditions before booking."],["Morocco flight change assistance","Review possible date, time, route, or connection changes for an existing reservation under the applicable ticket rules."],["Morocco flight cancellation assistance","Discuss cancellation timing, refund or credit possibilities, deadlines, and effects on connected itinerary segments before action."],["Morocco flight rebooking and rescheduling","Compare replacement dates and routes when plans change and review availability and possible fare differences."],["Morocco gateway planning","Discuss Mohammed V International (CMN) and other major gateways and how airport choice can affect connections and onward travel."],["Morocco multi-city travel","Plan combinations involving major cities in Morocco or onward international destinations when supported by the itinerary."]],
    faqs: [["Can I book a flight from the USA to Morocco by phone?","Yes. A specialist can discuss your U.S. departure, Morocco destination, dates, travelers, cabin, and itinerary preferences."],["Can you help change a Morocco flight?","We can review the reservation and discuss possible changes or rebooking. Exact eligibility and cost depend on the ticket rules, airline policy, availability, and how it was issued."],["What are the main Morocco international gateways?","Common gateways include Mohammed V International (CMN) and Marrakesh Menara (RAK). The best airport depends on the final destination and available itinerary."],["Is TicketDepart official airline customer service for Morocco?","No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by any airline mentioned on this page."]],
  },
  {
    path: "/flights-usa-to-south-africa",
    country: "South Africa",
    title: "USA to South Africa Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "U.S. travelers can discuss South Africa flight booking, changes, cancellations, rebooking, major gateways, airlines, connections, and baggage by phone with an independent travel specialist.",
    heading: "USA to South Africa flight booking assistance",
    intro: "Planning travel from the United States to South Africa? Discuss major destinations, U.S. departure airports, connections, cabins, baggage, and fare conditions with an independent travel specialist by phone.",
    hub: "O. R. Tambo (JNB) and Cape Town (CPT)",
    airports: ["O. R. Tambo (JNB)","Cape Town (CPT)","King Shaka (DUR)"],
    airlines: ["South African Airways","United Airlines","Delta Air Lines","Qatar Airways","Emirates"],
    routes: ["New York to Johannesburg","Atlanta to Johannesburg","Washington to Johannesburg","Newark to Cape Town","New York to Cape Town"],
    services: [["South Africa flight booking by phone","Discuss U.S. departure airports, South Africa destinations, dates, cabins, connections, baggage, and applicable fare conditions before booking."],["South Africa flight change assistance","Review possible date, time, route, or connection changes for an existing reservation under the applicable ticket rules."],["South Africa flight cancellation assistance","Discuss cancellation timing, refund or credit possibilities, deadlines, and effects on connected itinerary segments before action."],["South Africa flight rebooking and rescheduling","Compare replacement dates and routes when plans change and review availability and possible fare differences."],["South Africa gateway planning","Discuss O. R. Tambo (JNB) and Cape Town (CPT) and other major gateways and how airport choice can affect connections and onward travel."],["South Africa multi-city travel","Plan combinations involving major cities in South Africa or onward international destinations when supported by the itinerary."]],
    faqs: [["Can I book a flight from the USA to South Africa by phone?","Yes. A specialist can discuss your U.S. departure, South Africa destination, dates, travelers, cabin, and itinerary preferences."],["Can you help change a South Africa flight?","We can review the reservation and discuss possible changes or rebooking. Exact eligibility and cost depend on the ticket rules, airline policy, availability, and how it was issued."],["What are the main South Africa international gateways?","Common gateways include O. R. Tambo (JNB) and Cape Town (CPT). The best airport depends on the final destination and available itinerary."],["Is TicketDepart official airline customer service for South Africa?","No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by any airline mentioned on this page."]],
  },
  {
    path: "/flights-usa-to-south-korea",
    country: "South Korea",
    title: "USA to South Korea Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "U.S. travelers can discuss South Korea flight booking, changes, cancellations, rebooking, major gateways, airlines, connections, and baggage by phone with an independent travel specialist.",
    heading: "USA to South Korea flight booking assistance",
    intro: "Planning travel from the United States to South Korea? Discuss major destinations, U.S. departure airports, connections, cabins, baggage, and fare conditions with an independent travel specialist by phone.",
    hub: "Incheon International (ICN)",
    airports: ["Incheon International (ICN)","Gimpo (GMP)","Gimhae (PUS)"],
    airlines: ["Korean Air","Asiana Airlines","Delta Air Lines","United Airlines","American Airlines"],
    routes: ["New York to Seoul","Los Angeles to Seoul","San Francisco to Seoul","Atlanta to Seoul","Dallas to Seoul"],
    services: [["South Korea flight booking by phone","Discuss U.S. departure airports, South Korea destinations, dates, cabins, connections, baggage, and applicable fare conditions before booking."],["South Korea flight change assistance","Review possible date, time, route, or connection changes for an existing reservation under the applicable ticket rules."],["South Korea flight cancellation assistance","Discuss cancellation timing, refund or credit possibilities, deadlines, and effects on connected itinerary segments before action."],["South Korea flight rebooking and rescheduling","Compare replacement dates and routes when plans change and review availability and possible fare differences."],["South Korea gateway planning","Discuss Incheon International (ICN) and other major gateways and how airport choice can affect connections and onward travel."],["South Korea multi-city travel","Plan combinations involving major cities in South Korea or onward international destinations when supported by the itinerary."]],
    faqs: [["Can I book a flight from the USA to South Korea by phone?","Yes. A specialist can discuss your U.S. departure, South Korea destination, dates, travelers, cabin, and itinerary preferences."],["Can you help change a South Korea flight?","We can review the reservation and discuss possible changes or rebooking. Exact eligibility and cost depend on the ticket rules, airline policy, availability, and how it was issued."],["What are the main South Korea international gateways?","Common gateways include Incheon International (ICN) and Gimpo (GMP). The best airport depends on the final destination and available itinerary."],["Is TicketDepart official airline customer service for South Korea?","No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by any airline mentioned on this page."]],
  },
  {
    path: "/flights-usa-to-philippines",
    country: "Philippines",
    title: "USA to Philippines Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "U.S. travelers can discuss Philippines flight booking, changes, cancellations, rebooking, major gateways, airlines, connections, and baggage by phone with an independent travel specialist.",
    heading: "USA to Philippines flight booking assistance",
    intro: "Planning travel from the United States to Philippines? Discuss major destinations, U.S. departure airports, connections, cabins, baggage, and fare conditions with an independent travel specialist by phone.",
    hub: "Ninoy Aquino International (MNL)",
    airports: ["Ninoy Aquino International (MNL)","Mactan-Cebu (CEB)","Clark International (CRK)"],
    airlines: ["Philippine Airlines","Cebu Pacific","United Airlines","Delta Air Lines","American Airlines"],
    routes: ["Los Angeles to Manila","San Francisco to Manila","New York to Manila","Honolulu to Manila","Los Angeles to Cebu"],
    services: [["Philippines flight booking by phone","Discuss U.S. departure airports, Philippines destinations, dates, cabins, connections, baggage, and applicable fare conditions before booking."],["Philippines flight change assistance","Review possible date, time, route, or connection changes for an existing reservation under the applicable ticket rules."],["Philippines flight cancellation assistance","Discuss cancellation timing, refund or credit possibilities, deadlines, and effects on connected itinerary segments before action."],["Philippines flight rebooking and rescheduling","Compare replacement dates and routes when plans change and review availability and possible fare differences."],["Philippines gateway planning","Discuss Ninoy Aquino International (MNL) and other major gateways and how airport choice can affect connections and onward travel."],["Philippines multi-city travel","Plan combinations involving major cities in Philippines or onward international destinations when supported by the itinerary."]],
    faqs: [["Can I book a flight from the USA to Philippines by phone?","Yes. A specialist can discuss your U.S. departure, Philippines destination, dates, travelers, cabin, and itinerary preferences."],["Can you help change a Philippines flight?","We can review the reservation and discuss possible changes or rebooking. Exact eligibility and cost depend on the ticket rules, airline policy, availability, and how it was issued."],["What are the main Philippines international gateways?","Common gateways include Ninoy Aquino International (MNL) and Mactan-Cebu (CEB). The best airport depends on the final destination and available itinerary."],["Is TicketDepart official airline customer service for Philippines?","No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by any airline mentioned on this page."]],
  },
  {
    path: "/flights-usa-to-singapore",
    country: "Singapore",
    title: "USA to Singapore Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "U.S. travelers can discuss Singapore flight booking, changes, cancellations, rebooking, major gateways, airlines, connections, and baggage by phone with an independent travel specialist.",
    heading: "USA to Singapore flight booking assistance",
    intro: "Planning travel from the United States to Singapore? Discuss major destinations, U.S. departure airports, connections, cabins, baggage, and fare conditions with an independent travel specialist by phone.",
    hub: "Singapore Changi (SIN)",
    airports: ["Singapore Changi (SIN)"],
    airlines: ["Singapore Airlines","United Airlines","Delta Air Lines","American Airlines","British Airways"],
    routes: ["New York to Singapore","San Francisco to Singapore","Los Angeles to Singapore","Seattle to Singapore","Houston to Singapore"],
    services: [["Singapore flight booking by phone","Discuss U.S. departure airports, Singapore destinations, dates, cabins, connections, baggage, and applicable fare conditions before booking."],["Singapore flight change assistance","Review possible date, time, route, or connection changes for an existing reservation under the applicable ticket rules."],["Singapore flight cancellation assistance","Discuss cancellation timing, refund or credit possibilities, deadlines, and effects on connected itinerary segments before action."],["Singapore flight rebooking and rescheduling","Compare replacement dates and routes when plans change and review availability and possible fare differences."],["Singapore gateway planning","Discuss Singapore Changi (SIN) and other major gateways and how airport choice can affect connections and onward travel."],["Singapore multi-city travel","Plan combinations involving major cities in Singapore or onward international destinations when supported by the itinerary."]],
    faqs: [["Can I book a flight from the USA to Singapore by phone?","Yes. A specialist can discuss your U.S. departure, Singapore destination, dates, travelers, cabin, and itinerary preferences."],["Can you help change a Singapore flight?","We can review the reservation and discuss possible changes or rebooking. Exact eligibility and cost depend on the ticket rules, airline policy, availability, and how it was issued."],["What are the main Singapore international gateways?","Common gateways include Singapore Changi (SIN). The best airport depends on the final destination and available itinerary."],["Is TicketDepart official airline customer service for Singapore?","No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by any airline mentioned on this page."]],
  },
  {
    path: "/flights-usa-to-malaysia",
    country: "Malaysia",
    title: "USA to Malaysia Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "U.S. travelers can discuss Malaysia flight booking, changes, cancellations, rebooking, major gateways, airlines, connections, and baggage by phone with an independent travel specialist.",
    heading: "USA to Malaysia flight booking assistance",
    intro: "Planning travel from the United States to Malaysia? Discuss major destinations, U.S. departure airports, connections, cabins, baggage, and fare conditions with an independent travel specialist by phone.",
    hub: "Kuala Lumpur International (KUL)",
    airports: ["Kuala Lumpur International (KUL)","Penang International (PEN)","Kota Kinabalu (BKI)"],
    airlines: ["Malaysia Airlines","AirAsia","United Airlines","Singapore Airlines","Qatar Airways"],
    routes: ["New York to Kuala Lumpur","Los Angeles to Kuala Lumpur","San Francisco to Kuala Lumpur","Seattle to Kuala Lumpur","Newark to Kuala Lumpur"],
    services: [["Malaysia flight booking by phone","Discuss U.S. departure airports, Malaysia destinations, dates, cabins, connections, baggage, and applicable fare conditions before booking."],["Malaysia flight change assistance","Review possible date, time, route, or connection changes for an existing reservation under the applicable ticket rules."],["Malaysia flight cancellation assistance","Discuss cancellation timing, refund or credit possibilities, deadlines, and effects on connected itinerary segments before action."],["Malaysia flight rebooking and rescheduling","Compare replacement dates and routes when plans change and review availability and possible fare differences."],["Malaysia gateway planning","Discuss Kuala Lumpur International (KUL) and other major gateways and how airport choice can affect connections and onward travel."],["Malaysia multi-city travel","Plan combinations involving major cities in Malaysia or onward international destinations when supported by the itinerary."]],
    faqs: [["Can I book a flight from the USA to Malaysia by phone?","Yes. A specialist can discuss your U.S. departure, Malaysia destination, dates, travelers, cabin, and itinerary preferences."],["Can you help change a Malaysia flight?","We can review the reservation and discuss possible changes or rebooking. Exact eligibility and cost depend on the ticket rules, airline policy, availability, and how it was issued."],["What are the main Malaysia international gateways?","Common gateways include Kuala Lumpur International (KUL) and Penang International (PEN). The best airport depends on the final destination and available itinerary."],["Is TicketDepart official airline customer service for Malaysia?","No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by any airline mentioned on this page."]],
  },
  {
    path: "/flights-usa-to-thailand",
    country: "Thailand",
    title: "USA to Thailand Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "U.S. travelers can discuss Thailand flight booking, changes, cancellations, rebooking, major gateways, airlines, connections, and baggage by phone with an independent travel specialist.",
    heading: "USA to Thailand flight booking assistance",
    intro: "Planning travel from the United States to Thailand? Discuss major destinations, U.S. departure airports, connections, cabins, baggage, and fare conditions with an independent travel specialist by phone.",
    hub: "Suvarnabhumi (BKK) and Don Mueang (DMK)",
    airports: ["Suvarnabhumi (BKK)","Don Mueang (DMK)","Phuket (HKT)","Chiang Mai (CNX)"],
    airlines: ["Thai Airways","Thai AirAsia","United Airlines","Singapore Airlines","Qatar Airways"],
    routes: ["New York to Bangkok","Los Angeles to Bangkok","San Francisco to Bangkok","Chicago to Bangkok","Seattle to Bangkok"],
    services: [["Thailand flight booking by phone","Discuss U.S. departure airports, Thailand destinations, dates, cabins, connections, baggage, and applicable fare conditions before booking."],["Thailand flight change assistance","Review possible date, time, route, or connection changes for an existing reservation under the applicable ticket rules."],["Thailand flight cancellation assistance","Discuss cancellation timing, refund or credit possibilities, deadlines, and effects on connected itinerary segments before action."],["Thailand flight rebooking and rescheduling","Compare replacement dates and routes when plans change and review availability and possible fare differences."],["Thailand gateway planning","Discuss Suvarnabhumi (BKK) and Don Mueang (DMK) and other major gateways and how airport choice can affect connections and onward travel."],["Thailand multi-city travel","Plan combinations involving major cities in Thailand or onward international destinations when supported by the itinerary."]],
    faqs: [["Can I book a flight from the USA to Thailand by phone?","Yes. A specialist can discuss your U.S. departure, Thailand destination, dates, travelers, cabin, and itinerary preferences."],["Can you help change a Thailand flight?","We can review the reservation and discuss possible changes or rebooking. Exact eligibility and cost depend on the ticket rules, airline policy, availability, and how it was issued."],["What are the main Thailand international gateways?","Common gateways include Suvarnabhumi (BKK) and Don Mueang (DMK). The best airport depends on the final destination and available itinerary."],["Is TicketDepart official airline customer service for Thailand?","No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by any airline mentioned on this page."]],
  },
  {
    path: "/flights-usa-to-vietnam",
    country: "Vietnam",
    title: "USA to Vietnam Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "U.S. travelers can discuss Vietnam flight booking, changes, cancellations, rebooking, major gateways, airlines, connections, and baggage by phone with an independent travel specialist.",
    heading: "USA to Vietnam flight booking assistance",
    intro: "Planning travel from the United States to Vietnam? Discuss major destinations, U.S. departure airports, connections, cabins, baggage, and fare conditions with an independent travel specialist by phone.",
    hub: "Tan Son Nhat (SGN) and Noi Bai (HAN)",
    airports: ["Tan Son Nhat (SGN)","Noi Bai (HAN)","Da Nang (DAD)"],
    airlines: ["Vietnam Airlines","VietJet Air","United Airlines","Korean Air","Singapore Airlines"],
    routes: ["Los Angeles to Ho Chi Minh City","San Francisco to Ho Chi Minh City","Los Angeles to Hanoi","New York to Ho Chi Minh City","Seattle to Hanoi"],
    services: [["Vietnam flight booking by phone","Discuss U.S. departure airports, Vietnam destinations, dates, cabins, connections, baggage, and applicable fare conditions before booking."],["Vietnam flight change assistance","Review possible date, time, route, or connection changes for an existing reservation under the applicable ticket rules."],["Vietnam flight cancellation assistance","Discuss cancellation timing, refund or credit possibilities, deadlines, and effects on connected itinerary segments before action."],["Vietnam flight rebooking and rescheduling","Compare replacement dates and routes when plans change and review availability and possible fare differences."],["Vietnam gateway planning","Discuss Tan Son Nhat (SGN) and Noi Bai (HAN) and other major gateways and how airport choice can affect connections and onward travel."],["Vietnam multi-city travel","Plan combinations involving major cities in Vietnam or onward international destinations when supported by the itinerary."]],
    faqs: [["Can I book a flight from the USA to Vietnam by phone?","Yes. A specialist can discuss your U.S. departure, Vietnam destination, dates, travelers, cabin, and itinerary preferences."],["Can you help change a Vietnam flight?","We can review the reservation and discuss possible changes or rebooking. Exact eligibility and cost depend on the ticket rules, airline policy, availability, and how it was issued."],["What are the main Vietnam international gateways?","Common gateways include Tan Son Nhat (SGN) and Noi Bai (HAN). The best airport depends on the final destination and available itinerary."],["Is TicketDepart official airline customer service for Vietnam?","No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by any airline mentioned on this page."]],
  },
  {
    path: "/flights-usa-to-indonesia",
    country: "Indonesia",
    title: "USA to Indonesia Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "U.S. travelers can discuss Indonesia flight booking, changes, cancellations, rebooking, major gateways, airlines, connections, and baggage by phone with an independent travel specialist.",
    heading: "USA to Indonesia flight booking assistance",
    intro: "Planning travel from the United States to Indonesia? Discuss major destinations, U.S. departure airports, connections, cabins, baggage, and fare conditions with an independent travel specialist by phone.",
    hub: "Soekarno-Hatta (CGK) and Ngurah Rai (DPS)",
    airports: ["Soekarno-Hatta (CGK)","Ngurah Rai (DPS)","Juanda (SUB)"],
    airlines: ["Garuda Indonesia","AirAsia","Singapore Airlines","Qatar Airways","United Airlines"],
    routes: ["Los Angeles to Jakarta","Los Angeles to Bali","San Francisco to Bali","New York to Jakarta","Seattle to Bali"],
    services: [["Indonesia flight booking by phone","Discuss U.S. departure airports, Indonesia destinations, dates, cabins, connections, baggage, and applicable fare conditions before booking."],["Indonesia flight change assistance","Review possible date, time, route, or connection changes for an existing reservation under the applicable ticket rules."],["Indonesia flight cancellation assistance","Discuss cancellation timing, refund or credit possibilities, deadlines, and effects on connected itinerary segments before action."],["Indonesia flight rebooking and rescheduling","Compare replacement dates and routes when plans change and review availability and possible fare differences."],["Indonesia gateway planning","Discuss Soekarno-Hatta (CGK) and Ngurah Rai (DPS) and other major gateways and how airport choice can affect connections and onward travel."],["Indonesia multi-city travel","Plan combinations involving major cities in Indonesia or onward international destinations when supported by the itinerary."]],
    faqs: [["Can I book a flight from the USA to Indonesia by phone?","Yes. A specialist can discuss your U.S. departure, Indonesia destination, dates, travelers, cabin, and itinerary preferences."],["Can you help change a Indonesia flight?","We can review the reservation and discuss possible changes or rebooking. Exact eligibility and cost depend on the ticket rules, airline policy, availability, and how it was issued."],["What are the main Indonesia international gateways?","Common gateways include Soekarno-Hatta (CGK) and Ngurah Rai (DPS). The best airport depends on the final destination and available itinerary."],["Is TicketDepart official airline customer service for Indonesia?","No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by any airline mentioned on this page."]],
  },
  {
    path: "/flights-usa-to-taiwan",
    country: "Taiwan",
    title: "USA to Taiwan Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "U.S. travelers can discuss Taiwan flight booking, changes, cancellations, rebooking, major gateways, airlines, connections, and baggage by phone with an independent travel specialist.",
    heading: "USA to Taiwan flight booking assistance",
    intro: "Planning travel from the United States to Taiwan? Discuss major destinations, U.S. departure airports, connections, cabins, baggage, and fare conditions with an independent travel specialist by phone.",
    hub: "Taiwan Taoyuan International (TPE)",
    airports: ["Taiwan Taoyuan International (TPE)","Kaohsiung (KHH)"],
    airlines: ["EVA Air","China Airlines","United Airlines","Delta Air Lines","American Airlines"],
    routes: ["New York to Taipei","Los Angeles to Taipei","San Francisco to Taipei","Seattle to Taipei","Houston to Taipei"],
    services: [["Taiwan flight booking by phone","Discuss U.S. departure airports, Taiwan destinations, dates, cabins, connections, baggage, and applicable fare conditions before booking."],["Taiwan flight change assistance","Review possible date, time, route, or connection changes for an existing reservation under the applicable ticket rules."],["Taiwan flight cancellation assistance","Discuss cancellation timing, refund or credit possibilities, deadlines, and effects on connected itinerary segments before action."],["Taiwan flight rebooking and rescheduling","Compare replacement dates and routes when plans change and review availability and possible fare differences."],["Taiwan gateway planning","Discuss Taiwan Taoyuan International (TPE) and other major gateways and how airport choice can affect connections and onward travel."],["Taiwan multi-city travel","Plan combinations involving major cities in Taiwan or onward international destinations when supported by the itinerary."]],
    faqs: [["Can I book a flight from the USA to Taiwan by phone?","Yes. A specialist can discuss your U.S. departure, Taiwan destination, dates, travelers, cabin, and itinerary preferences."],["Can you help change a Taiwan flight?","We can review the reservation and discuss possible changes or rebooking. Exact eligibility and cost depend on the ticket rules, airline policy, availability, and how it was issued."],["What are the main Taiwan international gateways?","Common gateways include Taiwan Taoyuan International (TPE) and Kaohsiung (KHH). The best airport depends on the final destination and available itinerary."],["Is TicketDepart official airline customer service for Taiwan?","No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by any airline mentioned on this page."]],
  },
  {
    path: "/flights-usa-to-hong-kong",
    country: "Hong Kong",
    title: "USA to Hong Kong Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "U.S. travelers can discuss Hong Kong flight booking, changes, cancellations, rebooking, major gateways, airlines, connections, and baggage by phone with an independent travel specialist.",
    heading: "USA to Hong Kong flight booking assistance",
    intro: "Planning travel from the United States to Hong Kong? Discuss major destinations, U.S. departure airports, connections, cabins, baggage, and fare conditions with an independent travel specialist by phone.",
    hub: "Hong Kong International (HKG)",
    airports: ["Hong Kong International (HKG)"],
    airlines: ["Cathay Pacific","United Airlines","American Airlines","Delta Air Lines","Singapore Airlines"],
    routes: ["New York to Hong Kong","Los Angeles to Hong Kong","San Francisco to Hong Kong","Chicago to Hong Kong","Boston to Hong Kong"],
    services: [["Hong Kong flight booking by phone","Discuss U.S. departure airports, Hong Kong destinations, dates, cabins, connections, baggage, and applicable fare conditions before booking."],["Hong Kong flight change assistance","Review possible date, time, route, or connection changes for an existing reservation under the applicable ticket rules."],["Hong Kong flight cancellation assistance","Discuss cancellation timing, refund or credit possibilities, deadlines, and effects on connected itinerary segments before action."],["Hong Kong flight rebooking and rescheduling","Compare replacement dates and routes when plans change and review availability and possible fare differences."],["Hong Kong gateway planning","Discuss Hong Kong International (HKG) and other major gateways and how airport choice can affect connections and onward travel."],["Hong Kong multi-city travel","Plan combinations involving major cities in Hong Kong or onward international destinations when supported by the itinerary."]],
    faqs: [["Can I book a flight from the USA to Hong Kong by phone?","Yes. A specialist can discuss your U.S. departure, Hong Kong destination, dates, travelers, cabin, and itinerary preferences."],["Can you help change a Hong Kong flight?","We can review the reservation and discuss possible changes or rebooking. Exact eligibility and cost depend on the ticket rules, airline policy, availability, and how it was issued."],["What are the main Hong Kong international gateways?","Common gateways include Hong Kong International (HKG). The best airport depends on the final destination and available itinerary."],["Is TicketDepart official airline customer service for Hong Kong?","No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by any airline mentioned on this page."]],
  },
  {
    path: "/flights-usa-to-mexico",
    country: "Mexico",
    title: "USA to Mexico Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "U.S. travelers can discuss Mexico flight booking, changes, cancellations, rebooking, major gateways, airlines, connections, and baggage by phone with an independent travel specialist.",
    heading: "USA to Mexico flight booking assistance",
    intro: "Planning travel from the United States to Mexico? Discuss major destinations, U.S. departure airports, connections, cabins, baggage, and fare conditions with an independent travel specialist by phone.",
    hub: "Mexico City (MEX) and Cancún (CUN)",
    airports: ["Mexico City (MEX)","Cancún (CUN)","Guadalajara (GDL)","Monterrey (MTY)","Los Cabos (SJD)"],
    airlines: ["Aeroméxico","Volaris","American Airlines","United Airlines","Delta Air Lines"],
    routes: ["Los Angeles to Mexico City","New York to Mexico City","Dallas to Mexico City","Houston to Cancún","Miami to Mexico City"],
    services: [["Mexico flight booking by phone","Discuss U.S. departure airports, Mexico destinations, dates, cabins, connections, baggage, and applicable fare conditions before booking."],["Mexico flight change assistance","Review possible date, time, route, or connection changes for an existing reservation under the applicable ticket rules."],["Mexico flight cancellation assistance","Discuss cancellation timing, refund or credit possibilities, deadlines, and effects on connected itinerary segments before action."],["Mexico flight rebooking and rescheduling","Compare replacement dates and routes when plans change and review availability and possible fare differences."],["Mexico gateway planning","Discuss Mexico City (MEX) and Cancún (CUN) and other major gateways and how airport choice can affect connections and onward travel."],["Mexico multi-city travel","Plan combinations involving major cities in Mexico or onward international destinations when supported by the itinerary."]],
    faqs: [["Can I book a flight from the USA to Mexico by phone?","Yes. A specialist can discuss your U.S. departure, Mexico destination, dates, travelers, cabin, and itinerary preferences."],["Can you help change a Mexico flight?","We can review the reservation and discuss possible changes or rebooking. Exact eligibility and cost depend on the ticket rules, airline policy, availability, and how it was issued."],["What are the main Mexico international gateways?","Common gateways include Mexico City (MEX) and Cancún (CUN). The best airport depends on the final destination and available itinerary."],["Is TicketDepart official airline customer service for Mexico?","No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by any airline mentioned on this page."]],
  },
  {
    path: "/flights-usa-to-canada",
    country: "Canada",
    title: "USA to Canada Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "U.S. travelers can discuss Canada flight booking, changes, cancellations, rebooking, major gateways, airlines, connections, and baggage by phone with an independent travel specialist.",
    heading: "USA to Canada flight booking assistance",
    intro: "Planning travel from the United States to Canada? Discuss major destinations, U.S. departure airports, connections, cabins, baggage, and fare conditions with an independent travel specialist by phone.",
    hub: "Toronto Pearson (YYZ) and Vancouver (YVR)",
    airports: ["Toronto Pearson (YYZ)","Vancouver (YVR)","Montréal-Trudeau (YUL)","Calgary (YYC)","Edmonton (YEG)"],
    airlines: ["Air Canada","WestJet","American Airlines","Delta Air Lines","United Airlines"],
    routes: ["New York to Toronto","Chicago to Toronto","Los Angeles to Vancouver","Seattle to Vancouver","Boston to Montréal"],
    services: [["Canada flight booking by phone","Discuss U.S. departure airports, Canada destinations, dates, cabins, connections, baggage, and applicable fare conditions before booking."],["Canada flight change assistance","Review possible date, time, route, or connection changes for an existing reservation under the applicable ticket rules."],["Canada flight cancellation assistance","Discuss cancellation timing, refund or credit possibilities, deadlines, and effects on connected itinerary segments before action."],["Canada flight rebooking and rescheduling","Compare replacement dates and routes when plans change and review availability and possible fare differences."],["Canada gateway planning","Discuss Toronto Pearson (YYZ) and Vancouver (YVR) and other major gateways and how airport choice can affect connections and onward travel."],["Canada multi-city travel","Plan combinations involving major cities in Canada or onward international destinations when supported by the itinerary."]],
    faqs: [["Can I book a flight from the USA to Canada by phone?","Yes. A specialist can discuss your U.S. departure, Canada destination, dates, travelers, cabin, and itinerary preferences."],["Can you help change a Canada flight?","We can review the reservation and discuss possible changes or rebooking. Exact eligibility and cost depend on the ticket rules, airline policy, availability, and how it was issued."],["What are the main Canada international gateways?","Common gateways include Toronto Pearson (YYZ) and Vancouver (YVR). The best airport depends on the final destination and available itinerary."],["Is TicketDepart official airline customer service for Canada?","No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by any airline mentioned on this page."]],
  },
  {
    path: "/flights-usa-to-uk",
    country: "UK",
    title: "USA to UK Flights | Booking, Change & Rebooking Assistance | TicketDepart",
    description: "U.S. travelers can discuss UK flight booking, changes, cancellations, rebooking, major gateways, airlines, connections, and baggage by phone with an independent travel specialist.",
    heading: "USA to UK flight booking assistance",
    intro: "Planning travel from the United States to UK? Discuss major destinations, U.S. departure airports, connections, cabins, baggage, and fare conditions with an independent travel specialist by phone.",
    hub: "London Heathrow (LHR) and Manchester (MAN)",
    airports: ["London Heathrow (LHR)","London Gatwick (LGW)","Manchester (MAN)","Edinburgh (EDI)"],
    airlines: ["British Airways","Virgin Atlantic","American Airlines","Delta Air Lines","United Airlines"],
    routes: ["New York to London","Boston to London","Chicago to London","Los Angeles to London","Atlanta to London"],
    services: [["UK flight booking by phone","Discuss U.S. departure airports, UK destinations, dates, cabins, connections, baggage, and applicable fare conditions before booking."],["UK flight change assistance","Review possible date, time, route, or connection changes for an existing reservation under the applicable ticket rules."],["UK flight cancellation assistance","Discuss cancellation timing, refund or credit possibilities, deadlines, and effects on connected itinerary segments before action."],["UK flight rebooking and rescheduling","Compare replacement dates and routes when plans change and review availability and possible fare differences."],["UK gateway planning","Discuss London Heathrow (LHR) and Manchester (MAN) and other major gateways and how airport choice can affect connections and onward travel."],["UK multi-city travel","Plan combinations involving major cities in UK or onward international destinations when supported by the itinerary."]],
    faqs: [["Can I book a flight from the USA to UK by phone?","Yes. A specialist can discuss your U.S. departure, UK destination, dates, travelers, cabin, and itinerary preferences."],["Can you help change a UK flight?","We can review the reservation and discuss possible changes or rebooking. Exact eligibility and cost depend on the ticket rules, airline policy, availability, and how it was issued."],["What are the main UK international gateways?","Common gateways include London Heathrow (LHR) and London Gatwick (LGW). The best airport depends on the final destination and available itinerary."],["Is TicketDepart official airline customer service for UK?","No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by any airline mentioned on this page."]],
  },
];

function CountryPageView({ page }: { page: CountryPage }) {
  const id = page.path.slice(1).replaceAll("-", "_");
  const countryKeywords = [
    `${page.country} flights from USA`,
    `USA to ${page.country} flights`,
    `${page.country} flight booking assistance`,
    `${page.country} flight change assistance`,
    `${page.country} flight cancellation assistance`,
    `${page.country} flight rebooking assistance`,
    `${page.country} flight booking by phone`,
  ];

  return (
    <>
      <Seo
        title={page.title}
        description={page.description}
        path={page.path}
        structuredData={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: `USA to ${page.country} flights`, path: page.path },
          ]),
          webPageSchema({ title: page.title, description: page.description, path: page.path }),
          serviceSchema({ name: `USA to ${page.country} flight assistance`, description: page.description, path: page.path }),
        ]}
      />

      <Section tone="paper" ocid={`${id}.hero`}>
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li><Link to="/" className="font-medium hover:text-foreground">Home</Link></li>
            <li aria-hidden="true"><ArrowRight className="size-4" /></li>
            <li><span aria-current="page" className="font-semibold text-foreground">USA to {page.country} flights</span></li>
          </ol>
        </nav>

        <div className="mx-auto mt-10 max-w-4xl">
          <p className="label-board text-accent">U.S. traveler flight assistance</p>
          <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">{page.heading}</h1>
          <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">{page.intro}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CallCta size="lg" ocid={`${id}.hero_call`} />
            <Link to="/book-a-flight-by-phone/" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-card px-6 text-base font-medium text-primary hover:bg-primary hover:text-primary-foreground">
              Book by phone <ArrowRight className="size-4" />
            </Link>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">{SITE.hours}</p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-[1.75rem] border border-border/80 bg-card p-6 shadow-subtle sm:p-7">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
              <ShieldCheck className="size-5 text-accent" />
            </span>
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Independent agency disclosure:</span>{" "}
              TicketDepart is an independent travel agency. We are not affiliated with, endorsed by, or sponsored by any airline named on this page. Airline names and marks belong to their respective owners and are used for identification only.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="muted" ocid={`${id}.gateway`}>
        <SectionHeading
          eyebrow="U.S. to destination planning"
          title={`${page.country} gateways, airlines and U.S. routes`}
          description={`Common planning context includes ${page.hub}, major airports, major airlines, and U.S.-origin routes. Availability changes by date, season, aircraft, airline schedule, and ticket rules.`}
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <article className="rounded-2xl border border-border/80 bg-card p-6 shadow-subtle">
            <h2 className="font-display text-lg font-semibold">Major gateway and airports</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Primary hub: {page.hub}. Other airports worth discussing:</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">{page.airports.map((airport) => <li key={airport} className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />{airport}</li>)}</ul>
          </article>
          <article className="rounded-2xl border border-border/80 bg-card p-6 shadow-subtle">
            <h2 className="font-display text-lg font-semibold">Major airlines</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Airlines commonly relevant to U.S.-origin travel include:</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">{page.airlines.map((airline) => <li key={airline} className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />{airline}</li>)}</ul>
          </article>
          <article className="rounded-2xl border border-border/80 bg-card p-6 shadow-subtle">
            <h2 className="font-display text-lg font-semibold">Example U.S. routes</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Route examples help frame the conversation; they are not a promise of nonstop service.</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">{page.routes.map((route) => <li key={route} className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />{route}</li>)}</ul>
          </article>
        </div>
      </Section>

      <Section tone="paper" ocid={`${id}.services`}>
        <SectionHeading
          eyebrow="Phone assistance"
          title={`${page.country} booking, change, cancellation and rebooking help`}
          description={`Whether you need ${page.country} flight booking assistance, a flight change, cancellation guidance, rebooking, or rescheduling, start with your U.S. departure, destination, dates, and traveler details.`}
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {page.services.map(([title, body]) => (
            <article key={title} className="rounded-2xl border border-border/80 bg-card p-6 shadow-subtle">
              <CheckCircle2 className="size-5 text-accent" />
              <h2 className="mt-4 font-display text-lg font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-border/80 bg-muted/60 p-6">
          <h2 className="font-display text-lg font-semibold">Popular {page.country} flight assistance searches</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            U.S. travelers searching for <span className="font-semibold text-foreground">{countryKeywords.join(", ")}</span> may also need {page.country} flight booking help, USA to {page.country} flight reservations, flights from USA to {page.country}, {page.country} flights by phone, {page.country} flight change help, {page.country} flight cancellation help, {page.country} flight rebooking help, and {page.country} flight rescheduling assistance. This page covers booking a flight to {page.country}, changing an existing {page.country} flight, canceling or reviewing cancellation options, rebooking a missed or changed itinerary, comparing U.S. departure airports, and planning connections through major {page.country} hubs and international airports. It also provides destination-specific context for airline options, gateway airports, U.S. routes, baggage questions, cabin choices, multi-city travel, and reservation support by phone. Related searches can include “book {page.country} flight from USA,” “change {page.country} flight,” “cancel {page.country} flight,” “rebook {page.country} flight,” “{page.country} flight assistance,” and “{page.country} flight booking by phone.”
          </p>
        </div>
      </Section>

      <Section tone="muted" ocid={`${id}.faq`}>
        <SectionHeading eyebrow="FAQ" title={`${page.country} flight assistance questions`} description="Practical questions to consider before you call." />
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 lg:grid-cols-2">
          {page.faqs.map(([question, answer]) => (
            <details key={question} className="rounded-2xl border border-border bg-card p-5 shadow-subtle">
              <summary className="cursor-pointer font-semibold">{question}</summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section tone="paper" ocid={`${id}.cta`}>
        <div className="mx-auto max-w-3xl text-center">
          <p className="label-board text-accent">Available 24/7</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold sm:text-4xl">Talk with a {page.country} flight specialist</h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Call TicketDepart with your U.S. departure city, {page.country} destination, travel dates, traveler details, or existing reservation information when available.
          </p>
          <div className="mt-8"><CallCta size="lg" ocid={`${id}.final_call`} /></div>
        </div>
      </Section>
    </>
  );
}

export function UsaToItalyFlightsPage() { return <CountryPageView page={PAGES[0]} />; }
export function UsaToFranceFlightsPage() { return <CountryPageView page={PAGES[1]} />; }
export function UsaToGermanyFlightsPage() { return <CountryPageView page={PAGES[2]} />; }
export function UsaToSpainFlightsPage() { return <CountryPageView page={PAGES[3]} />; }
export function UsaToJapanFlightsPage() { return <CountryPageView page={PAGES[4]} />; }
export function UsaToChinaFlightsPage() { return <CountryPageView page={PAGES[5]} />; }
export function UsaToBrazilFlightsPage() { return <CountryPageView page={PAGES[6]} />; }
export function UsaToColombiaFlightsPage() { return <CountryPageView page={PAGES[7]} />; }
export function UsaToGreeceFlightsPage() { return <CountryPageView page={PAGES[8]} />; }
export function UsaToSwitzerlandFlightsPage() { return <CountryPageView page={PAGES[9]} />; }
export function UsaToUKFlightsPage() { return <CountryPageView page={PAGES[PAGES.findIndex((p) => p.path === "/flights-usa-to-uk")]} />; }
export function UsaToCanadaFlightsPage() { return <CountryPageView page={PAGES[PAGES.findIndex((p) => p.path === "/flights-usa-to-canada")]} />; }
export function UsaToMexicoFlightsPage() { return <CountryPageView page={PAGES[PAGES.findIndex((p) => p.path === "/flights-usa-to-mexico")]} />; }
export function UsaToHongKongFlightsPage() { return <CountryPageView page={PAGES[PAGES.findIndex((p) => p.path === "/flights-usa-to-hong-kong")]} />; }
export function UsaToTaiwanFlightsPage() { return <CountryPageView page={PAGES[PAGES.findIndex((p) => p.path === "/flights-usa-to-taiwan")]} />; }
export function UsaToIndonesiaFlightsPage() { return <CountryPageView page={PAGES[PAGES.findIndex((p) => p.path === "/flights-usa-to-indonesia")]} />; }
export function UsaToVietnamFlightsPage() { return <CountryPageView page={PAGES[PAGES.findIndex((p) => p.path === "/flights-usa-to-vietnam")]} />; }
export function UsaToThailandFlightsPage() { return <CountryPageView page={PAGES[PAGES.findIndex((p) => p.path === "/flights-usa-to-thailand")]} />; }
export function UsaToMalaysiaFlightsPage() { return <CountryPageView page={PAGES[PAGES.findIndex((p) => p.path === "/flights-usa-to-malaysia")]} />; }
export function UsaToSingaporeFlightsPage() { return <CountryPageView page={PAGES[PAGES.findIndex((p) => p.path === "/flights-usa-to-singapore")]} />; }
export function UsaToPhilippinesFlightsPage() { return <CountryPageView page={PAGES[PAGES.findIndex((p) => p.path === "/flights-usa-to-philippines")]} />; }
export function UsaToSouthKoreaFlightsPage() { return <CountryPageView page={PAGES[PAGES.findIndex((p) => p.path === "/flights-usa-to-south-korea")]} />; }
export function UsaToSouthAfricaFlightsPage() { return <CountryPageView page={PAGES[PAGES.findIndex((p) => p.path === "/flights-usa-to-south-africa")]} />; }
export function UsaToMoroccoFlightsPage() { return <CountryPageView page={PAGES[PAGES.findIndex((p) => p.path === "/flights-usa-to-morocco")]} />; }
export function UsaToTurkiyeFlightsPage() { return <CountryPageView page={PAGES[PAGES.findIndex((p) => p.path === "/flights-usa-to-turkiye")]} />; }
export function UsaToSaudiArabiaFlightsPage() { return <CountryPageView page={PAGES[PAGES.findIndex((p) => p.path === "/flights-usa-to-saudi-arabia")]} />; }
export function UsaToQatarFlightsPage() { return <CountryPageView page={PAGES[PAGES.findIndex((p) => p.path === "/flights-usa-to-qatar")]} />; }
export function UsaToUAEFlightsPage() { return <CountryPageView page={PAGES[PAGES.findIndex((p) => p.path === "/flights-usa-to-uae")]} />; }
export function UsaToNetherlandsFlightsPage() { return <CountryPageView page={PAGES[PAGES.findIndex((p) => p.path === "/flights-usa-to-netherlands")]} />; }
