import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { breadcrumbSchema, faqSchema } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  CalendarRange,
  CheckCircle2,
  Clock3,
  Globe2,
  Layers,
  MapPin,
  Phone,
  Repeat2,
  ShieldCheck,
  Ticket,
} from "lucide-react";

const PATH = "/united-airlines";

const HERO_IMAGE = {
  src: "/assets/generated/united-terminal-concourse.dim_1536x864.jpg",
  width: 1536,
  height: 864,
  alt: "Empty modern airport terminal concourse at sunset, with large windows, rows of dark blue waiting chairs, a polished reflective floor, and a central flight information screen.",
} as const;

const HERO_IMAGE_URL = absoluteUrl(HERO_IMAGE.src);

const CAPABILITIES = [
  {
    icon: Ticket,
    title: "Booking assistance",
    body: "We search United Airlines-operated and United Airlines-marketed flights across your travel window, compare Economy, Economy Plus, and premium cabin pricing, and complete the reservation with you on the phone.",
  },
  {
    icon: Globe2,
    title: "International booking",
    body: "Long-haul United Airlines routes often connect through a hub and may include partner-operated segments. We check that every connection is legal and comfortable, and that baggage rules are consistent across the whole journey.",
  },
  {
    icon: MapPin,
    title: "Multi-city booking",
    body: "Three or more stops, or a route that does not return to where it started, needs a human to sequence it well. We order the segments, price the itinerary as a whole, and confirm each stop works with your schedule.",
  },
  {
    icon: Briefcase,
    title: "Business and first-class booking",
    body: "United Airlines Polaris and domestic First Class are priced differently by route and date. We review the premium options in your window, explain what the fare includes, and book the cabin that fits the trip.",
  },
  {
    icon: Repeat2,
    title: "Flight changes and rebooking",
    body: "When your plans move, we read the fare rules on your ticket, compare the cost of changing against rebooking, and handle the reissue so you are not stuck in a queue.",
  },
] as const;

const CABINS = [
  {
    name: "United Airlines Economy",
    tag: "Standard cabin",
    body: "The standard main cabin on United Airlines flights. Seat selection and baggage allowances depend on the fare you choose, so we compare the fare options in your window and explain what each one includes before you book.",
  },
  {
    name: "Economy Plus",
    tag: "Extra legroom",
    body: "A United Airlines seating option with more legroom than standard Economy, located toward the front of the Economy cabin. Availability and pricing vary by aircraft and route, so we check what is open on your specific flights.",
  },
  {
    name: "United Airlines First",
    tag: "Domestic premium",
    body: "United Airlines's domestic premium cabin, offered on many routes within the United Airlines States. What is included — such as seat type and service — varies by aircraft and route, and we confirm the details for your flights.",
  },
  {
    name: "United Airlines Polaris",
    tag: "Long-haul business",
    body: "United Airlines's long-haul international business class, with lie-flat seating on equipped aircraft. It is not available on every international route or aircraft, so we verify the cabin on your specific itinerary.",
  },
] as const;

const INTERNATIONAL_NOTES = [
  {
    title: "Connections and hubs",
    body: "Many international United Airlines itineraries connect through a hub before the long-haul leg. We look at connection times with realistic transfer and security buffers in mind, rather than the shortest possible layover.",
  },
  {
    title: "Partner-operated segments",
    body: "An international United Airlines itinerary can include segments operated by partner airlines. We map the full journey so you know which carrier operates each leg and where the handoffs happen.",
  },
  {
    title: "Baggage across the journey",
    body: "Baggage allowances can differ between the international leg and any connecting domestic leg. We check the rules for the whole itinerary so there are no surprises at check-in.",
  },
  {
    title: "Entry and transit requirements",
    body: "Passport validity, visas, and transit rules are the traveler's responsibility, but we flag the common requirements for your routing so you can confirm them with the relevant authority before you fly.",
  },
] as const;

const MULTI_CITY_NOTES = [
  "Open-jaw trips that arrive in one city and depart from another",
  "Three or more stops where the order changes the total price",
  "Mixed cabins, such as Economy on short legs and a premium cabin long-haul",
  "Itineraries that combine United Airlines with a partner on part of the route",
] as const;

const CHANGE_STEPS = [
  {
    title: "Tell us what changed",
    body: "Call with your confirmation details and the new dates or routing you need. We pull up the reservation and review the fare rules that apply to your ticket.",
  },
  {
    title: "We compare the options",
    body: "We look at what a change costs under your fare against what a new booking would cost, and explain both plainly so you can decide.",
  },
  {
    title: "We handle the reissue",
    body: "Where the ticket allows a change, we process the rebooking and confirm the new itinerary with you. If a change is not permitted under your fare, we tell you that directly.",
  },
] as const;

const CHECKLIST = [
  "Travel dates and how much flexibility you have on each end",
  "Every city or airport you want to fly through, in order",
  "Passenger names spelled exactly as they appear on government ID",
  "MileagePlus number if you want the trip credited",
  "Whether you need extra legroom or a specific seat type",
  "Baggage you plan to check, including any oversized or special items",
  "Connection preferences — shorter versus more comfortable layovers",
] as const;

