import { CallCta } from "@/components/CallCta";
import { FlightServiceIntentSection } from "@/components/FlightServiceIntentSection";
import { PageContentExpansion } from "@/components/PageContentExpansion";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { breadcrumbSchema } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

type AirlinePage = {
  slug: string;
  name: string;
  title: string;
  description: string;
  heading: string;
  intro: string;
  services: readonly [string, string][];
  faqs: readonly { question: string; answer: string }[];
};

const AIRLINES: readonly AirlinePage[] = [
  {
    slug: "southwest-airlines",
    name: "Southwest Airlines",
    title: "Southwest Airlines Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency providing Southwest Airlines reservation support for booking, family travel, same-day trips, changes, cancellations, and multi-city itineraries.",
    heading: "Southwest Airlines reservation support from a travel specialist",
    intro: "Planning a Southwest Airlines trip? Tell us your route, dates, travelers, and priorities. A TicketDepart specialist can walk through available itinerary options and applicable terms before you decide to book.",
    services: [
      ["New Flight Booking", "Discuss routes, dates, travelers, schedules, and available fares and best deals before you authorize a booking."],
      ["Family Flight Booking Assistance", "Work through traveler details, baggage needs, schedule priorities, and practical itinerary choices for family trips."],
      ["Same-Day & Urgent Flight Booking", "Discuss current availability, nearby airports, departure timing, and ticketing deadlines for urgent trips."],
      ["Flight Changes & Rebooking", "Review the existing reservation and discuss eligible dates, routing, availability, and any applicable price difference."],
      ["Cancellation Assistance", "Review the ticket terms and discuss whether a refund, credit, or another outcome may apply."],
      ["Multi-City Flight Booking", "Explain each segment of a complex trip and discuss practical itinerary structures before booking."],
    ],
    faqs: [
      { question: "Can I book a Southwest Airlines flight with a specialist?", answer: "Yes. A specialist can discuss your origin, destination, dates, travelers, preferences, and available booking options." },
      { question: "Can you help with an existing Southwest Airlines reservation?", answer: "We can review the reservation and explain available change, rebooking, or cancellation options. Exact outcomes depend on the ticket terms, availability, and applicable rules." },
      { question: "Can you help with a last-minute Southwest Airlines trip?", answer: "Connect with a specialist to discuss current options. Seats, fares, and ticketing deadlines can change quickly, so availability is not guaranteed until ticketing is completed." },
      { question: "Are service fees disclosed before payment?", answer: "Any applicable TicketDepart service fee is disclosed before payment is authorized. Airline fare, taxes, and other applicable charges are also reviewed before you decide." },
    ],
  },
  {
    slug: "jetblue-airways",
    name: "JetBlue Airways",
    title: "JetBlue Airways Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency providing JetBlue Airways reservation support for booking, changes, cancellations, family trips, and urgent travel planning.",
    heading: "JetBlue Airways reservation support from a travel specialist",
    intro: "Planning a JetBlue Airways trip? A TicketDepart specialist can discuss schedules, routes, travelers, fare conditions, and support needs before you confirm your itinerary.",
    services: [
      ["New Flight Booking", "Compare available schedules, fares, and best deals for your dates and explain the fare conditions before booking."],
      ["International Flight Booking Assistance", "Discuss international routing, connection planning, baggage considerations, and travel-document responsibilities."],
      ["Family Flight Booking Assistance", "Work through traveler count, seating preferences, baggage, connection times, and schedule priorities."],
      ["Flight Changes & Rebooking", "Review the existing ticket and discuss date, time, routing, and fare-difference considerations."],
      ["Cancellation Assistance", "Discuss applicable cancellation, refund, or credit rules before any request is processed."],
      ["Last-Minute Flight Booking Assistance", "For urgent trips, discuss current availability, practical airports, connections, and ticketing timing."],
    ],
    faqs: [
      { question: "Can I book a JetBlue Airways flight with a specialist?", answer: "Yes. Share your origin, destination, dates, travelers, and preferences with a specialist, who can discuss available options." },
      { question: "Can you help with a JetBlue flight change?", answer: "We can review the ticket and discuss possible changes or rebooking. Exact costs and eligibility depend on the fare, availability, and applicable rules." },
      { question: "Can you help with international JetBlue itineraries?", answer: "Yes. We can discuss routing and connection considerations, while travelers remain responsible for confirming passport, visa, and entry requirements." },
    ],
  },
  {
    slug: "alaska-airlines",
    name: "Alaska Airlines",
    title: "Alaska Airlines Flight Booking & Reservation Assistance | TicketDepart",
    description: "Book an Alaska Airlines flight by phone with independent reservation assistance. Discuss routes, dates, connections, baggage, changes, and multi-city travel with TicketDepart.",
    heading: "Alaska Airlines flight booking and reservation assistance",
    intro: "Tell TicketDepart where you need to go, when you want to travel, and what matters most. A specialist can discuss Alaska Airlines itinerary options and booking support by phone.",
    services: [
      ["New Flight Booking", "Discuss route, dates, connections, travelers, available fares, and practical departure or arrival airports while exploring available deals."],
      ["West Coast travel", "Review schedules and routing for trips involving Alaska Airlines' network and connection points."],
      ["International Flight Booking Assistance", "Discuss eligible international routing, connections, baggage considerations, and itinerary details."],
      ["Flight Changes & Rebooking", "Review the existing reservation and compare available replacement dates or itineraries."],
      ["Cancellation Assistance", "Discuss refund or credit possibilities under the applicable ticket and airline terms."],
      ["Multi-City Flight Booking", "Work through multiple destinations, open-jaw ideas, and connection preferences before booking."],
    ],
    faqs: [
      { question: "Can you book Alaska Airlines flights with a specialist?", answer: "Yes. Call with your origin, destination, dates, traveler count, and cabin preference if known. A specialist can discuss available Alaska Airlines itinerary and booking options." },
      { question: "Can you help change an Alaska Airlines reservation?", answer: "We can review the reservation and discuss available change or rebooking options. Final terms depend on the ticket and current availability." },
      { question: "Can you help with a multi-city trip?", answer: "Yes. Explain every city and preferred order and a specialist can discuss practical itinerary options." },
    ],
  },
  {
    slug: "british-airways",
    name: "British Airways",
    title: "British Airways Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency providing British Airways reservation support for international itineraries, premium cabins, changes, and cancellations.",
    heading: "British Airways reservation support from a travel specialist",
    intro: "For a British Airways trip, the details can matter: dates, connection airports, cabin, baggage, and fare flexibility. TicketDepart can review those choices with you by phone.",
    services: [
      ["International Flight Booking", "Discuss transatlantic and other international itineraries, connections, travel dates, and available deals."],
      ["Premium Cabin Booking Assistance", "Compare available cabin options and review what the selected fare includes before booking."],
      ["Flight Connection Planning", "Review connection airports and timing across the complete itinerary."],
      ["Flight Changes & Rebooking", "Discuss replacement dates or routing and any applicable fare difference or change terms."],
      ["Cancellation & Refund Assistance", "Review the ticket terms and discuss what cancellation outcome may apply."],
      ["Multi-City Flight Booking", "Plan multiple destinations or open-jaw routing and discuss how the segments fit together."],
    ],
    faqs: [
      { question: "Can you help arrange British Airways international flights with a specialist?", answer: "Yes. We can discuss international routing, cabin preferences, connections, and fare conditions before booking." },
      { question: "Can you help with British Airways changes?", answer: "We can review the existing itinerary and discuss available changes or rebooking options. Exact terms depend on the ticket and current inventory." },
      { question: "Can you help compare premium cabins?", answer: "Yes. We can discuss available cabin options and the conditions that apply to the itinerary you are considering." },
    ],
  },
  {
    slug: "lufthansa",
    name: "Lufthansa",
    title: "Lufthansa Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency providing Lufthansa reservation support for Europe and international itineraries, premium cabins, changes, and cancellations.",
    heading: "Lufthansa reservation support from a travel specialist",
    intro: "Planning a Lufthansa itinerary? A TicketDepart specialist can discuss dates, connections, cabin preferences, baggage considerations, and change flexibility before you book.",
    services: [
      ["International Flight Booking", "Discuss Europe, transatlantic, and other international routing options, available fares, and deals for your travel dates."],
      ["Flight Connection Planning", "Review the full itinerary and practical connection timing rather than looking at each flight in isolation."],
      ["Premium Cabin Booking Assistance", "Discuss available premium-cabin choices and fare conditions for your route."],
      ["Flight Changes & Rebooking", "Review your existing ticket and discuss possible replacement dates, routing, and fare differences."],
      ["Cancellation Assistance", "Discuss refund or credit possibilities based on the specific ticket and applicable rules."],
      ["Multi-City Flight Booking", "Work through several destinations and open-jaw routing before booking."],
    ],
    faqs: [
      { question: "Can you help arrange Lufthansa flights with a specialist?", answer: "Yes. Connect with a specialist with your route and dates and a specialist can discuss available itinerary options." },
      { question: "Can you help with Lufthansa international connections?", answer: "Yes. We can discuss the complete routing and connection considerations, while travelers remain responsible for confirming entry and transit requirements." },
      { question: "Can you help change a Lufthansa booking?", answer: "We can review the ticket and explain available change or rebooking options. Eligibility and cost depend on the fare and availability." },
    ],
  },
  {
    slug: "air-canada",
    name: "Air Canada",
    title: "Air Canada Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency providing Air Canada reservation support for international travel, family itineraries, changes, cancellations, and multi-city trips.",
    heading: "Air Canada reservation support from a travel specialist",
    intro: "Planning an Air Canada itinerary? Tell TicketDepart your route, dates, travelers, and priorities and a specialist can discuss available options by phone.",
    services: [
      ["New Flight Booking", "Discuss schedules, routing, travelers, available fares, and practical airport options while exploring available deals."],
      ["Canada and international travel", "Review itineraries between the U.S., Canada, and international destinations."],
      ["Family Flight Booking Assistance", "Discuss coordinated itineraries, seating needs, baggage, and connection preferences."],
      ["Flight Changes & Rebooking", "Review the existing ticket and discuss possible date, time, or routing changes."],
      ["Cancellation Assistance", "Discuss refund or credit possibilities before you authorize a cancellation."],
      ["Multi-City Flight Booking", "Plan multiple stops and discuss the most practical way to structure the itinerary."],
    ],
    faqs: [
      { question: "Can you book Air Canada flights with a specialist?", answer: "Yes. A specialist can discuss your itinerary and available booking options by phone." },
      { question: "Can you help change an Air Canada flight?", answer: "We can review the reservation and discuss available changes or rebooking options. Exact terms depend on the ticket, availability, and applicable rules." },
      { question: "Can you help with U.S.-Canada and international itineraries?", answer: "Yes. We can discuss routing and connection considerations, while travelers remain responsible for confirming current entry and transit requirements." },
    ],
  },
  {
    slug: "swiss-air",
    name: "SWISS",
    title: "SWISS Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency providing SWISS reservation support for Europe and international itineraries, premium cabins, changes, and multi-city travel.",
    heading: "SWISS reservation support from a travel specialist",
    intro: "Planning a SWISS itinerary? Share your route, dates, travelers, and cabin preferences. A TicketDepart specialist can walk through available itinerary options and applicable fare terms before you decide to book.",
    services: [
      ["International Flight Booking", "Discuss Europe, North America, and other international routing, connections, cabins, available fares, and deals."],
      ["Premium Cabin Booking Assistance", "Review available Business or First cabin options and the fare conditions that apply to your itinerary."],
      ["Flight Connection Planning", "Work through the complete itinerary and practical connection timing before booking."],
      ["Flight Changes & Rebooking", "Review an existing reservation and discuss eligible dates, routing, availability, and applicable fare differences."],
      ["Cancellation Assistance", "Review the ticket terms and discuss whether a refund, credit, or another outcome may apply."],
      ["Multi-City Flight Booking", "Plan several destinations or open-jaw routing and discuss practical itinerary structures."],
    ],
    faqs: [
      { question: "Can I book a SWISS flight with a specialist?", answer: "Yes. A specialist can discuss your origin, destination, dates, travelers, cabin, and available booking options." },
      { question: "Can you help with an existing SWISS reservation?", answer: "We can review the reservation and discuss possible changes, rebooking, or cancellation options. Exact outcomes depend on the ticket terms and availability." },
      { question: "Are service fees disclosed before payment?", answer: "Any applicable TicketDepart service fee is disclosed before payment is authorized. Airline fare, taxes, and other applicable charges are reviewed before you decide." },
    ],
  },
  {
    slug: "qatar-airways",
    name: "Qatar Airways",
    title: "Qatar Airways Flight Booking & Reservation Assistance | TicketDepart",
    description: "Speak with an independent travel specialist about Qatar Airways flight booking and reservation assistance. Discuss international routes, connections, premium cabins, changes, and multi-city trips.",
    heading: "Qatar Airways flight booking and reservation assistance",
    intro: "Planning a Qatar Airways trip? Tell us your route, dates, travelers, and cabin preferences. A TicketDepart specialist can discuss itinerary options and applicable booking terms before you authorize a booking.",
    services: [
      ["International Flight Booking", "Discuss long-haul routing, connections, travel dates, and available fares and best deals."],
      ["Premium Cabin Booking Assistance", "Review Business and other cabin options, baggage considerations, and applicable fare conditions."],
      ["Flight Connection Planning", "Look at the complete itinerary, connection airports, and practical timing."],
      ["Family Flight Booking Assistance", "Coordinate traveler details, schedules, baggage needs, and connection preferences for family trips."],
      ["Flight Changes & Rebooking", "Review an existing ticket and discuss available replacement dates, routing, and fare differences."],
      ["Multi-City Flight Booking", "Build a practical multi-stop plan and discuss how the segments fit together before booking."],
    ],
    faqs: [
      { question: "How can I speak with a Qatar Airways reservation specialist by phone?", answer: "Call TicketDepart to discuss your Qatar Airways route, dates, travelers, cabin preferences, and available booking options with a travel specialist." },
      { question: "Can you help with a Qatar Airways change?", answer: "We can review the existing reservation and discuss possible changes or rebooking. Exact eligibility and cost depend on the ticket and availability." },
      { question: "Can you help with international connections?", answer: "Yes. We can discuss the complete routing and connection considerations, while travelers remain responsible for confirming current entry and transit requirements." },
    ],
  },
  {
    slug: "emirates",
    name: "Emirates",
    title: "Emirates Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency providing Emirates reservation support for international itineraries, premium cabins, connections, changes, and multi-city trips.",
    heading: "Emirates reservation support from a travel specialist",
    intro: "Planning an Emirates itinerary? Share your route, dates, travelers, and cabin preferences. A TicketDepart specialist can help you understand available itinerary options and applicable terms before booking.",
    services: [
      ["International Flight Booking", "Discuss long-haul routing, schedules, connections, available fares, and best deals for your trip."],
      ["Premium Cabin Booking Assistance", "Review available premium-cabin options and the inclusions and conditions associated with the itinerary."],
      ["Flight Connection Planning", "Work through the complete itinerary and practical connection timing."],
      ["Family Flight Booking Assistance", "Discuss coordinated travel, baggage needs, traveler details, and connection preferences."],
      ["Flight Changes & Rebooking", "Review an existing reservation and discuss eligible replacement dates, routing, and fare differences."],
      ["Multi-City Flight Booking", "Plan several destinations and discuss practical itinerary structures before you authorize a booking."],
    ],
    faqs: [
      { question: "Can I book an Emirates flight with a specialist?", answer: "Yes. A specialist can discuss your origin, destination, dates, travelers, cabin, and available booking options." },
      { question: "Can you help with an existing Emirates reservation?", answer: "We can review the reservation and discuss possible changes, rebooking, or cancellation options. Exact outcomes depend on ticket terms and availability." },
      { question: "Can you help with a multi-city Emirates itinerary?", answer: "Yes. We can discuss multiple destinations, connection timing, and practical itinerary structures before booking." },
    ],
  },
  {
    slug: "norse-atlantic-airways",
    name: "Norse Atlantic Airways",
    title: "Norse Atlantic Airways Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency providing Norse Atlantic Airways reservation support for transatlantic itineraries, connections, changes, and multi-city travel.",
    heading: "Norse Atlantic Airways reservation support from a travel specialist",
    intro: "Planning a Norse Atlantic Airways trip? Share your origin, destination, dates, travelers, and preferences. A TicketDepart specialist can discuss transatlantic itinerary options, connections, and applicable booking terms before you decide to book.",
    services: [
      ["Transatlantic Flight Booking", "Discuss available transatlantic routing, travel dates, airports, fares, and available deals."],
      ["Europe Flight Booking Assistance", "Work through U.S.-Europe and Europe-U.S. itinerary options and practical airport choices."],
      ["Flight Connection Planning", "Review the complete itinerary and discuss connection timing and airport considerations."],
      ["Flight Changes & Rebooking", "Review an existing reservation and discuss possible replacement dates, routing, availability, and applicable fare differences."],
      ["Cancellation Assistance", "Review the applicable ticket terms and discuss possible cancellation, refund, or credit outcomes."],
      ["Multi-City Flight Booking", "Discuss multiple destinations and practical itinerary structures before booking."],
    ],
    faqs: [
      { question: "Can I book a Norse Atlantic Airways flight with a specialist?", answer: "Yes. A specialist can discuss your route, dates, travelers, preferences, and available booking options." },
      { question: "Can you help with a Norse Atlantic Airways connection?", answer: "Yes. We can discuss the complete itinerary and practical connection considerations. Travelers remain responsible for confirming current passport, visa, transit, and entry requirements." },
      { question: "Can you help change an existing Norse Atlantic Airways reservation?", answer: "We can review the reservation and discuss possible changes or rebooking. Exact eligibility and costs depend on the ticket terms and availability." },
      { question: "Are service fees disclosed before payment?", answer: "Any applicable TicketDepart service fee is disclosed before payment is authorized. Airline fare, taxes, and other applicable charges are reviewed before you decide." },
    ],
  },
  {
    slug: "turkish-airlines",
    name: "Turkish Airlines",
    title: "Turkish Airlines Flight Booking & Reservation Assistance | TicketDepart",
    description: "Independent travel agency providing Turkish Airlines reservation assistance for U.S. travelers, including booking, flight changes, cancellations, rebooking, rescheduling, Istanbul connections, and multi-city itineraries.",
    heading: "Turkish Airlines flight booking and reservation assistance",
    intro: "Planning a Turkish Airlines trip from the United States? Tell TicketDepart your route, dates, travelers, and cabin preferences. A specialist can discuss available Turkish Airlines itineraries, Istanbul connections, fare conditions, and service options before you decide to book.",
    services: [
      ["Turkish Airlines Flight Booking", "Discuss U.S. departures, international destinations, travel dates, cabin preferences, available fares, and practical itinerary options by phone."],
      ["Turkish Airlines Flight Change Assistance", "Review an existing reservation and discuss eligible date, time, routing, and availability changes under the applicable ticket terms."],
      ["Turkish Airlines Cancellation Assistance", "Discuss the ticket conditions and possible refund, credit, or other cancellation outcomes before you authorize a request."],
      ["Turkish Airlines Rebooking & Rescheduling", "Compare replacement flights when plans change, including dates, routing, connections, and applicable fare differences."],
      ["Turkish Airlines Booking by Phone", "Speak with an independent travel specialist about a new reservation, complex itinerary, cabin preference, baggage questions, or multi-city travel."],
      ["Istanbul Airport (IST) Connections", "Turkish Airlines' main hub at Istanbul Airport can connect U.S. travelers with destinations across Türkiye, Europe, the Middle East, Africa, and Asia. Discuss connection timing and the full itinerary before booking."],
      ["U.S. to Türkiye and Beyond", "Discuss itineraries from major U.S. gateways to Istanbul and onward destinations, with practical routing and connection considerations."],
      ["Multi-City Turkish Airlines Travel", "Work through multiple destinations or open-jaw plans and discuss how the segments fit together before booking."],
    ],
    faqs: [
      { question: "Can I book a Turkish Airlines flight by phone?", answer: "Yes. A TicketDepart specialist can discuss your U.S. departure, destination, dates, travelers, cabin preference, and available Turkish Airlines booking options." },
      { question: "Can you help change a Turkish Airlines flight?", answer: "We can review the reservation information and discuss possible flight changes or rebooking. Exact eligibility and cost depend on the ticket terms, availability, and applicable airline rules." },
      { question: "Can you help cancel a Turkish Airlines flight?", answer: "We can discuss cancellation options and the applicable ticket conditions. Refunds, credits, and other outcomes depend on the fare and ticket rules." },
      { question: "Can you help rebook a Turkish Airlines flight by phone?", answer: "Yes. We can discuss replacement dates, routing, connection options, and applicable fare differences. Final availability is determined when the booking is processed." },
      { question: "What is Istanbul Airport's role in Turkish Airlines travel?", answer: "Istanbul Airport (IST) is Turkish Airlines' primary hub and an important connection point for travelers from the United States traveling onward to Türkiye, Europe, the Middle East, Africa, and Asia." },
      { question: "Are service fees disclosed before payment?", answer: "Any applicable TicketDepart service fee is disclosed before payment is authorized. Airline fare, taxes, and other applicable charges are reviewed before you decide." },
    ],
  },
  {
    slug: "lot-polish-airlines",
    name: "LOT Polish Airlines",
    title: "LOT Polish Airlines Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency providing LOT Polish Airlines reservation support for European and international itineraries, premium cabins, connections, changes, and multi-city trips.",
    heading: "LOT Polish Airlines reservation support from a travel specialist",
    intro: "Planning a LOT Polish Airlines trip? Share your origin, destination, dates, travelers, and cabin preferences. A TicketDepart specialist can discuss itinerary options, connections, and applicable booking terms before you decide to book.",
    services: [
      ["International Flight Booking", "Discuss European, transatlantic, and other international routing, schedules, connections, available fares, and deals."],
      ["Poland & Europe Flight Booking Assistance", "Work through routes involving Poland and European destinations, including connection timing and practical airport choices."],
      ["Premium Cabin Booking Assistance", "Review available premium-cabin options and the fare conditions and inclusions that apply to your itinerary."],
      ["Flight Connection Planning", "Look at the complete itinerary and discuss practical connection timing rather than evaluating each segment alone."],
      ["Flight Changes & Rebooking", "Review an existing reservation and discuss eligible replacement dates, routing, availability, and applicable fare differences."],
      ["Multi-City Flight Booking", "Plan multiple destinations or open-jaw routing and discuss practical itinerary structures before booking."],
    ],
    faqs: [
      { question: "Can I book a LOT Polish Airlines flight by phone?", answer: "Yes. A specialist can discuss your route, dates, travelers, cabin preferences, and available booking options." },
      { question: "Can you help with LOT Polish Airlines connections?", answer: "Yes. We can discuss the complete itinerary and practical connection considerations. Travelers remain responsible for confirming current passport, visa, transit, and entry requirements." },
      { question: "Can you help change an existing LOT reservation?", answer: "We can review the reservation and discuss possible changes or rebooking. Exact eligibility and costs depend on the ticket terms and availability." },
      { question: "Are service fees disclosed before payment?", answer: "Any applicable TicketDepart service fee is disclosed before payment is authorized. Airline fare, taxes, and other applicable charges are reviewed before you decide." },
    ],
  },
];

