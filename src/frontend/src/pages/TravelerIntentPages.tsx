import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { SITE } from "@/lib/site";
import { breadcrumbSchema, faqSchema, serviceSchema, webPageSchema } from "@/lib/seo";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";

type PageKey = "domestic" | "business" | "oneWay" | "family";

const CONFIG = {
  domestic: {
    path: "/domestic-flight-booking",
    title: "Domestic Flight Booking Assistance by Phone | TicketDepart",
    description: "Book a domestic U.S. flight with help from an independent travel specialist. Discuss routes, airports, dates, connections, cabins, and fare conditions at +1 855-544-9001.",
    eyebrow: "Domestic flights",
    heading: "Domestic flight booking help from a real travel specialist",
    intro: "For a straightforward trip, online booking may be fastest. When dates, airports, connections, travelers, or fare rules make the choice less obvious, TicketDepart can help you work through the options by phone.",
    points: ["U.S. one-way and round-trip travel", "Alternative departure or arrival airports", "Nonstop and connecting itinerary questions", "Economy, premium economy, business, and first class", "Family and multiple-traveler trips", "Questions about changes and fare conditions"],
    steps: ["Share your departure city, destination, dates, and number of travelers.", "Discuss schedule, airport, cabin, and connection preferences.", "Review the itinerary and applicable conditions before confirming."],
    faq: [
      ["Can you help book flights within the United States?", "Yes. TicketDepart provides independent assistance for domestic U.S. flight itineraries and can discuss routing, dates, cabins, and fare conditions."],
      ["Can you compare different departure airports?", "If you are flexible about the airport, tell the specialist which nearby airports you can use so the available routing options can be discussed."],
      ["Are you an airline?", "No. TicketDepart is an independent U.S. travel agency and is not affiliated with, endorsed by, or sponsored by any airline."]
    ],
    related: [["Flight booking assistance", "/flight-booking-assistance"], ["Same-day flight booking", "/same-day-flight-booking"], ["Book by phone", "/book-a-flight-by-phone"]]
  },
  business: {
    path: "/business-class-flight-booking",
    title: "Business Class Flight Booking Assistance | TicketDepart",
    description: "Plan business class and premium-cabin flights with an independent travel specialist. Discuss routes, schedules, connections, and fare conditions by phone.",
    eyebrow: "Premium cabins",
    heading: "Business class flight booking assistance by phone",
    intro: "Premium-cabin trips can involve different schedules, connection choices, baggage rules, and fare conditions. Talk through the itinerary with a specialist before you decide.",
    points: ["Business class itinerary planning", "First class and premium-cabin questions", "Long-haul and international travel", "Schedule and connection trade-offs", "One-way, round-trip, and multi-city trips", "Fare rules and change-condition questions"],
    steps: ["Tell us your cities, dates, travelers, and preferred cabin.", "Discuss routing, schedule, connection, and cabin options.", "Review the final itinerary and fare conditions before booking."],
    faq: [
      ["Can you help find business class flights?", "Yes. We can discuss available business-class itinerary options based on your dates, cities, cabin preference, and other trip requirements."],
      ["Can you help with first class too?", "Yes. First-class and other premium-cabin options can be discussed when available for the itinerary."],
      ["Do you guarantee a discounted business class fare?", "No. Airfares and inventory change, so we do not guarantee a particular fare or discount before a booking is confirmed."]
    ],
    related: [["International flight booking", "/international-flight-booking"], ["Multi-city flight booking", "/multi-city-flight-booking"], ["Flight booking assistance", "/flight-booking-assistance"]]
  },
  oneWay: {
    path: "/one-way-flight-booking",
    title: "One-Way Flight Booking Assistance by Phone | TicketDepart",
    description: "Need a one-way flight? Speak with a TicketDepart travel specialist about routes, dates, connections, cabins, and fare conditions at +1 855-544-9001.",
    eyebrow: "One-way travel",
    heading: "One-way flight booking help by phone",
    intro: "One-way travel can be simple or surprisingly complicated when you have flexible dates, international travel, multiple stops, or a specific arrival requirement. A specialist can help organize the options.",
    points: ["Domestic and international one-way trips", "Flexible departure dates", "Alternative airports and connections", "International multi-stop planning", "Premium-cabin one-way travel", "Questions about fare conditions"],
    steps: ["Share your origin, destination, travel date, and traveler count.", "Explain any flexibility around airports, times, connections, or cabin.", "Review the available itinerary and fare conditions before confirming."],
    faq: [
      ["Can I book a one-way international flight?", "Yes. TicketDepart can discuss one-way international itineraries and the routing, connection, cabin, and fare conditions that apply."],
      ["Can you help if my return date is unknown?", "Yes. If you do not know your return date, a one-way itinerary may be worth considering. The specialist can discuss the available options."],
      ["Is a one-way ticket always cheaper than a round trip?", "No. Pricing depends on the itinerary, carrier, fare rules, dates, and availability. We do not promise that one option will always cost less."]
    ],
    related: [["International flight booking", "/international-flight-booking"], ["Last-minute flight booking", "/last-minute-flight-booking"], ["Flight booking assistance", "/flight-booking-assistance"]]
  },
  family: {
    path: "/family-flight-booking",
    title: "Family Flight Booking Assistance by Phone | TicketDepart",
    description: "Plan family flights with help from an independent travel specialist. Discuss travelers, schedules, connections, cabins, seating preferences, and fare conditions by phone.",
    eyebrow: "Family travel",
    heading: "Family flight booking help from a travel specialist",
    intro: "Family travel adds details that can make an ordinary flight search harder: different traveler ages, seating preferences, baggage needs, connections, and schedules. TicketDepart helps you organize those requirements by phone.",
    points: ["Families traveling together", "Children and multiple traveler types", "Domestic or international family trips", "Seating and connection preferences", "Baggage and cabin questions", "One-way, round-trip, and multi-city itineraries"],
    steps: ["Share the number and ages of travelers, route, and dates.", "Explain seating, connection, baggage, and schedule preferences.", "Review the itinerary and applicable conditions before confirming."],
    faq: [
      ["Can you help families book flights together?", "Yes. We can discuss the travelers, routing, cabin preferences, connections, and other requirements for a family itinerary."],
      ["Can you guarantee seats together?", "No. Seat availability varies by flight and fare. We can discuss seating preferences and the options available at booking time."],
      ["Can you help with international family travel?", "Yes. We can discuss international family itineraries, including connections, cabins, and multi-city routing where appropriate."]
    ],
    related: [["Group flight booking", "/group-flight-booking"], ["International flight booking", "/international-flight-booking"], ["Book by phone", "/book-a-flight-by-phone"]]
  }
} as const;

