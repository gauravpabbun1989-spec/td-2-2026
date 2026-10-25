import { Section } from "@/components/Section";
import { SITE } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import { Info } from "lucide-react";

/**
 * Customer-focused trust section. Legal relationship details live on the
 * dedicated disclaimer page, not in the main booking journey.
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
            <Info aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="label-board text-accent">Clear information, no pressure</p>
            <h2
              id="home-disclosure-heading"
              className="mt-2 text-xl font-semibold leading-snug sm:text-2xl"
            >
              Know your flight options before you decide
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {SITE.disclosure}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Flight prices, schedules, baggage allowances, and fare conditions
              can vary. Review the details and total price before authorizing a
              booking; a fare is confirmed only when ticketing is completed.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Learn more about{" "}
              <Link
                to="/flight-booking/"
                data-ocid="home.disclosure_flight_booking_link"
                className="font-medium text-primary underline underline-offset-4 transition-smooth hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                how our flight booking service works
              </Link>{" "}
              before you choose.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
