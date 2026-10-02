import { CallCta } from "@/components/CallCta";
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

const PAGE_PATH = "/book-a-flight-by-phone";
const PAGE_TITLE =
  "Book a Flight by Phone in the USA | 24/7 Flight Booking Help | TicketDepart";
const PAGE_DESCRIPTION =
  "Book a domestic or international flight by phone with an independent travel agency serving U.S. travelers and customers across Canada, Mexico, and the UK. Discuss routes, dates, cabins, baggage, and fare rules with a travel specialist 24/7.";

const FAQS = [
  {
    question: "Can I book a flight by phone with TicketDepart?",
    answer:
      "Yes. TicketDepart is an independent U.S. travel agency. A travel specialist can discuss your itinerary, available booking options, and applicable terms with you before you decide whether to book.",
  },
  {
    question: "What flights can I book by phone?",
    answer:
      "We can discuss domestic and international trips, one-way and round-trip itineraries, multi-city travel, premium cabins, and group travel. Availability and ticketing options depend on the itinerary and responsible travel provider.",
  },
  {
    question: "Can I ask about the total price before paying?",
    answer:
      "Yes. Ask for the airfare, taxes and charges, baggage terms, and any applicable agency service fee before authorizing payment. Fares and availability can change until a ticket is issued.",
  },
  {
    question: "Can you help with complicated or last-minute trips?",
    answer:
      "A phone conversation can be useful for multi-city routing, flexible dates, nearby airports, premium cabins, groups, and trips that need more discussion than a basic online search. Last-minute options depend on available seats and fare rules.",
  },
] as const;

const BENEFITS = [
  [
    "Domestic & international",
    "Discuss U.S. domestic trips and international itineraries with a specialist.",
  ],
  [
    "Multi-city & complex trips",
    "Review multiple cities, open-jaw routing, connections, and flexible airports.",
  ],
  [
    "Business & first class",
    "Talk through cabin options, schedules, baggage, and fare conditions.",
  ],
  [
    "Groups & families",
    "Coordinate traveler details and trip requirements in one conversation.",
  ],
] as const;