const FAQS = [
  {
    question: "Is TicketDepart part of United Airlines Airlines?",
    answer:
      "No. TicketDepart is an independent travel agency. We are not affiliated with, endorsed by, or sponsored by United Airlines Airlines, and we are not United Airlines's official customer service. We book travel for our own clients as a third party.",
  },
  {
    question: "What United Airlines booking help can I get over the phone?",
    answer:
      "We can search and compare United Airlines itineraries, book new reservations, build multi-city and international routings, book premium cabins, and assist with changes and rebooking. Call and describe your trip and a specialist will take it from there.",
  },
  {
    question: "Can you book a multi-city United Airlines itinerary?",
    answer:
      "Yes. Multi-city and open-jaw trips are one of the main reasons travelers call us instead of using a search engine. We sequence the segments deliberately and price the whole itinerary together.",
  },
  {
    question: "What is the difference between Economy Plus and United Airlines Polaris?",
    answer:
      "Economy Plus is a seat with extra legroom within the Economy cabin. United Airlines Polaris is United Airlines's long-haul international business class, with lie-flat seating on equipped aircraft. Which cabins are available depends on your route and aircraft, so we check your specific flights.",
  },
  {
    question: "How do I change a United Airlines flight I booked through you?",
    answer:
      "Call us with your confirmation details. We will review the fare rules, explain what the change costs, and handle the rebooking where the ticket allows it. If a change is not possible under your fare, we will tell you that plainly.",
  },
  {
    question: "Do you help with international United Airlines itineraries?",
    answer:
      "Yes. International routings involve partner segments, transit requirements, and baggage that can differ by fare. We map the full journey and explain each leg before you book.",
  },
  {
    question: "Are there fees for using your service?",
    answer:
      "Any service fee is disclosed before your booking is finalized, so the total cost is clear before you agree. We do not add charges after the fact.",
  },
] as const;

const RELATED = [
  { label: "Delta flight assistance", to: "/delta-airlines" },
  { label: "American Airlines assistance", to: "/american-airlines" },
  { label: "General flight booking", to: "/flight-booking" },
] as const;

/**
 * United Airlines booking assistance page. Opens with a hero image and capability
 * summary, then the disclosure, cabin options, international and multi-city
 * guidance, change/rebooking steps, a numbered checklist, and a United Airlines-specific
 * FAQ with matching FAQPage schema.
 */
