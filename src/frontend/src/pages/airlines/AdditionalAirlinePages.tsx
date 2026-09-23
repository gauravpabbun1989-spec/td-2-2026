import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { breadcrumbSchema, faqSchema } from "@/lib/seo";
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
    description: "Independent travel agency assistance for Southwest Airlines flight booking, family travel, same-day trips, changes, cancellations, and multi-city itineraries.",
    heading: "Southwest Airlines flight assistance, with a specialist on the phone",
    intro: "Planning a Southwest Airlines trip? Tell us your route, dates, travelers, and priorities. A TicketDepart specialist can walk through available itinerary options and applicable terms before you decide to book.",
    services: [
      ["Flight booking", "Discuss routes, dates, travelers, schedules, and available fare options before you authorize a booking."],
      ["Family travel", "Work through traveler details, baggage needs, schedule priorities, and practical itinerary choices for family trips."],
      ["Same-day and urgent travel", "Discuss current availability, nearby airports, departure timing, and ticketing deadlines for urgent trips."],
      ["Changes and rebooking", "Review the existing reservation and discuss eligible dates, routing, availability, and any applicable price difference."],
      ["Cancellation questions", "Review the ticket terms and discuss whether a refund, credit, or another outcome may apply."],
      ["Multi-city planning", "Explain each segment of a complex trip and discuss practical itinerary structures before booking."],
    ],
    faqs: [
      { question: "Is TicketDepart part of Southwest Airlines?", answer: "No. TicketDepart is an independent travel agency. We are not affiliated with, endorsed by, or sponsored by Southwest Airlines and are not its official customer service." },
      { question: "Can I book a Southwest Airlines flight by phone?", answer: "Yes. A specialist can discuss your origin, destination, dates, travelers, preferences, and available booking options." },
      { question: "Can you help with an existing Southwest Airlines reservation?", answer: "We can review the reservation and explain available change, rebooking, or cancellation options. Exact outcomes depend on the ticket terms, availability, and applicable rules." },
      { question: "Can you help with a last-minute Southwest Airlines trip?", answer: "You can call to discuss current options. Seats, fares, and ticketing deadlines can change quickly, so availability is not guaranteed until ticketing is completed." },
      { question: "Are service fees disclosed before payment?", answer: "Any applicable TicketDepart service fee is disclosed before payment is authorized. Airline fare, taxes, and other applicable charges are also reviewed before you decide." },
    ],
  },
  {
    slug: "jetblue-airways",
    name: "JetBlue Airways",
    title: "JetBlue Airways Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency assistance for JetBlue Airways flight booking, changes, cancellations, family trips, and urgent travel planning.",
    heading: "JetBlue Airways flight booking assistance",
    intro: "Planning a JetBlue Airways trip? A TicketDepart specialist can discuss schedules, routes, travelers, fare conditions, and support needs before you confirm your itinerary.",
    services: [
      ["Flight booking", "Compare available schedules and routing for your dates and explain the fare conditions before booking."],
      ["International trips", "Discuss international routing, connection planning, baggage considerations, and travel-document responsibilities."],
      ["Family booking", "Work through traveler count, seating preferences, baggage, connection times, and schedule priorities."],
      ["Flight changes", "Review the existing ticket and discuss date, time, routing, and fare-difference considerations."],
      ["Cancellation assistance", "Discuss applicable cancellation, refund, or credit rules before any request is processed."],
      ["Last-minute travel", "For urgent trips, discuss current availability, practical airports, connections, and ticketing timing."],
    ],
    faqs: [
      { question: "Is TicketDepart affiliated with JetBlue Airways?", answer: "No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by JetBlue Airways." },
      { question: "Can I book a JetBlue Airways flight by phone?", answer: "Yes. Call with your origin, destination, dates, travelers, and preferences and a specialist can discuss available options." },
      { question: "Can you help with a JetBlue flight change?", answer: "We can review the ticket and discuss possible changes or rebooking. Exact costs and eligibility depend on the fare, availability, and applicable rules." },
      { question: "Can you help with international JetBlue itineraries?", answer: "Yes. We can discuss routing and connection considerations, while travelers remain responsible for confirming passport, visa, and entry requirements." },
    ],
  },
  {
    slug: "alaska-airlines",
    name: "Alaska Airlines",
    title: "Alaska Airlines Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency assistance for Alaska Airlines flight booking, changes, cancellations, family travel, and multi-city itineraries.",
    heading: "Alaska Airlines flight booking assistance",
    intro: "Tell TicketDepart where you need to go, when you want to travel, and what matters most. A specialist can discuss Alaska Airlines itinerary options and booking support by phone.",
    services: [
      ["Flight booking", "Discuss route, dates, connections, travelers, fare options, and practical departure or arrival airports."],
      ["West Coast travel", "Review schedules and routing for trips involving Alaska Airlines' network and connection points."],
      ["International travel", "Discuss eligible international routing, connections, baggage considerations, and itinerary details."],
      ["Changes and rebooking", "Review the existing reservation and compare available replacement dates or itineraries."],
      ["Cancellation questions", "Discuss refund or credit possibilities under the applicable ticket and airline terms."],
      ["Multi-city trips", "Work through multiple destinations, open-jaw ideas, and connection preferences before booking."],
    ],
    faqs: [
      { question: "Is TicketDepart part of Alaska Airlines?", answer: "No. TicketDepart is an independent travel agency. We are not affiliated with, endorsed by, or sponsored by Alaska Airlines." },
      { question: "Can you book Alaska Airlines flights by phone?", answer: "Yes. A specialist can discuss your itinerary and available booking options by phone." },
      { question: "Can you help change an Alaska Airlines reservation?", answer: "We can review the reservation and discuss available change or rebooking options. Final terms depend on the ticket and current availability." },
      { question: "Can you help with a multi-city trip?", answer: "Yes. Explain every city and preferred order and a specialist can discuss practical itinerary options." },
    ],
  },
  {
    slug: "british-airways",
    name: "British Airways",
    title: "British Airways Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency assistance for British Airways flight booking, international itineraries, premium cabins, changes, and cancellations.",
    heading: "British Airways flight booking assistance",
    intro: "For a British Airways trip, the details can matter: dates, connection airports, cabin, baggage, and fare flexibility. TicketDepart can review those choices with you by phone.",
    services: [
      ["International booking", "Discuss transatlantic and other international itineraries, connections, and travel dates."],
      ["Premium cabin planning", "Compare available cabin options and review what the selected fare includes before booking."],
      ["Connection planning", "Review connection airports and timing across the complete itinerary."],
      ["Flight changes", "Discuss replacement dates or routing and any applicable fare difference or change terms."],
      ["Cancellation and refund questions", "Review the ticket terms and discuss what cancellation outcome may apply."],
      ["Multi-city travel", "Plan multiple destinations or open-jaw routing and discuss how the segments fit together."],
    ],
    faqs: [
      { question: "Is TicketDepart affiliated with British Airways?", answer: "No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by British Airways." },
      { question: "Can you help book British Airways international flights?", answer: "Yes. We can discuss international routing, cabin preferences, connections, and fare conditions before booking." },
      { question: "Can you help with British Airways changes?", answer: "We can review the existing itinerary and discuss available changes or rebooking options. Exact terms depend on the ticket and current inventory." },
      { question: "Can you help compare premium cabins?", answer: "Yes. We can discuss available cabin options and the conditions that apply to the itinerary you are considering." },
    ],
  },
  {
    slug: "lufthansa",
    name: "Lufthansa",
    title: "Lufthansa Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency assistance for Lufthansa flight booking, Europe and international itineraries, premium cabins, changes, and cancellations.",
    heading: "Lufthansa flight booking assistance",
    intro: "Planning a Lufthansa itinerary? A TicketDepart specialist can discuss dates, connections, cabin preferences, baggage considerations, and change flexibility before you book.",
    services: [
      ["International booking", "Discuss Europe, transatlantic, and other international routing options for your travel dates."],
      ["Connection planning", "Review the full itinerary and practical connection timing rather than looking at each flight in isolation."],
      ["Premium cabin options", "Discuss available premium-cabin choices and fare conditions for your route."],
      ["Flight changes", "Review your existing ticket and discuss possible replacement dates, routing, and fare differences."],
      ["Cancellation questions", "Discuss refund or credit possibilities based on the specific ticket and applicable rules."],
      ["Multi-city itineraries", "Work through several destinations and open-jaw routing before booking."],
    ],
    faqs: [
      { question: "Is TicketDepart part of Lufthansa?", answer: "No. TicketDepart is an independent travel agency. We are not affiliated with, endorsed by, or sponsored by Lufthansa." },
      { question: "Can you help book Lufthansa flights by phone?", answer: "Yes. Call with your route and dates and a specialist can discuss available itinerary options." },
      { question: "Can you help with Lufthansa international connections?", answer: "Yes. We can discuss the complete routing and connection considerations, while travelers remain responsible for confirming entry and transit requirements." },
      { question: "Can you help change a Lufthansa booking?", answer: "We can review the ticket and explain available change or rebooking options. Eligibility and cost depend on the fare and availability." },
    ],
  },
  {
    slug: "air-canada",
    name: "Air Canada",
    title: "Air Canada Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency assistance for Air Canada flight booking, international travel, family itineraries, changes, cancellations, and multi-city trips.",
    heading: "Air Canada flight booking assistance",
    intro: "Planning an Air Canada itinerary? Tell TicketDepart your route, dates, travelers, and priorities and a specialist can discuss available options by phone.",
    services: [
      ["Flight booking", "Discuss schedules, routing, travelers, fare conditions, and practical airport options."],
      ["Canada and international travel", "Review itineraries between the U.S., Canada, and international destinations."],
      ["Family travel", "Discuss coordinated itineraries, seating needs, baggage, and connection preferences."],
      ["Flight changes", "Review the existing ticket and discuss possible date, time, or routing changes."],
      ["Cancellation questions", "Discuss refund or credit possibilities before you authorize a cancellation."],
      ["Multi-city trips", "Plan multiple stops and discuss the most practical way to structure the itinerary."],
    ],
    faqs: [
      { question: "Is TicketDepart affiliated with Air Canada?", answer: "No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by Air Canada." },
      { question: "Can you book Air Canada flights by phone?", answer: "Yes. A specialist can discuss your itinerary and available booking options by phone." },
      { question: "Can you help change an Air Canada flight?", answer: "We can review the reservation and discuss available changes or rebooking options. Exact terms depend on the ticket, availability, and applicable rules." },
      { question: "Can you help with U.S.-Canada and international itineraries?", answer: "Yes. We can discuss routing and connection considerations, while travelers remain responsible for confirming current entry and transit requirements." },
    ],
  },
  {
    slug: "swiss-air",
    name: "SWISS",
    title: "SWISS Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency assistance for SWISS flight booking, Europe and international itineraries, premium cabins, changes, and multi-city travel.",
    heading: "SWISS flight assistance with a travel specialist",
    intro: "Planning a SWISS itinerary? Share your route, dates, travelers, and cabin preferences. A TicketDepart specialist can walk through available itinerary options and applicable fare terms before you decide to book.",
    services: [
      ["International booking", "Discuss Europe, North America, and other international routing, connections, cabins, and fare conditions."],
      ["Premium cabin planning", "Review available Business or First cabin options and the fare conditions that apply to your itinerary."],
      ["Connection planning", "Work through the complete itinerary and practical connection timing before booking."],
      ["Changes and rebooking", "Review an existing reservation and discuss eligible dates, routing, availability, and applicable fare differences."],
      ["Cancellation questions", "Review the ticket terms and discuss whether a refund, credit, or another outcome may apply."],
      ["Multi-city travel", "Plan several destinations or open-jaw routing and discuss practical itinerary structures."],
    ],
    faqs: [
      { question: "Is TicketDepart affiliated with SWISS?", answer: "No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by SWISS." },
      { question: "Can I book a SWISS flight by phone?", answer: "Yes. A specialist can discuss your origin, destination, dates, travelers, cabin, and available booking options." },
      { question: "Can you help with an existing SWISS reservation?", answer: "We can review the reservation and discuss possible changes, rebooking, or cancellation options. Exact outcomes depend on the ticket terms and availability." },
      { question: "Are service fees disclosed before payment?", answer: "Any applicable TicketDepart service fee is disclosed before payment is authorized. Airline fare, taxes, and other applicable charges are reviewed before you decide." },
    ],
  },
  {
    slug: "qatar-airways",
    name: "Qatar Airways",
    title: "Qatar Airways Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency assistance for Qatar Airways flight booking, international itineraries, premium cabins, connections, changes, and multi-city trips.",
    heading: "Qatar Airways flight assistance with a travel specialist",
    intro: "Planning a Qatar Airways trip? Tell us your route, dates, travelers, and cabin preferences. A TicketDepart specialist can discuss itinerary options and applicable booking terms before you authorize a booking.",
    services: [
      ["International booking", "Discuss long-haul routing, connections, travel dates, and available fare options."],
      ["Premium cabin planning", "Review Business and other cabin options, baggage considerations, and applicable fare conditions."],
      ["Connection planning", "Look at the complete itinerary, connection airports, and practical timing."],
      ["Family travel", "Coordinate traveler details, schedules, baggage needs, and connection preferences for family trips."],
      ["Changes and rebooking", "Review an existing ticket and discuss available replacement dates, routing, and fare differences."],
      ["Multi-city itineraries", "Build a practical multi-stop plan and discuss how the segments fit together before booking."],
    ],
    faqs: [
      { question: "Is TicketDepart part of Qatar Airways?", answer: "No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by Qatar Airways." },
      { question: "Can I book Qatar Airways by phone?", answer: "Yes. A specialist can discuss your route, dates, travelers, cabin preferences, and available booking options." },
      { question: "Can you help with a Qatar Airways change?", answer: "We can review the existing reservation and discuss possible changes or rebooking. Exact eligibility and cost depend on the ticket and availability." },
      { question: "Can you help with international connections?", answer: "Yes. We can discuss the complete routing and connection considerations, while travelers remain responsible for confirming current entry and transit requirements." },
    ],
  },
  {
    slug: "emirates",
    name: "Emirates",
    title: "Emirates Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency assistance for Emirates flight booking, international itineraries, premium cabins, connections, changes, and multi-city trips.",
    heading: "Emirates flight assistance with a travel specialist",
    intro: "Planning an Emirates itinerary? Share your route, dates, travelers, and cabin preferences. A TicketDepart specialist can help you understand available itinerary options and applicable terms before booking.",
    services: [
      ["International booking", "Discuss long-haul routing, schedules, connections, and fare conditions for your trip."],
      ["Premium cabin planning", "Review available premium-cabin options and the inclusions and conditions associated with the itinerary."],
      ["Connection planning", "Work through the complete itinerary and practical connection timing."],
      ["Family travel", "Discuss coordinated travel, baggage needs, traveler details, and connection preferences."],
      ["Changes and rebooking", "Review an existing reservation and discuss eligible replacement dates, routing, and fare differences."],
      ["Multi-city travel", "Plan several destinations and discuss practical itinerary structures before you authorize a booking."],
    ],
    faqs: [
      { question: "Is TicketDepart affiliated with Emirates?", answer: "No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by Emirates." },
      { question: "Can I book an Emirates flight by phone?", answer: "Yes. A specialist can discuss your origin, destination, dates, travelers, cabin, and available booking options." },
      { question: "Can you help with an existing Emirates reservation?", answer: "We can review the reservation and discuss possible changes, rebooking, or cancellation options. Exact outcomes depend on ticket terms and availability." },
      { question: "Can you help with a multi-city Emirates itinerary?", answer: "Yes. We can discuss multiple destinations, connection timing, and practical itinerary structures before booking." },
    ],
  },
  {
    slug: "norse-atlantic-airways",
    name: "Norse Atlantic Airways",
    title: "Norse Atlantic Airways Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency assistance for Norse Atlantic Airways flight booking, transatlantic itineraries, connections, changes, and multi-city travel.",
    heading: "Norse Atlantic Airways flight assistance with a travel specialist",
    intro: "Planning a Norse Atlantic Airways trip? Share your origin, destination, dates, travelers, and preferences. A TicketDepart specialist can discuss transatlantic itinerary options, connections, and applicable booking terms before you decide to book.",
    services: [
      ["Transatlantic booking", "Discuss available transatlantic routing, travel dates, airports, and fare conditions."],
      ["Europe travel", "Work through U.S.-Europe and Europe-U.S. itinerary options and practical airport choices."],
      ["Connection planning", "Review the complete itinerary and discuss connection timing and airport considerations."],
      ["Changes and rebooking", "Review an existing reservation and discuss possible replacement dates, routing, availability, and applicable fare differences."],
      ["Cancellation questions", "Review the applicable ticket terms and discuss possible cancellation, refund, or credit outcomes."],
      ["Multi-city travel", "Discuss multiple destinations and practical itinerary structures before booking."],
    ],
    faqs: [
      { question: "Is TicketDepart affiliated with Norse Atlantic Airways?", answer: "No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by Norse Atlantic Airways." },
      { question: "Can I book a Norse Atlantic Airways flight by phone?", answer: "Yes. A specialist can discuss your route, dates, travelers, preferences, and available booking options." },
      { question: "Can you help with a Norse Atlantic Airways connection?", answer: "Yes. We can discuss the complete itinerary and practical connection considerations. Travelers remain responsible for confirming current passport, visa, transit, and entry requirements." },
      { question: "Can you help change an existing Norse Atlantic Airways reservation?", answer: "We can review the reservation and discuss possible changes or rebooking. Exact eligibility and costs depend on the ticket terms and availability." },
      { question: "Are service fees disclosed before payment?", answer: "Any applicable TicketDepart service fee is disclosed before payment is authorized. Airline fare, taxes, and other applicable charges are reviewed before you decide." },
    ],
  },
  {
    slug: "lot-polish-airlines",
    name: "LOT Polish Airlines",
    title: "LOT Polish Airlines Flight Booking Assistance | TicketDepart",
    description: "Independent travel agency assistance for LOT Polish Airlines flight booking, European and international itineraries, premium cabins, connections, changes, and multi-city trips.",
    heading: "LOT Polish Airlines flight assistance with a travel specialist",
    intro: "Planning a LOT Polish Airlines trip? Share your origin, destination, dates, travelers, and cabin preferences. A TicketDepart specialist can discuss itinerary options, connections, and applicable booking terms before you decide to book.",
    services: [
      ["International booking", "Discuss European, transatlantic, and other international routing, schedules, connections, and fare conditions."],
      ["Poland and Europe travel", "Work through routes involving Poland and European destinations, including connection timing and practical airport choices."],
      ["Premium cabin planning", "Review available premium-cabin options and the fare conditions and inclusions that apply to your itinerary."],
      ["Connection planning", "Look at the complete itinerary and discuss practical connection timing rather than evaluating each segment alone."],
      ["Changes and rebooking", "Review an existing reservation and discuss eligible replacement dates, routing, availability, and applicable fare differences."],
      ["Multi-city travel", "Plan multiple destinations or open-jaw routing and discuss practical itinerary structures before booking."],
    ],
    faqs: [
      { question: "Is TicketDepart affiliated with LOT Polish Airlines?", answer: "No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by LOT Polish Airlines." },
      { question: "Can I book a LOT Polish Airlines flight by phone?", answer: "Yes. A specialist can discuss your route, dates, travelers, cabin preferences, and available booking options." },
      { question: "Can you help with LOT Polish Airlines connections?", answer: "Yes. We can discuss the complete itinerary and practical connection considerations. Travelers remain responsible for confirming current passport, visa, transit, and entry requirements." },
      { question: "Can you help change an existing LOT reservation?", answer: "We can review the reservation and discuss possible changes or rebooking. Exact eligibility and costs depend on the ticket terms and availability." },
      { question: "Are service fees disclosed before payment?", answer: "Any applicable TicketDepart service fee is disclosed before payment is authorized. Airline fare, taxes, and other applicable charges are reviewed before you decide." },
    ],
  },
];

