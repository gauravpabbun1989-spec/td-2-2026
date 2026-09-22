import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { SITE } from "@/lib/site";
import { breadcrumbSchema, serviceSchema, webPageSchema } from "@/lib/seo";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";

const guides = [
  {
    title: "Book a flight by phone",
    to: "/book-a-flight-by-phone",
    description: "What to prepare before calling and what to review before confirming a ticket.",
  },
  {
    title: "Flight booking assistance",
    to: "/flight-booking-assistance",
    description: "Help with routes, dates, connections, cabins, travelers, and fare conditions.",
  },
  {
    title: "International flight booking",
    to: "/international-flight-booking",
    description: "Plan long-haul, multi-country, connection-heavy, and premium-cabin itineraries.",
  },
  {
    title: "Last-minute flight booking",
    to: "/last-minute-flight-booking",
    description: "Organize urgent travel and discuss practical schedule and airport alternatives.",
  },
  {
    title: "Same-day flight booking",
    to: "/same-day-flight-booking",
    description: "Discuss travel departing today and understand availability limitations before booking.",
  },
  {
    title: "Multi-city flight booking",
    to: "/multi-city-flight-booking",
    description: "Work through several city pairs, open-jaw trips, and complex routing.",
  },
  {
    title: "Group and family flights",
    to: "/group-flight-booking",
    description: "Coordinate travelers, dates, cabins, connections, and seating preferences.",
  },
  {
    title: "Business class flight booking",
    to: "/business-class-flight-booking",
    description: "Discuss premium-cabin routing, schedules, connections, and fare conditions.",
  },
  {
    title: "Flight changes and rebooking",
    to: "/flight-change-rebooking",
    description: "Review change requests, ticket conditions, and available alternatives.",
  },
  {
    title: "Missed flight rebooking",
    to: "/missed-flight-rebooking",
    description: "Call promptly to discuss the itinerary and rebooking options available.",
  },
  {
    title: "Flight cancellation assistance",
    to: "/flight-cancellation-assistance",
    description: "Discuss cancellation, refund, credit, and ticket-condition questions.",
  },
  {
    title: "Book a flight for someone else",
    to: "/book-flight-for-someone-else",
    description: "Organize traveler information when the person arranging the trip is not flying.",
  },
];

export function FlightBookingGuidesPage() {
  const path = "/flight-booking-guides";
  const title = "Flight Booking Guides & Phone Assistance | TicketDepart";
  const description =
    "Practical flight-booking guides from TicketDepart covering phone booking, international, last-minute, multi-city, group, family, premium-cabin, and flight-change questions.";

  return (
    <>
      <Seo
        title={title}
        description={description}
        path={path}
        structuredData={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Flight Booking", path: "/flight-booking" },
            { name: "Flight Booking Guides", path },
          ]),
          webPageSchema({ title, description, path }),
          serviceSchema({
            name: "Flight booking guides and phone assistance",
            description,
            path,
          }),
        ]}
      />

      <Section tone="paper">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li><Link to="/">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link to="/flight-booking">Flight Booking</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-semibold text-foreground">Flight Booking Guides</li>
          </ol>
        </nav>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <p className="label-board text-accent">Flight booking guides</p>
            <h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold leading-[1.08] sm:text-5xl">
              Practical help for planning and booking flights
            </h1>
            <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Use these guides to understand what information to prepare, which questions matter, and when phone assistance can make a complicated itinerary easier to discuss.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CallCta size="lg" ocid="guides.hero_call" />
              <Link
                to="/flight-booking"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-card px-6 text-base font-medium text-primary"
              >
                Flight booking help <ArrowRight className="size-4" />
              </Link>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="size-4 text-accent" />{SITE.hours} · {SITE.phoneDisplay}
            </p>
          </div>

          <aside className="rounded-2xl border border-border bg-card p-6 shadow-elevated sm:p-7">
            <h2 className="label-board text-muted-foreground">Before you call</h2>
            <ul className="mt-5 space-y-3">
              {[
                "Departure and arrival cities or airports",
                "Travel dates and flexibility",
                "Number of travelers and cabin preference",
                "One-way, round-trip, or multi-city needs",
                "Existing confirmation details for changes",
                "Questions about baggage, connections, or fare rules",
              ].map((item) => (
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
          eyebrow="Choose a topic"
          title="Find the flight-booking help that matches your trip"
          description="Each guide is focused on a specific planning or booking situation."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <Link
              key={guide.to}
              to={guide.to}
              className="group rounded-2xl border border-border bg-card p-6 transition-smooth hover:border-primary/30 hover:shadow-subtle"
            >
              <h2 className="font-display text-lg font-semibold text-primary">
                {guide.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {guide.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Read the guide <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="paper">
        <SectionHeading
          eyebrow="What to expect"
          title="Clear information before you confirm"
          description="TicketDepart is an independent U.S. travel agency. Flight availability, pricing, seats, schedules, and ticket conditions can change and are not guaranteed until a booking is confirmed."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["1", "Explain the trip", "Tell the specialist the cities, dates, travelers, cabin, and any flexibility."],
            ["2", "Discuss options", "Work through routing, connections, schedules, and applicable conditions."],
            ["3", "Review before booking", "Confirm the itinerary and understand the applicable fare conditions before proceeding."],
          ].map(([number, heading, body]) => (
            <div key={number} className="rounded-2xl border border-border bg-card p-6">
              <span className="label-board text-accent">0{number}</span>
              <h2 className="mt-3 font-display text-lg font-semibold">{heading}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="navy">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="label-board text-accent">Need help now?</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Talk through your flight with a specialist
            </h2>
            <p className="mt-4 text-base leading-relaxed text-primary-foreground/80">
              Call {SITE.phoneDisplay}. TicketDepart is available 24/7 for travel-planning and booking assistance.
            </p>
          </div>
          <CallCta size="lg" showNumber ocid="guides.final_call" />
        </div>
      </Section>
    </>
  );
}
