import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { breadcrumbSchema, faqSchema } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  Globe2,
  Layers,
  RefreshCw,
  ShieldCheck,
  Ticket,
} from "lucide-react";

const PATH = "/delta-airlines";

const TERMINAL_IMAGE = {
  src: "/assets/generated/delta-terminal-concourse.dim_1200x800.jpg",
  alt: "Empty modern airport terminal concourse at sunrise, with floor-to-ceiling windows facing the tarmac, rows of gate seating, and a departures board in the distance.",
  width: 1200,
  height: 800,
} as const;

const TERMINAL_IMAGE_URL = absoluteUrl(TERMINAL_IMAGE.src);

const SERVICES = [
  {
    icon: Ticket,
    title: "New Delta Airlines flight bookings",
    body: "Tell us your dates, airports, and how many travelers are flying. A specialist searches available Delta Airlines-operated and Delta Airlines-marketed itineraries, compares fare families, and books the option that fits your trip — including Main Cabin, Comfort+, and Delta One where available.",
  },
  {
    icon: Globe2,
    title: "International Delta Airlines itineraries",
    body: "Transatlantic and transpacific routings involve partner segments, visa and transit rules, and baggage that differs by fare. We map the full journey end to end, confirm connection times are realistic, and explain what each leg includes before you commit.",
  },
  {
    icon: Layers,
    title: "Multi-city and open-jaw trips",
    body: "Flying into one city and home from another, or stopping in three places along the way, is where online search tools struggle. We build the segment order deliberately, price it as a single itinerary, and check that each stopover is long enough to be useful.",
  },
  {
    icon: BadgeCheck,
    title: "Business and first-class cabins",
    body: "Premium cabin inventory moves quickly and pricing varies by departure day and routing. We look at the cabin options across your travel window, explain the difference between Delta One and domestic First Class, and book the seat that matches how you actually want to fly.",
  },
  {
    icon: RefreshCw,
    title: "Changes and rebooking",
    body: "Plans shift. If your schedule moves, we review the fare rules on your existing ticket, walk through what a change costs versus what a new booking would cost, and handle the rebooking so you are not left navigating hold queues on your own.",
  },
] as const;

const CABINS = [
  {
    name: "Main Cabin",
    body: "The standard economy experience on Delta Airlines-operated flights. Seats are assigned at booking or check-in, and the fare family you choose determines whether a seat selection or a change is included. Basic economy-style fares are more restrictive, so we confirm what your specific fare allows before you book.",
  },
  {
    name: "Comfort+",
    body: "An extra-legroom economy cabin on many Delta Airlines mainline aircraft, with more recline and earlier boarding than standard Main Cabin. It is a seat-and-space upgrade rather than a separate service class, and availability varies by aircraft and route.",
  },
  {
    name: "First Class",
    body: "The domestic premium cabin on Delta Airlines mainline routes, with a wider seat, priority boarding, and a higher baggage allowance on most fares. It is offered on select domestic and short-haul international routes rather than on every flight.",
  },
  {
    name: "Delta One",
    body: "Delta Airlines' long-haul premium cabin, offered on many international and select transcontinental routes. It features a lie-flat seat and premium service. Which aircraft and routes carry Delta One changes over time, so we check your specific itinerary rather than assume.",
  },
] as const;

const INTERNATIONAL_NOTES = [
  {
    title: "Partner-operated segments",
    body: "A single Delta Airlines-marketed itinerary can include legs operated by partner airlines. We identify which carrier actually flies each segment so you know whose check-in desk, baggage rules, and seat map apply.",
  },
  {
    title: "Transit and entry requirements",
    body: "Some countries require a transit visa even when you never leave the airport, and passport validity rules differ by destination. We flag the requirements that apply to your routing so you can confirm them with the relevant authority before departure.",
  },
  {
    title: "Baggage across the journey",
    body: "Allowances can change between carriers and fare families on the same ticket. We read the rules for the whole itinerary, not just the first leg, so there are no surprises at the counter.",
  },
  {
    title: "Connection timing",
    body: "International connections need more time than domestic ones, especially where you clear immigration or change terminals. We build layovers that are realistic for the airport you are passing through.",
  },
] as const;

const CHECKLIST = [
  "Your departure and return dates, plus any flexibility you have around them",
  "The exact airport codes or city names for every leg you are considering",
  "Full legal names for each traveler exactly as they appear on ID",
  "Date of birth for every passenger on the reservation",
  "Your SkyMiles number if you want the trip credited to your account",
  "Seat preferences — aisle, window, extra legroom, or traveling together",
  "Checked bag needs and whether you will carry a pet or special item",
  "Any medical, mobility, or dietary requests that need advance notice",
] as const;

