import { Seo } from "@/components/Seo";
import { CallCta } from "@/components/CallCta";
import { HeroSection } from "@/components/home/HeroSection";
import { lazy, Suspense, useEffect, useRef, useState } from "react";

const FlightSearchPage = lazy(() => import("@/pages/FlightSearchPage").then((module) => ({ default: module.FlightSearchPage })));
const HomeFaq = lazy(() => import("@/components/home/HomeFaq").then((module) => ({ default: module.HomeFaq })));
const HowItWorks = lazy(() => import("@/components/home/HowItWorks").then((module) => ({ default: module.HowItWorks })));
const PreCallChecklist = lazy(() => import("@/components/home/PreCallChecklist").then((module) => ({ default: module.PreCallChecklist })));
const ServiceGrid = lazy(() => import("@/components/home/ServiceGrid").then((module) => ({ default: module.ServiceGrid })));
const DisclosureBlock = lazy(() => import("@/components/home/DisclosureBlock").then((module) => ({ default: module.DisclosureBlock })));
const ContactInfoBlock = lazy(() => import("@/components/home/ContactInfoBlock").then((module) => ({ default: module.ContactInfoBlock })));
import { homeFaqSchema } from "@/components/home/HomeFaq.data";
import { breadcrumbSchema, organizationSchema, serviceSchema, websiteSchema } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

const HOME_TITLE = "Book Flights by Phone | 24/7 Flight Reservation Assistance | TicketDepart";
const HOME_DESCRIPTION = "Book domestic or international flights by phone with TicketDepart. Discuss routes, dates, cabins, baggage, and fare rules with a travel specialist 24/7.";

const HOME_IMAGE = absoluteUrl("/assets/generated/hero-flight.dim_1600x1100.jpg");

function DeferredFlightSearch() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="min-h-[420px]" aria-label="Flight search">
      {shouldLoad ? (
        <Suspense fallback={<div className="mx-auto max-w-6xl px-5 py-12 text-sm text-muted-foreground">Loading flight search…</div>}>
          <FlightSearchPage embedded />
        </Suspense>
      ) : null}
    </div>
  );
}

