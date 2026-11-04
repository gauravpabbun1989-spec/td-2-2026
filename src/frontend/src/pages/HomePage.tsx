import { Seo } from "@/components/Seo";
import { CallCta } from "@/components/CallCta";
import { HeroSection } from "@/components/home/HeroSection";
import { lazy, Suspense, useEffect, useRef, useState } from "react";

const FlightSearchPage = lazy(() => import("@/pages/FlightSearchPage").then((module) => ({ default: module.FlightSearchPage })));
const FlightServiceIntentSection = lazy(() => import("@/components/FlightServiceIntentSection").then((module) => ({ default: module.FlightServiceIntentSection })));
const HomeFaq = lazy(() => import("@/components/home/HomeFaq").then((module) => ({ default: module.HomeFaq })));
const HowItWorks = lazy(() => import("@/components/home/HowItWorks").then((module) => ({ default: module.HowItWorks })));
const PreCallChecklist = lazy(() => import("@/components/home/PreCallChecklist").then((module) => ({ default: module.PreCallChecklist })));
const ServiceGrid = lazy(() => import("@/components/home/ServiceGrid").then((module) => ({ default: module.ServiceGrid })));
const ContactInfoBlock = lazy(() => import("@/components/home/ContactInfoBlock").then((module) => ({ default: module.ContactInfoBlock })));
import { breadcrumbSchema, organizationSchema, serviceSchema, websiteSchema } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

const HOME_TITLE = "Make Flight Booking Easy | 24/7 Booking Assistance";
const HOME_DESCRIPTION = "Call +1-833-225-0511 for 24/7 economy flight booking help. Discuss routes, flexible dates, changes, cancellations, and pet or infant travel.";

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
      { rootMargin: "0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={containerRef} aria-label="Flight search" className="min-h-[420px]">
      {shouldLoad ? (
        <Suspense fallback={<div className="mx-auto max-w-6xl px-5 py-12 text-sm text-muted-foreground">Loading flight search…</div>}>
          <FlightSearchPage embedded />
        </Suspense>
      ) : null}
    </section>
  );
}

type FlightGuideGroup = [string, [string, string][]];

const FLIGHT_GUIDE_GROUPS: FlightGuideGroup[] = [
              ["Booking help", [
                ["Flight booking", "/flight-booking/"], ["Flight search", "/flight-search/"], ["Book a flight by phone", "/book-a-flight-by-phone/"], ["How to book by phone", "/how-to-book-a-flight-by-phone/"],
                ["International flight booking", "/international-flight-booking/"], ["Last-minute flight booking", "/last-minute-flight-booking/"],
                ["Cheap flight booking by phone", "/cheap-flight-booking-by-phone/"],
                ["Family flight booking", "/family-flight-booking/"], ["Pet flight booking", "/pet-flight-booking/"],
                ["Flight change assistance", "/flight-change-assistance/"], ["Flight cancellation assistance", "/flight-cancellation-assistance/"], ["Airline reservation assistance", "/airline-reservation-assistance/"], 
              ]],
              ["Airlines", [
                ["Delta Airlines", "/delta-airlines/"], ["United Airlines", "/united-airlines/"], ["American Airlines", "/american-airlines/"], ["Southwest Airlines", "/southwest-airlines/"],
                ["JetBlue Airways", "/jetblue-airways/"], ["Alaska Airlines", "/alaska-airlines/"], ["British Airways", "/british-airways/"], ["Lufthansa", "/lufthansa/"],
                ["Air Canada", "/air-canada/"], ["SWISS", "/swiss-air/"], ["Qatar Airways", "/qatar-airways/"], ["Emirates", "/emirates/"],  ["Norse Atlantic Airways", "/norse-atlantic-airways/"],
              ]],
              ["U.S. markets and international routes", [
                ["USA to Canada", "/flights-usa-to-canada/"], ["USA to UK", "/flights-usa-to-uk/"], ["USA to Europe", "/flights-usa-to-europe/"], ["USA to Mexico", "/flights-usa-to-mexico/"],
                ["Flights from New York", "/flights-from-new-york/"], ["Flights from Los Angeles", "/flights-from-los-angeles/"], ["Flights from Chicago", "/flights-from-chicago/"], ["Flights from Miami", "/flights-from-miami/"],
                ["Flights from Atlanta", "/flights-from-atlanta/"], ["Flights from Dallas", "/flights-from-dallas/"], ["Flights from Orlando", "/flights-from-orlando/"], ["Flights from San Francisco", "/flights-from-san-francisco/"],
                ["New York to London", "/flights-new-york-to-london/"],   ["Los Angeles to Tokyo", "/flights-los-angeles-to-tokyo/"],
                ["Los Angeles to London", "/flights-los-angeles-to-london/"],
                ["New York to Paris", "/flights-new-york-to-paris/"], ["New York to Dubai", "/flights-new-york-to-dubai/"],
                ["Chicago to London", "/flights-chicago-to-london/"], ["Miami to Cancun", "/flights-miami-to-cancun/"],
                ["San Francisco to Tokyo", "/flights-san-francisco-to-tokyo/"],
              ]],
              ["Site and support", [
                ["Contact", "/contact/"], ["Privacy policy", "/privacy/"], ["Terms of service", "/terms/"],
              ]],
];

