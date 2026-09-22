import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { SITE } from "@/lib/site";
import { breadcrumbSchema, faqSchema } from "@/lib/seo";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Phone, ShieldCheck } from "lucide-react";

type AirlineKey = "southwest" | "british-airways" | "lufthansa";

type AirlineConfig = {
  path: string;
  name: string;
  title: string;
  description: string;
  heading: string;
  intro: string;
  services: string[];
  planning: string[];
  faq: readonly { question: string; answer: string }[];
  related: readonly { label: string; to: string }[];
};

const CONFIG: Record<AirlineKey, AirlineConfig> = {
  southwest: {
    path: "/southwest-airlines",
    name: "Southwest Airlines",
    title: "Southwest Airlines Flight Booking Assistance | TicketDepart",
    description:
      "Independent travel agency assistance for Southwest Airlines flight planning and booking. Discuss routes, dates, travelers, and fare options by phone at +1 855-544-9001.",
    heading: "Southwest Airlines flight booking help by phone",
    intro:
      "If you prefer to talk through your Southwest Airlines trip with a person, TicketDepart can help organize your route, dates, travelers, and fare questions before you decide.",
    services: [
      "Domestic U.S. flight planning and booking",
      "One-way and round-trip itineraries",
      "Family and group travel planning",
      "Date, airport, and schedule comparisons",
      "Connecting itinerary questions",
      "Booking changes and rebooking discussions",
    ],
    planning: [
      "Have the departure and arrival cities or airports ready.",
      "Share your travel dates and any flexibility around them.",
      "Tell the specialist how many adults, children, or other travelers are flying.",
      "Ask about the fare, baggage, seating, and change conditions that apply to the itinerary you are considering.",
    ],
    faq: [
      {
        question: "Can TicketDepart book Southwest Airlines flights?",
        answer:
          "TicketDepart is an independent travel agency. We can discuss Southwest Airlines flight options and booking assistance by phone where our booking channels support the requested itinerary.",
      },
      {
        question: "Are you Southwest Airlines official customer service?",
        answer:
          "No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or the official customer service of Southwest Airlines.",
      },
      {
        question: "Can you guarantee a specific Southwest fare or seat?",
        answer:
          "No. Flight availability, fares, and seat options can change. We confirm the details that apply to the itinerary available when you book.",
      },
    ],
    related: [
      { label: "Flight booking assistance", to: "/flight-booking-assistance" },
      { label: "Domestic flight booking", to: "/domestic-flight-booking" },
      { label: "Family flight booking", to: "/family-flight-booking" },
    ],
  },
  "british-airways": {
    path: "/british-airways",
    name: "British Airways",
    title: "British Airways Flight Booking Assistance | TicketDepart",
    description:
      "Independent travel agency assistance for British Airways flight planning and booking. Discuss international routes, connections, cabins, and fare conditions by phone.",
    heading: "British Airways flight booking assistance by phone",
    intro:
      "International British Airways itineraries can involve long-haul schedules, connections, cabin choices, and different fare conditions. TicketDepart helps you work through those details with a travel specialist.",
    services: [
      "U.S.–U.K. and other international itinerary planning",
      "One-way, round-trip, and multi-city trips",
      "Economy, premium economy, business, and first-class questions",
      "Connection and airport-change planning",
      "Family and group international travel",
      "Changes and rebooking discussions",
    ],
    planning: [
      "List every city and date in your itinerary, especially for multi-city travel.",
      "Tell the specialist which cabin and schedule preferences matter most.",
      "Ask which segments are operated by British Airways or another carrier when partners are involved.",
      "Review baggage, connection, change, and fare conditions for the actual itinerary before confirming.",
    ],
    faq: [
      {
        question: "Can TicketDepart help book British Airways flights?",
        answer:
          "Yes. TicketDepart is an independent travel agency that can provide travel-planning and booking assistance for British Airways itineraries through supported booking channels.",
      },
      {
        question: "Can you help with a British Airways multi-city trip?",
        answer:
          "Yes. Share every city pair and date. A specialist can discuss routing, connections, cabin choices, and the fare conditions that apply.",
      },
      {
        question: "Are you affiliated with British Airways?",
        answer:
          "No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by British Airways.",
      },
    ],
    related: [
      { label: "International flight booking", to: "/international-flight-booking" },
      { label: "Multi-city flight booking", to: "/multi-city-flight-booking" },
      { label: "Flight booking by phone", to: "/book-a-flight-by-phone" },
    ],
  },
  lufthansa: {
    path: "/lufthansa",
    name: "Lufthansa",
    title: "Lufthansa Flight Booking Assistance | TicketDepart",
    description:
      "Independent travel agency assistance for Lufthansa flight planning and booking. Discuss international routes, connections, cabins, and fare conditions by phone.",
    heading: "Lufthansa flight booking assistance by phone",
    intro:
      "Lufthansa trips often involve international connections and cabin choices. TicketDepart helps you organize the itinerary and discuss routing, schedule, and fare details with a travel specialist.",
    services: [
      "U.S.–Europe and international itinerary planning",
      "One-way, round-trip, and multi-city trips",
      "Economy, premium economy, business, and first-class questions",
      "Connection and airport planning",
      "Family and group international travel",
      "Changes and rebooking discussions",
    ],
    planning: [
      "Provide the complete origin, destination, and travel dates.",
      "Mention whether your priority is schedule, cabin, connection time, or flexibility.",
      "Ask which carrier operates each segment when partner airlines are involved.",
      "Review the actual fare rules, baggage conditions, and change restrictions before booking.",
    ],
    faq: [
      {
        question: "Can TicketDepart help with Lufthansa flight bookings?",
        answer:
          "Yes. TicketDepart is an independent travel agency and can provide travel-planning and booking assistance for Lufthansa itineraries through supported booking channels.",
      },
      {
        question: "Can you help with Lufthansa connections in Europe?",
        answer:
          "Yes. Tell the specialist the complete itinerary and dates. We can discuss connection options and the practical details of the itinerary available for booking.",
      },
      {
        question: "Are you affiliated with Lufthansa?",
        answer:
          "No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by Lufthansa.",
      },
    ],
    related: [
      { label: "International flight booking", to: "/international-flight-booking" },
      { label: "Business class booking", to: "/business-class-flight-booking" },
      { label: "Multi-city flight booking", to: "/multi-city-flight-booking" },
    ],
  },
};

