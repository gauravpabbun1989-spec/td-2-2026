import { CallCta } from "@/components/CallCta";
import { SITE } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronRight, Globe2, Headset, Route, Search } from "lucide-react";
import { Link } from "@tanstack/react-router";

const HERO_IMAGE = "/assets/generated/hero-flight.dim_1600x1100.jpg";

const HERO_POINTS = [
  { icon: Globe2, label: "Domestic & international", detail: "Simple or complex itineraries" },
  { icon: Route, label: "Multi-city & group trips", detail: "Built around your plans" },
  { icon: Headset, label: "Real specialists 24/7", detail: "Human help when you need it" },
] as const;

export function HeroSection() {
  return (
    <section data-ocid="home.hero_section" aria-labelledby="home-hero-heading" className="relative overflow-hidden bg-[#061a34] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(61,157,207,0.25),transparent_32%),radial-gradient(circle_at_10%_85%,rgba(234,166,76,0.12),transparent_28%)]" />
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:px-10 lg:py-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-xs font-semibold tracking-wide text-white/85 backdrop-blur">
            <span className="size-2 rounded-full bg-emerald-300" />
            Independent flight reservation assistance
          </div>
          <h1 id="home-hero-heading" className="mt-6 max-w-2xl text-balance text-[2.75rem] font-bold leading-[0.98] tracking-[-0.045em] sm:text-5xl lg:text-[4.65rem]">Flight Reservation Assistance — <span className="text-sky-200">Human Help 24/7</span>
            Travel plans deserve{" "}
            <span className="text-sky-200">human attention.</span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-base leading-8 text-white/72 sm:text-lg">
            Tell us where you want to go and what matters most. A real travel specialist can help you understand routes, cabins, baggage, and booking details before you decide.
          </p>
          <div className="mt-8 rounded-3xl border border-white/15 bg-white/[0.08] p-4 backdrop-blur-xl sm:p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Search className="size-4 text-sky-200" />
              Search airports & routes
            </div>
            <p className="mt-1 text-xs leading-5 text-white/60">Free route reference data. No fares are shown.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white/55">From — city or airport</div>
              <div className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white/55">To — city or airport</div>
            </div>
            <Link to="/flight-search" className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-primary hover:bg-white/90">
              Search flights <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CallCta size="lg" ocid="home.hero_call_button" className="shadow-[0_18px_40px_-18px_rgba(0,0,0,0.75)]" />
            <Link to="/contact" data-ocid="home.hero_trip_request_link" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-6 text-base font-semibold text-white backdrop-blur transition-smooth hover:bg-white hover:text-primary">
              Request a callback <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm text-white/65">
            {["24/7 availability", "Passenger-first guidance", "Clear booking details"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2"><Check className="size-4 text-emerald-300" />{item}</span>
            ))}
          </div>
        </div>

        <div className="relative lg:pl-4">
          <div className="absolute -inset-8 rounded-[3rem] bg-sky-400/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-2 shadow-[0_35px_90px_-35px_rgba(0,0,0,0.8)]">
            <img src={HERO_IMAGE} alt="Passenger aircraft above clouds at golden hour" width={1600} height={1100} loading="eager" decoding="async" className="aspect-[5/4] w-full rounded-[1.5rem] object-cover" />
            <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/20 bg-[#071a35]/80 p-5 shadow-elevated backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="label-board text-accent">A calmer way to book</p>
                  <p className="mt-2 text-lg font-semibold text-white">Clear options. Straight answers. A specialist who listens.</p>
                </div>
                <span className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-white/10 sm:flex"><ChevronRight className="size-5 text-sky-200" /></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-8 sm:px-8 lg:px-10">
        <div className="grid overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.06] backdrop-blur sm:grid-cols-3">
          {HERO_POINTS.map((point) => (
            <div key={point.label} className="group border-b border-white/10 p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
              <point.icon className="size-5 text-sky-200 transition-transform group-hover:scale-110" />
              <p className="mt-3 text-sm font-semibold text-white">{point.label}</p>
              <p className="mt-1 text-xs leading-5 text-white/55">{point.detail}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 max-w-4xl text-xs leading-5 text-white/45">{SITE.disclosure}</p>
      </div>
    </section>
  );
}
