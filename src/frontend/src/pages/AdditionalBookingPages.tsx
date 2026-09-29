import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import {
  breadcrumbSchema,
  faqSchema,
  serviceSchema,
  webPageSchema,
} from "@/lib/seo";
import { SITE } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";

type PageConfig = {
  path: string;
  title: string;
  description: string;
  heading: string;
  intro: string;
  service: string;
  items: readonly [string, string][];
  faqs: readonly { question: string; answer: string }[];
};

const PAGES: readonly PageConfig[] = [
  {
    path: "/cheap-flight-booking-by-phone",
    title: "Cheap Flight Booking by Phone | TicketDepart",
    description:
      "Discuss affordable domestic and international flight options by phone. Compare dates, nearby airports, cabins, and fare conditions with a TicketDepart travel specialist.",
    heading: "Cheap flight booking help by phone",
    intro:
      "A small change in travel date, airport, cabin, or routing can affect the fare. Tell us what you are trying to balance and a specialist can review available options with you.",
    service: "Affordable flight booking assistance",
    items: [
      [
        "Flexible travel dates",
        "Discuss date flexibility that may open different schedules or fares.",
      ],
      [
        "Nearby airports",
        "Compare practical alternative airports when the trip allows it.",
      ],
      [
        "Domestic and international",
        "Review options for U.S. trips and international itineraries.",
      ],
      [
        "Cabin choices",
        "Compare economy and premium cabin options with the fare conditions.",
      ],
      [
        "Baggage details",
        "Ask what baggage is included and what additional charges may apply.",
      ],
      [
        "Fare conditions",
        "Review changes, cancellations, and other restrictions before booking.",
      ],
    ],
    faqs: [
      {
        question: "Can you help me find a cheaper flight?",
        answer:
          "A specialist can discuss available fares, dates, airports, routing, and cabin options. Final prices depend on live availability and fare rules.",
      },
      {
        question: "Can changing my departure airport lower the fare?",
        answer:
          "It can in some cases. Nearby airports may have different schedules and prices, but you should compare the total trip cost and ground transportation.",
      },
      {
        question: "Can I ask for the total price before paying?",
        answer:
          "Yes. Ask for the full airfare, taxes and charges, baggage terms, and any applicable agency service fee before authorizing payment.",
      },
    ],
  },
  {
    path: "/business-class-flight-booking",
    title: "Business Class & Corporate Flight Booking by Phone | TicketDepart",
    description:
      "Book business class or corporate flights by phone with an independent travel agency. Compare schedules, premium cabins, connections, baggage, and fare conditions with a business class or corporate travel specialist.",
    heading: "Business class and corporate flight booking by phone",
    intro:
      "Business and corporate travel can differ significantly by aircraft, route, connection, fare family, schedule, and traveler requirements. Explain the trip you need and a TicketDepart specialist can discuss premium-cabin and corporate flight options before you decide.",
    service: "Business class and corporate flight booking",
    items: [
      [
        "Business class travel agent assistance",
        "Discuss available business class schedules, routing, cabin preferences, and fare options with a travel specialist.",
      ],
      [
        "Corporate and executive travel",
        "Discuss business travel schedules, flexible routing, premium-cabin preferences, and itinerary details for work trips.",
      ],
      [
        "Corporate flight booking",
        "Discuss business travel schedules, traveler requirements, flexible routing, premium-cabin preferences, and itinerary details for work trips.",
      ],
      [
        "Aircraft and seats",
        "Discuss seat layouts, lie-flat availability, and cabin differences where known.",
      ],
      [
        "Connection planning",
        "Review layovers and connection airports for long-haul itineraries.",
      ],
      [
        "International travel",
        "Discuss premium-cabin options for Europe, Asia, Latin America, and other markets.",
      ],
      [
        "Fare flexibility",
        "Review change and cancellation conditions before you choose a fare.",
      ],
      [
        "Baggage and services",
        "Ask what the selected fare includes and which services are available.",
      ],
    ],
    faqs: [
      {
        question: "Can I book business class by phone?",
        answer:
          "Yes. TicketDepart can discuss business class itineraries, cabin preferences, dates, and available booking options by phone.",
      },
      {
        question: "Can you help compare business class seats?",
        answer:
          "We can discuss available aircraft and cabin information when it is available for the itinerary. Exact seat maps and availability depend on the airline and fare.",
      },
      {
        question: "Is business class always refundable?",
        answer:
          "No. Refund and change conditions depend on the fare purchased and the airline's rules.",
      },
      {
        question: "Can a business class travel agent help with corporate flights?",
        answer:
          "Yes. You can discuss corporate or executive travel requirements, business-class cabin preferences, routing, schedules, baggage, and applicable fare conditions by phone.",
      },
      {
        question: "Can you help book corporate flights?",
        answer:
          "Yes. You can discuss corporate or executive flight requirements, traveler schedules, premium-cabin preferences, routing, baggage, and applicable fare conditions by phone.",
      },
      {
        question: "Can you help compare business-class flight options?",
        answer:
          "A specialist can discuss available schedules, connections, cabin information, airports, and fare conditions. Live inventory and final pricing depend on the itinerary and airline.",
      },
    ],
  },
  {
    path: "/same-day-flight-booking",
    title: "Same-Day Flight Booking Assistance | TicketDepart",
    description:
      "Need to travel today? Call TicketDepart to discuss same-day flight availability, nearby airports, connections, and ticketing deadlines with a travel specialist.",
    heading: "Same-day flight booking help",
    intro:
      "Same-day travel can change quickly as seats sell and departure deadlines approach. Call with your route and timing so the specialist can work through the available possibilities.",
    service: "Same-day flight booking assistance",
    items: [
      [
        "Travel today",
        "Discuss currently available options when you need to depart the same day.",
      ],
      [
        "Nearby airports",
        "Consider additional airports if they are practical for your departure.",
      ],
      [
        "Nonstop or connecting",
        "Compare the fastest practical routing with other available choices.",
      ],
      [
        "Urgent timing",
        "Discuss check-in, airport, and ticketing timing that may affect the trip.",
      ],
      [
        "Flexible destination airports",
        "Consider alternate arrival airports when they make the itinerary workable.",
      ],
      [
        "Fare terms",
        "Review the applicable price, baggage, and change rules before payment.",
      ],
    ],
    faqs: [
      {
        question: "Can you help me book a flight for today?",
        answer:
          "We can discuss same-day options by phone. Availability depends on live inventory, the route, departure time, and ticketing deadlines.",
      },
      {
        question: "Can you check nearby airports?",
        answer:
          "Yes. Additional airports can be considered when they are practical for your trip.",
      },
      {
        question: "Will the price be guaranteed while I decide?",
        answer:
          "No. Same-day fares and seat availability can change until a ticket is issued.",
      },
    ],
  },
  {
    path: "/family-flight-booking",
    title: "Family Flight Booking Assistance | TicketDepart",
    description:
      "Plan family flights by phone with help coordinating travelers, dates, seats, baggage, connections, and practical itinerary options.",
    heading: "Family flight booking assistance",
    intro:
      "Family travel can involve different ages, baggage needs, seats, schedules, and connection preferences. A specialist can work through those details with you before you confirm the trip.",
    service: "Family flight booking assistance",
    items: [
      [
        "Traveling together",
        "Discuss itineraries that keep family members on the same flight where availability allows.",
      ],
      [
        "Seat planning",
        "Ask about seat availability and seating options for the family.",
      ],
      [
        "Child and infant travel",
        "Discuss the booking details you should prepare for younger travelers.",
      ],
      [
        "Baggage planning",
        "Review baggage allowances and applicable fees for your selected fare.",
      ],
      [
        "Connections",
        "Compare connection times that may be more practical for family travel.",
      ],
      [
        "Flexible scheduling",
        "Explore date and airport alternatives when your plans allow flexibility.",
      ],
    ],
    faqs: [
      {
        question: "Can you help book flights for a family?",
        answer:
          "Yes. A specialist can discuss traveler count, ages, routing, dates, cabin preference, and seating considerations.",
      },
      {
        question: "Can you keep the family on the same flight?",
        answer:
          "We can discuss coordinated itineraries, but keeping everyone together depends on inventory and the airline's booking and seat availability.",
      },
      {
        question: "What family travel details should I have ready?",
        answer:
          "Have traveler count, approximate ages, origin, destination, dates, cabin preference, and any accessibility or seating needs ready if known.",
      },
    ],
  },
  {
    path: "/flight-change-assistance",
    title: "Flight Change Assistance by Phone | TicketDepart",
    description:
      "Need to change a flight? Discuss date, time, route, fare difference, and airline change rules with a TicketDepart travel specialist.",
    heading: "Flight change assistance by phone",
    intro:
      "Before changing an existing ticket, review the current fare rules and the practical alternatives. A specialist can help you understand the options available for your itinerary.",
    service: "Flight change assistance",
    items: [
      [
        "Date or time changes",
        "Discuss moving the departure or return date and the resulting fare conditions.",
      ],
      [
        "Route changes",
        "Ask whether a different departure, arrival, or connecting airport can work.",
      ],
      [
        "Fare difference",
        "Review any fare difference and applicable change charges before authorizing the change.",
      ],
      [
        "Schedule changes",
        "Discuss options when the airline changes the original schedule.",
      ],
      [
        "Connection alternatives",
        "Compare replacement itineraries when the original routing no longer fits.",
      ],
      [
        "Ticket details",
        "Have the confirmation code, passenger name, and existing itinerary ready.",
      ],
    ],
    faqs: [
      {
        question: "Can you help change my flight by phone?",
        answer:
          "Yes. TicketDepart can discuss possible date, time, route, and itinerary changes. Final changes depend on the ticket's fare rules and the airline's inventory.",
      },
      {
        question: "Will I have to pay a change fee?",
        answer:
          "It depends on the fare, airline, route, and timing. You should review any applicable charges and fare difference before authorizing the change.",
      },
      {
        question: "What should I have ready?",
        answer:
          "Have the passenger name, confirmation code or ticket number, current itinerary, and preferred new dates or route ready.",
      },
    ],
  },
  {
    path: "/flight-cancellation-assistance",
    title: "Flight Cancellation Assistance by Phone | TicketDepart",
    description:
      "Need to cancel a flight? Discuss cancellation rules, refunds, credits, deadlines, and replacement travel options with a TicketDepart specialist.",
    heading: "Flight cancellation assistance by phone",
    intro:
      "Cancellation outcomes depend on the ticket, fare rules, airline policy, and timing. A specialist can help you review the applicable options before you request a cancellation.",
    service: "Flight cancellation assistance",
    items: [
      [
        "Cancellation review",
        "Discuss whether the ticket may qualify for a refund, credit, or other option.",
      ],
      [
        "Timing and deadlines",
        "Review the timing requirements that can affect the outcome.",
      ],
      [
        "Refund questions",
        "Ask what refund rules appear to apply to the specific ticket.",
      ],
      [
        "Travel credits",
        "Discuss whether the airline may issue a credit and what restrictions apply.",
      ],
      [
        "Partial itinerary changes",
        "Review whether canceling one segment affects the rest of the itinerary.",
      ],
      [
        "Replacement travel",
        "Discuss rebooking alternatives when canceling the original itinerary is not the best fit.",
      ],
    ],
    faqs: [
      {
        question: "Can you help me cancel a flight?",
        answer:
          "Yes. We can review the ticket details and discuss the cancellation options and applicable terms before anything is processed.",
      },
      {
        question: "Will I get a refund?",
        answer:
          "Not necessarily. Refund eligibility depends on the ticket, fare conditions, airline rules, applicable law, and timing.",
      },
      {
        question: "Could I receive a travel credit instead?",
        answer:
          "Depending on the ticket and airline policy, a credit may be available. The exact restrictions should be confirmed before cancellation.",
      },
    ],
  },
  {
    path: "/airline-reservation-assistance",
    title: "Airline Reservation Assistance by Phone | TicketDepart",
    description: "Need help with an airline reservation? Discuss booking, changes, cancellations, connections, baggage, and fare conditions with a TicketDepart travel specialist.",
    heading: "Airline reservation assistance by phone",
    intro: "If you are comparing a new trip or need help with an existing airline reservation, a specialist can walk through the itinerary, ticket details, and applicable terms with you.",
    service: "Airline reservation assistance",
    items: [
      ["New reservations", "Discuss route, dates, travelers, cabin, and airline preferences before booking."],
      ["Existing reservations", "Review your current itinerary and the information you should have ready before requesting help."],
      ["Changes and rebooking", "Discuss date, time, route, connection, and fare-difference questions."],
      ["Cancellation questions", "Review possible refund, credit, deadline, and ticket-condition questions before cancellation."],
      ["Baggage and fare terms", "Ask what the selected fare includes and what restrictions may apply."],
      ["Complex itineraries", "Discuss international, multi-city, family, group, and premium-cabin travel needs."]
    ],
    faqs: [
      { question: "Can I get airline reservation help by phone?", answer: "Yes. TicketDepart can discuss new and existing reservation questions by phone. Exact actions and availability depend on the ticket, airline, and applicable rules." },
      { question: "Can you help change an existing reservation?", answer: "We can discuss possible changes and the information needed. Final changes depend on the ticket's fare rules, airline inventory, and applicable terms." },
      { question: "What should I have ready when I call?", answer: "Have the passenger name, confirmation code or ticket number, current itinerary, desired change or new trip details, and traveler count ready if available." }
    ]
  },
  {
    path: "/flight-booking-assistance",
    title: "Flight Booking Assistance by Phone | TicketDepart",
    description: "Get flight booking assistance by phone for domestic, international, multi-city, family, group, and premium-cabin travel with an independent travel specialist.",
    heading: "Flight booking assistance by phone",
    intro: "Tell us where you are going, when you want to travel, and what matters most. A specialist can help you compare practical itinerary options and review booking terms before you decide.",
    service: "Flight booking assistance",
    items: [
      ["Domestic flights", "Discuss one-way and round-trip travel between major and regional U.S. airports."],
      ["International flights", "Review international routes, connections, cabins, dates, and fare conditions."],
      ["Flexible itinerary planning", "Compare nearby airports, flexible dates, and routing alternatives when practical."],
      ["Premium cabins", "Discuss economy, premium economy, business, and first-class options."],
      ["Family and group travel", "Work through traveler counts, coordinated schedules, baggage, and seating questions."],
      ["Before you pay", "Review the itinerary, fare conditions, baggage terms, and any applicable service fee before authorizing payment."]
    ],
    faqs: [
      { question: "Can I book a flight by phone?", answer: "Yes. TicketDepart provides independent travel assistance for domestic and international flight booking by phone." },
      { question: "Can you compare different flight options?", answer: "A specialist can discuss available routing, schedules, connections, cabins, airports, and fare conditions for your trip." },
      { question: "Will the price stay the same while I decide?", answer: "Not necessarily. Airfare and seat availability can change until a ticket is issued." }
    ]
  },
  {
    path: "/flights-usa-to-canada",
    title: "USA to Canada Flights | Booking Assistance | TicketDepart",
    description: "Get help comparing flights from the USA to Canada by phone. Discuss cities, airports, dates, connections, baggage, cabins, and fare conditions with a travel specialist.",
    heading: "USA to Canada flight booking assistance",
    intro: "Planning a trip between the United States and Canada? Discuss departure and arrival cities, nearby airports, dates, connections, cabin choices, baggage, and fare conditions with a travel specialist.",
    service: "USA to Canada flight assistance",
    items: [
      ["Popular cross-border trips", "Discuss practical options for major U.S. and Canadian city pairs."],
      ["Flexible airports", "Consider nearby departure or arrival airports when practical."],
      ["Nonstop and connections", "Compare routing and connection options for your dates."],
      ["Dates and schedules", "Review schedule choices when your dates are flexible."],
      ["Baggage and cabin", "Ask about baggage terms and cabin options before booking."],
      ["Fare conditions", "Review applicable change, cancellation, and payment terms."],
    ],
    faqs: [
      { question: "Can you help with USA to Canada flights?", answer: "Yes. A specialist can discuss available itineraries between U.S. and Canadian cities. Final availability and pricing depend on live airline inventory." },
      { question: "Can nearby airports be compared?", answer: "Yes. Nearby airports can be considered when they make sense for your trip and ground transportation." },
      { question: "Are international travel documents included?", answer: "Travel-document requirements depend on your citizenship and itinerary. Confirm current requirements with the appropriate government and airline sources." },
    ],
  },
  {
    path: "/flights-usa-to-uk",
    title: "USA to UK Flights | Booking Assistance | TicketDepart",
    description: "Plan USA to UK flights by phone. Discuss London and other UK destinations, dates, connections, cabins, baggage, and fare conditions with a travel specialist.",
    heading: "USA to UK flight booking assistance",
    intro: "Planning travel from the United States to the United Kingdom? Explain your preferred cities, dates, cabin, connection tolerance, and baggage needs and review available options by phone.",
    service: "USA to UK flight assistance",
    items: [
      ["UK destination options", "Discuss London and other UK arrival cities that fit your plans."],
      ["East Coast and West Coast", "Compare routing choices from different U.S. departure regions."],
      ["Nonstop and connections", "Review nonstop and connecting itineraries where available."],
      ["Premium cabins", "Discuss economy, premium economy, business, and other available cabins."],
      ["Baggage and fare rules", "Review what the selected fare includes before payment."],
      ["Schedule flexibility", "Consider nearby dates when your plans allow flexibility."],
    ],
    faqs: [
      { question: "Can you help book a flight from the USA to the UK?", answer: "Yes. TicketDepart can discuss USA-to-UK itineraries by phone. Live inventory, fares, and airline rules determine the final options." },
      { question: "Can I compare different UK airports?", answer: "Yes. When practical, you can discuss different arrival airports and the onward ground-travel implications." },
      { question: "Can you guarantee a fare while I decide?", answer: "Airline fares and availability can change until a ticket is issued, so a quote should not be treated as a guarantee unless the applicable terms say otherwise." },
    ],
  },
  {
    path: "/flights-usa-to-europe",
    title: "USA to Europe Flights | Booking Assistance | TicketDepart",
    description: "Plan USA to Europe flights by phone. Discuss destinations, connections, dates, cabins, baggage, and fare conditions with a travel specialist.",
    heading: "USA to Europe flight booking assistance",
    intro: "European trips can involve many routing and airport choices. Tell a specialist where you want to go, your dates, preferred cabin, and connection preferences and discuss practical itinerary options.",
    service: "USA to Europe flight assistance",
    items: [
      ["Europe destination planning", "Discuss major European destinations and practical arrival airports."],
      ["One-stop routing", "Compare connection options when nonstop service is unavailable or unsuitable."],
      ["Flexible dates", "Review nearby dates when flexibility may open different schedules."],
      ["Cabin choices", "Compare available cabin options and fare conditions."],
      ["Multi-city trips", "Discuss open-jaw and multi-city European itineraries."],
      ["Baggage and changes", "Review baggage terms and applicable change or cancellation conditions."],
    ],
    faqs: [
      { question: "Can you help plan flights to Europe?", answer: "Yes. A specialist can discuss European routes, dates, connections, cabins, and itinerary structure by phone." },
      { question: "Can I plan a multi-city Europe trip?", answer: "Yes. Multi-city and open-jaw itineraries can be discussed when supported by available airline inventory and fare rules." },
      { question: "Do European fares include every charge?", answer: "The total depends on the selected fare and applicable taxes, fees, baggage, and agency charges. Ask for the complete price before authorizing payment." },
    ],
  },
  {
    path: "/flights-usa-to-mexico",
    title: "USA to Mexico Flights | Booking Assistance | TicketDepart",
    description: "Plan USA to Mexico flights by phone. Discuss destinations, airports, dates, connections, cabins, baggage, and fare conditions with a travel specialist.",
    heading: "USA to Mexico flight booking assistance",
    intro: "Whether you are planning a vacation, family visit, or business trip, discuss U.S.-Mexico flight options by phone and compare practical dates, airports, routing, and fare conditions.",
    service: "USA to Mexico flight assistance",
    items: [
      ["Popular Mexico destinations", "Discuss major destinations and arrival-airport choices for your trip."],
      ["Flexible departure airports", "Consider nearby U.S. airports when they are practical."],
      ["Nonstop and connections", "Review available routing and connection choices."],
      ["Family travel", "Discuss traveler count, seating, baggage, and schedule preferences."],
      ["Cabin and baggage", "Compare cabin options and understand baggage terms before booking."],
      ["Fare and change rules", "Review applicable fare conditions, changes, and cancellations."],
    ],
    faqs: [
      { question: "Can you help book flights from the USA to Mexico?", answer: "Yes. TicketDepart can discuss USA-to-Mexico flight options by phone, subject to live airline availability." },
      { question: "Can you help with family trips to Mexico?", answer: "Yes. Discuss traveler count, ages, seating needs, baggage, and schedule preferences with a specialist." },
      { question: "What should I verify before international travel?", answer: "Verify current passport, entry, visa, and other travel requirements for your nationality and itinerary with official government and airline sources." },
    ],
  },
];