function AirlineIntentPage({ airline }: { airline: AirlineKey }) {
  const config = CONFIG[airline];
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Airline Booking Assistance", path: "/flight-booking" },
    { name: config.name, path: config.path },
  ];

  return (
    <>
      <Seo
        title={config.title}
        description={config.description}
        path={config.path}
        structuredData={[breadcrumbSchema(breadcrumbs), faqSchema(config.faq)]}
      />
      <Section tone="paper" ocid={airline + ".page"}>
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li><Link to="/">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link to="/flight-booking">Airline Booking Assistance</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-semibold text-foreground">{config.name}</li>
          </ol>
        </nav>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <p className="label-board text-accent">{config.name} flight assistance</p>
            <h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold leading-[1.08] sm:text-5xl">{config.heading}</h1>
            <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">{config.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CallCta size="lg" ocid={airline + ".hero_call"} />
              <Link to="/contact" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-card px-6 text-base font-medium text-primary">
                Send trip details <ArrowRight className="size-4" />
              </Link>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="size-4 text-accent" /> {SITE.hours} · {SITE.phoneDisplay}
            </p>
          </div>

          <aside className="rounded-2xl border border-border bg-card p-6 shadow-elevated sm:p-7">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="size-5 text-accent" />
              <h2 className="font-display text-lg font-semibold">Independent agency disclosure</h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              TicketDepart is an independent travel agency. We are not affiliated with, endorsed by, or sponsored by {config.name}, and this page is not the airline's official customer-service page.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Airline names and trademarks belong to their respective owners and are referenced only to identify the travel service discussed.
            </p>
          </aside>
        </div>
      </Section>

      <Section tone="muted" ocid={airline + ".services"}>
        <SectionHeading
          eyebrow="What we can discuss"
          title={"Practical " + config.name + " booking assistance"}
          description="The specialist can work through the trip details with you before you decide."
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {config.services.map((item) => (
            <li key={item} className="rounded-2xl border border-border bg-card p-6">
              <CheckCircle2 className="size-5 text-accent" />
              <p className="mt-3 text-sm leading-relaxed">{item}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="paper" ocid={airline + ".planning"}>
        <SectionHeading
          eyebrow="Before you call"
          title="Bring these details for a faster booking discussion"
          description="Having the basics ready helps the specialist search the right itinerary on the first call."
        />
        <ol className="mt-10 grid gap-4 md:grid-cols-2">
          {config.planning.map((item, index) => (
            <li key={item} className="rounded-2xl border border-border bg-card p-6">
              <span className="label-board text-accent">0{index + 1}</span>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="navy" ocid={airline + ".cta"}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="label-board text-accent">Ready to plan?</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Talk through your {config.name} trip</h2>
            <p className="mt-4 text-base leading-relaxed text-primary-foreground/80">
              Call {SITE.phoneDisplay}. We are available 24/7 for travel-planning and booking assistance.
            </p>
          </div>
          <CallCta size="lg" variant="solid" showNumber ocid={airline + ".final_call"} />
        </div>
      </Section>

      <Section tone="paper" ocid={airline + ".faq"}>
        <SectionHeading eyebrow="Questions" title={config.name + " booking FAQs"} description="Straight answers about independent travel-agency assistance." />
        <dl className="mt-10 grid gap-4 lg:grid-cols-2">
          {config.faq.map((item) => (
            <div key={item.question} className="rounded-2xl border border-border bg-card p-6">
              <dt className="font-display text-base font-semibold">{item.question}</dt>
              <dd className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section tone="paper" ocid={airline + ".related"}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="font-display text-xl font-semibold">More flight booking help</h2>
          <ul className="flex flex-wrap gap-3">
            {config.related.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card px-5 py-2.5 text-sm font-medium text-primary">
                  {item.label} <ArrowRight className="size-3.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}

export function SouthwestAirlinesPage() { return <AirlineIntentPage airline="southwest" />; }
export function BritishAirwaysPage() { return <AirlineIntentPage airline="british-airways" />; }
export function LufthansaPage() { return <AirlineIntentPage airline="lufthansa" />; }
