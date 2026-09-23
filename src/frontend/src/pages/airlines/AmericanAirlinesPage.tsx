import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { breadcrumbSchema, faqSchema } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import {
  Armchair,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Globe2,
  Headphones,
  Layers,
  Plane,
  RefreshCw,
  Route,
  ShieldCheck,
  Ticket,
} from "lucide-react";

const PATH = "/american-airlines";

const IMAGE_SRC =
  "/assets/generated/american-terminal-concourse.dim_1600x900.jpg";

const IMAGE_URL = absoluteUrl(IMAGE_SRC);

const SERVICES = [
  {
    icon: Ticket,
    title: "Booking assistance for American itineraries",
    body: "Tell us your dates, airports, and travelers. A specialist searches American-operated and American-marketed flights, compares the fare options available in your window, and completes the reservation with you on the line — including Main Cabin, Main Cabin Extra, and premium cabins where they are offered.",
  },
  {
    icon: Globe2,
    title: "International and multi-city travel",
    body: "Long-haul American itineraries often combine American-operated legs with partner-operated segments, and each country has its own entry and transit rules. We build the full routing, check that connection times are realistic, and explain what each segment includes before you commit.",
  },
  {
    icon: Armchair,
    title: "Cabin options explained",
    body: "Main Cabin is the standard economy experience, Main Cabin Extra adds extra legroom and earlier boarding on eligible flights, domestic First Class is the premium cabin on many U.S. routes, and Flagship Business and Flagship First are the long-haul premium cabins. We describe what each one includes on your specific route so you can choose deliberately.",
  },
  {
    icon: RefreshCw,
    title: "Changes and rebooking guidance",
    body: "If your plans move, we read the fare rules attached to your ticket, explain what a change would cost versus what a new booking would cost, and handle the reissue where the fare allows it. If your fare does not permit the change you want, we will say so plainly rather than leave you guessing.",
  },
  {
    icon: Layers,
    title: "Multi-city and open-jaw sequencing",
    body: "Flying into one city and home from another, or stopping in three places along the way, is where self-service search tools tend to struggle. We sequence the segments by hand, price the trip as a single itinerary, and confirm every stop fits your schedule.",
  },
] as const;

const CABINS = [
  {
    name: "Main Cabin",
    detail:
      "The standard economy cabin on American flights. Seat selection and baggage allowances depend on the fare you choose, so we walk through what is included before booking.",
  },
  {
    name: "Main Cabin Extra",
    detail:
      "An economy seat with additional legroom and earlier boarding on eligible flights. Availability varies by aircraft and route, so we check your specific flight.",
  },
  {
    name: "Domestic First Class",
    detail:
      "The premium cabin offered on many U.S. domestic routes, with a wider seat and a higher level of service than economy. What is included varies by route and aircraft.",
  },
  {
    name: "Flagship Business & Flagship First",
    detail:
      "American's long-haul premium cabins on eligible international and transcontinental routes. Lie-flat seating and lounge access depend on the route and fare, so we confirm the details for your itinerary.",
  },
] as const;

const CHECKLIST = [
  "Your travel dates and any flexibility around them",
  "The airports or cities for every leg, in the order you want to fly",
  "Passenger names exactly as they appear on government-issued ID",
  "AAdvantage number if you want the trip credited to your account",
  "Seat preferences, including whether your party must sit together",
  "Checked and carry-on baggage needs, including special items",
  "Any accessibility, medical, or dietary request needing advance notice",
  "Whether you are open to a connecting itinerary to get a better fare",
] as const;