const FAQS = [
  {
    question: "Can TicketDepart book Delta Airlines flights for me?",
    answer:
      "Yes. TicketDepart is an independent travel agency and our specialists can search, price, and book Delta Airlines-operated and Delta Airlines-marketed flights on your behalf. We are not Delta Airlines and we are not Delta Airlines' official customer service — we are a third-party agency that books travel for our clients.",
  },
  {
    question:
      "How is booking through an agency different from booking on Delta Airlines' website?",
    answer:
      "You get a person on the phone who can compare fare families, explain what each fare includes, and handle the booking from start to finish. If something changes later, you call the same agency back rather than working through a self-service portal.",
  },
  {
    question: "Do you charge a service fee?",
    answer:
      "Any agency service fee is disclosed to you before your booking is finalized, so you always know the full cost of your itinerary before you agree to it. There are no hidden charges added after the fact.",
  },
  {
    question:
      "Can you help with a Delta Airlines flight I already booked elsewhere?",
    answer:
      "We can look at your existing itinerary and advise on change and rebooking options. Whether we can act on the reservation depends on the fare rules and how the ticket was issued, and we will tell you honestly what is possible before you commit to anything.",
  },
  {
    question: "What if my Delta Airlines flight is delayed or cancelled?",
    answer:
      "Call us and we will review your itinerary and the applicable fare rules, then walk you through the rebooking options that are available. We can handle the rebooking for you where the ticket allows it.",
  },
  {
    question: "Can I get Delta Airlines flight booking assistance 24/7?",
    answer:
      "Yes. TicketDepart travel specialists are available 24/7 for independent Delta Airlines booking assistance. We are not Delta Airlines official customer service, and airline-specific support hours can vary by channel.",
  },
  {
    question: "Can I book business or first class through TicketDepart?",
    answer:
      "Yes. We book premium cabins including Delta One on long-haul routes and First Class on domestic routes where it is offered. Availability and pricing vary by route and date, so we check your specific travel window.",
  },
] as const;

const RELATED = [
  { label: "United Airlines assistance", to: "/united-airlines" },
  { label: "American Airlines assistance", to: "/american-airlines" },
  { label: "International flight booking assistance", to: "/international-flight-booking" },
  { label: "General flight booking", to: "/flight-booking" },
  { label: "Business class booking assistance", to: "/business-class-flight-booking" },
  { label: "Book a flight by phone", to: "/book-a-flight-by-phone" },
] as const;

/**
 * Delta Airlines booking assistance page. Leads with the independent-agency disclosure,
 * then walks through the five service areas, a cabin comparison, international
 * and multi-city considerations, a before-calling checklist, and a
 * Delta Airlines-specific FAQ with matching FAQPage schema.
 */
