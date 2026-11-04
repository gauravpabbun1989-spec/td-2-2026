import { Section } from "@/components/Section";
import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

/**
 * Sets clear expectations for travelers without placing legal disclaimer copy
 * in the main booking journey.
 */
export function DisclosureBlock() {
  return (
    <Section
      tone="muted"
      ocid="home.disclosure_section"
      aria-labelledby="home-disclosure-heading"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-subtle sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <ShieldCheck aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="label-board text-accent">What you can expect</p>
            <h2
              id="home-disclosure-heading"
              className="mt-2 text-xl font-semibold leading-snug sm:text-2xl"
            >
              Clear flight options, with helpful human support
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Tell us where and when you want to fly. A TicketDepart specialist can help you compare available routes, travel dates, itinerary details, and fare conditions before you decide.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              We explain the details that matter, including applicable restrictions and fees, in plain language. You stay in control of the decision and can ask questions before moving forward with a booking.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Learn more about{" "}
              <Link
                to="/flight-booking/"
                data-ocid="home.disclosure_flight_booking_link"
                className="font-medium text-primary underline underline-offset-4 transition-smooth hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                how our flight booking service works
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