export function United AirlinesPage() {
  return (
    <>
      <Seo
        title="United Airlines Flight Booking Assistance | TicketDepart"
        description="Independent travel agency for United Airlines Airlines bookings — domestic, international, multi-city, premium cabins, and rebooking help. Call +1 855-544-9001."
        path={PATH}
        image={HERO_IMAGE_URL}
        structuredData={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "United Airlines", path: PATH },
          ]),
          faqSchema(FAQS),
        ]}
      />

      <Section tone="paper" ocid="united.page">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link
                to="/"
                data-ocid="united.breadcrumb.home_link"
                className="rounded-sm transition-smooth hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-foreground">United Airlines</li>
          </ol>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="label-board text-accent">United Airlines flight assistance</p>
            <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.08] sm:text-5xl">
              United Airlines itineraries, planned and booked by phone
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              TicketDepart specialists help travelers book United Airlines flights every
              day — from a straightforward domestic round trip to a multi-city
              international routing with partner segments. You describe the
              trip; we handle the search, the fare comparison, and the booking.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CallCta size="lg" ocid="united.call_button" />
              <Link
                to="/flight-booking"
                data-ocid="united.booking_link"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-card px-6 text-base font-medium text-primary transition-smooth hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                See how booking works
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>

            <p className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Phone aria-hidden="true" className="size-4" />
              <span>{SITE.hours}</span>
              <span aria-hidden="true">·</span>
              <a
                href={SITE.phoneHref}
                data-ocid="united.phone_link"
                className="rounded-sm font-semibold text-primary underline underline-offset-4 transition-smooth hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {SITE.phoneDisplay}
              </a>
            </p>
          </div>

          <figure
            data-ocid="united.hero_image"
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-elevated"
          >
            <img
              src={HERO_IMAGE.src}
              width={HERO_IMAGE.width}
              height={HERO_IMAGE.height}
              alt={HERO_IMAGE.alt}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </figure>
        </div>

        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-border bg-muted p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ShieldCheck
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-accent"
            />
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">
                Independent agency disclosure:
              </span>{" "}
              TicketDepart is an independent travel agency. We are not
              affiliated with, endorsed by, or sponsored by United Airlines Airlines, and
              we are not United Airlines's official customer service. United Airlines and all
              related names and marks belong to their respective owners and are
              used for identification only.
            </p>
          </div>
          <CallCta
            size="md"
            variant="outline"
            ocid="united.disclosure.call_button"
            className="shrink-0"
          />
        </div>
      </Section>

      <Section tone="muted" ocid="united.capabilities">
        <SectionHeading
          eyebrow="What we handle"
          title="Five ways we help with United Airlines travel"
          description="Each service is handled by a specialist who can explain the trade-offs before you decide, not after."
        />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((item, index) => (
            <li
              key={item.title}
              data-ocid={`united.capability_card.${index + 1}`}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-subtle transition-smooth hover:shadow-elevated"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <item.icon aria-hidden="true" className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold leading-snug">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="paper" ocid="united.cabins">
        <SectionHeading
          eyebrow="Cabin options"
          title="Understanding United Airlines's cabins"
          description="United Airlines uses different cabin names across domestic and long-haul international flights. Here is how they differ, described generically."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {CABINS.map((cabin, index) => (
            <div
              key={cabin.name}
              data-ocid={`united.cabin_card.${index + 1}`}
              className="rounded-2xl border border-border bg-card p-6 shadow-subtle"
            >
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-lg font-semibold">
                  {cabin.name}
                </h3>
                <span className="label-board rounded-full bg-primary/5 px-3 py-1 text-primary">
                  {cabin.tag}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {cabin.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="muted" ocid="united.international">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeading
            eyebrow="International travel"
            title="What to consider on a long-haul United Airlines itinerary"
            description="International routings have more moving parts than a domestic round trip. These are the ones we work through with you."
          />
          <ul className="grid gap-4">
            {INTERNATIONAL_NOTES.map((note, index) => (
              <li
                key={note.title}
                data-ocid={`united.international_item.${index + 1}`}
                className="rounded-xl border border-border bg-card p-5"
              >
                <h3 className="font-display text-base font-semibold">
                  {note.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {note.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="paper" ocid="united.multicity">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Multi-city travel"
              title="When a trip needs more than a round trip"
              description="Multi-city itineraries are where a specialist earns their keep. We sequence the segments and price the whole trip together."
            />
            <ul className="mt-8 grid gap-3">
              {MULTI_CITY_NOTES.map((note, index) => (
                <li
                  key={note}
                  data-ocid={`united.multicity_item.${index + 1}`}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
                >
                  <Layers
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-accent"
                  />
                  <span className="text-sm leading-relaxed text-foreground">
                    {note}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-subtle">
            <div className="flex items-center gap-2.5">
              <Clock3 aria-hidden="true" className="size-5 text-accent" />
              <p className="font-display text-base font-semibold">
                {SITE.hours}
              </p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Call{" "}
              <a
                href={SITE.phoneHref}
                data-ocid="united.multicity.phone_link"
                className="rounded-sm font-semibold text-primary underline underline-offset-4 transition-smooth hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {SITE.phoneDisplay}
              </a>{" "}
              and a specialist will pick up.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="muted" ocid="united.changes">
        <SectionHeading
          eyebrow="Changes and rebooking"
          title="How we handle a change to your United Airlines ticket"
          description="Fare rules decide what is possible. We read them for you and explain the options in plain language."
        />
        <ol className="mt-10 grid gap-5 sm:grid-cols-3">
          {CHANGE_STEPS.map((step, index) => (
            <li
              key={step.title}
              data-ocid={`united.change_step.${index + 1}`}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <h3 className="mt-4 font-display text-base font-semibold">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="paper" ocid="united.checklist">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
          <SectionHeading
            eyebrow="Before you call"
            title="A short checklist for a faster booking"
            description="Have these ready and your specialist can search accurately on the first call."
          />
          <ol className="grid gap-3">
            {CHECKLIST.map((item, index) => (
              <li
                key={item}
                data-ocid={`united.checklist_item.${index + 1}`}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <span className="text-sm leading-relaxed text-foreground">
                  {item}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section tone="navy" ocid="united.cta">
        <div className="mx-auto max-w-2xl text-center">
          <p className="label-board text-accent">One call, one specialist</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight sm:text-4xl">
            Let's plan your United Airlines trip together
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-primary-foreground/80">
            Tell us where you are going and when. We will search the options,
            explain the differences, and book the itinerary that works for you.
          </p>
          <div className="mt-8 flex justify-center">
            <CallCta
              size="lg"
              variant="solid"
              showNumber
              ocid="united.cta.call_button"
            />
          </div>
        </div>
      </Section>

      <Section tone="paper" ocid="united.faq">
        <SectionHeading
          eyebrow="United Airlines questions"
          title="What travelers ask us most"
          description="Clear answers about independent agency booking and United Airlines itineraries."
        />
        <dl className="mt-10 grid gap-4 lg:grid-cols-2">
          {FAQS.map((faq, index) => (
            <div
              key={faq.question}
              data-ocid={`united.faq_item.${index + 1}`}
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

      <Section tone="muted" ocid="united.related">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2.5">
            <CalendarRange aria-hidden="true" className="size-5 text-accent" />
            <h2 className="font-display text-xl font-semibold">
              Explore other airline assistance
            </h2>
          </div>
          <ul className="flex flex-wrap gap-3">
            {RELATED.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  data-ocid={`united.related_link.${item.to.replace(/\//g, "_")}`}
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
