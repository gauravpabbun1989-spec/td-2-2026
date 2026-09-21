import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { breadcrumbSchema, faqSchema } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  CalendarClock,
  ChevronRight,
  Globe2,
  MapPinned,
  Phone,
  RefreshCw,
  Route,
  Users,
} from "lucide-react";

const PAGE_PATH = "/flight-booking";
const PAGE_TITLE = "Flight Booking Assistance by Phone | TicketDepart";
const PAGE_DESCRIPTION =
  "Get help booking domestic, international, multi-city, business or first-class, and group flights. Speak with an independent travel specialist at +1 855-544-9001, 24/7.";

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Flight Booking", path: PAGE_PATH },
] as const;

const FAQS = [
  {
    question: "Can I book a flight by phone with TicketDepart?",
    answer:
      "Yes. TicketDepart is an independent travel agency, and a travel specialist can discuss your itinerary, compare options, and assist with booking by phone at +1 855-544-9001.",
  },
  {
    question: "Can you help with international and multi-city flights?",
    answer:
      "Yes. We assist with domestic, international, multi-city, and open-jaw itineraries, including complex connections and mixed-carrier options.",
  },
  {
    question: "Can you help with business class or first class flights?",
    answer:
      "Yes. We can discuss business, first, and premium economy options and explain differences in cabin, schedule, and fare conditions.",
  },
  {
    question: "Is TicketDepart affiliated with Delta, United, or American Airlines?",
    answer:
      "No. TicketDepart is an independent travel agency and is not affiliated with, endorsed by, or sponsored by any airline. Airline names and trademarks belong to their respective owners.",
  },
  {
    question: "What information should I have ready when I call?",
    answer:
      "Have your departure and destination cities, preferred travel dates, number of travelers, cabin preference, and any flexibility or special requirements ready if available.",
  },
] as const;

type BookingService = {
  icon: typeof Globe2;
  title: string;
  description: string;
  details: readonly string[];
};

const SERVICES: readonly BookingService[] = [
  {
    icon: MapPinned,
    title: "Domestic flight booking",
    description:
      "Point-to-point travel inside the United States, including one-way and round-trip fares across major hubs and regional airports.",
    details: [
      "One-way and round-trip itineraries",
      "Regional and small-airport connections",
      "Seat and baggage questions answered up front",
    ],
  },
  {
    icon: Globe2,
    title: "International flight booking",
    description:
      "Long-haul and transborder trips where entry rules, connection times, and fare families change the price more than the route does.",
    details: [
      "Transatlantic, transpacific, and Latin America routes",
      "Connection and layover planning",
      "Passport and entry-document reminders",
    ],
  },
  {
    icon: Route,
    title: "Multi-city and complex itineraries",
    description:
      "Trips with three or more stops, open jaws, or mixed carriers that online booking engines often cannot price in a single search.",
    details: [
      "Three or more city pairs on one trip",
      "Open-jaw and circle itineraries",
      "Mixed-carrier routings priced together",
    ],
  },
  {
    icon: Briefcase,
    title: "Business and first class",
    description:
      "Premium cabin requests where cabin availability, lie-flat options, and upgrade rules matter as much as the schedule.",
    details: [
      "Business, first, and premium economy cabins",
      "Cabin and aircraft comparisons",
      "Upgrade and change-rule guidance",
    ],
  },
  {
    icon: Users,
    title: "Group flight booking",
    description:
      "Coordinated travel for families, teams, and organizations that need everyone on the same routing and the same record.",
    details: [
      "Family and extended-family trips",
      "Sports, school, and church groups",
      "Seating kept together where available",
    ],
  },
  {
    icon: RefreshCw,
    title: "Changes and rebooking",
    description:
      "When plans move, we review the fare rules on your existing ticket and explain what a change costs before you decide anything.",
    details: [
      "Fare-rule and change-fee review",
      "Rebooking after a schedule change",
      "Alternative dates and airports compared",
    ],
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Tell us the trip",
    description:
      "Share your cities, dates, and how many travelers are flying. If your dates are flexible, say so — it widens the options we can compare.",
  },
  {
    step: "02",
    title: "We compare the options",
    description:
      "A specialist reviews schedules, connections, and fare conditions across carriers and presents the routings that actually fit your trip.",
  },
  {
    step: "03",
    title: "You choose and confirm",
    description:
      "You decide what works, ask questions about bags and changes, and confirm the itinerary with a person on the phone — not a checkout timer.",
  },
] as const;

const AIRLINE_LINKS = [
  {
    to: "/delta-airlines",
    label: "Delta Airlines booking assistance",
    description:
      "Routes, cabins, and connection guidance for Delta Airlines itineraries.",
  },
  {
    to: "/united-airlines",
    label: "United Airlines booking assistance",
    description:
      "Hub connections, international routings, and fare questions for United Airlines.",
  },
  {
    to: "/american-airlines",
    label: "American Airlines booking assistance",
    description:
      "Domestic and international planning for American Airlines itineraries.",
  },
] as const;