export function HomePage() {
  return (
    <>
      <Seo title={HOME_TITLE} description={HOME_DESCRIPTION} path="/" image={HOME_IMAGE} structuredData={[organizationSchema(), websiteSchema(), breadcrumbSchema([{ name: "Home", path: "/" }]), homeFaqSchema(), serviceSchema({ name: "Flight reservation assistance by phone", description: HOME_DESCRIPTION, path: "/" })]} />
      <HeroSection />

      <section data-cro-version="265" className="border-b border-border bg-background px-5 py-6 sm:px-8 sm:py-8" aria-labelledby="home-start-heading">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="label-board text-accent">Choose your next step</p>
              <h2 id="home-start-heading" className="mt-1 text-xl font-semibold sm:text-2xl">Ready to plan the trip?</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">Call for a person, request a callback, or explore flight options first.</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[620px]">
              <CallCta size="md" ocid="home.quick_call_button" ctaLocation="home_quick" className="w-full" />
              <Link to="/contact" data-ocid="home.quick_callback_link" className="inline-flex h-11 items-center justify-center rounded-full border border-primary/20 bg-card px-5 text-sm font-semibold text-primary transition-smooth hover:bg-primary hover:text-primary-foreground">Request a callback</Link>
              <Link to="/flight-booking" data-ocid="home.quick_booking_link" className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-semibold text-foreground transition-smooth hover:border-primary/30 hover:text-primary">See booking help</Link>
            </div>
          </div>
        </div>
      </section>

      <DeferredFlightSearch />

      <section className="relative overflow-hidden border-b border-border bg-card px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div><p className="label-board text-accent">Start with a conversation</p><h2 className="mt-2 max-w-3xl text-balance text-2xl font-semibold sm:text-3xl">Tell us what you need. We’ll help you make sense of the options.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">Discuss your route, dates, cabin, baggage, and fare rules before you decide.</p></div>
          <Link to="/book-a-flight-by-phone" className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-subtle hover:bg-primary/90">Explore phone booking <span aria-hidden="true" className="ml-2">→</span></Link>
        </div>
      </section>

      <section className="border-b border-border bg-background px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <p className="label-board text-accent">Where we serve</p>
          <h2 className="mt-3 max-w-4xl text-balance text-3xl font-semibold sm:text-4xl">Flight assistance for travelers across the USA, Canada, Mexico & UK.</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">English-speaking travelers can get help with domestic, international, last-minute, multi-city, family, group, and premium-cabin itineraries. TicketDepart is an independent travel agency, not an airline or an airline’s official customer-service department.</p>
          <div className="mt-7 flex flex-wrap gap-2">{["USA","Canada","Mexico","UK"].map(m=><span key={m} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold shadow-subtle">{m}</span>)}</div>
        </div>
      </section>

      <section className="border-b border-border bg-card px-5 py-10 sm:px-8 sm:py-12" aria-labelledby="call-reasons-heading">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="label-board text-accent">Why travelers call</p>
              <h2 id="call-reasons-heading" className="mt-2 max-w-3xl text-balance text-2xl font-semibold sm:text-3xl">Get a person involved when the itinerary needs more than a search box.</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  ["Compare routes", "Talk through nonstop, connecting, and alternate-airport options."],
                  ["Ask before booking", "Clarify baggage, cabin, fare rules, and change questions."],
                  ["Handle complex trips", "Get help with multi-city, group, international, or urgent travel."],
                ].map(([title, description]) => (
                  <div key={title} className="rounded-2xl border border-border bg-background p-4">
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:pl-4">
              <CallCta size="lg" ocid="home.call_reasons_button" ctaLocation="home_call_reasons" className="w-full sm:w-auto" />
              <p className="mt-2 text-center text-xs text-muted-foreground lg:text-right">{SITE.hours}</p>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="min-h-24" aria-hidden="true" />}><ServiceGrid /></Suspense>

      <section className="border-b border-border bg-background px-5 py-14 sm:px-8 sm:py-20" aria-labelledby="regional-flights-heading">
        <div className="mx-auto max-w-6xl">
          <p className="label-board text-accent">Popular international routes</p>
          <h2 id="regional-flights-heading" className="mt-3 max-w-3xl text-balance text-3xl font-semibold sm:text-4xl">Planning travel between the USA and another country?</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">Start with a focused guide for common international travel markets. Compare routing, airports, dates, cabins, baggage, and fare conditions before you book.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["USA to Canada flights", "/flights-usa-to-canada"],
              ["USA to UK flights", "/flights-usa-to-uk"],
              ["USA to Europe flights", "/flights-usa-to-europe"],
              ["USA to Mexico flights", "/flights-usa-to-mexico"],
            ].map(([label, to]) => (
              <Link key={to} to={to} className="group rounded-[1.5rem] border border-border bg-card px-5 py-6 text-sm font-semibold text-primary shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-elevated">
                {label}<span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Suspense fallback={<div className="min-h-24" aria-hidden="true" />}><HowItWorks /><PreCallChecklist /></Suspense>

      <section className="border-y border-border bg-[#f3f6f9] px-5 py-14 sm:px-8 sm:py-20" aria-labelledby="phone-booking-guide-heading">
        <div className="mx-auto max-w-6xl"><p className="label-board text-accent">Helpful guide</p><h2 id="phone-booking-guide-heading" className="mt-3 max-w-3xl text-balance text-3xl font-semibold sm:text-4xl">Know what to expect when booking by phone.</h2><p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">See what to prepare, which questions to ask about fares and changes, and how a phone booking typically moves from trip details to a confirmed ticket.</p><Link to="/how-to-book-a-flight-by-phone" className="mt-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-5 py-3 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground">Read the booking guide <ArrowRight className="size-4" /></Link></div>
      </section>

      <section className="border-b border-border bg-card px-5 py-14 sm:px-8 sm:py-20" aria-labelledby="airline-guides-heading">
        <div className="mx-auto max-w-6xl"><p className="label-board text-accent">Airline booking assistance</p><h2 id="airline-guides-heading" className="mt-3 max-w-3xl text-balance text-3xl font-semibold sm:text-4xl">Planning around a specific airline?</h2><p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">Explore practical booking guides for major airlines, including Delta, United, American, Southwest, JetBlue, Alaska, British Airways, Lufthansa, and Air Canada.</p><div className="mt-8 grid gap-3 sm:grid-cols-3">{[["Delta Airlines booking assistance","/delta-airlines"],["United Airlines booking assistance","/united-airlines"],["American Airlines booking assistance","/american-airlines"],["Southwest Airlines booking assistance","/southwest-airlines"],["JetBlue Airways booking assistance","/jetblue-airways"],["Alaska Airlines booking assistance","/alaska-airlines"],["British Airways booking assistance","/british-airways"],["Lufthansa booking assistance","/lufthansa"],["Air Canada booking assistance","/air-canada"],["SWISS booking assistance","/swiss-air"],["Qatar Airways booking assistance","/qatar-airways"],["Emirates booking assistance","/emirates"],["LOT Polish Airlines booking assistance","/lot-polish-airlines"],["Norse Atlantic Airways booking assistance","/norse-atlantic-airways"]].map(([label,to])=><Link key={to} to={to} className="group rounded-[1.25rem] border border-border bg-background px-5 py-5 text-sm font-semibold text-primary transition-smooth hover:-translate-y-0.5 hover:border-primary/25 hover:bg-card hover:shadow-subtle">{label}<span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span></Link>)}</div></div>
      </section>

      <section className="border-b border-border bg-background px-5 py-14 sm:px-8 sm:py-20" aria-labelledby="popular-booking-help-heading">
        <div className="mx-auto max-w-6xl"><p className="label-board text-accent">Popular booking help</p><h2 id="popular-booking-help-heading" className="mt-3 max-w-3xl text-balance text-3xl font-semibold sm:text-4xl">Support for the trips people plan most often.</h2><p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">Explore focused guides for urgent travel, premium cabins, family trips, affordable fare planning, and changes or cancellations.</p><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[["Cheap flight booking by phone","/cheap-flight-booking-by-phone"],["Business class flight booking","/business-class-flight-booking"],["Corporate flight booking","/corporate-flight-booking"],["Same-day flight booking","/same-day-flight-booking"],["Family flight booking","/family-flight-booking"],["Flight change assistance","/flight-change-assistance"],["Flight cancellation assistance","/flight-cancellation-assistance"]].map(([label,to])=><Link key={to} to={to} className="group rounded-[1.5rem] border border-border bg-card px-6 py-5 text-sm font-semibold text-primary shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-elevated">{label}<span className="ml-2 transition-transform group-hover:translate-x-1">→</span></Link>)}</div></div>
      </section>

      <Suspense fallback={<div className="min-h-24" aria-hidden="true" />}><HomeFaq /><DisclosureBlock /><ContactInfoBlock /></Suspense>
      <p className="sr-only">{SITE.name} — {SITE.tagline}. {SITE.hours}.</p>
    </>
  );
}
