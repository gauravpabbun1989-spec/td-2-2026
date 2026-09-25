import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import {
  breadcrumbSchema,
  faqSchema,
  serviceSchema,
  webPageSchema,
} from "@/lib/seo";
import { SITE } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";

const PAGE_PATH = "/how-to-book-a-flight-by-phone";
const PAGE_TITLE = "How to Book a Flight by Phone | TicketDepart";
const PAGE_DESCRIPTION =
  "Learn how phone flight booking works, what information to prepare, what to ask about fares and changes, and when speaking with a travel specialist can help.";

const FAQS = [
  {
    question: "Can I book a flight entirely by phone?",
    answer:
      "Yes. An independent travel specialist can review itinerary options with you and, when the agency can issue the ticket, complete the booking by phone after you confirm the itinerary, price, and applicable terms.",
  },
  {
    question: "What information should I have ready before calling?",
    answer:
      "Have your departure and destination cities or airports, travel dates, number of travelers, preferred cabin, and any flexibility. For international trips, have the passenger names and travel-document details available when appropriate.",
  },
  {
    question: "Can a travel specialist help with multi-city flights?",
    answer:
      "Yes. A specialist can discuss multi-city, open-jaw, and other complex itineraries and explain how the routing, connections, and fare rules differ from a simple round trip.",
  },
  {
    question: "Can I ask about baggage and change rules before paying?",
    answer:
      "Yes. Ask which baggage is included, what the fare permits, whether changes are allowed, and what fees or fare differences may apply before you confirm a booking.",
  },
] as const;

const CHECKLIST = [
  "Departure and destination cities or airport codes",
  "Preferred departure and return dates",
  "Number of travelers and passenger ages when relevant",
  "Cabin preference: economy, premium economy, business, or first",
  "Flexible dates or nearby airports you can use",
  "Baggage, seating, accessibility, or other travel requirements",
] as const;

export function HowToBookFlightByPhonePage() {
  return (
    <>
      <Seo
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        path={PAGE_PATH}
        structuredData={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "How to Book a Flight by Phone", path: PAGE_PATH },
          ]),
          faqSchema(FAQS),
          webPageSchema({
            title: PAGE_TITLE,
            description: PAGE_DESCRIPTION,
            path: PAGE_PATH,
          }),
          serviceSchema({
            name: "Phone flight booking assistance",
            description: PAGE_DESCRIPTION,
            path: PAGE_PATH,
          }),
        ]}
      />

      <Section tone="paper" ocid="phone_booking_guide.hero">
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
                How to Book a Flight by Phone
              </span>
            </li>
          </ol>
        </nav>

        <div className="mx-auto mt-10 max-w-4xl">
          <p className="label-board text-accent">Phone booking guide</p>
          <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
            How to book a flight by phone
          </h1>
          <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            If you are searching for a flight booking phone number or want to book a
            flight by phone, this guide explains what to prepare and what to ask.
            Booking by phone can be useful when your trip is more complicated
            than a simple search. A travel specialist can talk through dates,
            airports, connections, cabin options, baggage, and fare rules with
            you before you decide what to book.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CallCta size="lg" ocid="phone_booking_guide.call_button" />
            <Link
              to="/flight-booking"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-card px-6 text-base font-medium text-primary hover:bg-primary hover:text-primary-foreground"
            >
              See flight booking services
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <Phone aria-hidden="true" className="size-4 text-accent" />
            {SITE.hours} · {SITE.phoneDisplay}
          </p>
        </div>
      </Section>

      <Section tone="muted" ocid="phone_booking_guide.steps">
        <SectionHeading
          eyebrow="The process"
          title="What happens when you book by phone"
          description="The exact process depends on the travel provider and itinerary, but these are the practical steps to work through before a ticket is issued."
        />

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              number: "01",
              title: "Explain the trip",
              text: "Give the departure and destination, dates, travelers, cabin preference, and any flexibility. Mention nearby airports or alternate dates if you can use them.",
            },
            {
              number: "02",
              title: "Compare the itinerary",
              text: "Review departure times, airports, connections, airline, cabin, baggage terms, change rules, and the complete price. Ask questions before agreeing to anything.",
            },
            {
              number: "03",
              title: "Confirm the booking",
              text: "Once you choose an itinerary, verify passenger names and the final terms. A booking is complete only after the responsible travel provider issues the ticket and confirmation.",
            },
          ].map((step) => (
            <li
              key={step.number}
              className="rounded-2xl border border-border bg-card p-6 shadow-subtle"
            >
              <span className="label-board text-accent">{step.number}</span>
              <h2 className="mt-4 font-display text-lg font-semibold">
                {step.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="paper" ocid="phone_booking_guide.checklist">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Before you call"
              title="Have these details ready"
              description="You do not need every detail before the call, but having the basics ready makes the conversation faster and reduces avoidable mistakes."
            />
            <ul className="mt-8 space-y-4">
              {CHECKLIST.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-accent"
                  />
                  <span className="text-sm leading-relaxed text-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-subtle sm:p-7">
            <h2 className="font-display text-xl font-semibold">
              Questions worth asking
            </h2>
            <ul className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <li>
                What is the complete price, including taxes and any agency fee?
              </li>
              <li>What baggage is included with this fare?</li>
              <li>What are the change and cancellation rules?</li>
              <li>
                Are there alternative airports or dates that change the
                itinerary?
              </li>
              <li>Who will issue the ticket and provide the confirmation?</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="muted" ocid="phone_booking_guide.when_helpful">
        <SectionHeading
          eyebrow="When it helps"
          title="Phone booking is especially useful for complicated trips"
          description="A phone conversation can be useful when the itinerary needs more context than a basic origin-and-destination search provides."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              "Multi-city",
              "Three or more cities, open-jaw trips, or unusual routing.",
            ],
            [
              "International",
              "Long connections, multiple airports, and document questions.",
            ],
            [
              "Premium cabins",
              "Business or first class where cabin and aircraft details matter.",
            ],
            [
              "Groups",
              "Families, teams, or groups that need coordinated travel.",
            ],
          ].map(([title, text]) => (
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

      <Section tone="paper" ocid="phone_booking_guide.related">
        <SectionHeading
          eyebrow="Continue planning"
          title="Explore airline-specific booking help"
          description="If you already know which airline you want to fly, these guides cover booking, cabin options, connections, and changes for that carrier."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            ["Delta Airlines", "/delta-airlines"],
            ["United Airlines", "/united-airlines"],
            ["American Airlines", "/american-airlines"],
          ].map(([label, to]) => (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl border border-border bg-card p-5 shadow-subtle transition-smooth hover:shadow-elevated"
            >
              <span className="font-display text-base font-semibold text-foreground">
                {label} booking assistance
              </span>
              <span className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-primary">
                Read the guide{" "}
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-smooth group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="navy" ocid="phone_booking_guide.cta">
        <div className="mx-auto max-w-3xl text-center">
          <p className="label-board text-accent">TicketDepart</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight sm:text-4xl">
            Want to talk through your itinerary?
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
            TicketDepart is an independent travel agency. Tell us your route,
            dates, travelers, and preferences, and a specialist can discuss the
            booking options with you.
          </p>
          <div className="mt-8">
            <CallCta size="lg" ocid="phone_booking_guide.cta_call_button" />
          </div>
        </div>
      </Section>

      <Section tone="paper" ocid="phone_booking_guide.faq">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions about booking flights by phone"
          description="Practical answers before you call."
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