const FAQS = [
  {
    question: "Is TicketDepart affiliated with American Airlines?",
    answer:
      "No. TicketDepart is an independent travel agency. We are not affiliated with, endorsed by, or sponsored by American Airlines, and we are not American's official customer service. American Airlines and all related names and marks belong to their respective owners and are used for identification only.",
  },
  {
    question: "Can you book American Airlines flights on my behalf?",
    answer:
      "Yes. Our specialists search, price, and book American-operated and American-marketed flights for our clients. We are a third-party agency, not the airline.",
  },
  {
    question: "What is the difference between Main Cabin and Main Cabin Extra?",
    answer:
      "Main Cabin is the standard economy cabin. Main Cabin Extra is an economy seat with additional legroom and earlier boarding on eligible flights. Availability and pricing vary by aircraft and route, so we check your specific flight before you decide.",
  },
  {
    question: "Can you help with a multi-city American Airlines trip?",
    answer:
      "Yes. Multi-city and open-jaw itineraries are a core part of what we do. We sequence the segments deliberately and price the whole trip together rather than as separate one-ways.",
  },
  {
    question: "How do changes and rebooking work?",
    answer:
      "Call us with your confirmation details. We review the fare rules on your ticket, explain what a change would cost, and handle the rebooking where the fare allows it. If it does not, we will say so clearly.",
  },
  {
    question: "Do you book premium cabins on American Airlines?",
    answer:
      "Yes. We book Flagship Business and Flagship First on eligible long-haul routes and domestic First Class where offered. Availability and pricing depend on your route and dates, so we check your specific window.",
  },
] as const;

const RELATED = [
  { label: "Delta Airlines flight assistance", to: "/delta-airlines" },
  { label: "United Airlines flight assistance", to: "/united-airlines" },
  { label: "General flight booking", to: "/flight-booking" },
] as const;

/**
 * American Airlines booking assistance page. Leads with a terminal image and
 * the independent-agency disclosure, then walks through the service areas,
 * cabin options, a before-calling checklist, and an American-specific FAQ with
 * matching FAQPage schema.
 */
