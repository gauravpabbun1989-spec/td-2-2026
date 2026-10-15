import { CallCta } from "@/components/CallCta";
import { FlightServiceIntentSection } from "@/components/FlightServiceIntentSection";
import { PageContentExpansion } from "@/components/PageContentExpansion";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { breadcrumbSchema, serviceSchema, webPageSchema } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";

type RoutePage = {
  path: string;
  origin: string;
  destination: string;
  airports: string;
  title: string;
  description: string;
  intro: string;
  routeNotes: string;
  faqs: readonly { question: string; answer: string }[];
};

const PAGES: readonly RoutePage[] = [
  {
    path: "/flights-new-york-to-london",
    origin: "New York",
    destination: "London",
    airports: "JFK, EWR → LHR, LGW",
    title: "New York to London Flights | Booking Assistance | TicketDepart",
    description: "Plan New York to London flights by phone. Discuss JFK or Newark, London airports, nonstop and connecting options, cabins, dates, and fare conditions.",
    intro: "Planning a New York to London trip from the U.S. East Coast? Share your travel dates, traveler count, cabin, and whether JFK or Newark is easier to reach. A specialist can discuss available nonstop and connecting itineraries and the fare rules that apply.",
    routeNotes: "Compare JFK and Newark departures with London-area arrival options such as Heathrow or Gatwick. Consider ground transport on both ends, arrival time, baggage allowance, connection details, and the change or cancellation rules for the exact fare. Schedules and nonstop availability depend on travel dates.",
    faqs: [
      { question: "Can I discuss New York to London flights by phone?", answer: "Yes. TicketDepart can discuss available itinerary options, dates, cabins, connections, baggage terms, and fare conditions by phone." },
      { question: "Can you compare JFK and Newark?", answer: "When practical, a specialist can discuss schedules from JFK and EWR and the trade-offs between available itineraries." },
    ],
  },
  {
    path: "/flights-new-york-to-paris",
    origin: "New York",
    destination: "Paris",
    airports: "JFK, EWR → CDG, ORY",
    title: "New York to Paris Flights | Booking Assistance | TicketDepart",
    description: "Book and compare New York to Paris flight options by phone. Discuss airports, nonstop and connecting routes, cabins, flexible dates, and fare rules.",
    intro: "For a New York to Paris trip, tell us your preferred dates, departure airport, travelers, and cabin. A specialist can work through nonstop and connecting options and explain the applicable terms.",
    routeNotes: "Discuss JFK or Newark departures and Paris-area arrival choices, including schedule, connection, cabin, baggage, and change-condition considerations.",
    faqs: [
      { question: "Can you help with New York to Paris flight booking?", answer: "Yes. You can discuss routes, dates, travelers, cabins, connections, baggage, and fare conditions by phone." },
      { question: "Can flexible dates be considered?", answer: "Yes. If your dates are flexible, provide a range so different schedules and fare options can be discussed." },
    ],
  },
  {
    path: "/flights-new-york-to-dubai",
    origin: "New York",
    destination: "Dubai",
    airports: "JFK, EWR → DXB",
    title: "New York to Dubai Flights | Booking Assistance | TicketDepart",
    description: "Plan New York to Dubai flights by phone. Discuss JFK and Newark, nonstop and connecting options, cabins, baggage, dates, and international fare conditions.",
    intro: "For New York to Dubai travel, share your date range, traveler count, preferred cabin, and tolerance for connections. A specialist can discuss available long-haul itineraries from the New York area and explain baggage and ticket conditions before you choose.",
    routeNotes: "For this long-haul trip, compare total journey time, departure and arrival times, connection airport and layover, cabin, baggage allowance, and change or cancellation rules. Do not assume a nonstop option or a particular fare is available for every date; confirm live itinerary details before payment.",
    faqs: [
      { question: "Can I book New York to Dubai flights by phone?", answer: "Yes. A specialist can discuss available routing and booking options, subject to live airline availability." },
      { question: "Can you discuss business class options?", answer: "Yes. Business and other cabin options can be discussed along with schedules and fare conditions." },
    ],
  },
  {
    path: "/flights-los-angeles-to-tokyo",
    origin: "Los Angeles",
    destination: "Tokyo",
    airports: "LAX → HND, NRT",
    title: "Los Angeles to Tokyo Flights | Booking Assistance | TicketDepart",
    description: "Compare Los Angeles to Tokyo flights by phone. Discuss LAX, Haneda and Narita, nonstop and connecting options, cabins, dates, and fare conditions.",
    intro: "Planning a Los Angeles to Tokyo trip? Share your travel window, traveler count, cabin preference, and whether Haneda or Narita is more convenient. A specialist can discuss available LAX itineraries and compare schedule and connection trade-offs.",
    routeNotes: "Tokyo has two major international airports, Haneda (HND) and Narita (NRT), and the better arrival point depends on your final destination and ground transport. Compare total travel time, arrival time, connection details, baggage allowance, and fare rules for the specific dates.",
    faqs: [
      { question: "Can you compare Haneda and Narita?", answer: "Yes. A specialist can discuss available schedules and the practical differences between Tokyo-area arrival airports." },
      { question: "Can you help with a business class itinerary?", answer: "Yes. Premium cabin availability and fare conditions can be discussed for the route." },
    ],
  },
  {
    path: "/flights-los-angeles-to-london",
    origin: "Los Angeles",
    destination: "London",
    airports: "LAX → LHR, LGW",
    title: "Los Angeles to London Flights | Booking Assistance | TicketDepart",
    description: "Plan Los Angeles to London flights by phone. Discuss LAX, London airports, nonstop and connecting routes, cabins, flexible dates, and fare conditions.",
    intro: "For Los Angeles to London travel, share your dates and preferences and a specialist can discuss available routing, airport, cabin, and connection choices by phone.",
    routeNotes: "Compare London-area arrival airports and itinerary timing. Fare families can differ in baggage, changes, cancellations, and flexibility.",
    faqs: [
      { question: "Can you help compare Los Angeles to London options?", answer: "Yes. Discuss schedules, airports, cabins, connections, baggage, and fare conditions with a specialist." },
      { question: "Can I ask about flexible dates?", answer: "Yes. Flexible dates can be included when discussing available schedules and fares." },
    ],
  },
  {
    path: "/flights-miami-to-cancun",
    origin: "Miami",
    destination: "Cancun",
    airports: "MIA → CUN",
    title: "Miami to Cancun Flights | Booking Assistance | TicketDepart",
    description: "Plan Miami to Cancun flights by phone. Discuss MIA, nonstop and connecting options, dates, travelers, cabins, baggage, and fare conditions.",
    intro: "Planning Miami to Cancun travel? Call with your dates, travelers, and preferred cabin and discuss practical MIA-to-CUN options with a specialist.",
    routeNotes: "For a short international route, schedule and fare-family differences can matter. Discuss baggage, connection needs, and change conditions before payment.",
    faqs: [
      { question: "Can I discuss Miami to Cancun flights by phone?", answer: "Yes. TicketDepart can discuss available route and fare options subject to live availability." },
      { question: "Can you help with family travel?", answer: "Yes. Share traveler count and any seating or baggage considerations when discussing the itinerary." },
    ],
  },
  {
    path: "/flights-chicago-to-london",
    origin: "Chicago",
    destination: "London",
    airports: "ORD → LHR, LGW",
    title: "Chicago to London Flights | Booking Assistance | TicketDepart",
    description: "Compare Chicago to London flights by phone. Discuss O'Hare, London airports, nonstop and connecting itineraries, cabins, dates, and fare conditions.",
    intro: "Need a Chicago to London flight? Tell us your dates, traveler count, cabin, and flexibility and a specialist can discuss available ORD-to-London itinerary choices.",
    routeNotes: "Chicago departures and London arrival airports can produce different schedules and connections. Compare practical itinerary details before confirming.",
    faqs: [
      { question: "Can you help with Chicago to London booking?", answer: "Yes. Discuss routing, dates, cabins, baggage, connections, and fare conditions by phone." },
      { question: "Can you discuss nonstop options?", answer: "Yes. A specialist can discuss available nonstop and connecting itineraries based on live availability." },
    ],
  },
  {
    path: "/flights-san-francisco-to-tokyo",
    origin: "San Francisco",
    destination: "Tokyo",
    airports: "SFO → HND, NRT",
    title: "San Francisco to Tokyo Flights | Booking Assistance | TicketDepart",
    description: "Plan San Francisco to Tokyo flights by phone. Discuss SFO, Haneda and Narita, nonstop and connecting routes, cabins, dates, and fare conditions.",
    intro: "Planning a San Francisco to Tokyo trip? Share your date range, traveler count, cabin preference, and whether Haneda or Narita works better for your final destination. A specialist can discuss available SFO itineraries and help compare schedule, connection, and fare-rule trade-offs.",
    routeNotes: "For San Francisco–Tokyo travel, compare Haneda (HND) and Narita (NRT) against your final destination and ground transport. Review total journey time, arrival time, connection details, baggage allowance, and the change or cancellation rules for the exact fare before confirming.",
    faqs: [
      { question: "Can you help compare Tokyo airports?", answer: "Yes. A specialist can discuss available Haneda and Narita itineraries and their schedule differences." },
      { question: "Can I ask about premium cabins?", answer: "Yes. Business, first, and other available cabin options can be discussed for the route." },
    ],
  },
];

