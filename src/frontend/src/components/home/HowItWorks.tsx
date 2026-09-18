import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { Link } from "@tanstack/react-router";

const STEPS = [
  {
    title: "You call and tell us the trip",
    description:
      "A specialist answers, asks where you are flying from and to, your dates, how many travelers, and any flexibility you have. No forms, no hold music.",
  },
  {
    title: "We search and compare options",
    description:
      "We look across carriers and fare classes, then walk you through the realistic choices — including what each fare includes and what it does not.",
  },
  {
    title: "You choose, we book",
    description:
      "Once you pick an option, we confirm the details with you, complete the booking, and send your confirmation and itinerary.",
  },
  {
    title: "We stay available after booking",
    description:
      "Seat questions, schedule changes, or a rebooking later on — call back and the same team picks up where you left off.",
  },
] as const;

/**
 * Step-by-step explanation of what actually happens when a traveler calls,
 * so first-time callers know exactly what to expect.
 */
export function HowItWorks() {
  return (
    <Section
      tone="paper"
      ocid="home.how_it_works_section"
      aria-labelledby="home-how-it-works-heading"
    >
      <SectionHeading
        id="home-how-it-works-heading"
        eyebrow="How it works"
        title="What happens when you call"
        description="Four straightforward steps, from your first ring to a confirmed itinerary."
      />

      <ol className="mt-12 grid gap-6 lg:grid-cols-4">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            data-ocid={`home.step.${index + 1}`}
            className="relative flex flex-col border-t-2 border-primary/15 pt-6"
          >
            <span className="label-board text-accent">
              Step {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-lg font-semibold leading-snug">
              {step.title}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-subtle sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg font-semibold">
            Ready to start? The line is open.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Prefer to write?{" "}
            <Link
              to="/contact"
              data-ocid="home.how_it_works_trip_request_link"
              className="font-medium text-primary underline underline-offset-4 transition-smooth hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Send a trip request
            </Link>{" "}
            and we will follow up.
          </p>
        </div>
        <CallCta size="lg" ocid="home.how_it_works_call_button" />
      </div>
    </Section>
  );
}