function Page({ kind }: { kind: PageKey }) {
  const c = CONFIG[kind];
  const faq = c.faq.map(([question, answer]: readonly [string, string]) => ({ question, answer }));
  const breadcrumbs = [{ name: "Home", path: "/" }, { name: "Flight Booking", path: "/flight-booking" }, { name: c.eyebrow, path: c.path }];
  return (
    <>
      <Seo title={c.title} description={c.description} path={c.path} structuredData={[
        breadcrumbSchema(breadcrumbs), faqSchema(faq),
        webPageSchema({ title: c.title, description: c.description, path: c.path }),
        serviceSchema({ name: c.eyebrow, description: c.description, path: c.path })
      ]} />
      <Section tone="paper">
        <nav aria-label="Breadcrumb"><ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li><Link to="/">Home</Link></li><li aria-hidden="true">/</li><li><Link to="/flight-booking">Flight Booking</Link></li><li aria-hidden="true">/</li><li aria-current="page" className="font-semibold text-foreground">{c.eyebrow}</li>
        </ol></nav>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div><p className="label-board text-accent">{c.eyebrow}</p><h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold leading-[1.08] sm:text-5xl">{c.heading}</h1>
            <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">{c.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><CallCta size="lg" ocid={`${kind}.hero_call`} /><Link to="/contact" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-card px-6 text-base font-medium text-primary">Send trip details <ArrowRight className="size-4" /></Link></div>
            <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><Phone className="size-4 text-accent" />{SITE.hours} · {SITE.phoneDisplay}</p>
          </div>
          <aside className="rounded-2xl border border-border bg-card p-6 shadow-elevated sm:p-7"><h2 className="label-board text-muted-foreground">This page covers</h2><ul className="mt-5 space-y-3">{c.points.map((item) => <li key={item} className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" /><span className="text-sm leading-relaxed">{item}</span></li>)}</ul></aside>
        </div>
      </Section>
      <Section tone="muted"><SectionHeading eyebrow="How it works" title="A simple phone-booking process" description="Get the itinerary organized before you decide to confirm." />
        <ol className="mt-10 grid gap-4 md:grid-cols-3">{c.steps.map((step, i) => <li key={step} className="rounded-2xl border border-border bg-card p-6"><span className="label-board text-accent">0{i + 1}</span><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step}</p></li>)}</ol>
      </Section>
      <Section tone="paper"><SectionHeading eyebrow="Questions" title="Frequently asked questions" description="Straight answers before you call." />
        <dl className="mt-10 grid gap-4 lg:grid-cols-2">{c.faq.map(([q, a]: readonly [string, string]) => <div key={q} className="rounded-2xl border border-border bg-card p-6"><dt className="font-display text-base font-semibold">{q}</dt><dd className="mt-3 text-sm leading-relaxed text-muted-foreground">{a}</dd></div>)}</dl>
      </Section>
      <Section tone="navy"><div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"><div className="max-w-2xl"><p className="label-board text-accent">Ready to plan?</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Talk through your trip with a specialist</h2><p className="mt-4 text-base leading-relaxed text-primary-foreground/80">Call {SITE.phoneDisplay}. We are available 24/7 for travel-planning and booking assistance.</p></div><CallCta size="lg" showNumber ocid={`${kind}.final_call`} /></div></Section>
      <Section tone="paper"><div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><h2 className="font-display text-xl font-semibold">Related booking help</h2><ul className="flex flex-wrap gap-3">{c.related.map(([label, to]: readonly [string, string]) => <li key={to}><Link to={to} className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card px-5 py-2.5 text-sm font-medium text-primary">{label} <ArrowRight className="size-3.5" /></Link></li>)}</ul></div></Section>
    </>
  );
}

export function DomesticFlightBookingPage() { return <Page kind="domestic" />; }
export function BusinessClassFlightBookingPage() { return <Page kind="business" />; }
export function OneWayFlightBookingPage() { return <Page kind="oneWay" />; }
export function FamilyFlightBookingPage() { return <Page kind="family" />; }