/**
 * Flight Booking Assistance page. Covers the booking scenarios a specialist
 * handles, links to the airline guides and contact page, and keeps the
 * click-to-call conversion control present in every band.
 */
export function FlightBookingPage() {
  return (
    <>
      <Seo
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        path={PAGE_PATH}
        structuredData={[breadcrumbSchema([...BREADCRUMBS]), faqSchema(FAQS)]}
      />

      <Section tone="paper" ocid="flight_booking.page">
        <nav aria-label="Breadcrumb" data-ocid="flight_booking.breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link
                to="/"
                data-ocid="flight_booking.breadcrumb.home_link"
                className="rounded-sm font-medium transition-smooth hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-border">
              <ChevronRight className="size-4" />
            </li>
            <li>
              <span
                aria-current="page"
                className="font-semibold text-foreground"
              >
                Flight Booking
              </span>
            </li>
          </ol>
        </nav>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-16">
          <div className="min-w-0">
            <p className="label-board text-accent">Booking assistance</p>
            <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
              Flight booking help for trips a search box cannot finish
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              TicketDepart is an independent travel agency. Our specialists help
              you plan and book domestic, international, multi-city, premium
              cabin, and group flights — comparing schedules, connections, and
              fare conditions with you on the phone before anything is
              confirmed.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CallCta
                size="lg"
                ocid="flight_booking.call_button"
                className="w-full sm:w-auto"
              />
              <Link
                to="/contact"
                data-ocid="flight_booking.contact_link"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-card px-6 text-base font-medium text-primary transition-smooth hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                See contact options
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>

            <p className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Phone aria-hidden="true" className="size-4 text-accent" />
              <span>{SITE.hours}</span>
              <span aria-hidden="true">·</span>
              <a
                href={SITE.phoneHref}
                data-ocid="flight_booking.phone_link"
                className="rounded-sm font-semibold text-primary underline underline-offset-4 transition-smooth hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {SITE.phoneDisplay}
              </a>
            </p>
          </div>

          <aside
            data-ocid="flight_booking.summary_card"
            className="rounded-2xl border border-border bg-card p-6 shadow-elevated sm:p-7"
          >
            <h2 className="label-board text-muted-foreground">
              What we handle
            </h2>
            <ul className="mt-5 space-y-3.5">
              {[
                "Domestic one-way and round-trip",
                "International long-haul and transborder",
                "Multi-city and open-jaw routings",
                "Business, first, and premium economy",
                "Group and family bookings",
                "Changes, rebooking, and disrupted plans",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent"
                  />
                  <span className="text-sm leading-relaxed text-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-border pt-5">
              <CallCta
                variant="outline"
                size="md"
                className="w-full"
                ocid="flight_booking.summary_call_button"
              />
            </div>
          </aside>
        </div>
      </Section>

      <Section
        tone="muted"
        ocid="flight_booking.services"
        aria-labelledby="flight_booking_services_heading"
      >
        <SectionHeading
          id="flight_booking_services_heading"
          eyebrow="Booking scenarios"
          title="The kinds of trips we book"
          description="Every itinerary below is handled by a person who can explain the trade-offs between schedule, price, and flexibility before you commit."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                data-ocid={`flight_booking.service_card.${index + 1}`}
                className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-subtle transition-smooth hover:shadow-elevated"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/5 text-primary">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold leading-snug">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <ul className="mt-5 space-y-2 border-t border-border pt-5">
                  {service.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-start gap-2.5 text-sm text-foreground"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent"
                      />
                      <span className="leading-relaxed">{detail}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </Section>

      <Section
        tone="paper"
        ocid="flight_booking.guidance"
        aria-labelledby="flight_booking_guidance_heading"
      >
        <SectionHeading
          id="flight_booking_guidance_heading"
          eyebrow="How we help"
          title="What a specialist actually does for your booking"
          description="Agency booking is not a different search box. It is a person who knows where itineraries break and works through the details with you."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <article
            data-ocid="flight_booking.guidance_card.1"
            className="rounded-2xl border border-border bg-card p-6 shadow-subtle sm:p-7"
          >
            <h3 className="font-display text-lg font-semibold leading-snug">
              International and multi-city itineraries
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              International trips are priced by fare family, routing, and
              connection quality as much as by distance. A specialist checks
              that each layover is long enough to clear immigration and transfer
              terminals, that the carriers on your ticket actually interline,
              and that the fare rules allow the changes you may need later.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Multi-city and open-jaw trips — flying into one city and home from
              another, or stopping in three places along the way — are where
              self-service search tools struggle most. We build the segment
              order deliberately and price it as a single itinerary so the
              connections hold together.
            </p>
          </article>

          <article
            data-ocid="flight_booking.guidance_card.2"
            className="rounded-2xl border border-border bg-card p-6 shadow-subtle sm:p-7"
          >
            <h3 className="font-display text-lg font-semibold leading-snug">
              Cabin options and changes
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Premium cabin inventory moves quickly and pricing varies by
              departure day and routing. We compare business, first, and premium
              economy options across your travel window, explain the difference
              between cabins on the aircraft you would actually fly, and book
              the seat that matches how you want to travel.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              If your plans change, we review the fare rules on your existing
              ticket, walk through what a change costs versus what a new booking
              would cost, and handle the rebooking where the ticket allows it —
              so you are not left navigating hold queues on your own.
            </p>
          </article>
        </div>
      </Section>

      <Section
        tone="muted"
        ocid="flight_booking.process"
        aria-labelledby="flight_booking_process_heading"
      >
        <SectionHeading
          id="flight_booking_process_heading"
          eyebrow="How it works"
          title="Three steps from idea to confirmed itinerary"
          description="No account to create and no checkout timer. You talk to a specialist, compare real options, and decide when you are ready."
        />

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {PROCESS.map((item) => (
            <li
              key={item.step}
              data-ocid={`flight_booking.step.${item.step}`}
              className="relative rounded-2xl border border-border bg-card p-6 shadow-subtle"
            >
              <span className="label-board text-accent">{item.step}</span>
              <h3 className="mt-4 font-display text-lg font-semibold">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        tone="paper"
        ocid="flight_booking.airlines"
        aria-labelledby="flight_booking_airlines_heading"
      >
        <SectionHeading
          id="flight_booking_airlines_heading"
          eyebrow="Airline guides"
          title="Planning around a specific airline"
          description="Each guide covers the routes, hubs, and cabin questions travelers ask us most about that carrier."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {AIRLINE_LINKS.map((airline) => (
            <Link
              key={airline.to}
              to={airline.to}
              data-ocid={`flight_booking.airline_link.${airline.to.replace("/", "")}`}
              className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-subtle transition-smooth hover:border-primary/30 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <h3 className="font-display text-lg font-semibold leading-snug">
                {airline.label}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {airline.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Read the guide
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-smooth group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
          Booking a trip that does not fit one carrier?{" "}
          <Link
            to="/contact"
            data-ocid="flight_booking.contact_inline_link"
            className="rounded-sm font-semibold text-primary underline underline-offset-4 transition-smooth hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Contact our travel specialists
          </Link>{" "}
          and we will compare the options with you.
        </p>
      </Section>

      <Section
        tone="muted"
        ocid="flight_booking.us_intent"
        aria-labelledby="flight_booking_us_intent_heading"
      >
        <SectionHeading
          id="flight_booking_us_intent_heading"
          eyebrow="U.S. flight booking"
          title="Flight booking help from major U.S. gateways"
          description="If you are flying from or through a major U.S. airport, tell us your cities, dates, and flexibility. We can compare domestic and international itineraries and explain the trade-offs before you book."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["New York", "JFK, LGA, EWR"],
            ["Los Angeles", "LAX"],
            ["Chicago", "ORD, MDW"],
            ["Miami", "MIA"],
            ["Dallas–Fort Worth", "DFW"],
            ["Atlanta", "ATL"],
            ["San Francisco", "SFO"],
            ["Seattle", "SEA"],
          ].map(([city, airports]) => (
            <div
              key={city}
              className="rounded-xl border border-border bg-card p-5 shadow-subtle"
            >
              <h3 className="font-display text-base font-semibold">{city}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{airports}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-subtle sm:p-7">
          <h3 className="font-display text-lg font-semibold">
            Looking for a specific U.S. route?
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Tell us the departure airport, destination, dates, number of travelers,
            and preferred cabin. If you can use nearby airports or flexible dates,
            mention that too. A specialist can then compare the available
            itineraries with you by phone.
          </p>
          <div className="mt-5">
            <CallCta
              variant="outline"
              size="md"
              ocid="flight_booking.us_intent_call_button"
            />
          </div>
        </div>
      </Section>

      <Section tone="navy" ocid="flight_booking.cta">
        <div className="mx-auto max-w-3xl text-center">
          <p className="label-board text-accent">Available 24/7</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight sm:text-4xl">
            Ready to book? Talk it through with a specialist
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
            Call {SITE.phoneDisplay} any time, day or night. We will compare
            schedules, connections, and fare conditions for your trip and
            explain what each option includes before you decide.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CallCta
              size="lg"
              ocid="flight_booking.cta_call_button"
              className="w-full sm:w-auto"
            />
            <Link
              to="/contact"
              data-ocid="flight_booking.cta_contact_link"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-primary-foreground/30 px-6 text-base font-medium text-primary-foreground transition-smooth hover:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:w-auto"
            >
              Contact options
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </Section>

      <Section tone="paper" ocid="flight_booking.disclosure">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-muted/60 p-6 sm:p-8">
          <h2 className="label-board text-muted-foreground">
            Independent agency disclosure
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {SITE.disclosure}
          </p>
        </div>
      </Section>
    </>
  );
}