export function HomePage() {
  return (
    <>
      <Seo title={HOME_TITLE} description={HOME_DESCRIPTION} path="/" image={HOME_IMAGE} structuredData={[organizationSchema(), websiteSchema(), breadcrumbSchema([{ name: "Home", path: "/" }]), serviceSchema({ name: "Flight reservation assistance by phone", description: HOME_DESCRIPTION, path: "/" })]} />
      <HeroSection />

      <section data-cro-version="265" className="border-b border-border bg-background px-5 py-6 sm:px-8 sm:py-8" aria-labelledby="home-start-heading">
        <div className="mx-auto max-w-6xl">
          <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,620px)] lg:items-center">
            <div className="min-w-0">
              <p className="label-board text-accent">Choose your next step</p>
              <h2 id="home-start-heading" className="mt-1 text-xl font-semibold sm:text-2xl">Ready to book your flight?</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">Call now to discuss your route, dates, and flight questions with a travel specialist and take the next step toward booking.</p>
            </div>
            <div className="grid min-w-0 gap-2 sm:grid-cols-3">
              <CallCta size="md" ocid="home.quick_call_button" ctaLocation="home_quick" className="w-full min-w-0 px-3 sm:px-3" />
              <Link to="/contact/" data-ocid="home.quick_callback_link" className="inline-flex min-w-0 min-h-11 items-center justify-center rounded-full border border-primary/20 bg-card px-3 py-2 text-center text-sm font-semibold leading-tight text-primary transition-smooth hover:bg-primary hover:text-primary-foreground sm:px-3">Request a callback</Link>
              <Link to="/flight-booking/" data-ocid="home.quick_booking_link" className="inline-flex min-w-0 min-h-11 items-center justify-center rounded-full border border-border bg-card px-3 py-2 text-center text-sm font-semibold leading-tight text-foreground transition-smooth hover:border-primary/30 hover:text-primary sm:px-3">See booking help</Link>
            </div>
          </div>
        </div>
      </section>

      <DeferredFlightSearch />

      <div className="home-deferred-content">
      <section className="relative overflow-hidden border-b border-border bg-card px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div><p className="label-board text-accent">Start with a conversation</p><h2 className="mt-2 max-w-3xl text-balance text-2xl font-semibold sm:text-3xl">Call now and get help with your flight plans.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">Get help reviewing routes, travel dates, ticket conditions, and next steps. Call now to discuss your options.</p></div>
          <Link to="/book-a-flight-by-phone/" className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-subtle hover:bg-primary/90">Explore phone booking <span aria-hidden="true" className="ml-2">→</span></Link>
        </div>
      </section>

      <section className="border-b border-border bg-background px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <p className="label-board text-accent">Where we serve</p>
          <h2 className="mt-3 max-w-4xl text-balance text-3xl font-semibold sm:text-4xl">Flight assistance for travelers across the USA, Canada, Mexico & UK.</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">English-speaking travelers can get help exploring domestic, international, last-minute, and flexible flight options, with support for routes, dates, changes, cancellations, and fare conditions.</p>
          <div className="mt-7 flex flex-wrap gap-2">{["USA","Canada","Mexico","UK"].map(m=><span key={m} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold shadow-subtle">{m}</span>)}</div>
        </div>
      </section>

      <section className="border-b border-border bg-card px-5 py-10 sm:px-8 sm:py-12" aria-labelledby="call-reasons-heading">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="label-board text-accent">Why travelers call</p>
              <h2 id="call-reasons-heading" className="mt-2 max-w-3xl text-balance text-2xl font-semibold sm:text-3xl">Some trips are easy to book online. Others are easier when you can ask a person a question.</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  ["Compare economy routes", "Talk through nonstop, connecting, and alternate-airport options."],
                  ["Check the full fare", "Clarify ticket conditions, fare rules, and change or cancellation terms before paying."],
                  ["Plan urgent trips", "Discuss last-minute departures, same-day options, and practical connections."],
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
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">Start with a focused guide for common international travel markets. Compare routes, airports, dates, connection options, and fare conditions before you book.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["USA to Canada flights", "/flights-usa-to-canada/"],
              ["USA to UK flights", "/flights-usa-to-uk/"],
              ["USA to Europe flights", "/flights-usa-to-europe/"],
              ["USA to Mexico flights", "/flights-usa-to-mexico/"],
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
        <div className="mx-auto max-w-6xl"><p className="label-board text-accent">Helpful guide</p><h2 id="phone-booking-guide-heading" className="mt-3 max-w-3xl text-balance text-3xl font-semibold sm:text-4xl">Know what to expect when booking by phone.</h2><p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">See what to prepare, which questions to ask about fares and changes, and how a phone booking typically moves from trip details to a confirmed ticket.</p><Link to="/how-to-book-a-flight-by-phone/" className="mt-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-5 py-3 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground">Read the booking guide <ArrowRight className="size-4" /></Link></div>
      </section>

      <Suspense fallback={<div className="min-h-24" aria-hidden="true" />}><FlightServiceIntentSection /></Suspense>
      <section className="border-b border-border bg-card px-5 py-14 sm:px-8 sm:py-20" aria-labelledby="airline-guides-heading">
        <div className="mx-auto max-w-6xl"><p className="label-board text-accent">Airline booking assistance</p><h2 id="airline-guides-heading" className="mt-3 max-w-3xl text-balance text-3xl font-semibold sm:text-4xl">Planning around a specific airline?</h2><p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">Explore practical booking guides for major airlines, including Delta, United, American, Southwest, JetBlue, Alaska, British Airways, Lufthansa, and Air Canada.</p><div className="mt-8 grid gap-3 sm:grid-cols-3">{[["Delta Airlines booking assistance","/delta-airlines/"],["United Airlines booking assistance","/united-airlines/"],["American Airlines booking assistance","/american-airlines/"],["Southwest Airlines booking assistance","/southwest-airlines/"],["JetBlue Airways booking assistance","/jetblue-airways/"],["Alaska Airlines booking assistance","/alaska-airlines/"],["British Airways booking assistance","/british-airways/"],["Lufthansa booking assistance","/lufthansa/"],["Air Canada booking assistance","/air-canada/"],["SWISS booking assistance","/swiss-air/"],["Qatar Airways booking assistance","/qatar-airways/"],["Emirates booking assistance","/emirates/"],["Norse Atlantic Airways booking assistance","/norse-atlantic-airways/"]].map(([label,to])=><Link key={to} to={to} className="group rounded-[1.25rem] border border-border bg-background px-5 py-5 text-sm font-semibold text-primary transition-smooth hover:-translate-y-0.5 hover:border-primary/25 hover:bg-card hover:shadow-subtle">{label}<span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span></Link>)}</div></div>
      </section>

      <section className="border-b border-border bg-background px-5 py-14 sm:px-8 sm:py-20" aria-labelledby="popular-booking-help-heading">
        <div className="mx-auto max-w-6xl"><p className="label-board text-accent">Popular booking help</p><h2 id="popular-booking-help-heading" className="mt-3 max-w-3xl text-balance text-3xl font-semibold sm:text-4xl">A few common reasons travelers reach out.</h2><p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">Explore practical guides for affordable economy flights, urgent travel, family trips, and ticket changes or cancellations.</p><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[["Cheap flight booking by phone","/cheap-flight-booking-by-phone/"],["International flight booking","/international-flight-booking/"],["Last-minute flight booking","/last-minute-flight-booking/"],["Same-day flight booking","/same-day-flight-booking/"],["Family flight booking","/family-flight-booking/"],["Flight change assistance","/flight-change-assistance/"],["Flight cancellation assistance","/flight-cancellation-assistance/"]].map(([label,to])=><Link key={to} to={to} className="group rounded-[1.5rem] border border-border bg-card px-6 py-5 text-sm font-semibold text-primary shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-elevated">{label}<span className="ml-2 transition-transform group-hover:translate-x-1">→</span></Link>)}</div></div>
      </section>

      <section className="border-b border-border bg-muted/40 px-5 py-14 sm:px-8 sm:py-20" aria-labelledby="before-you-pay-heading">
        <div className="mx-auto max-w-6xl">
          <p className="label-board text-accent">Before you book</p>
          <h2 id="before-you-pay-heading" className="mt-3 max-w-4xl text-balance text-3xl font-semibold sm:text-4xl">Check the details that can change the real cost of a flight.</h2>
          <p className="mt-5 max-w-4xl text-base leading-7 text-muted-foreground">A fare is only one part of the decision. Before paying, confirm the full price, connection times, seat-selection costs, ticket restrictions, and the terms for changes or cancellation. Options and prices vary by route, travel dates, and booking provider.</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Total trip cost", "Check taxes, seat-selection fees, and any separately charged services."],
              ["Connections", "Review layover length, airport changes, and arrival times."],
              ["Ticket conditions", "Ask which changes, cancellations, or refunds are permitted."],
              ["Traveler details", "Confirm passenger names and document requirements before purchase."],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-4">
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-4xl text-sm leading-6 text-muted-foreground">Want to discuss a specific itinerary? <Link to="/book-a-flight-by-phone/" className="font-semibold text-primary underline underline-offset-4">See how phone booking works</Link> or <Link to="/flight-change-assistance/" className="font-semibold text-primary underline underline-offset-4">review flight-change assistance</Link>.</p>
        </div>
      </section>

      <section className="border-b border-border bg-card px-5 py-12 sm:px-8 sm:py-16" aria-labelledby="flight-guide-index-heading">
        <div className="mx-auto max-w-6xl">
          <p className="label-board text-accent">Flight guide index</p>
          <h2 id="flight-guide-index-heading" className="mt-3 max-w-4xl text-balance text-3xl font-semibold sm:text-4xl">Explore every flight booking guide</h2>
          <p className="mt-4 max-w-4xl text-base leading-7 text-muted-foreground">Use these focused guides to explore airline assistance, booking situations, U.S. departure gateways, and popular international routes. Each guide is an independent page with its own booking topic and destination or airline focus.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {FLIGHT_GUIDE_GROUPS.map(([group, links]) => (
              <details key={group} className="rounded-2xl border border-border bg-background p-5">
                <summary className="cursor-pointer list-none font-display text-base font-semibold text-foreground">{group}</summary>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {links.map(([label, to]) => (
                    <Link key={to} to={to} className="rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-primary hover:border-primary/25 hover:text-primary/90">{label}</Link>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="min-h-24" aria-hidden="true" />}><HomeFaq /><ContactInfoBlock /></Suspense>
      </div>
      <p className="sr-only">{SITE.name} — {SITE.tagline}. {SITE.hours}.</p>
    </>
  );
}
