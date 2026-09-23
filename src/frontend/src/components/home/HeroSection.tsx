import { CallCta } from "@/components/CallCta";
import { SITE } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Globe2, Headset, Route } from "lucide-react";

const HERO_IMAGE = "/assets/generated/hero-flight.dim_1600x1100.jpg";

const HERO_POINTS = [
  { icon: Globe2, label: "Domestic & international", detail: "Simple or complex itineraries" },
  { icon: Route, label: "Multi-city & group trips", detail: "Built around your plans" },
  { icon: Headset, label: "Real specialists 24/7", detail: "Human help when you need it" },
] as const;

export function HeroSection() {
  return (
    <section
      data-ocid="home.hero_section"
      aria-labelledby="home-hero-heading"
      className="relative overflow-hidden bg-gradient-to-br from-[#071a35] via-[#0d2b52] to-[#174b73] text-white"
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-accent blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-sky-300 blur-3xl" />
      </div>
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:px-10 lg:py-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold tracking-wide text-white/90 backdrop-blur">
            <span className="size-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.7)]" />
            Independent flight reservation assistance
          </div>
          <h1 id="home-hero-heading" className="mt-6 text-balance text-4xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-[4.35rem]">
            Your next flight,{" "}
            <span className="text-sky-200">handled with care.</span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-base leading-8 text-white/75 sm:text-lg">
            Tell us where you are going, when you want to travel, and what matters
            most. A real travel specialist can help compare routes, cabins,
            baggage needs, and booking details for domestic and international trips.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CallCta size="lg" ocid="home.hero_call_button" className="shadow-[0_14px_30px_-12px_rgba(0,0,0,0.55)]" />
            <Link
              to="/contact"
              data-ocid="home.hero_trip_request_link"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 text-base font-semibold text-white backdrop-blur transition-smooth hover:bg-white hover:text-primary"
            >
              Request a callback
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm text-white/65">
            {["24/7 availability", "Domestic & international", "Passenger-first guidance"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <Check className="size-4 text-emerald-300" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
          <dl className="mt-10 grid gap-3 sm:grid-cols-3">
            {HERO_POINTS.map((point) => (
              <div key={point.label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur transition-smooth hover:bg-white/15">
                <point.icon className="size-5 text-sky-200" aria-hidden="true" />
                <dt className="mt-3 text-sm font-semibold text-white">{point.label}</dt>
                <dd className="mt-1 text-xs leading-5 text-white/60">{point.detail}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-xs leading-5 text-white/55">
            {SITE.disclosure}
          </p>
        </div>

        <div className="relative lg:py-4">
          <div className="absolute -inset-3 rounded-[2rem] bg-white/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-2 shadow-premium">
            <img
              src={HERO_IMAGE}
              alt="Passenger aircraft above clouds at golden hour"
              width={1600}
              height={1100}
              loading="eager"
              decoding="async"
              className="aspect-[4/3] w-full rounded-[1.5rem] object-cover transition-transform duration-700 hover:scale-[1.02]"
            />
            <div className="absolute bottom-6 left-6 right-6 glass-card rounded-2xl border border-white/20 p-4 text-foreground shadow-elevated">
              <p className="label-board text-accent">Travel support, made personal</p>
              <p className="mt-1 text-sm font-semibold">
                Clear options. Straight answers. A specialist who listens.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative mx-auto max-w-7xl px-5 pb-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-black/10 text-center sm:grid-cols-4">
          {[
            ["24/7", "Specialist availability"],
            ["Domestic", "Flight assistance"],
            ["International", "Travel support"],
            ["Human", "Real-person guidance"],
          ].map(([value, label]) => (
            <div key={value} className="border-white/10 px-3 py-4 not-last:border-r">
              <p className="font-display text-lg font-bold text-white">{value}</p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-white/50">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}