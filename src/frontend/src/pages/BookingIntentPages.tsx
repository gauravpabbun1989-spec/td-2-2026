import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { SITE } from "@/lib/site";
import { breadcrumbSchema, faqSchema, serviceSchema, webPageSchema } from "@/lib/seo";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";

type IntentKey = "international" | "last-minute" | "multi-city" | "group";

type IntentConfig = {
  path: string; title: string; description: string; eyebrow: string; heading: string;
  intro: string; situations: string[]; process: string[];
  faq: readonly { question: string; answer: string }[];
  related: readonly { label: string; to: string }[];
};

const CONFIG: Record<IntentKey, IntentConfig> = {
  international: {
    path: "/international-flight-booking",
    title: "International Flight Booking Assistance by Phone | TicketDepart",
    description: "Plan international flights with a travel specialist. Get help comparing routes, connections, cabins, and fare conditions by phone at +1 855-544-9001.",
    eyebrow: "International travel",
    heading: "International flight booking with a real travel specialist",
    intro: "International itineraries can involve long connections, multiple carriers, cabin choices, and fare conditions that are easy to overlook. TicketDepart helps you work through those details by phone before you decide.",
    situations: ["Transatlantic, transpacific, and long-haul itineraries","U.S. travel to Europe, Asia, Latin America, Canada, Mexico, and the Caribbean","One-way, round-trip, open-jaw, and multi-city international trips","Business, first, and premium economy cabin questions","Connection and layover planning","Questions about fare rules and changes"],
    process: ["Share your departure city, destination, dates, travelers, and preferred cabin.","Discuss routing, connection, and schedule trade-offs with a specialist.","Review the fare conditions and choose the itinerary that fits your trip."],
    faq: [
      { question: "Can you help with international flight itineraries?", answer: "Yes. TicketDepart assists with international itineraries and can discuss routing, connections, cabins, and fare conditions by phone." },
      { question: "Can you help with a complicated international itinerary?", answer: "Yes. Tell the specialist all of your city pairs and dates. We can discuss multi-city, open-jaw, and mixed-carrier options where available." },
      { question: "Are you an official airline booking office?", answer: "No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by any airline." }
    ],
    related: [{ label: "Flight booking assistance", to: "/flight-booking" },{ label: "Book by phone", to: "/book-a-flight-by-phone" },{ label: "How phone booking works", to: "/how-to-book-a-flight-by-phone" }]
  },
  "last-minute": {
    path: "/last-minute-flight-booking",
    title: "Last-Minute Flight Booking Assistance | TicketDepart",
    description: "Need a flight soon? Speak with a TicketDepart travel specialist about available routing, connection, cabin, and fare options at +1 855-544-9001.",
    eyebrow: "Travel soon",
    heading: "Last-minute flight booking help by phone",
    intro: "When your departure is close, time matters. A specialist can help you organize the trip details, compare practical routing options, and explain fare conditions before you confirm.",
    situations: ["Departures coming up soon","Urgent one-way or round-trip travel","Alternative departure airports or dates","Connection and schedule comparisons","Cabin and baggage questions","Rebooking after a changed travel plan"],
    process: ["Call with your departure city, destination, date, and traveler count.","Tell us how flexible you are about time, airport, cabin, or connections.","Review the available options and fare conditions before confirming."],
    faq: [
      { question: "Can you help when I need to travel soon?", answer: "Yes. Call with your route and travel date. A specialist can discuss the available options and explain the conditions that apply." },
      { question: "Do you guarantee a last-minute seat or fare?", answer: "No. Flight availability and pricing change, so we do not guarantee a particular seat, fare, or schedule before it is confirmed." },
      { question: "Can you help if my original plans changed?", answer: "Yes. We can discuss rebooking and alternative dates or airports based on the fare rules and availability for your ticket." }
    ],
    related: [{ label: "Flight booking assistance", to: "/flight-booking" },{ label: "Contact TicketDepart", to: "/contact" },{ label: "International booking", to: "/international-flight-booking" }]
  },
  "multi-city": {
    path: "/multi-city-flight-booking",
    title: "Multi-City Flight Booking Assistance by Phone | TicketDepart",
    description: "Plan multi-city and open-jaw flights with a travel specialist. Compare city pairs, connections, cabins, and fare conditions by phone.",
    eyebrow: "Complex itineraries",
    heading: "Multi-city flight booking without the guesswork",
    intro: "A trip with several stops can require more than a simple round-trip search. TicketDepart helps you organize each city pair and compare practical routing and fare options with a specialist.",
    situations: ["Three or more city pairs on one trip","Open-jaw itineraries","Different arrival and departure cities","Mixed-carrier travel","International trips with multiple stops","Business and premium-cabin multi-city travel"],
    process: ["List every city, date, and required stop in your trip.","Discuss routing and connection trade-offs with a specialist.","Review the complete itinerary and fare conditions before confirming."],
    faq: [
      { question: "Can you help with three or more cities?", answer: "Yes. Share the complete sequence of cities and dates so the specialist can discuss multi-city routing options." },
      { question: "What is an open-jaw itinerary?", answer: "An open-jaw trip has different origin or destination points between flight segments. A specialist can help organize the city pairs you need." },
      { question: "Can a multi-city trip use more than one airline?", answer: "Depending on availability and fare rules, multiple carriers may be part of an itinerary. The specialist can explain the options before you confirm." }
    ],
    related: [{ label: "Flight booking assistance", to: "/flight-booking" },{ label: "International booking", to: "/international-flight-booking" },{ label: "Book by phone", to: "/book-a-flight-by-phone" }]
  },
  group: {
    path: "/group-flight-booking",
    title: "Group & Family Flight Booking Assistance | TicketDepart",
    description: "Get phone assistance planning group and family flights. Discuss travelers, routing, cabins, connections, and booking details with TicketDepart.",
    eyebrow: "Groups & families",
    heading: "Group and family flight booking help by phone",
    intro: "Traveling with several people adds coordination questions around dates, routing, cabins, and seating. TicketDepart helps you organize the trip and discuss practical flight options with a specialist.",
    situations: ["Family vacations with multiple travelers","Sports, school, church, and community groups","Different traveler ages or cabin needs","Shared routing and connection planning","Domestic or international group trips","Questions about baggage, seating, and fare conditions"],
    process: ["Have the number of travelers, destinations, dates, and cabin preferences ready.","Tell the specialist about flexibility and any seating or connection needs.","Review the proposed routing and conditions before confirming the trip."],
    faq: [
      { question: "Can you help families book flights together?", answer: "Yes. We can discuss family itineraries, traveler counts, routing, cabin preferences, and other trip details by phone." },
      { question: "Can you guarantee seats together?", answer: "No. Seat availability varies by flight and fare. We can discuss seating preferences and the options available at the time of booking." },
      { question: "Do you handle international groups?", answer: "Yes. We can discuss domestic and international group itineraries, including multi-city travel and cabin requirements." }
    ],
    related: [{ label: "Flight booking assistance", to: "/flight-booking" },{ label: "International booking", to: "/international-flight-booking" },{ label: "Contact TicketDepart", to: "/contact" }]
  }
};