const RELATED = [
  ["/delta-airlines", "Delta Airlines"],
  ["/united-airlines", "United Airlines"],
  ["/american-airlines", "American Airlines"],
  ["/southwest-airlines", "Southwest Airlines"],
  ["/jetblue-airways", "JetBlue Airways"],
  ["/alaska-airlines", "Alaska Airlines"],
  ["/british-airways", "British Airways"],
  ["/lufthansa", "Lufthansa"],
  ["/air-canada", "Air Canada"],
  ["/swiss-air", "SWISS"],
  ["/qatar-airways", "Qatar Airways"],
  ["/emirates", "Emirates"],
] as const;

function AirlineAssistancePage({ page }: { page: AirlinePage }) {
  const id = page.slug.replaceAll("-", "_");

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
          faqSchema(page.faqs),
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
          <p className="label-board text-accent">{page.name} flight assistance</p>
          <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">{page.heading}</h1>
          <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">{page.intro}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CallCta size="lg" ocid={`${id}.hero_call`} />
            <Link to="/book-a-flight-by-phone" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-card px-6 text-base font-medium text-primary hover:bg-primary hover:text-primary-foreground">
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
              TicketDepart is an independent travel agency. We are not affiliated with, endorsed by, or sponsored by {page.name}, and we are not that airline's official customer service. Airline names and marks belong to their respective owners and are used for identification only.
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

      <Section tone="muted" ocid={`${id}.services`}>
        <SectionHeading eyebrow="What we can discuss" title={`${page.name} travel support`} description="Start with your route, dates, traveler details, or existing reservation. A specialist can work through the options that apply." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {page.services.map(([title, body]) => (
            <article key={title} className="group rounded-2xl border border-border/80 bg-card p-6 shadow-subtle transition-smooth hover:-translate-y-1 hover:border-primary/20 hover:shadow-elevated">
              <CheckCircle2 className="size-5 text-accent" />
              <h2 className="mt-4 font-display text-lg font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </Section>

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
        <SectionHeading eyebrow="FAQ" title={`${page.name} booking questions`} description="Practical information before you call." />
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 lg:grid-cols-2">
          {page.faqs.map((faq) => (
            <details key={faq.question} className="rounded-2xl border border-border bg-card p-5 shadow-subtle">
              <summary className="cursor-pointer font-semibold">{faq.question}</summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>

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
export function LotPolishAirlinesPage() { return <AirlineAssistancePage page={AIRLINES[9]} />; }
export function NorseAtlanticAirwaysPage() { return <AirlineAssistancePage page={AIRLINES[10]} />; }
