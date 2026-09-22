import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { SITE } from "@/lib/site";
import { breadcrumbSchema, faqSchema, serviceSchema, webPageSchema } from "@/lib/seo";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";

type SupportPage = "travelAgent" | "flightChange";

const PAGES = {
  travelAgent: {
    path: "/travel-agent-by-phone",
    title: "Travel Agent by Phone | Flight Booking Help | TicketDepart",
    description:
      "Speak with an independent travel agent by phone for flight booking help, complex itineraries, premium cabins, and urgent travel planning. TicketDepart is available 24/7.",
    eyebrow: "Travel agent by phone",
    heading: "Talk to a travel agent by phone about your flight",
    intro:
      "Some trips are easy to book online. Others become harder when you have several travelers, multiple stops, a tight departure date, or questions about fare conditions. TicketDepart gives you a person to talk through those details with.",
    points: [
      "Domestic and international flight planning",
      "One-way, round-trip, and multi-city trips",
      "Business, first, and premium-cabin questions",
      "Group and family itinerary coordination",
      "Urgent and near-term travel planning",
      "Questions about changes and fare conditions",
    ],
    sections: [
      {
        title: "When a phone call is useful",
        body:
          "A phone conversation can be useful when you want to explain the trip in your own words instead of entering every detail into a search form. Tell the specialist where you need to go, when you need to travel, how many people are going, and what matters most about the itinerary. We can then work through the options with you.",
      },
      {
        title: "What to have ready",
        body:
          "For a new booking, have your travel dates, departure and arrival cities or airports, traveler count, and preferred cabin ready. For an existing ticket, have the passenger name and booking confirmation available if you can find them. Exact requirements vary by airline and ticket.",
      },
      {
        title: "What we do not promise",
        body:
          "TicketDepart does not promise a particular fare, seat, airline inventory, or savings before a booking is confirmed. Airline schedules, availability, and fare rules can change. We explain the options available at the time we review your trip.",
      },
    ],
    faq: [
      [
        "Can I speak to a travel agent instead of booking online?",
        "Yes. Call TicketDepart at +1 855-544-9001 to discuss your itinerary with a travel specialist. We are an independent travel agency and are available 24/7.",
      ],
      [
        "What kind of flights can a travel agent help with?",
        "We can discuss domestic and international trips, one-way and round-trip travel, multi-city itineraries, premium cabins, family and group travel, and other booking questions.",
      ],
      [
        "Can a travel agent book a flight over the phone?",
        "Yes. A specialist can collect your trip details, discuss available itinerary options, and guide you through the booking process.",
      ],
      [
        "Are you the official customer service department of an airline?",
        "No. TicketDepart is an independent U.S. travel agency and is not affiliated with, endorsed by, or sponsored by any airline.",
      ],
    ],
    related: [
      ["Book a flight by phone", "/book-a-flight-by-phone"],
      ["Flight booking assistance", "/flight-booking-assistance"],
      ["International flight booking", "/international-flight-booking"],
    ],
  },
  flightChange: {
    path: "/flight-change-rebooking",
    title: "Flight Change & Rebooking Assistance by Phone | TicketDepart",
    description:
      "Need to change a flight? Speak with a TicketDepart travel specialist about date, time, route, and rebooking options. Independent phone assistance available 24/7.",
    eyebrow: "Flight changes",
    heading: "Flight change and rebooking help by phone",
    intro:
      "When plans change, the useful question is not only whether a ticket can be changed, but what the available options and fare conditions mean for your specific booking. TicketDepart helps you review those details by phone.",
    points: [
      "Date and departure-time changes",
      "Routing and destination-change questions",
      "Return-flight and one-segment changes",
      "Rebooking after disrupted plans",
      "Fare-rule and ticket-condition review",
      "Existing booking assistance by phone",
    ],
    sections: [
      {
        title: "What to have ready",
        body:
          "Keep your airline confirmation code or ticket number nearby, along with the passenger name as booked and the new date or time you prefer. If you know the flight number, include it. These details help the specialist understand which ticket and itinerary you need to review.",
      },
      {
        title: "What determines the available option",
        body:
          "A change may depend on the fare rules, ticket conditions, airline schedule, inventory, and the difference between the original and new itinerary. Some tickets allow certain changes while others have tighter restrictions. We review the applicable conditions before a change is confirmed.",
      },
      {
        title: "When you should call quickly",
        body:
          "Call as soon as you know your plans have changed, especially when departure is close. Inventory can move and options can narrow. We cannot guarantee a particular replacement flight or fare, but we can review the options available when you call.",
      },
    ],
    faq: [
      [
        "Can you help change my flight date?",
        "Yes. Call with your confirmation details and preferred new date. A specialist can review the ticket conditions and available alternatives.",
      ],
      [
        "Can you help if I need a different departure time?",
        "Yes. Tell us the flight or itinerary you have and the time you would prefer. The available options depend on airline inventory and your ticket's rules.",
      ],
      [
        "Can you help after I miss a flight?",
        "Call as soon as possible. A specialist can review the itinerary information you provide and discuss the rebooking options available under the applicable airline and ticket rules.",
      ],
      [
        "Do you guarantee that my flight can be changed?",
        "No. Changes depend on the airline, fare rules, ticket conditions, and availability at the time of the request.",
      ],
    ],
    related: [
      ["Same-day flight booking", "/same-day-flight-booking"],
      ["Last-minute flight booking", "/last-minute-flight-booking"],
      ["Flight booking assistance", "/flight-booking-assistance"],
    ],
  },
} as const;