export function AmericanAirlinesPage() {
  return (
    <>
      <Seo
        title="American Airlines Flight Booking Assistance | TicketDepart"
        description="Independent travel agency for American Airlines bookings — domestic, international, multi-city, cabin options, and rebooking help. Call +1 855-544-9001."
        path={PATH}
        image={IMAGE_URL}
        structuredData={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "American Airlines", path: PATH },
          ]),
          faqSchema(FAQS),
        ]}
      />

      <Section tone="paper" ocid="american.page">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link
                to="/"
                data-ocid="american.breadcrumb.home_link"
                className="rounded-sm transition-smooth hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-foreground">American Airlines</li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="label-board text-accent">
              American Airlines flight assistance
            </p>
            <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.08] sm:text-5xl">
              American Airlines trips, booked with a specialist on the line
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              From a single domestic round trip to a multi-city international
              routing, a TicketDepart specialist can search, compare, and book
              American Airlines flights for you — and stay reachable when your
              plans change.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CallCta size="lg" ocid="american.call_button" />
              <Link
                to="/flight-booking"
                data-ocid="american.booking_link"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-card px-6 text-base font-medium text-primary transition-smooth hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                How booking works
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted p-6">
            <div className="flex items-center gap-2.5">
              <Headphones aria-hidden="true" className="size-5 text-accent" />
              <h2 className="font-display text-lg font-semibold">
                Talk to a person, not a menu
              </h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {SITE.hours}. Call and a specialist will pick up, search fares,
              and book your itinerary while you are on the line.
            </p>
            <p className="mt-4 text-sm font-semibold text-primary">
              Call for flight assistance when you are ready.
            </p>
          </div>
        </div>

        <figure className="mt-12 overflow-hidden rounded-2xl border border-border bg-card shadow-subtle">
          <img
            src={IMAGE_SRC}
            alt="Sunlit airport terminal concourse with floor-to-ceiling windows, rows of gate seating, and a departure board overlooking a parked aircraft"
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
            className="h-auto w-full object-cover"
          />
          <figcaption className="border-t border-border px-5 py-3 text-xs leading-relaxed text-muted-foreground sm:px-6">
            A quiet terminal concourse before departure. TicketDepart is an
            independent agency and is not affiliated with any airline.
          </figcaption>
        </figure>
      </Section>

      <Section tone="muted" ocid="american.disclosure">
        <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-subtle sm:p-8">
          <ShieldCheck
            aria-hidden="true"
            className="mt-0.5 size-6 shrink-0 text-accent"
          />
          <div>
            <h2 className="font-display text-lg font-semibold">
              Independent agency disclosure
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              TicketDepart is an independent travel agency. We are not
              affiliated with, endorsed by, or sponsored by American Airlines,
              and we are not American Airlines' official customer service.
              American Airlines and all related names and marks belong to their
              respective owners and are used here for identification only.
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              We do not link out to airline booking websites. Every booking and
              change is handled on this site by phone with one of our
              specialists.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="paper" ocid="american.services">
        <SectionHeading
          eyebrow="What we handle"
          title="American Airlines services we provide"
          description="Every service is handled by a specialist who explains the trade-offs before you decide."
        />
        <ol className="mt-10 grid gap-4">
          {SERVICES.map((service, index) => (
            <li
              key={service.title}
              data-ocid={`american.service_row.${index + 1}`}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-subtle sm:flex-row sm:items-start"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <service.icon aria-hidden="true" className="size-5" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="label-board text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-lg font-semibold leading-snug">
                    {service.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {service.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="muted" ocid="american.cabins">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <SectionHeading
            eyebrow="Cabin options"
            title="Choosing how you fly"
            description="American offers several cabins, and what each one includes depends on the route, aircraft, and fare. Here is how we describe them when we talk through your trip."
          />
          <dl className="grid gap-4 sm:grid-cols-2">
            {CABINS.map((cabin, index) => (
              <div
                key={cabin.name}
                data-ocid={`american.cabin_card.${index + 1}`}
                className="rounded-2xl border border-border bg-card p-6 shadow-subtle"
              >
                <dt className="font-display text-base font-semibold leading-snug">
                  {cabin.name}
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {cabin.detail}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section tone="navy" ocid="american.cta">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="label-board text-accent">Ready when you are</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight sm:text-4xl">
              Plan your American Airlines trip today
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-primary-foreground/80">
              Tell us where you are going and when. We will search the options,
              explain the differences, and book the itinerary that works for
              you.
            </p>
          </div>
          <CallCta
            size="lg"
            variant="solid"

            ocid="american.cta.call_button"
            className="shrink-0"
          />
        </div>
      </Section>

      <Section tone="paper" ocid="american.checklist">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Before you call"
              title="What to have on hand"
              description="A little preparation makes your booking call faster and more accurate."
            />
            <div className="mt-8 flex items-center gap-2.5 rounded-2xl border border-border bg-muted p-5">
              <ClipboardList
                aria-hidden="true"
                className="size-5 shrink-0 text-accent"
              />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Not sure about something on the list? Call anyway — a specialist
                can help you work it out.
              </p>
            </div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {CHECKLIST.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
              >
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
      </Section>

      <Section tone="muted" ocid="american.faq">
        <SectionHeading
          eyebrow="American Airlines questions"
          title="Frequently asked questions"
          description="Straight answers about independent agency booking and American Airlines itineraries."
        />
        <dl className="mt-10 grid gap-4 lg:grid-cols-2">
          {FAQS.map((faq, index) => (
            <div
              key={faq.question}
              data-ocid={`american.faq_item.${index + 1}`}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <dt className="font-display text-base font-semibold leading-snug">
                {faq.question}
              </dt>
              <dd className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section tone="paper" ocid="american.related">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2.5">
            <Plane
              aria-hidden="true"
              className="size-5 -rotate-45 text-accent"
            />
            <h2 className="font-display text-xl font-semibold">
              Flying another airline too?
            </h2>
          </div>
          <ul className="flex flex-wrap gap-3">
            {RELATED.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  data-ocid={`american.related_link.${item.to.replace(/\//g, "_")}`}
                  className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card px-5 py-2.5 text-sm font-medium text-primary transition-smooth hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {item.label}
                  <ArrowRight aria-hidden="true" className="size-3.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
