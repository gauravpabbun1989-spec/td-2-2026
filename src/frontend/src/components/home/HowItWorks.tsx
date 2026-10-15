import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const STEPS = [
  ["01", "Tell us about your trip", "Share your route, dates, travelers, cabin preferences, and anything that matters."],
  ["02", "We compare the options", "Understand routing, fare details, baggage, and practical choices with a specialist."],
  ["03", "You choose what works", "You stay in control. Details are explained before booking or payment is authorized."],
  ["04", "We help after booking", "Questions, seats, changes, or rebooking needs can be discussed afterward."],
] as const;

export function HowItWorks() {
  return (
    <Section tone="muted" ocid="home.how_it_works_section" aria-labelledby="home-how-it-works-heading">
      <SectionHeading id="home-how-it-works-heading" eyebrow="A simple experience" title="From trip idea to itinerary, one clear step at a time." description="A straightforward process designed to make flight planning feel calmer and easier." />
      <ol className="mt-12 grid gap-5 lg:grid-cols-4">
        {STEPS.map(([number, title, description], index) => (
          <li key={number} data-ocid={`home.step.${index + 1}`} className="relative rounded-[1.75rem] border border-border bg-card p-7 shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-elevated">
            <div className="flex items-center justify-between"><span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground font-display text-sm font-bold">{number}</span><CheckCircle2 className="size-5 text-emerald-500" /></div>
            <h3 className="mt-6 text-lg font-semibold">{title}</h3>
            <p className="mt-2.5 text-sm leading-6 text-muted-foreground">{description}</p>
          </li>
        ))}
      </ol>
      <div className="relative mt-12 overflow-hidden rounded-[2rem] bg-white p-7 shadow-premium ring-1 ring-black/5 sm:p-9">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div><p className="label-board text-accent">Ready when you are</p><p className="mt-2 font-display text-2xl font-semibold">Get help from a real travel specialist.</p><p className="mt-2 text-sm text-muted-foreground">Prefer not to call? Send your trip details online and request a callback.</p></div>
          <div className="flex flex-col gap-2 sm:flex-row"><CallCta size="lg" ocid="home.how_it_works_call_button" /><Link to="/contact/" data-ocid="home.how_it_works_trip_request_link" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-primary/20 px-5 text-sm font-semibold text-primary hover:bg-muted">Request a callback <ArrowRight className="size-4" /></Link></div>
        </div>
      </div>
    </Section>
  );
}
