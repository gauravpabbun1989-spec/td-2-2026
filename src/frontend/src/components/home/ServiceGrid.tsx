import { Section, SectionHeading } from "@/components/Section";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight, BriefcaseBusiness, CalendarClock, Globe2, Plane, Route, Users,
} from "lucide-react";

const SERVICES = [
  { icon: Plane, title: "Flight booking assistance", description: "Compare routes, schedules, cabins, baggage needs, and fare details with a travel specialist before you decide." },
  { icon: Globe2, title: "International travel", description: "Get help thinking through long-haul routes, connections, layovers, and practical booking details." },
  { icon: Route, title: "Multi-city itineraries", description: "Coordinate multiple destinations into one organized itinerary with realistic connections." },
  { icon: BriefcaseBusiness, title: "Business & first class", description: "Explore premium-cabin options with clear information about seats, baggage, and fare conditions." },
  { icon: Users, title: "Group travel", description: "Planning for family, friends, teams, or colleagues? We can help organize the trip details." },
  { icon: CalendarClock, title: "Changes & rebooking", description: "Review available options when your plans change and understand the applicable fare conditions." },
] as const;

const AIRLINE_LINKS = [
  ["Delta Airlines flight booking help", "/delta-airlines", "home.services_delta_link"],
  ["United Airlines flight booking help", "/united-airlines", "home.services_united_link"],
  ["American Airlines flight booking help", "/american-airlines", "home.services_american_link"],
] as const;

export function ServiceGrid() {
  return (
    <Section tone="paper" ocid="home.services_section" aria-labelledby="home-services-heading">
      <SectionHeading
        id="home-services-heading"
        eyebrow="Travel support"
        title="A better way to plan the details"
        description="From a simple one-way trip to a complicated multi-city itinerary, get clear human guidance without having to figure everything out alone."
      />
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service, index) => (
          <li
            key={service.title}
            data-ocid={`home.service_card.${index + 1}`}
            className="group relative overflow-hidden rounded-[1.5rem] border border-border bg-card p-7 shadow-subtle transition-smooth hover:-translate-y-1 hover:border-primary/20 hover:shadow-premium"
          >
            <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-accent/5 blur-2xl transition-smooth group-hover:bg-accent/10" />
            <div className="relative">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-subtle transition-smooth group-hover:scale-105 group-hover:bg-accent group-hover:text-accent-foreground">
                <service.icon aria-hidden="true" className="size-5" />
              </span>
              <h3 className="mt-6 text-xl font-semibold leading-snug">{service.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{service.description}</p>
              <Link
                to="/flight-booking"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-smooth group-hover:text-accent"
              >
                Explore assistance <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-10 overflow-hidden rounded-[1.75rem] bg-gradient-primary p-7 text-primary-foreground shadow-premium sm:p-9">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="label-board text-accent">Airline guides</p>
            <h3 className="mt-2 text-2xl font-semibold">Traveling with a specific airline?</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-primary-foreground/70">
              Explore practical booking guidance for major carriers or start with the flight booking overview.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {AIRLINE_LINKS.map(([label, to, ocid]) => (
              <Link
                key={to}
                to={to}
                data-ocid={ocid}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 text-sm font-medium text-white backdrop-blur transition-smooth hover:bg-white hover:text-primary"
              >
                {label.replace(" flight booking help", "")}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}