function SupportPage({ kind }: { kind: SupportPage }) {
  const page = PAGES[kind];
  const faq = page.faq.map(([question, answer]) => ({ question, answer }));
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Flight Booking", path: "/flight-booking" },
    { name: page.eyebrow, path: page.path },
  ];

  return (
    <>
      <Seo
        title={page.title}
        description={page.description}
        path={page.path}
        structuredData={[
          breadcrumbSchema(breadcrumbs),
          faqSchema(faq),
          webPageSchema({ title: page.title, description: page.description, path: page.path }),
          serviceSchema({ name: page.eyebrow, description: page.description, path: page.path }),
        ]}
      />

      <Section tone="paper">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li><Link to="/">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link to="/flight-booking">Flight Booking</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-semibold text-foreground">{page.eyebrow}</li>
          </ol>
        </nav>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-start">
          <div>
            <p className="label-board text-accent">{page.eyebrow}</p>
            <h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold leading-[1.08] sm:text-5xl">
              {page.heading}
            </h1>
            <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {page.intro}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CallCta size="lg" ocid={kind + ".hero_call"} />
              <Link
                to="/contact"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-card px-6 text-base font-medium text-primary"
              >
                Send trip details <ArrowRight className="size-4" />
              </Link>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="size-4 text-accent" />{SITE.hours} · {SITE.phoneDisplay}
            </p>
          </div>

          <aside className="rounded-2xl border border-border bg-card p-6 shadow-elevated sm:p-7">
            <h2 className="label-board text-muted-foreground">This page covers</h2>
            <ul className="mt-5 space-y-3">
              {page.points.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" />
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Practical guidance"
          title="What to know before you call"
          description="Useful information for travelers, without promising an outcome that depends on airline rules or inventory."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {page.sections.map((section) => (
            <article key={section.title} className="rounded-2xl border border-border bg-card p-6 shadow-subtle">
              <h2 className="font-display text-lg font-semibold leading-snug">{section.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="paper">
        <SectionHeading
          eyebrow="Questions"
          title="Frequently asked questions"
          description="Straight answers before you pick up the phone."
        />
        <dl className="mt-10 grid gap-4 lg:grid-cols-2">
          {page.faq.map(([question, answer]) => (
            <div key={question} className="rounded-2xl border border-border bg-card p-6">
              <dt className="font-display text-base font-semibold">{question}</dt>
              <dd className="mt-3 text-sm leading-relaxed text-muted-foreground">{answer}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section tone="navy">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="label-board text-accent">Ready when you are</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Talk through your trip with a specialist</h2>
            <p className="mt-4 text-base leading-relaxed text-primary-foreground/80">
              Call {SITE.phoneDisplay}. Travel specialists are available 24/7.
            </p>
          </div>
          <CallCta size="lg" showNumber ocid={kind + ".final_call"} />
        </div>
      </Section>

      <Section tone="paper">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="font-display text-xl font-semibold">Related booking help</h2>
          <ul className="flex flex-wrap gap-3">
            {page.related.map(([label, to]) => (
              <li key={to}>
                <Link
                  to={to}
                  className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card px-5 py-2.5 text-sm font-medium text-primary"
                >
                  {label} <ArrowRight className="size-4" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}

export function TravelAgentByPhonePage() {
  return <SupportPage kind="travelAgent" />;
}

export function FlightChangeRebookingPage() {
  return <SupportPage kind="flightChange" />;
}