function RoutePage({ page }: { page: RoutePage }) {
  const id = page.path.slice(1).replaceAll("-", "_");
  const breadcrumbs = [{ name: "Home", path: "/" }, { name: `${page.origin} to ${page.destination} flights`, path: page.path }];
  const originGatewayPath: Record<string, string> = {
    "New York": "/flights-from-new-york",
    "Los Angeles": "/flights-from-los-angeles",
    "Chicago": "/flights-from-chicago",
    "Miami": "/flights-from-miami",
    "San Francisco": "/flights-from-san-francisco",
  };
  return (
    <>
      <Seo title={page.title} description={page.description} path={page.path} structuredData={[
        breadcrumbSchema(breadcrumbs),
        webPageSchema({ title: page.title, description: page.description, path: page.path }),
        serviceSchema({ name: `${page.origin} to ${page.destination} flight booking assistance`, description: page.description, path: page.path }),
      ]} />
      <Section tone="paper" ocid={`${id}.hero`}>
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li><Link to="/" className="font-medium hover:text-foreground">Home</Link></li>
            <li aria-hidden="true"><ArrowRight className="size-4" /></li>
            <li><span aria-current="page" className="font-semibold text-foreground">{page.origin} to {page.destination} flights</span></li>
          </ol>
        </nav>
        <div className="mx-auto mt-10 max-w-4xl">
          <p className="label-board text-accent">Route booking assistance</p>
          <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">{page.origin} to {page.destination} flights</h1>
          <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">{page.intro}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CallCta size="lg" ocid={`${id}.hero_call`} />
            <Link to="/flight-booking/" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-card px-6 text-base font-medium text-primary hover:bg-primary hover:text-primary-foreground">
              More flight booking help <ArrowRight className="size-4" />
            </Link>
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><Phone className="size-4 text-accent" />{SITE.hours} · {SITE.phoneDisplay}</p>
          <p className="mt-3 text-sm text-muted-foreground">Typical airport pair: {page.airports}</p>
        </div>
      </Section>

      <Section tone="muted" ocid={`${id}.planning`}>
        <SectionHeading eyebrow="Route planning" title={`Plan your ${page.origin} to ${page.destination} itinerary`} description="Discuss the details that can change the practical value of a flight, not just the headline fare." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Dates and flexibility", "Share your travel dates and whether nearby dates are workable."],
            ["Airport choices", `Discuss ${page.airports} and any practical airport alternatives.`],
            ["Nonstop or connecting", "Compare schedule, connection time, and routing trade-offs."],
            ["Cabin", "Ask about economy, premium economy, business, or first-class availability."],
            ["Baggage", "Review the baggage allowance and fare-family conditions before payment."],
            ["Changes and cancellations", "Ask about applicable change, cancellation, and refund conditions before confirming."],
          ].map(([title, text]) => (
            <article key={title} className="rounded-2xl border border-border bg-card p-6 shadow-subtle">
              <CheckCircle2 className="size-5 text-accent" />
              <h2 className="mt-4 font-display text-lg font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
        <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-border bg-card p-6 shadow-subtle">
          <h2 className="font-display text-lg font-semibold">Route considerations</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{page.routeNotes}</p>
        </div>
      </Section>

      <PageContentExpansion subject={`${page.origin} to ${page.destination} flights`} intro={page.intro} points={[["Airport choices", `Typical airport pair: ${page.airports}`],["Route considerations", page.routeNotes],["Dates and flexibility", "Discuss your travel window and any flexibility."],["Cabin and baggage", "Review cabin options and baggage terms before booking."]]} />

      <Section tone="paper" ocid={`${id}.cta`}>
        <div className="mx-auto max-w-3xl text-center">
          <p className="label-board text-accent">Available 24/7</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold sm:text-4xl">Discuss {page.origin} to {page.destination} flight options</h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">Have your dates, traveler count, cabin preference, and airport preferences ready if known. Review available options and applicable terms before you decide.</p>
          <div className="mt-8"><CallCta size="lg" showNumber ocid={`${id}.final_call`} /></div>
        </div>
      </Section>

            <FlightServiceIntentSection routeLabel={`${page.origin} to ${page.destination}`} />
<Section tone="paper" ocid={`${id}.related`}>
        <SectionHeading eyebrow="Related booking help" title="Continue planning" description="Move from a route search to broader booking assistance." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [`Flights from ${page.origin}`, originGatewayPath[page.origin] ?? "/flight-booking/"],
            ["Flight booking", "/flight-booking/"],
            ["International flights", "/international-flight-booking/"],
            ["Last-minute flights", "/last-minute-flight-booking"],
            ["Book by phone", "/book-a-flight-by-phone/"],
          ].map(([label, to]) => (
            <Link key={to} to={to} className="rounded-2xl border border-border bg-card p-5 shadow-subtle hover:shadow-elevated">
              <span className="font-display text-base font-semibold">{label}</span>
              <span className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-primary">Open guide <ArrowRight className="size-4" /></span>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="paper" ocid={`${id}.faq`}>
        <SectionHeading eyebrow="FAQ" title={`${page.origin} to ${page.destination} flight questions`} description="Practical information before you call." />
        <div className="mx-auto mt-10 max-w-3xl space-y-4">
          {page.faqs.map((faq) => (
            <details key={faq.question} className="rounded-2xl border border-border bg-card p-5 shadow-subtle">
              <summary className="cursor-pointer font-semibold">{faq.question}</summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}

export function FlightsNewYorkToLondonPage() { return <RoutePage page={PAGES[0]} />; }
export function FlightsNewYorkToParisPage() { return <RoutePage page={PAGES[1]} />; }
export function FlightsNewYorkToDubaiPage() { return <RoutePage page={PAGES[2]} />; }
export function FlightsLosAngelesToTokyoPage() { return <RoutePage page={PAGES[3]} />; }
export function FlightsLosAngelesToLondonPage() { return <RoutePage page={PAGES[4]} />; }
export function FlightsMiamiToCancunPage() { return <RoutePage page={PAGES[5]} />; }
export function FlightsChicagoToLondonPage() { return <RoutePage page={PAGES[6]} />; }
export function FlightsSanFranciscoToTokyoPage() { return <RoutePage page={PAGES[7]} />; }
