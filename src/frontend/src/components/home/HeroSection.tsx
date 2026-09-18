import { CallCta } from "@/components/CallCta";
import { SITE } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Globe2, Headset, Route } from "lucide-react";

const HERO_IMAGE = "/assets/generated/hero-flight.dim_1600x1100.jpg";

const HERO_POINTS = [
  {
    icon: Globe2,
    label: "International & domestic",
    detail: "One team for every route",
  },
  {
    icon: Route,
    label: "Multi-city itineraries",
    detail: "Complex trips, planned properly",
  },
  {
    icon: Headset,
    label: "24/7 travel specialists",
    detail: "A real person, any hour",
  },
] as const;

/**
 * Above-the-fold hero. States the core service in plain language, leads with
 * the click-to-call conversion control, and offers the on-site trip-request
 * form as a secondary path for travelers who cannot call right now.
 */
export function HeroSection() {
  return (
    <section
      data-ocid="home.hero_section"
      aria-labelledby="home-hero-heading"
      className="relative overflow-hidden border-b border-border bg-gradient-subtle"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
        <div className="max-w-xl">
          <p className="label-board text-accent">
            Independent U.S. travel agency
          </p>

          <h1
            id="home-hero-heading"
            className="mt-4 text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Flight booking help from a real travel specialist
          </h1>

          <p className="mt-6 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            TicketDepart plans and books international and domestic flights,
            multi-city itineraries, and group travel — with a specialist on the
            phone around the clock. Tell us where you need to go and we will
            handle the routing, the fare rules, and the details.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CallCta size="lg" ocid="home.hero_call_button" />
            <Link
              to="/contact"
              data-ocid="home.hero_trip_request_link"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-card px-6 text-base font-medium text-primary transition-smooth hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Send a trip request
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <Clock aria-hidden="true" className="size-4 text-accent" />
            <span>{SITE.hours}</span>
            <span aria-hidden="true" className="text-border">
              ·
            </span>
            <span className="font-mono text-xs tracking-wide">
              {SITE.phoneDisplay}
            </span>
          </p>

          <dl className="mt-10 grid gap-5 border-t border-border pt-8 sm:grid-cols-3">
            {HERO_POINTS.map((point) => (
              <div key={point.label} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <point.icon aria-hidden="true" className="size-5" />
                </span>
                <div className="min-w-0">
                  <dt className="text-sm font-semibold leading-snug text-foreground">
                    {point.label}
                  </dt>
                  <dd className="mt-0.5 text-xs leading-snug text-muted-foreground">
                    {point.detail}
                  </dd>
                </div>
              </div>
            ))}
          </dl>

          <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
            Not ready to call?{" "}
            <Link
              to="/flight-booking"
              data-ocid="home.hero_flight_booking_link"
              className="font-medium text-primary underline underline-offset-4 transition-smooth hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              See how our flight booking service works
            </Link>
            .
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
            <img
              src={HERO_IMAGE}
              alt="A commercial passenger jet climbing above a layer of clouds into a golden evening sky"
              width={1600}
              height={1100}
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="absolute -bottom-5 left-4 right-4 rounded-xl border border-border bg-card/95 p-4 shadow-elevated backdrop-blur sm:left-6 sm:right-auto sm:max-w-xs">
            <p className="label-board text-accent">On the line now</p>
            <p className="mt-1.5 text-sm leading-snug text-foreground">
              Specialists answer calls 24 hours a day, every day of the year.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
