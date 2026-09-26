import { CallCta } from "@/components/CallCta";
import { SITE } from "@/lib/site";
import { ArrowRight, Check, Globe2, Headset, Route } from "lucide-react";
import { Link } from "@tanstack/react-router";

const HERO_IMAGE = "/assets/generated/hero-flight.dim_1600x1100.jpg";

const HERO_POINTS = [
  { icon: Globe2, label: "Domestic & international", detail: "Simple or complex itineraries" },
  { icon: Route, label: "Multi-city & group trips", detail: "Built around your plans" },
  { icon: Headset, label: "Real specialists 24/7", detail: "Human help when you need it" },
] as const;

export function HeroSection() {
  return (
    <section data-ocid="home.hero_section" aria-labelledby="home-hero-heading" className="relative isolate overflow-hidden bg-[#eef8ff] text-slate-900">
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-white via-sky-50 to-[#dcefff]" />
      <img
        src={HERO_IMAGE}
        alt="Commercial aircraft in a bright open sky"
        width={1600}
        height={1100}
        fetchPriority="high"
        loading="eager"
        decoding="async"
        className="absolute inset-y-0 right-0 -z-10 h-full w-full object-cover object-center sm:object-[58%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(248,252,255,0.98)_0%,rgba(248,252,255,0.94)_34%,rgba(248,252,255,0.62)_57%,rgba(248,252,255,0.08)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/10 via-transparent to-sky-100/35" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-5 pb-10 pt-12 sm:px-8 sm:pb-12 sm:pt-16 lg:min-h-[510px] lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:px-10 lg:py-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/85 px-4 py-2 text-xs font-semibold tracking-wide text-sky-900 shadow-sm">
            <span className="size-2 rounded-full bg-emerald-500" />
            Independent flight reservation assistance
          </div>
          <h1 id="home-hero-heading" className="mt-5 max-w-xl text-balance text-[2.65rem] font-bold leading-[1.03] tracking-[-0.045em] text-[#102b4e] sm:text-5xl lg:text-[3.75rem]">
            Need a Flight? <span className="text-[#1676b8]">We’re Here to Help.</span>
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
            Tell us where you want to go. Our reservation specialists can help you review routes, dates, cabins, baggage, and booking details before you decide.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <CallCta size="lg" ocid="home.hero_call_button" className="shadow-lg shadow-sky-900/10" />
            <Link to="/contact" data-ocid="home.hero_trip_request_link" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-sky-200 bg-white/90 px-6 text-base font-semibold text-[#17436b] shadow-sm transition-smooth hover:border-sky-300 hover:bg-white">
              Request a callback <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium text-slate-700">
            {["Available 24/7", "Clear booking details", "Help with complex trips"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2"><Check className="size-4 text-emerald-600" />{item}</span>
            ))}
          </div>
        </div>

        <div className="hidden lg:block" aria-hidden="true" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 pb-7 sm:px-8 lg:px-10">
        <div className="grid overflow-hidden rounded-2xl border border-sky-100 bg-white/95 shadow-[0_12px_40px_-24px_rgba(20,74,120,0.3)] sm:grid-cols-3">
          {HERO_POINTS.map((point, index) => (
            <div key={point.label} className={`flex items-start gap-3 p-4 sm:p-5 ${index < HERO_POINTS.length - 1 ? "border-b border-sky-100 sm:border-b-0 sm:border-r" : ""}`}>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-[#1676b8]">
                <point.icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">{point.label}</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">{point.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-5 text-slate-600">{SITE.disclosure}</p>
      </div>
    </section>
  );
}
