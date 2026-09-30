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
    <section
      data-ocid="home.hero_section"
      aria-labelledby="home-hero-heading"
      className="relative isolate overflow-hidden bg-[#e9f7ff] text-slate-900"
    >
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.95),transparent_30%),linear-gradient(135deg,#ffffff_0%,#eefaff_42%,#cfefff_100%)]" />
      <img
        src={HERO_IMAGE}
        alt="Commercial aircraft flying through a bright blue sky"
        width={1600}
        height={1100}
        fetchPriority="high"
        loading="eager"
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[64%_center] sm:object-[60%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.91)_32%,rgba(255,255,255,0.48)_56%,rgba(255,255,255,0.04)_82%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(116,201,255,0.12)_100%)]" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-5 pb-10 pt-12 sm:px-8 sm:pb-14 sm:pt-16 lg:min-h-[560px] lg:grid-cols-[1fr_0.9fr] lg:gap-10 lg:px-10 lg:py-16">
        <div className="max-w-2xl min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/90 px-4 py-2 text-xs font-bold tracking-wide text-sky-900 shadow-sm backdrop-blur-sm">
            <span className="size-2 rounded-full bg-emerald-500" />
            Independent flight reservation assistance
          </div>

          <h1
            id="home-hero-heading"
            className="mt-5 max-w-2xl text-balance text-[2.75rem] font-bold leading-[1.02] tracking-[-0.05em] text-[#0b3155] sm:text-5xl lg:text-[4rem]"
          >
            Need a Flight?{" "}
            <span className="text-[#087fc1]">We’re Here to Help.</span>
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
            Need to book a flight or get help with an airline reservation? Call our travel specialists to review routes, dates, cabins, baggage, changes, cancellations, and booking details with you.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <CallCta
              size="lg"
              ocid="home.hero_call_button"
              className="w-full min-w-0 shadow-xl shadow-sky-900/15 sm:col-span-2"
            />
            <Link
              to="/flight-search"
              data-ocid="home.hero_flight_booking_link"
              className="inline-flex min-w-0 h-12 items-center justify-center gap-2 rounded-full bg-[#087fc1] px-6 text-base font-semibold text-white shadow-md transition-smooth hover:bg-[#066da6]"
            >
              Search flights <ArrowRight className="size-4 shrink-0" />
            </Link>
            <Link
              to="/contact"
              data-ocid="home.hero_trip_request_link"
              className="inline-flex min-w-0 h-12 items-center justify-center gap-2 rounded-full border border-sky-200 bg-white/90 px-6 text-base font-semibold text-[#17436b] shadow-sm backdrop-blur-sm transition-smooth hover:border-sky-300 hover:bg-white"
            >
              Request a callback <ArrowRight className="size-4 shrink-0" />
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-slate-700">
            {["Available 24/7", "Booking or reservation help", "Help with complex trips"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <Check className="size-4 text-emerald-600" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="hidden lg:block" aria-hidden="true" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 pb-7 sm:px-8 lg:px-10">
        <div className="grid overflow-hidden rounded-2xl border border-white/80 bg-white/95 shadow-[0_18px_55px_-28px_rgba(20,74,120,0.45)] backdrop-blur-md sm:grid-cols-3">
          {HERO_POINTS.map((point, index) => (
            <div
              key={point.label}
              className={`flex items-start gap-3 p-4 sm:p-5 ${index < HERO_POINTS.length - 1 ? "border-b border-sky-100 sm:border-b-0 sm:border-r" : ""}`}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-[#087fc1]">
                <point.icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">{point.label}</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">{point.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Book a flight", "/flight-booking"],
            ["Change a flight", "/flight-change-assistance"],
            ["Cancel a flight", "/flight-cancellation-assistance"],
            ["Airline reservation help", "/airline-reservation-assistance"],
          ].map(([label, to]) => (
            <Link
              key={to}
              to={to}
              className="group rounded-xl border border-sky-100 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-smooth hover:border-sky-300 hover:bg-white"
            >
              <span className="flex items-center justify-between gap-2">
                {label}
                <ArrowRight className="size-4 text-sky-600 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-4 text-xs leading-5 text-slate-600">{SITE.disclosure}</p>
      </div>
    </section>
  );
}