function IntentPage({ intent }: { intent: IntentKey }) {
  const config = CONFIG[intent];
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Flight Booking", path: "/flight-booking" },
    { name: config.eyebrow, path: config.path }
  ];

  return (
    <>
      <Seo title={config.title} description={config.description} path={config.path}
        structuredData={[
          breadcrumbSchema(breadcrumbs), faqSchema(config.faq),
          webPageSchema({ title: config.title, description: config.description, path: config.path }),
          serviceSchema({ name: config.eyebrow, description: config.description, path: config.path })
        ]}
      />
      <Section tone="paper" ocid={intent + ".page"}>
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li><Link to="/">Home</Link></li><li aria-hidden="true">/</li>
            <li><Link to="/flight-booking">Flight Booking</Link></li><li aria-hidden="true">/</li>
            <li aria-current="page" className="font-semibold text-foreground">{config.eyebrow}</li>
          </ol>
        </nav>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <p className="label-board text-accent">{config.eyebrow}</p>
            <h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold leading-[1.08] sm:text-5xl">{config.heading}</h1>
            <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">{config.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CallCta size="lg" ocid={intent + ".hero_call"} />
              <Link to="/contact" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-card px-6 text-base font-medium text-primary">
                Send trip details <ArrowRight className="size-4" />
              </Link>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><Phone className="size-4 text-accent" />{SITE.hours} · {SITE.phoneDisplay}</p>
          </div>
          <aside className="rounded-2xl border border-border bg-card p-6 shadow-elevated sm:p-7">
            <h2 className="label-board text-muted-foreground">This page covers</h2>
            <ul className="mt-5 space-y-3">
              {config.situations.map((item) => <li key={item} className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" /><span className="text-sm leading-relaxed">{item}</span></li>)}
            </ul>
          </aside>
        </div>
      </Section>
      <Section tone="muted" ocid={intent + ".process"}>
        <SectionHeading eyebrow="How it works" title="A simple phone-booking process" description="The goal is to make the itinerary clear before you decide to book." />
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {config.process.map((step, index) => <li key={step} className="rounded-2xl border border-border bg-card p-6"><span className="label-board text-accent">0{index + 1}</span><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step}</p></li>)}
        </ol>
      </Section>
      <Section tone="paper" ocid={intent + ".faq"}>
        <SectionHeading eyebrow="Questions" title="Frequently asked questions" description="Straight answers before you call." />
        <dl className="mt-10 grid gap-4 lg:grid-cols-2">
          {config.faq.map((item) => <div key={item.question} className="rounded-2xl border border-border bg-card p-6"><dt className="font-display text-base font-semibold">{item.question}</dt><dd className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</dd></div>)}
        </dl>
      </Section>
      <Section tone="navy" ocid={intent + ".cta"}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl"><p className="label-board text-accent">Ready to plan?</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Talk through your trip with a specialist</h2><p className="mt-4 text-base leading-relaxed text-primary-foreground/80">Call {SITE.phoneDisplay}. We are available 24/7 for travel-planning and booking assistance.</p></div>
          <CallCta size="lg" showNumber ocid={intent + ".final_call"} />
        </div>
      </Section>
      <Section tone="paper" ocid={intent + ".related"}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="font-display text-xl font-semibold">Related booking help</h2>
          <ul className="flex flex-wrap gap-3">
            {config.related.map((item) => <li key={item.to}><Link to={item.to} className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card px-5 py-2.5 text-sm font-medium text-primary">{item.label} <ArrowRight className="size-3.5" /></Link></li>)}
          </ul>
        </div>
      </Section>
    </>
  );
}

export function InternationalFlightBookingPage() { return <IntentPage intent="international" />; }
export function LastMinuteFlightBookingPage() { return <IntentPage intent="last-minute" />; }
export function MultiCityFlightBookingPage() { return <IntentPage intent="multi-city" />; }
export function GroupFlightBookingPage() { return <IntentPage intent="group" />; }
