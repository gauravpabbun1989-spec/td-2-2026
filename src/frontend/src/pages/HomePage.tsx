import { Seo } from "@/components/Seo";
import { ContactInfoBlock } from "@/components/home/ContactInfoBlock";
import { DisclosureBlock } from "@/components/home/DisclosureBlock";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeFaq, homeFaqSchema } from "@/components/home/HomeFaq";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PreCallChecklist } from "@/components/home/PreCallChecklist";
import { ServiceGrid } from "@/components/home/ServiceGrid";
import { breadcrumbSchema, organizationSchema, websiteSchema } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

const HOME_TITLE = "TicketDepart | Premium Flight Reservation Assistance";
const HOME_DESCRIPTION = "Book flights by phone with TicketDepart. Get 24/7 flight booking assistance for domestic and international travel, changes, and cancellations.";

const HOME_IMAGE = absoluteUrl("/assets/generated/hero-flight.dim_1600x1100.jpg");

export function HomePage() {
  return (
    <>
      <Seo title={HOME_TITLE} description={HOME_DESCRIPTION} path="/" image={HOME_IMAGE} structuredData={[organizationSchema(), websiteSchema(), breadcrumbSchema([{ name: "Home", path: "/" }]), homeFaqSchema()]} />
      <HeroSection />

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

      <ServiceGrid />
      <HowItWorks />
      <PreCallChecklist />

      <section className="border-y border-border bg-[#f3f6f9] px-5 py-14 sm:px-8 sm:py-20" aria-labelledby="phone-booking-guide-heading">
        <div className="mx-auto max-w-6xl"><p className="label-board text-accent">Helpful guide</p><h2 id="phone-booking-guide-heading" className="mt-3 max-w-3xl text-balance text-3xl font-semibold sm:text-4xl">Know what to expect when booking by phone.</h2><p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">See what to prepare, which questions to ask about fares and changes, and how a phone booking typically moves from trip details to a confirmed ticket.</p><Link to="/how-to-book-a-flight-by-phone" className="mt-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-5 py-3 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground">Read the booking guide <ArrowRight className="size-4" /></Link></div>
      </section>

      <section className="border-b border-border bg-card px-5 py-14 sm:px-8 sm:py-20" aria-labelledby="airline-guides-heading">
        <div className="mx-auto max-w-6xl"><p className="label-board text-accent">Airline booking assistance</p><h2 id="airline-guides-heading" className="mt-3 max-w-3xl text-balance text-3xl font-semibold sm:text-4xl">Planning around a specific airline?</h2><p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">Explore practical booking guides for major airlines, including Delta, United, American, Southwest, JetBlue, Alaska, British Airways, Lufthansa, and Air Canada.</p><div className="mt-8 grid gap-3 sm:grid-cols-3">{[["Delta Airlines booking assistance","/delta-airlines"],["United Airlines booking assistance","/united-airlines"],["American Airlines booking assistance","/american-airlines"],["Southwest Airlines booking assistance","/southwest-airlines"],["JetBlue Airways booking assistance","/jetblue-airways"],["Alaska Airlines booking assistance","/alaska-airlines"],["British Airways booking assistance","/british-airways"],["Lufthansa booking assistance","/lufthansa"],["Air Canada booking assistance","/air-canada"],["SWISS booking assistance","/swiss-air"],["Qatar Airways booking assistance","/qatar-airways"],["Emirates booking assistance","/emirates"],["LOT Polish Airlines booking assistance","/lot-polish-airlines"],["Norse Atlantic Airways booking assistance","/norse-atlantic-airways"]].map(([label,to])=><Link key={to} to={to} className="group rounded-[1.25rem] border border-border bg-background px-5 py-5 text-sm font-semibold text-primary transition-smooth hover:-translate-y-0.5 hover:border-primary/25 hover:bg-card hover:shadow-subtle">{label}<span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span></Link>)}</div></div>
      </section>

      <section className="border-b border-border bg-background px-5 py-14 sm:px-8 sm:py-20" aria-labelledby="popular-booking-help-heading">
        <div className="mx-auto max-w-6xl"><p className="label-board text-accent">Popular booking help</p><h2 id="popular-booking-help-heading" className="mt-3 max-w-3xl text-balance text-3xl font-semibold sm:text-4xl">Support for the trips people plan most often.</h2><p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">Explore focused guides for urgent travel, premium cabins, family trips, affordable fare planning, and changes or cancellations.</p><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[["Cheap flight booking by phone","/cheap-flight-booking-by-phone"],["Business class flight booking","/business-class-flight-booking"],["Same-day flight booking","/same-day-flight-booking"],["Family flight booking","/family-flight-booking"],["Flight change assistance","/flight-change-assistance"],["Flight cancellation assistance","/flight-cancellation-assistance"]].map(([label,to])=><Link key={to} to={to} className="group rounded-[1.5rem] border border-border bg-card px-6 py-5 text-sm font-semibold text-primary shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-elevated">{label}<span className="ml-2 transition-transform group-hover:translate-x-1">→</span></Link>)}</div></div>
      </section>

      <HomeFaq />
      <DisclosureBlock />
      <ContactInfoBlock />
      <p className="sr-only">{SITE.name} — {SITE.tagline}. {SITE.hours}.</p>
    </>
  );
}
