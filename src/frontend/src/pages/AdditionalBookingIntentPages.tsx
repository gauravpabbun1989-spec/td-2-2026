import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { SITE } from "@/lib/site";
import { breadcrumbSchema, faqSchema, serviceSchema, webPageSchema } from "@/lib/seo";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";

const pages = {
  assistance: {
    path: "/flight-booking-assistance",
    title: "Flight Booking Assistance by Phone | TicketDepart",
    description: "Need flight booking help? Call TicketDepart to discuss domestic, international, multi-city, and complex itineraries with an independent specialist.",
    heading: "Flight booking assistance from a real travel specialist",
    intro: "If an online flight search leaves you with questions about routing, dates, cabins, travelers, or fare conditions, you can talk through the trip with a TicketDepart specialist.",
    points: [
      "Domestic and international flight planning",
      "One-way, round-trip, and multi-city itineraries",
      "Business, first, and premium economy questions",
      "Family and group travel coordination",
      "Connection and schedule comparisons",
      "Questions about fare rules and changes",
    ],
    steps: [
      "Share your departure city, destination, dates, travelers, and cabin preference.",
      "Explain any flexibility or special requirements for the trip.",
      "Review the available itinerary options and conditions before deciding.",
    ],
    faq: [
      ["What can I discuss with a flight booking specialist?", "You can discuss routes, dates, connections, cabin preferences, traveler details, and fare conditions before deciding whether to book."],
      ["Can you help with international and domestic flights?", "Yes. TicketDepart provides independent assistance for both domestic and international flight itineraries."],
      ["Are you an official airline reservations department?", "No. TicketDepart is an independent U.S. travel agency and is not affiliated with, endorsed by, or sponsored by any airline."],
    ],
  },
  sameDay: {
    path: "/same-day-flight-booking",
    title: "Same-Day Flight Booking by Phone | TicketDepart",
    description: "Need to travel today? Call TicketDepart to discuss same-day routes, departure airports, connections, and fare conditions with a travel specialist.",
    heading: "Same-day flight booking help by phone",
    intro: "When travel is urgent, you may need to compare practical options quickly. TicketDepart can help you organize the route and discuss available booking options by phone.",
    points: [
      "Same-day and near-term travel planning",
      "One-way or round-trip urgent travel",
      "Alternative departure airports",
      "Connection and schedule trade-offs",
      "Domestic and international itineraries",
      "Fare and change-condition questions",
    ],
    steps: [
      "Call with your departure city, destination, travel date, and traveler count.",
      "Tell the specialist what you can change, such as departure airport or schedule.",
      "Review the available options and applicable fare conditions before confirming.",
    ],
    faq: [
      ["Can you help with a flight departing today?", "You can call and discuss your route and travel date. Availability, schedules, and fares change continuously and are not guaranteed until confirmed."],
      ["Can I be flexible about the airport or departure time?", "Yes. Tell the specialist what flexibility you have so alternative routing and departure options can be discussed."],
      ["Do you guarantee a same-day seat or price?", "No. Same-day availability and pricing depend on the airlines and inventory available at the time of booking."],
    ],
  },
} as const;

type Key = keyof typeof pages;

function BookingIntentPage({ kind }: { kind: Key }) {
  const page = pages[kind];
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Flight Booking", path: "/flight-booking" },
    { name: kind === "assistance" ? "Flight Booking Assistance" : "Same-Day Flight Booking", path: page.path },
  ];

  return (
    <>
      <Seo
        title={page.title}
        description={page.description}
        path={page.path}
        structuredData={[
          breadcrumbSchema(breadcrumbs),
          faqSchema(page.faq.map(([question, answer]: readonly [string, string]) => ({ question, answer }))),
          webPageSchema({ title: page.title, description: page.description, path: page.path }),
          serviceSchema({ name: page.heading, description: page.description, path: page.path }),
        ]}
      />
      <Section tone="paper">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li><Link to="/">Home</Link></li><li aria-hidden="true">/</li>
            <li><Link to="/flight-booking">Flight Booking</Link></li><li aria-hidden="true">/</li>
            <li aria-current="page" className="font-semibold text-foreground">{kind === "assistance" ? "Flight Booking Assistance" : "Same-Day Flight Booking"}</li>
          </ol>
        </nav>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <p className="label-board text-accent">{kind === "assistance" ? "Booking help" : "Urgent travel"}</p>
            <h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold leading-[1.08] sm:text-5xl">{page.heading}</h1>
            <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">{page.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CallCta size="lg" ocid={`${kind}.hero_call`} />
              <Link to="/contact" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-card px-6 text-base font-medium text-primary">Send trip details <ArrowRight className="size-4" /></Link>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><Phone className="size-4 text-accent" />{SITE.hours} · {SITE.phoneDisplay}</p>
          </div>
          <aside className="rounded-2xl border border-border bg-card p-6 shadow-elevated sm:p-7">
            <h2 className="label-board text-muted-foreground">This page covers</h2>
            <ul className="mt-5 space-y-3">{page.points.map((item) => <li key={item} className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" /><span className="text-sm leading-relaxed">{item}</span></li>)}</ul>
          </aside>
        </div>
      </Section>
      <Section tone="muted">
        <SectionHeading eyebrow="How it works" title="A simple phone-booking process" description="Get the trip details organized before you decide to confirm." />
        <ol className="mt-10 grid gap-4 md:grid-cols-3">{page.steps.map((step, index) => <li key={step} className="rounded-2xl border border-border bg-card p-6"><span className="label-board text-accent">0{index + 1}</span><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step}</p></li>)}</ol>
      </Section>
      <Section tone="paper">
        <SectionHeading eyebrow="Questions" title="Frequently asked questions" description="Straight answers before you call." />
        <dl className="mt-10 grid gap-4 lg:grid-cols-2">{page.faq.map(([question, answer]: readonly [string, string]) => <div key={question} className="rounded-2xl border border-border bg-card p-6"><dt className="font-display text-base font-semibold">{question}</dt><dd className="mt-3 text-sm leading-relaxed text-muted-foreground">{answer}</dd></div>)}</dl>
      </Section>
      <Section tone="navy">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl"><p className="label-board text-accent">Ready to plan?</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Talk through your trip with a specialist</h2><p className="mt-4 text-base leading-relaxed text-primary-foreground/80">Call {SITE.phoneDisplay}. We are available 24/7 for travel-planning and booking assistance.</p></div>
          <CallCta size="lg" showNumber ocid={`${kind}.final_call`} />
        </div>
      </Section>
    </>
  );
}

export function FlightBookingAssistancePage() { return <BookingIntentPage kind="assistance" />; }
export function SameDayFlightBookingPage() { return <BookingIntentPage kind="sameDay" />; }
