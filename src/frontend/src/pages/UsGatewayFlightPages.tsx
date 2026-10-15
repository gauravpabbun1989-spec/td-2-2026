import { CallCta } from "@/components/CallCta";
import { FlightServiceIntentSection } from "@/components/FlightServiceIntentSection";
import { PageContentExpansion } from "@/components/PageContentExpansion";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import {
  breadcrumbSchema,
  serviceSchema,
  webPageSchema,
} from "@/lib/seo";
import { SITE } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";

type GatewayPage = {
  path: string;
  city: string;
  airports: string;
  region: string;
  title: string;
  description: string;
  intro: string;
  routes: string;
  faqs: readonly { question: string; answer: string }[];
};

const PAGES: readonly GatewayPage[] = [
  {
    path: "/flights-from-new-york",
    city: "New York",
    airports: "JFK, LGA, EWR",
    region: "New York",
    title: "Flights From New York | Booking Assistance | TicketDepart",
    description:
      "Compare flight options from New York by phone. Discuss JFK, LaGuardia, Newark, domestic and international routes, dates, cabins, connections, and fare conditions.",
    intro:
      "Flying from New York can mean choosing between JFK, LaGuardia, and Newark, with different ground-transport needs and schedules. Share your destination, dates, traveler count, and airport flexibility so a specialist can discuss practical domestic or international itineraries.",
    routes:
      "Discuss domestic trips across the U.S., transatlantic travel, Caribbean routes, and other international itineraries departing from the New York area.",
    faqs: [
      {
        question: "Can you help compare JFK, LGA, and Newark?",
        answer:
          "Yes. When practical, a specialist can discuss the schedules and itinerary differences between JFK, LaGuardia, and Newark. Ground transportation and total travel time should also be considered.",
      },
      {
        question: "Can I book an international flight from New York by phone?",
        answer:
          "Yes. TicketDepart can discuss international flight options, connections, cabins, baggage terms, and fare conditions by phone.",
      },
    ],
  },
  {
    path: "/flights-from-los-angeles",
    city: "Los Angeles",
    airports: "LAX",
    region: "Los Angeles",
    title: "Flights From Los Angeles | Booking Assistance | TicketDepart",
    description:
      "Plan flights from Los Angeles by phone. Discuss LAX routes, domestic and international destinations, flexible dates, connections, cabins, baggage, and fare conditions.",
    intro:
      "For departures from Los Angeles, share your destination, date range, traveler count, cabin, and whether you prefer to depart from LAX or can use another airport. A specialist can discuss available domestic and long-haul options and the trade-offs between journey time, connections, and fare rules.",
    routes:
      "Discuss U.S. domestic routes plus international travel to Latin America, Europe, Asia, Canada, and other destinations served from the Los Angeles area.",
    faqs: [
      {
        question: "Can you help with flights from LAX?",
        answer:
          "Yes. A specialist can discuss available LAX itineraries, dates, connections, cabins, and applicable fare conditions.",
      },
      {
        question: "Can flexible dates be considered?",
        answer:
          "Yes. If your dates are flexible, mention the range when you call so available schedules and fare options can be compared.",
      },
    ],
  },
  {
    path: "/flights-from-chicago",
    city: "Chicago",
    airports: "ORD, MDW",
    region: "Chicago",
    title: "Flights From Chicago | Booking Assistance | TicketDepart",
    description:
      "Compare flights from Chicago by phone. Discuss O'Hare and Midway, domestic and international routes, connections, cabin options, baggage, and fare conditions.",
    intro:
      "Chicago travelers can have different routing choices depending on whether O'Hare or Midway works better for the trip. Discuss your destination, timing, and airport flexibility with a specialist.",
    routes:
      "Review domestic itineraries and international options from the Chicago area, including trips where connection time, airport choice, or cabin matters.",
    faqs: [
      {
        question: "Can you compare O'Hare and Midway?",
        answer:
          "When practical, a specialist can discuss schedules from ORD and MDW and the trade-offs of using either airport for your trip.",
      },
      {
        question: "Can you help with international travel from Chicago?",
        answer:
          "Yes. International routes, connections, cabins, baggage terms, and fare conditions can be discussed by phone.",
      },
    ],
  },
  {
    path: "/flights-from-miami",
    city: "Miami",
    airports: "MIA",
    region: "Miami",
    title: "Flights From Miami | Booking Assistance | TicketDepart",
    description:
      "Plan flights from Miami by phone. Discuss MIA routes, domestic and international destinations, connections, dates, cabins, baggage, and fare conditions.",
    intro:
      "For flights from Miami, share your destination, travel dates, traveler count, and schedule priorities. A specialist can discuss domestic options and international routes toward the Caribbean, Mexico, Latin America, and beyond, subject to live availability.",
    routes:
      "Discuss domestic trips and international travel involving the Caribbean, Mexico, Latin America, Europe, and other destinations.",
    faqs: [
      {
        question: "Can you help book flights from Miami?",
        answer:
          "Yes. TicketDepart can discuss MIA flight options, routing, dates, cabins, baggage, and fare conditions by phone.",
      },
      {
        question: "Can you help with Caribbean or Latin America trips?",
        answer:
          "Yes. You can discuss international itinerary options and connections for Caribbean and Latin American travel, subject to live airline availability.",
      },
    ],
  },
  {
    path: "/flights-from-atlanta",
    city: "Atlanta",
    airports: "ATL",
    region: "Atlanta",
    title: "Flights From Atlanta | Booking Assistance | TicketDepart",
    description:
      "Compare flights from Atlanta by phone. Discuss ATL domestic and international routes, schedules, connections, cabins, baggage, and fare conditions.",
    intro:
      "Atlanta can offer many routing choices for domestic and international travel. Tell a specialist your destination, dates, and preferred schedule and review practical options by phone.",
    routes:
      "Discuss domestic U.S. trips and international itineraries where connection timing, cabin, baggage, or schedule flexibility matters.",
    faqs: [
      {
        question: "Can you help with flights from ATL?",
        answer:
          "Yes. A specialist can discuss available ATL itineraries and the applicable schedules, connections, cabins, and fare conditions.",
      },
      {
        question: "Can I discuss connecting flights?",
        answer:
          "Yes. Connection timing and routing can be reviewed as part of the itinerary discussion before you decide.",
      },
    ],
  },
  {
    path: "/flights-from-dallas",
    city: "Dallas",
    airports: "DFW, DAL",
    region: "Dallas–Fort Worth",
    title: "Flights From Dallas | Booking Assistance | TicketDepart",
    description:
      "Plan flights from Dallas by phone. Discuss DFW and Love Field, domestic and international routes, dates, connections, cabins, baggage, and fare conditions.",
    intro:
      "Dallas-area travelers may have different options depending on the departure airport and destination. Share your trip details and discuss practical routing and schedule choices.",
    routes:
      "Discuss domestic travel and international itineraries from the Dallas–Fort Worth area, including airport, connection, and cabin considerations.",
    faqs: [
      {
        question: "Can you compare DFW and Love Field?",
        answer:
          "When practical, a specialist can discuss available schedules from DFW and DAL and the travel-time implications of each airport.",
      },
      {
        question: "Can you help with international flights from Dallas?",
        answer:
          "Yes. International routing, connections, cabin choices, baggage terms, and fare conditions can be discussed by phone.",
      },
    ],
  },
  {
    path: "/flights-from-orlando",
    city: "Orlando",
    airports: "MCO",
    region: "Orlando",
    title: "Flights From Orlando | Booking Assistance | TicketDepart",
    description:
      "Compare flights from Orlando by phone. Discuss MCO domestic and international routes, family travel, dates, connections, cabins, baggage, and fare conditions.",
    intro:
      "Orlando trips often involve families, flexible dates, or destination changes. Explain your travelers and schedule and discuss flight options that fit the practical needs of the trip.",
    routes:
      "Discuss domestic U.S. travel and international itineraries from Orlando, including family, group, and vacation-oriented schedules.",
    faqs: [
      {
        question: "Can you help families book flights from Orlando?",
        answer:
          "Yes. You can discuss traveler count, ages, seating considerations, baggage, dates, and available itineraries with a specialist.",
      },
      {
        question: "Can you compare different departure dates?",
        answer:
          "Yes. If you have flexibility, provide the date range so available schedules and fare conditions can be discussed.",
      },
    ],
  },
  {
    path: "/flights-from-san-francisco",
    city: "San Francisco",
    airports: "SFO",
    region: "San Francisco",
    title: "Flights From San Francisco | Booking Assistance | TicketDepart",
    description:
      "Plan flights from San Francisco by phone. Discuss SFO domestic and international routes, connections, dates, cabins, baggage, and fare conditions.",
    intro:
      "San Francisco is a major gateway for U.S. and international travel. Share your destination, dates, cabin preference, and connection needs and review practical itinerary considerations.",
    routes:
      "Discuss domestic travel and international routes to Europe, Asia, Canada, Mexico, and other destinations, subject to live airline availability.",
    faqs: [
      {
        question: "Can you help with international flights from SFO?",
        answer:
          "Yes. International routes, connection options, cabins, baggage terms, and fare conditions can be discussed by phone.",
      },
      {
        question: "Can nearby airports be considered?",
        answer:
          "If another airport is practical for your trip, mention it when you call. Airport choice should be weighed against schedule, transportation, and total travel time.",
      },
    ],
  },
];