function AdditionalBookingPage({ page }: { page: PageConfig }) {
  const id = page.path.slice(1).replaceAll("-", "_");
  const supportFaqs = [
    {
      question: "Can I call for help with an existing flight reservation?",
      answer: "Yes. TicketDepart is an independent travel agency and a specialist can discuss your existing itinerary, possible changes, cancellations, rebooking, or other reservation questions. What can be handled depends on how the ticket was issued, its fare rules, airline policies, and current availability.",
    },
    {
      question: "Can I speak with a travel specialist about my flight?",
      answer: `Yes. Call TicketDepart to discuss ${page.service.toLowerCase()}, an existing reservation, or another flight-planning question. Have your route, dates, traveler details, and confirmation information ready when applicable.`,
    },
    {
      question: "Are applicable service fees disclosed before payment?",
      answer: "Any applicable TicketDepart service fee is disclosed before payment is authorized. Airline fares, taxes, baggage charges, and other applicable costs are reviewed before you decide.",
    },
  ] as const;
  const allFaqs = [...page.faqs, ...supportFaqs];

  return (
    <>
      <Seo
        title={page.title}
        description={page.description}
        path={page.path}
        structuredData={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: page.heading, path: page.path },
          ]),
          webPageSchema({
            title: page.title,
            description: page.description,
            path: page.path,
          }),
          serviceSchema({
            name: page.service,
            description: page.description,
            path: page.path,
          }),
          faqSchema(allFaqs),
        ]}
      />

      <Section tone="paper" ocid={`${id}.hero`}>
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="font-medium hover:text-foreground">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ArrowRight className="size-4" />
            </li>
            <li>
              <span aria-current="page" className="font-semibold text-foreground">
                {page.heading}
              </span>
            </li>
          </ol>
        </nav>

        <div className="mx-auto mt-10 max-w-4xl">
          <p className="label-board text-accent">{page.service}</p>
          <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
            {page.heading}
          </h1>
          <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {page.intro}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CallCta size="lg" ocid={`${id}.hero_call`} />
            <Link
              to="/contact"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-card px-6 text-base font-medium text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Send trip details <ArrowRight className="size-4" />
            </Link>
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="size-4 text-accent" />
            {SITE.hours} · {SITE.phoneDisplay}
          </p>
          {page.path === "/business-class-flight-booking" && (
            <div
              data-cro-version="269"
              className="mt-8 rounded-2xl border border-border bg-card p-5 sm:p-6"
              aria-labelledby="premium-intent-heading"
            >
              <h2 id="premium-intent-heading" className="text-xl font-semibold">
                What kind of premium-cabin trip are you planning?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Choose a starting point. A specialist can discuss available cabins, routing, schedules, and fare conditions for your itinerary.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Business class", "/business-class-flight-booking", "Compare cabin features, schedules, and fare flexibility."],
                  ["First class", "/contact", "Send your route and dates to discuss first-class availability."],
                  ["Premium economy", "/flight-booking", "Review cabin choices and the trade-offs for your trip."],
                  ["Long-haul premium travel", "/international-flight-booking", "Explore international routing and connection options."],
                ].map(([label, to, description]) => (
                  <Link
                    key={label}
                    to={to}
                    className="group rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/40 hover:bg-muted/40"
                  >
                    <span className="block font-semibold text-foreground">{label}</span>
                    <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{description}</span>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      Continue <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {page.path === "/flight-booking-assistance" && (
            <div
              data-cro-version="268"
              className="mt-8 rounded-2xl border border-border bg-card p-5 sm:p-6"
              aria-labelledby="booking-intent-heading"
            >
              <h2 id="booking-intent-heading" className="text-xl font-semibold">
                What kind of flight help do you need?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Choose the option closest to your trip, or send your details if you are still deciding.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ["Domestic or international", "/international-flight-booking", "Plan a trip within the U.S. or abroad."],
                  ["Last-minute or travel today", "/last-minute-flight-booking", "Explore options for a near-term departure."],
                  ["Business or premium cabin", "/business-class-flight-booking", "Discuss business class and premium-cabin choices."],
                  ["Family or group trip", "/family-flight-booking", "Coordinate travelers, schedules, and trip details."],
                  ["Multi-city itinerary", "/multi-city-flight-booking", "Plan a trip with multiple stops."],
                  ["I need help choosing", "/contact", "Send your route and dates and request a callback."],
                ].map(([label, to, description]) => (
                  <Link
                    key={label}
                    to={to}
                    className="group rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/40 hover:bg-muted/40"
                  >
                    <span className="block font-semibold text-foreground">{label}</span>
                    <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{description}</span>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      Continue <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>

      <Section tone="muted" ocid={`${id}.services`}>
        <SectionHeading
          eyebrow="What we can discuss"
          title="Practical help for your trip"
          description="Start with your route, dates, traveler details, or existing booking. The specialist can work through the options that apply."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {page.items.map(([title, text]) => (
            <article
              key={title}
              className="rounded-2xl border border-border bg-card p-6 shadow-subtle"
            >
              <CheckCircle2 className="size-5 text-accent" />
              <h2 className="mt-4 font-display text-lg font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {text}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="paper" ocid={`${id}.cta`}>
        <div className="mx-auto max-w-3xl text-center">
          <p className="label-board text-accent">Available 24/7</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold sm:text-4xl">
            Talk with a flight specialist
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Call {SITE.phoneDisplay}. Review the applicable itinerary or ticket
            details and any relevant terms before you decide.
          </p>
          <div className="mt-8">
            <CallCta size="lg" showNumber ocid={`${id}.final_call`} />
          </div>
        </div>
      </Section>

      <Section tone="muted" ocid={`${id}.support_paths`}>
        <SectionHeading
          eyebrow="Flight and reservation support"
          title="Not sure which kind of help you need?"
          description="You can call directly or continue to the support path that best matches your situation."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Airline reservation assistance", "/airline-reservation-assistance", "Questions about an airline reservation, representative, or travel-support issue."],
            ["Change a flight", "/flight-change-assistance", "Discuss dates, times, routes, fare differences, and eligible changes."],
            ["Cancel a flight", "/flight-cancellation-assistance", "Review cancellation, refund, credit, and applicable ticket terms."],
            ["Book a flight by phone", "/book-a-flight-by-phone", "Start a new booking with a travel specialist."],
            ["Last-minute flight help", "/last-minute-flight-booking", "Discuss urgent travel, nearby airports, and ticketing timing."],
            ["General flight assistance", "/flight-booking-assistance", "If you are unsure where to start, describe the trip and get pointed to the right path."],
          ].map(([label, to, description]) => (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl border border-border bg-card p-5 shadow-subtle transition-smooth hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-elevated"
            >
              <span className="font-display text-base font-semibold">{label}</span>
              <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{description}</span>
              <span className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-primary">Continue <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" /></span>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="paper" ocid={`${id}.related`}>
        <SectionHeading
          eyebrow="Related booking help"
          title="Explore more high-intent flight guides"
          description="Continue to another flight-planning or support topic."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Flight booking", "/flight-booking"],
            ["Business class booking", "/business-class-flight-booking"],
            ["Corporate flight booking", "/corporate-flight-booking"],
            ["Book a flight by phone", "/book-a-flight-by-phone"],
            ["International flights", "/international-flight-booking"],
            ["Last-minute flights", "/last-minute-flight-booking"],
            ["Multi-city flights", "/multi-city-flight-booking"],
            ["Group flights", "/group-flight-booking"],
          ].map(([label, to]) => (
            <Link
              key={`${label}-${to}`}
              to={to}
              className="rounded-2xl border border-border bg-card p-5 shadow-subtle hover:shadow-elevated"
            >
              <span className="font-display text-base font-semibold">{label}</span>
              <span className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-primary">
                Open guide <ArrowRight className="size-4" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="paper" ocid={`${id}.faq`}>
        <SectionHeading
          eyebrow="FAQ"
          title={`${page.service} questions`}
          description="Practical information before you call."
        />
        <div className="mx-auto mt-10 max-w-3xl space-y-4">
          {allFaqs.map((faq) => (
            <details
              key={faq.question}
              className="rounded-2xl border border-border bg-card p-5 shadow-subtle"
            >
              <summary className="cursor-pointer font-semibold">
                {faq.question}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}

export function CheapFlightBookingByPhonePage() {
  return <AdditionalBookingPage page={PAGES[0]!} />;
}

export function BusinessClassFlightBookingPage() {
  return <AdditionalBookingPage page={PAGES[1]!} />;
}

export function SameDayFlightBookingPage() {
  return <AdditionalBookingPage page={PAGES[2]!} />;
}

export function FamilyFlightBookingPage() {
  return <AdditionalBookingPage page={PAGES[3]!} />;
}

export function FlightChangeAssistancePage() {
  return <AdditionalBookingPage page={PAGES[4]!} />;
}

export function FlightCancellationAssistancePage() {
  return <AdditionalBookingPage page={PAGES[5]!} />;
}

export function AirlineReservationAssistancePage() {
  return <AdditionalBookingPage page={PAGES[6]!} />;
}

export function FlightBookingAssistancePage() {
  return <AdditionalBookingPage page={PAGES[7]!} />;
}

export function UsaToCanadaFlightsPage() {
  return <AdditionalBookingPage page={PAGES[8]!} />;
}

export function UsaToUkFlightsPage() {
  return <AdditionalBookingPage page={PAGES[9]!} />;
}

export function UsaToEuropeFlightsPage() {
  return <AdditionalBookingPage page={PAGES[10]!} />;
}

export function UsaToMexicoFlightsPage() {
  return <AdditionalBookingPage page={PAGES[11]!} />;
}