const RELATED = [
  ["/delta-airlines/", "Delta Airlines"],
  ["/united-airlines/", "United Airlines"],
  ["/american-airlines/", "American Airlines"],
  ["/southwest-airlines/", "Southwest Airlines"],
  ["/jetblue-airways/", "JetBlue Airways"],
  ["/alaska-airlines/", "Alaska Airlines"],
  ["/british-airways/", "British Airways"],
  ["/lufthansa/", "Lufthansa"],
  ["/air-canada/", "Air Canada"],
  ["/swiss-air/", "SWISS"],
  ["/qatar-airways/", "Qatar Airways"],
  ["/emirates/", "Emirates"],
] as const;

function AirlineAssistancePage({ page }: { page: AirlinePage }) {
  const id = page.slug.replaceAll("-", "_");
  const supportFaqs = [
    {
      question: `How do I speak with a ${page.name} reservation specialist by phone?`,
      answer: `Call TicketDepart to discuss a new ${page.name} flight or an existing reservation, including changes, cancellations, connections, baggage questions, and travel-planning options with a specialist.`,
    },
    {
      question: `Can you help if I need support with an existing ${page.name} reservation?`,
      answer: "We can review the information you provide and discuss possible reservation, change, cancellation, or rebooking options. What can be handled depends on how the ticket was issued, its fare rules, airline policies, and current availability.",
    },
    {
      question: `Can I call for ${page.name} flight booking help 24/7?`,
      answer: `TicketDepart travel specialists are available 24/7 to discuss ${page.name} flight options, reservation questions, changes, and rebooking possibilities.`,
    },
  ] as const;
  const allFaqs = [...page.faqs, ...supportFaqs];

  return (
    <>
      <Seo
        title={page.title}
        description={page.description}
        path={`/${page.slug}`}
        structuredData={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: page.name, path: `/${page.slug}` },
          ]),
        ]}
      />

      <Section tone="paper" ocid={`${id}.hero`}>
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li><Link to="/" className="font-medium hover:text-foreground">Home</Link></li>
            <li aria-hidden="true"><ArrowRight className="size-4" /></li>
            <li><span aria-current="page" className="font-semibold text-foreground">{page.name}</span></li>
          </ol>
        </nav>

        <div className="mx-auto mt-10 max-w-4xl">
          <p className="label-board text-accent">{page.name} reservation support</p>
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
              <span className="font-semibold text-foreground">Travel planning support:</span>{" "}
              A TicketDepart specialist can help you review {page.name} route options, cabin choices, connections, and applicable booking terms.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-6 grid max-w-4xl gap-3 sm:grid-cols-3">
          {[
            ["24/7", "Travel specialist availability"],
            ["Phone-first", "Human itinerary guidance"],
            ["Clear terms", "Applicable fees disclosed before payment"],
          ].map(([value, label]) => (
            <div key={value} className="rounded-2xl border border-border/70 bg-muted/60 p-5">
              <p className="font-display text-lg font-bold text-foreground">{value}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="paper" ocid={`${id}.next_step`}>
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            eyebrow="Choose your next step"
            title="Go from airline research to flight planning"
            description="If you already know the airline, continue to the booking path that matches your trip."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Book a flight by phone", "/book-a-flight-by-phone/", "Start with a person and discuss your route, dates, and travelers."],
              ["General flight booking", "/flight-booking/", "Review domestic and international booking options."],
              ["International flights", "/international-flight-booking/", "Plan connections, cabins, flexible dates, and multi-city trips."],
              ["Last-minute flights", "/last-minute-flight-booking", "Discuss urgent travel, nearby airports, and ticketing timing."],
              ["Business class", "/business-class-flight-booking/", "Explore premium-cabin schedules, routing, and fare conditions."],
              ["Send trip details", "/contact/", "Request a callback if you are not ready to call yet."],
            ].map(([label, to, description]) => (
              <Link
                key={to}
                to={to}
                className="group rounded-2xl border border-border bg-card p-5 shadow-subtle transition-smooth hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-elevated"
              >
                <span className="font-display text-base font-semibold">{label}</span>
                <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{description}</span>
                <span className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Continue <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="muted" ocid={`${id}.services`}>
        <SectionHeading eyebrow="What we can discuss" title={`${page.name} reservation support and booking services`} description={`New ${page.name} flight booking, ${page.name} flight changes, ${page.name} cancellation assistance, ${page.name} rebooking, and other itinerary support are covered below. Start with your route, dates, traveler details, or existing reservation.`} />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {page.services.map(([title, body]) => (
            <article key={title} className="group rounded-2xl border border-border/80 bg-card p-6 shadow-subtle transition-smooth hover:-translate-y-1 hover:border-primary/20 hover:shadow-elevated">
              <CheckCircle2 className="size-5 text-accent" />
              <h2 className="mt-4 font-display text-lg font-semibold">{page.name} {title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </Section>

      <PageContentExpansion subject={`${page.name} flight booking and reservation assistance`} intro={page.intro} points={page.services} />

      <Section tone="paper" ocid={`${id}.cta`}>
        <div className="mx-auto max-w-3xl text-center">
          <p className="label-board text-accent">Available 24/7</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold sm:text-4xl">Talk with a {page.name} travel specialist</h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Call for flight assistance when you are ready. Have your route, dates, traveler details, or existing confirmation ready if available.
          </p>
          <div className="mt-8"><CallCta size="lg" ocid={`${id}.final_call`} /></div>
        </div>
      </Section>

      <Section tone="muted" ocid={`${id}.faq`}>
        <SectionHeading eyebrow="FAQ" title={`${page.name} reservation support questions`} description="Practical information before you call." />
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 lg:grid-cols-2">
          {allFaqs.map((faq) => (
            <details key={faq.question} className="rounded-2xl border border-border bg-card p-5 shadow-subtle">
              <summary className="cursor-pointer font-semibold">{faq.question}</summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <FlightServiceIntentSection airline={page.name} />
      <Section tone="paper" ocid={`${id}.related`}>
        <SectionHeading eyebrow="Airline booking help" title="Explore another airline" description="Choose another airline-specific guide or return to general flight booking help." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RELATED.filter(([, name]) => name !== page.name).map(([to, name]) => (
            <Link key={to} to={to} className="group rounded-2xl border border-border/80 bg-card p-5 shadow-subtle transition-smooth hover:-translate-y-1 hover:border-primary/20 hover:shadow-elevated">
              <span className="font-display text-base font-semibold">{name}</span>
              <span className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-primary">Open guide <ArrowRight className="size-4" /></span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}

export function SouthwestAirlinesPage() { return <AirlineAssistancePage page={AIRLINES[0]} />; }
export function JetBlueAirwaysPage() { return <AirlineAssistancePage page={AIRLINES[1]} />; }
export function AlaskaAirlinesPage() { return <AirlineAssistancePage page={AIRLINES[2]} />; }
export function BritishAirwaysPage() { return <AirlineAssistancePage page={AIRLINES[3]} />; }
export function LufthansaPage() { return <AirlineAssistancePage page={AIRLINES[4]} />; }
export function AirCanadaPage() { return <AirlineAssistancePage page={AIRLINES[5]} />; }
export function SwissAirPage() { return <AirlineAssistancePage page={AIRLINES[6]} />; }
export function QatarAirwaysPage() { return <AirlineAssistancePage page={AIRLINES[7]} />; }
export function EmiratesPage() { return <AirlineAssistancePage page={AIRLINES[8]} />; }
export function TurkishAirlinesPage() { return <AirlineAssistancePage page={AIRLINES[10]} />; }
export function LotPolishAirlinesPage() { return <AirlineAssistancePage page={AIRLINES[11]} />; }
export function NorseAtlanticAirwaysPage() { return <AirlineAssistancePage page={AIRLINES[9]} />; }