export function DeltaPage() {
  return (
    <>
      <Seo
        title="Delta Airlines Flight Booking and Reservation Assistance | TicketDepart"
        description="Independent travel agency providing Delta Airlines reservation support and flight booking assistance for domestic, international, multi-city, and premium-cabin travel. Call +1 888-958-0280."
        path={PATH}
        image={TERMINAL_IMAGE_URL}
        structuredData={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Delta Airlines", path: PATH },
          ]),
          faqSchema(FAQS),
        ]}
      />

      <Section tone="paper" ocid="delta.page">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link
                to="/"
                data-ocid="delta.breadcrumb.home_link"
                className="rounded-sm transition-smooth hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-foreground">Delta Airlines</li>
          </ol>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <p className="label-board text-accent">
              Delta Airlines reservation support
            </p>
            <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.08] sm:text-5xl">
              Delta Airlines reservation support from a real travel specialist
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Whether you need Delta Airlines flight booking for a simple domestic round trip or a multi-city international itinerary, a TicketDepart specialist can search, compare, and book Delta Airlines flights with you by phone — including international, premium-cabin, and complex routing options.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CallCta size="lg" ocid="delta.call_button" />
              <Link
                to="/flight-booking"
                data-ocid="delta.booking_link"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-card px-6 text-base font-medium text-primary transition-smooth hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                See how booking works
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              {SITE.hours}. Call for flight assistance when you are ready.
            </p>
          </div>

          <aside
            data-ocid="delta.disclosure_card"
            className="rounded-2xl border border-border bg-card p-6 shadow-subtle"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck aria-hidden="true" className="size-5 text-accent" />
              <h2 className="font-display text-lg font-semibold">
                Independent agency disclosure
              </h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              TicketDepart is an independent travel agency. We are not
              affiliated with, endorsed by, or sponsored by Delta Airlines, and
              we are not Delta Airlines' official customer service. Delta
              Airlines and all related names and marks belong to their
              respective owners and are used here for identification only.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              We do not link out to airline booking websites. Every booking and
              change is handled on this site by phone with one of our
              specialists.
            </p>
          </aside>
        </div>

        <figure className="mt-12 overflow-hidden rounded-2xl border border-border bg-card shadow-subtle">
          <img
            src={TERMINAL_IMAGE.src}
            alt={TERMINAL_IMAGE.alt}
            width={TERMINAL_IMAGE.width}
            height={TERMINAL_IMAGE.height}
            loading="lazy"
            decoding="async"
            data-ocid="delta.terminal_image"
            className="h-auto w-full object-cover"
          />
          <figcaption className="border-t border-border px-5 py-3 text-xs leading-relaxed text-muted-foreground sm:px-6">
            A quiet terminal concourse before the day's first departures. Photo
            for illustration only — no airline is depicted or implied.
          </figcaption>
        </figure>
      </Section>

      <Section tone="muted" ocid="delta.services">
        <SectionHeading
          eyebrow="What we handle"
          title="Delta Airlines reservation support and booking services"
          description="From new reservations and international itineraries to changes and premium cabins, each service is handled by a specialist who explains the options before you decide."
        />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => (
            <li
              key={service.title}
              data-ocid={`delta.service_card.${index + 1}`}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-subtle transition-smooth hover:shadow-elevated"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/5 text-primary">
                <service.icon aria-hidden="true" className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold leading-snug">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {service.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="paper" ocid="delta.cabins">
        <SectionHeading
          eyebrow="Cabin options"
          title="Understanding Delta Airlines' cabins before you choose"
          description="Cabin names and what they include vary by aircraft and route. Here is a plain-language starting point — your specialist confirms the details for your specific flight."
        />
        <dl className="mt-10 grid gap-5 sm:grid-cols-2">
          {CABINS.map((cabin, index) => (
            <div
              key={cabin.name}
              data-ocid={`delta.cabin_card.${index + 1}`}
              className="rounded-2xl border border-border bg-card p-6 shadow-subtle"
            >
              <dt className="font-display text-lg font-semibold leading-snug">
                {cabin.name}
              </dt>
              <dd className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {cabin.body}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Cabin availability, seat maps, and inclusions are set by the airline
          and can change between aircraft and seasons. We describe what is
          offered on the itinerary you are actually booking rather than
          generalizing.
        </p>
      </Section>

      <Section tone="muted" ocid="delta.international">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeading
            eyebrow="International and multi-city"
            title="What changes when the trip gets complex"
            description="A multi-city international itinerary is more than a longer booking. These are the details we work through with you before anything is ticketed."
          />
          <ul className="grid gap-4">
            {INTERNATIONAL_NOTES.map((note, index) => (
              <li
                key={note.title}
                data-ocid={`delta.international_item.${index + 1}`}
                className="rounded-xl border border-border bg-card p-5"
              >
                <h3 className="font-display text-base font-semibold leading-snug">
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

      <Section tone="paper" ocid="delta.checklist">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeading
            eyebrow="Before you call"
            title="Have these details ready"
            description="A few minutes of preparation lets your specialist search accurately on the first call instead of calling you back for missing information."
          />
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

      <Section tone="navy" ocid="delta.cta">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="label-board text-accent">Ready when you are</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight sm:text-4xl">
              Talk through your Delta Airlines trip with a specialist
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-primary-foreground/80">
              No hold music, no automated menus. Call and speak with a person
              who can search fares and book your itinerary while you are on the
              line.
            </p>
          </div>
          <CallCta
            size="lg"
            variant="solid"

            ocid="delta.cta.call_button"
            className="shrink-0"
          />
        </div>
      </Section>

      <Section tone="paper" ocid="delta.faq">
        <SectionHeading
          eyebrow="Delta Airlines questions"
          title="Frequently asked questions"
          description="Straight answers about Delta Airlines reservation support, agency booking, changes, rebooking, and premium-cabin travel."
        />
        <dl className="mt-10 grid gap-4 lg:grid-cols-2">
          {FAQS.map((faq, index) => (
            <div
              key={faq.question}
              data-ocid={`delta.faq_item.${index + 1}`}
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

      <Section tone="muted" ocid="delta.related">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2.5">
            <CalendarClock aria-hidden="true" className="size-5 text-accent" />
            <h2 className="font-display text-xl font-semibold">
              Also flying another airline?
            </h2>
          </div>
          <ul className="flex flex-wrap gap-3">
            {RELATED.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  data-ocid={`delta.related_link.${item.to.replace(/\//g, "_")}`}
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