const CITY_ROUTE_LINKS: Record<string, readonly [string, string][]> = {
  "New York": [["New York to London", "/flights-new-york-to-london"], ["New York to Paris", "/flights-new-york-to-paris"], ["New York to Dubai", "/flights-new-york-to-dubai"]],
  "Los Angeles": [["Los Angeles to Tokyo", "/flights-los-angeles-to-tokyo"], ["Los Angeles to London", "/flights-los-angeles-to-london"]],
  "Chicago": [["Chicago to London", "/flights-chicago-to-london"]],
  "Miami": [["Miami to Cancun", "/flights-miami-to-cancun"]],
  "San Francisco": [["San Francisco to Tokyo", "/flights-san-francisco-to-tokyo"]],
};

function GatewayFlightPage({ page }: { page: GatewayPage }) {
  const id = page.path.slice(1).replaceAll("-", "_");

  return (
    <>
      <Seo
        title={page.title}
        description={page.description}
        path={page.path}
        structuredData={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: `Flights from ${page.city}`, path: page.path },
          ]),
          webPageSchema({
            title: page.title,
            description: page.description,
            path: page.path,
          }),
          serviceSchema({
            name: `${page.region} flight booking assistance`,
            description: page.description,
            path: page.path,
          }),
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
                Flights from {page.city}
              </span>
            </li>
          </ol>
        </nav>

        <div className="mx-auto mt-10 max-w-4xl">
          <p className="label-board text-accent">U.S. flight booking assistance</p>
          <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
            Flights from {page.city}
          </h1>
          <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {page.intro}
          </p>
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            Departure airport{page.airports.includes(",") ? "s" : ""}: {page.airports}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CallCta size="lg" ocid={`${id}.hero_call`} />
            <Link
              to="/flight-booking/"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-card px-6 text-base font-medium text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Explore flight booking help <ArrowRight className="size-4" />
            </Link>
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="size-4 text-accent" />
            {SITE.hours} · {SITE.phoneDisplay}
          </p>
        </div>
      </Section>

      <Section tone="muted" ocid={`${id}.planning`}>
        <SectionHeading
          eyebrow={`${page.city} departure options`}
          title="Build the trip around your actual plans"
          description="Start with the destination, dates, travelers, cabin, and airport preferences. A specialist can help you work through the practical itinerary details."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Airport choices", `Discuss options around ${page.airports} and nearby airports when they are practical.`],
            ["Domestic and international", "Review U.S. and international itineraries based on your destination and dates."],
            ["Connections", "Compare connection points and timing when a nonstop itinerary is unavailable or unsuitable."],
            ["Flexible dates", "If your schedule allows flexibility, discuss nearby dates that may offer different schedules."],
            ["Cabin and baggage", "Review available cabin options and the baggage terms attached to the fare."],
            ["Fare conditions", "Ask about changes, cancellations, refund terms, and any applicable agency service fee before payment."],
          ].map(([title, text]) => (
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
        <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-border bg-card p-6 shadow-subtle">
          <h2 className="font-display text-lg font-semibold">Routes travelers may discuss</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{page.routes}</p>
        </div>
      </Section>

      <PageContentExpansion subject={`flights from ${page.city}`} intro={page.intro} points={[["Airport choices", `Departure airports: ${page.airports}`],["Route options", page.routes],["Dates and flexibility", "Discuss the dates and schedule priorities that matter to your trip."],["Connections", "Compare nonstop and connecting options when both are available."]]} />

      <Section tone="paper" ocid={`${id}.cta`}>
        <div className="mx-auto max-w-3xl text-center">
          <p className="label-board text-accent">Available 24/7</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold sm:text-4xl">
            Discuss your {page.city} flight plans by phone
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Have your destination, travel dates, travelers, and preferred cabin ready if known. We can review the itinerary details and applicable terms before you decide.
          </p>
          <div className="mt-8">
            <CallCta size="lg" showNumber ocid={`${id}.final_call`} />
          </div>
        </div>
      </Section>

            <FlightServiceIntentSection />
<Section tone="paper" ocid={`${id}.related`}>
        <SectionHeading
          eyebrow="Related booking help"
          title="Continue planning your flight"
          description="Explore broader booking assistance and trip-type guides."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ...(CITY_ROUTE_LINKS[page.city] ?? []),
            ["Flight booking", "/flight-booking/"],
            ["International flights", "/international-flight-booking/"],
            ["Last-minute flights", "/last-minute-flight-booking"],
            ["Multi-city flights", "/multi-city-flight-booking/"],
            ["Group flights", "/group-flight-booking/"],
            ["Book by phone", "/book-a-flight-by-phone/"],
          ].map(([label, to]) => (
            <Link
              key={to}
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
          title={`${page.city} flight booking questions`}
          description="Practical information before you call."
        />
        <div className="mx-auto mt-10 max-w-3xl space-y-4">
          {page.faqs.map((faq) => (
            <details
              key={faq.question}
              className="rounded-2xl border border-border bg-card p-5 shadow-subtle"
            >
              <summary className="cursor-pointer font-semibold">{faq.question}</summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}

export function FlightsFromNewYorkPage() {
  return <GatewayFlightPage page={PAGES[0]!} />;
}
export function FlightsFromLosAngelesPage() {
  return <GatewayFlightPage page={PAGES[1]!} />;
}
export function FlightsFromChicagoPage() {
  return <GatewayFlightPage page={PAGES[2]!} />;
}
export function FlightsFromMiamiPage() {
  return <GatewayFlightPage page={PAGES[3]!} />;
}
export function FlightsFromAtlantaPage() {
  return <GatewayFlightPage page={PAGES[4]!} />;
}
export function FlightsFromDallasPage() {
  return <GatewayFlightPage page={PAGES[5]!} />;
}
export function FlightsFromOrlandoPage() {
  return <GatewayFlightPage page={PAGES[6]!} />;
}
export function FlightsFromSanFranciscoPage() {
  return <GatewayFlightPage page={PAGES[7]!} />;
}
