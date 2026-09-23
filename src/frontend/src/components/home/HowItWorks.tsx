import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const STEPS = [
  ["01", "Tell us about your trip", "Share your route, dates, travelers, cabin preferences, and anything that matters to you."],
  ["02", "We compare the options", "A specialist helps you understand practical routing, fare details, baggage, and available choices."],
  ["03", "You choose what works", "You stay in control. We explain the details before any booking or payment is authorized."],
  ["04", "We help after booking", "Questions, seats, changes, or rebooking needs can be discussed with the team afterward."],
] as const;

export function HowItWorks() {
  return (
    <Section tone="muted" ocid="home.how_it_works_section" aria-labelledby="home-how-it-works-heading">
      <SectionHeading
        id="home-how-it-works-heading"
        eyebrow="Simple process"
        title="From trip idea to itinerary"
        description="A straightforward experience designed to make flight planning feel easier."
      />
      <ol className="mt-10 grid gap-4 lg:grid-cols-4">
        {STEPS.map(([number, title, description], index) => (
          <li
            key={number}
            data-ocid={`home.step.${index + 1}`}
            className="group relative rounded-[1.5rem] border border-border bg-card p-6 shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-elevated"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground font-display text-sm font-bold shadow-subtle">{number}</span>
              <CheckCircle2 className="size-5 text-emerald-500 opacity-60 transition-smooth group-hover:opacity-100" aria-hidden="true" />
            </div>
            <h3 className="mt-6 text-lg font-semibold">{title}</h3>
            <p className="mt-2.5 text-sm leading-6 text-muted-foreground">{description}</p>
          </li>
        ))}
      </ol>
      <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-primary/10 bg-card shadow-elevated">
        <div className="flex flex-col gap-5 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="label-board text-accent">Ready when you are</p>
            <p className="mt-2 font-display text-2xl font-semibold">Get help from a real travel specialist.</p>
            <p className="mt-2 text-sm text-muted-foreground">Prefer not to call? Send your trip details online and request a callback.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <CallCta size="lg" ocid="home.how_it_works_call_button" />
            <Link to="/contact" data-ocid="home.how_it_works_trip_request_link" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-primary/20 px-5 text-sm font-semibold text-primary hover:bg-muted">
              Request a callback <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}