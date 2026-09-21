import { Section, SectionHeading } from "@/components/Section";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  CalendarClock,
  Globe2,
  Plane,
  Route,
  Users,
} from "lucide-react";

const SERVICES = [
  {
    icon: Plane,
    title: "Flight booking assistance",
    description:
      "We search live availability across carriers and fare classes, then book the itinerary that fits your dates, budget, and baggage needs.",
  },
  {
    icon: Globe2,
    title: "International travel",
    description:
      "Long-haul routing, connections, entry timing, and layover planning handled by specialists who book international trips every day.",
  },
  {
    icon: Route,
    title: "Multi-city itineraries",
    description:
      "Three cities, two continents, one trip. We sequence segments so connections are realistic and the whole itinerary prices correctly.",
  },
  {
    icon: Briefcase,
    title: "Business & first class",
    description:
      "Premium cabin searches with clear fare rules, seat selection guidance, and honest comparisons between cabin options.",
  },
  {
    icon: Users,
    title: "Group travel",
    description:
      "Family reunions, sports teams, church groups, and corporate travel. We coordinate seats and names so everyone travels together.",
  },
  {
    icon: CalendarClock,
    title: "Changes & rebooking",
    description:
      "Plans change. We review your fare conditions, explain the real options, and rebook or restructure your trip when it is possible.",
  },
] as const;

const AIRLINE_LINKS = [
  {
    label: "Delta Airlines flight booking help",
    to: "/delta-airlines",
    ocid: "home.services_delta_link",
  },
  {
    label: "United Airlines flight booking help",
    to: "/united-airlines",
    ocid: "home.services_united_link",
  },
  {
    label: "American Airlines flight booking help",
    to: "/american-airlines",
    ocid: "home.services_american_link",
  },
] as const;

/**
 * The six core services, presented as a 3x2 editorial card grid on the muted
 * band so the section reads as a distinct zone from the hero. Closes with
 * descriptive internal links into the booking and airline pages.
 */
export function ServiceGrid() {
  return (
    <Section
      tone="muted"
      ocid="home.services_section"
      aria-labelledby="home-services-heading"
    >
      <SectionHeading
        id="home-services-heading"
        eyebrow="What we handle"
        title="Flight services built around real trips"
        description="Every request is handled by a specialist, not a search box. Here is what travelers call us for most."
      />

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service, index) => (
          <li
            key={service.title}
            data-ocid={`home.service_card.${index + 1}`}
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-subtle transition-smooth hover:-translate-y-0.5 hover:shadow-elevated"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-smooth group-hover:bg-accent group-hover:text-accent-foreground">
              <service.icon aria-hidden="true" className="size-5" />
            </span>
            <h3 className="mt-5 text-lg font-semibold leading-snug">
              {service.title}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              {service.description}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-subtle sm:p-8">
        <h3 className="text-lg font-semibold leading-snug">
          Looking for a specific airline?
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Read how we help with each carrier, or start with our{" "}
          <Link
            to="/flight-booking"
            data-ocid="home.services_flight_booking_link"
            className="font-medium text-primary underline underline-offset-4 transition-smooth hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            flight booking service overview
          </Link>
          .
        </p>
        <ul className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {AIRLINE_LINKS.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                data-ocid={link.ocid}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/25 bg-background px-5 text-sm font-medium text-primary transition-smooth hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {link.label}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
