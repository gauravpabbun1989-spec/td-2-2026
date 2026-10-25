import { Section, SectionHeading } from "@/components/Section";
import { AIRLINE_ITEMS } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, CalendarClock, Globe2, Plane, Route } from "lucide-react";

const SERVICES = [
  { icon: Plane, title: "Affordable flight booking by phone", href: "/cheap-flight-booking-by-phone/", description: "Compare economy fares, nearby dates, baggage allowances, and the full trip cost before booking." },
  { icon: Globe2, title: "International flight booking", href: "/international-flight-booking/", description: "Review routes, connections, baggage, and fare rules for domestic and international trips." },
  { icon: CalendarClock, title: "Last-minute flights", href: "/last-minute-flight-booking/", description: "Check available dates, departure times, connection windows, and ticketing details for urgent trips." },
  { icon: Plane, title: "Same-day flight booking", href: "/same-day-flight-booking/", description: "Review departure timing, airport access, connection risks, and current ticketing availability." },
  { icon: Route, title: "Multi-city itineraries", href: "/multi-city-flight-booking/", description: "Compare the complete itinerary, connection details, and fare conditions across multiple stops." },
  { icon: CalendarClock, title: "Changes & rebooking", href: "/flight-change-assistance/", description: "Understand available options and ticket rules when your travel plans change." },
] as const;

export function ServiceGrid() {
  return (
    <Section tone="paper" ocid="home.services_section" aria-labelledby="home-services-heading">
      <SectionHeading id="home-services-heading" eyebrow="Travel support" title="Practical help for your next flight." description="Explore economy-focused booking help, international routes, urgent trips, and ticket changes with clear information about itinerary details and fare rules." />
      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service, index) => (
          <li key={service.title} data-ocid={`home.service_card.${index + 1}`} className="group relative overflow-hidden rounded-[1.75rem] border border-border/80 bg-card p-7 shadow-subtle transition-smooth hover:-translate-y-1.5 hover:border-primary/20 hover:shadow-premium">
            <div className="absolute -right-8 -top-8 size-28 rounded-full bg-accent/10 blur-2xl transition-smooth group-hover:bg-accent/20" />
            <div className="relative">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-subtle transition-smooth group-hover:bg-accent group-hover:text-accent-foreground">
                <service.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-xl font-semibold leading-snug">{service.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{service.description}</p>
              <Link to={service.href} className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:text-accent">
                Explore assistance <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </li>
        ))}
      </ul>
      <div className="relative mt-12 overflow-hidden rounded-[2rem] bg-[#071a35] p-7 text-white shadow-premium sm:p-10">
        <div className="absolute -right-24 -top-24 size-72 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div><p className="label-board text-accent">Airline guides</p><h3 className="mt-2 text-2xl font-semibold">Planning around a specific airline?</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">Explore practical booking guidance for major carriers or start with the flight booking overview.</p></div>
          <div className="flex flex-wrap gap-2.5">
            {AIRLINE_ITEMS.map((item) => (
              <Link key={item.to} to={item.to} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 text-sm font-semibold text-white hover:bg-white hover:text-primary">
                {item.label}<ArrowUpRight className="size-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