export function BookAFlightByPhonePage() {
  return (
    <>
      <Seo
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        path={PAGE_PATH}
        structuredData={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Book a Flight by Phone", path: PAGE_PATH },
          ]),
          webPageSchema({
            title: PAGE_TITLE,
            description: PAGE_DESCRIPTION,
            path: PAGE_PATH,
          }),
          serviceSchema({
            name: "Flight booking by phone",
            description: PAGE_DESCRIPTION,
            path: PAGE_PATH,
          }),
        ]}
      />

      <Section tone="paper" ocid="book_flight_phone.hero">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="font-medium hover:text-foreground">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-border">
              <ArrowRight className="size-4" />
            </li>
            <li>
              <span
                aria-current="page"
                className="font-semibold text-foreground"
              >
                Book a Flight by Phone
              </span>
            </li>
          </ol>
        </nav>

        <div className="mx-auto mt-10 max-w-4xl">
          <p className="label-board text-accent">24/7 phone flight booking</p>
          <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
            Book a flight by phone with a travel specialist
          </h1>
          <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Tell us where you want to fly, when you want to travel, and what
            matters to you. A specialist can discuss itinerary options, cabin
            choices, baggage, and fare rules before you decide.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CallCta size="lg" ocid="book_flight_phone.call_button" />
            <Link
              to="/flight-booking"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-card px-6 text-base font-medium text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Explore flight booking services
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <Phone aria-hidden="true" className="size-4 text-accent" />
            {SITE.hours}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Serving travelers in the USA, Canada, Mexico, and UK · English-speaking support
          </p>
          <div className="mt-5 rounded-2xl border border-accent/25 bg-accent/5 p-4 sm:flex sm:items-center sm:justify-between sm:gap-5">
            <div>
              <p className="font-semibold text-foreground">Need to book today?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Call now with your route, dates, and number of travelers.
              </p>
            </div>
            <div className="mt-3 shrink-0 sm:mt-0">
              <CallCta size="md" showNumber ocid="book_flight_phone.hero_number_button" />
            </div>
          </div>

          <div
            data-cro-version="267"
            className="mt-6 grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-3"
            aria-label="Choose how to continue"
          >
            <div className="rounded-xl bg-muted/40 p-4">
              <p className="text-sm font-semibold text-foreground">Ready now?</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Call and discuss your trip with a specialist.</p>
              <CallCta size="sm" className="mt-3 w-full" ocid="book_flight_phone.quick_call_button" />
            </div>
            <div className="rounded-xl bg-muted/40 p-4">
              <p className="text-sm font-semibold text-foreground">Not ready to call?</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Send your trip details and request a callback.</p>
              <Link
                to="/contact"
                data-ocid="book_flight_phone.quick_callback_link"
                className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-full border border-primary/25 bg-background px-4 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Request a callback
              </Link>
            </div>
            <div className="rounded-xl bg-muted/40 p-4">
              <p className="text-sm font-semibold text-foreground">Still comparing?</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">See the booking services and trip types we handle.</p>
              <Link
                to="/flight-booking"
                data-ocid="book_flight_phone.quick_services_link"
                className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-full border border-border bg-background px-4 text-sm font-semibold text-foreground hover:border-primary/30 hover:text-primary"
              >
                See booking help
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="muted" ocid="book_flight_phone.services">
        <SectionHeading
          eyebrow="What we can discuss"
          title="Flight booking help for different kinds of trips"
          description="Start with your route and dates. The specialist can then work through the details that matter for your trip."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(([title, text]) => (
            <article
              key={title}
              className="rounded-2xl border border-border bg-card p-6 shadow-subtle"
            >
              <h2 className="font-display text-lg font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {text}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="paper" ocid="book_flight_phone.process">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading
              eyebrow="How it works"
              title="A straightforward booking conversation"
              description="You remain in control of the booking decision. Review the itinerary and price before authorizing a ticket."
            />
            <ol className="mt-8 space-y-5">
              {[
                "Share your departure, destination, dates, travelers, and preferences.",
                "Review available itinerary details, cabin, baggage terms, and applicable fare rules.",
                "Confirm the final details and price before the responsible travel provider issues the ticket.",
              ].map((item, index) => (
                <li key={item} className="flex items-start gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent">
                    {index + 1}
                  </span>
                  <span className="pt-1 text-sm leading-relaxed text-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-subtle sm:p-7">
            <h2 className="font-display text-xl font-semibold">
              Have these details ready
            </h2>
            <ul className="mt-5 space-y-4">
              {[
                "Departure and destination cities or airport codes",
                "Preferred travel dates and flexibility",
                "Number of travelers",
                "Cabin preference",
                "Baggage or accessibility requirements",
                "Preferred airline or nearby airports, if applicable",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-accent"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="navy" ocid="book_flight_phone.cta">
        <div className="mx-auto max-w-3xl text-center">
          <p className="label-board text-accent">TicketDepart</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight sm:text-4xl">
            Ready to discuss your flight?
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
            Call TicketDepart and explain your route, dates, travelers, and
            preferences. A specialist can walk through the booking options with
            you.
          </p>
          <div className="mt-8">
            <CallCta size="lg" ocid="book_flight_phone.cta_call_button" />
          </div>
        </div>
      </Section>

      <Section tone="paper" ocid="book_flight_phone.related">
        <SectionHeading
          eyebrow="More flight help"
          title="Continue with a specific booking guide"
          description="Use these pages if you already know the airline or want a step-by-step phone booking overview."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            ["Flight booking", "/flight-booking"],
            ["International flight booking", "/international-flight-booking"],
            ["Group flight booking", "/group-flight-booking"],
            ["Business class & corporate booking", "/business-class-flight-booking"],
            ["Last-minute flight booking", "/last-minute-flight-booking"],
            ["How to book a flight by phone", "/how-to-book-a-flight-by-phone"],
            ["American Airlines", "/american-airlines"],
            ["Delta Airlines", "/delta-airlines"],
            ["United Airlines", "/united-airlines"],
            ["New York to London", "/flights-new-york-to-london"],
            ["Los Angeles to Tokyo", "/flights-los-angeles-to-tokyo"],
            ["Miami to Cancun", "/flights-miami-to-cancun"],
          ].map(([label, to]) => (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl border border-border bg-card p-5 shadow-subtle transition-smooth hover:shadow-elevated"
            >
              <span className="font-display text-base font-semibold text-foreground">
                {label}
              </span>
              <span className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-primary">
                Open guide{" "}
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-smooth group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-3 shadow-elevated backdrop-blur sm:hidden">
        <div className="mx-auto max-w-lg">
          <CallCta
            size="lg"

            className="w-full"
            ocid="book_flight_phone.mobile_sticky_call"
          />
        </div>
      </div>

      <Section tone="muted" ocid="book_flight_phone.us_gateways">
        <SectionHeading
          eyebrow="U.S. departure cities"
          title="Flight booking help from major U.S. gateways"
          description="If you are departing from a U.S. city, start with your airport or route. These guides cover practical booking questions and connect back to phone assistance."
        />
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["New York", "/flights-from-new-york"],
            ["Los Angeles", "/flights-from-los-angeles"],
            ["Chicago", "/flights-from-chicago"],
            ["Miami", "/flights-from-miami"],
            ["Atlanta", "/flights-from-atlanta"],
            ["Dallas", "/flights-from-dallas"],
            ["Orlando", "/flights-from-orlando"],
            ["San Francisco", "/flights-from-san-francisco"],
          ].map(([label, to]) => (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl border border-border bg-card p-5 shadow-subtle transition-smooth hover:shadow-elevated"
            >
              <span className="font-display text-base font-semibold text-foreground">
                Flights from {label}
              </span>
              <span className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-primary">
                Open city guide
                <ArrowRight aria-hidden="true" className="size-4 transition-smooth group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="paper" ocid="book_flight_phone.faq">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions before you book by phone"
          description="Practical information before you call."
        />
        <div className="mx-auto mt-10 max-w-3xl space-y-4">
          {FAQS.map((faq) => (
            <details
              key={faq.question}
              className="rounded-2xl border border-border bg-card p-5 shadow-subtle"
            >
              <summary className="cursor-pointer font-semibold text-foreground">
                {faq.question}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
