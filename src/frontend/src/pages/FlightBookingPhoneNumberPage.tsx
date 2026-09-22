import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { breadcrumbSchema, faqSchema, serviceSchema, webPageSchema } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";

const PATH = "/flight-booking-phone-number";
const TITLE = "Flight Booking Phone Number | TicketDepart";
const DESCRIPTION =
  "Need a flight booking phone number? Call TicketDepart at +1 855-544-9001 for independent domestic or international booking assistance, 24/7.";

const FAQS = [
  {
    question: "What is TicketDepart's flight booking phone number?",
    answer:
      "Call TicketDepart at +1 855-544-9001 to discuss a new flight booking with an independent travel specialist. We are available 24/7.",
  },
  {
    question: "Is TicketDepart the official phone number for an airline?",
    answer:
      "No. TicketDepart is an independent U.S. travel agency. We are not affiliated with, endorsed by, sponsored by, or the official customer-service department of any airline.",
  },
  {
    question: "Can I book domestic and international flights by phone?",
    answer:
      "Yes. You can discuss domestic and international itineraries, one-way and round-trip travel, multi-city trips, premium cabins, and group or family travel.",
  },
  {
    question: "What should I have ready before calling?",
    answer:
      "Have your departure and destination cities or airports, preferred travel dates, number of travelers, cabin preference, and any flexibility or special requirements ready.",
  },
  {
    question: "Can I ask about the total cost before I book?",
    answer:
      "Yes. Before you authorize a booking, ask the specialist to explain the airfare, taxes and charges, baggage terms, and any applicable agency service fee. Prices and availability can change until the ticket is issued.",
  },
] as const;

const NEEDS = [
  ["New flight booking", "Talk through a new domestic or international itinerary instead of navigating a long online form."],
  ["Urgent travel", "Discuss same-day or near-term routing, alternative airports, connections, and schedule options."],
  ["Complex itineraries", "Review multi-city, open-jaw, and international trips with several segments."],
  ["Premium cabins", "Compare business, first, and premium-economy options for your specific trip."],
  ["Families and groups", "Coordinate multiple travelers, seating preferences, connections, baggage, and trip details."],
  ["Flight changes", "Discuss existing-ticket changes or rebooking options where the ticket rules allow them."],
] as const;

export function FlightBookingPhoneNumberPage() {
  return (
    <>
      <Seo
        title={TITLE}
        description={DESCRIPTION}
        path={PATH}
        structuredData={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Flight Booking Phone Number", path: PATH },
          ]),
          webPageSchema({ title: TITLE, description: DESCRIPTION, path: PATH }),
          serviceSchema({
            name: "Flight booking phone assistance",
            description: DESCRIPTION,
            path: PATH,
          }),
          faqSchema(FAQS),
        ]}
      />

      <Section tone="paper" ocid="flight_phone_number.hero">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li><Link to="/" className="font-medium hover:text-foreground">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-semibold text-foreground">Flight Booking Phone Number</li>
          </ol>
        </nav>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="label-board text-accent">Flight booking phone number</p>
            <h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
              Need a phone number to book a flight?
            </h1>
            <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Call TicketDepart at {SITE.phoneDisplay}. A travel specialist can discuss your route, dates, travelers, cabin, connections, and booking questions with you 24/7.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CallCta size="lg" showNumber ocid="flight_phone_number.hero_call" />
              <Link
                to="/book-a-flight-by-phone"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-card px-6 text-base font-medium text-primary hover:bg-primary hover:text-primary-foreground"
              >
                See phone booking guide <ArrowRight className="size-4" />
              </Link>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="size-4 text-accent" /> {SITE.hours}
            </p>
          </div>

          <aside className="rounded-2xl border border-border bg-card p-6 shadow-subtle sm:p-7">
            <h2 className="font-display text-lg font-semibold">Important to know</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              TicketDepart is an independent travel agency. This is our booking line, not an airline's official customer-service number.
            </p>
            <a
              href={SITE.phoneHref}
              className="mt-5 inline-flex items-center gap-2 font-display text-xl font-bold text-primary underline underline-offset-4"
              data-ocid="flight_phone_number.phone_link"
            >
              <Phone className="size-5" /> {SITE.phoneDisplay}
            </a>
          </aside>
        </div>
      </Section>

      <Section tone="muted" ocid="flight_phone_number.needs">
        <SectionHeading
          eyebrow="When a call helps"
          title="Common flight-booking situations"
          description="Start with the trip you are trying to plan. A specialist can help organize the details before you decide."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {NEEDS.map(([title, body]) => (
            <article key={title} className="rounded-2xl border border-border bg-card p-6 shadow-subtle">
              <h2 className="font-display text-lg font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="paper" ocid="flight_phone_number.prepare">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <SectionHeading
            eyebrow="Before you call"
            title="Have these details ready"
            description="A little preparation can make the first booking conversation faster and more accurate."
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              "Departure and destination cities or airport codes",
              "Preferred travel dates and flexibility",
              "Number of travelers",
              "Cabin preference",
              "Nearby airports you can use",
              "Baggage or accessibility needs",
              "Preferred airline, if any",
              "Your questions about changes or fare rules",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" />
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="navy" ocid="flight_phone_number.cta">
        <div className="mx-auto max-w-3xl text-center">
          <p className="label-board text-accent">TicketDepart</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight sm:text-4xl">
            Talk to a travel specialist about your flight
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
            Explain where you need to go, when you need to travel, and what matters most. Review the itinerary and applicable terms before you authorize a booking.
          </p>
          <div className="mt-8">
            <CallCta size="lg" showNumber ocid="flight_phone_number.cta_call" />
          </div>
        </div>
      </Section>

      <Section tone="paper" ocid="flight_phone_number.related">
        <SectionHeading
          eyebrow="More booking help"
          title="Choose the guide that matches your trip"
          description="Use a more specific page when you already know what kind of flight you need."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Book a flight by phone", "/book-a-flight-by-phone"],
            ["International flights", "/international-flight-booking"],
            ["Last-minute flights", "/last-minute-flight-booking"],
            ["Multi-city flights", "/multi-city-flight-booking"],
            ["Group flights", "/group-flight-booking"],
            ["Domestic flights", "/domestic-flight-booking"],
            ["Business class", "/business-class-flight-booking"],
            ["Family flights", "/family-flight-booking"],
          ].map(([label, to]) => (
            <Link key={to} to={to} className="group rounded-2xl border border-border bg-card p-5 shadow-subtle transition-smooth hover:shadow-elevated">
              <span className="font-display text-base font-semibold">{label}</span>
              <span className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-primary">
                Open guide <ArrowRight className="size-4 transition-smooth group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="paper" ocid="flight_phone_number.faq">
        <SectionHeading eyebrow="FAQ" title="Questions about flight booking by phone" description="Clear answers before you call." />
        <div className="mx-auto mt-10 max-w-3xl space-y-4">
          {FAQS.map((faq) => (
            <details key={faq.question} className="rounded-2xl border border-border bg-card p-5 shadow-subtle">
              <summary className="cursor-pointer font-semibold text-foreground">{faq.question}</summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
