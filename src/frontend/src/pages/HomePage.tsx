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

const HOME_TITLE = "Book Flights by Phone | TicketDepart 24/7";
const HOME_DESCRIPTION =
  "Book domestic or international flights by phone with TicketDepart, an independent U.S. travel agency. Speak with a travel specialist 24/7 at +1 855-544-9001.";

const HOME_IMAGE = absoluteUrl(
  "/assets/generated/hero-flight.dim_1600x1100.jpg",
);

/**
 * Homepage. Assembles the hero, service grid, process explanation, pre-call
 * checklist, FAQ, disclosure, and contact block into one editorial page, and
 * applies the homepage SEO metadata and structured data.
 */
export function HomePage() {
  return (
    <>
      <Seo
        title={HOME_TITLE}
        description={HOME_DESCRIPTION}
        path="/"
        image={HOME_IMAGE}
        structuredData={[
          organizationSchema(),
          websiteSchema(),
          breadcrumbSchema([{ name: "Home", path: "/" }]),
          homeFaqSchema(),
        ]}
      />

      <HeroSection />

      <section className="border-b border-border bg-card px-5 py-10 sm:px-8 sm:py-12" aria-labelledby="book-flight-phone-heading">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="label-board text-accent">Ready to book?</p>
            <h2 id="book-flight-phone-heading" className="mt-2 text-balance text-2xl font-semibold leading-tight sm:text-3xl">Book a flight by phone with a travel specialist</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">Discuss your route, dates, cabin, baggage, and fare rules before you decide. Phone assistance is available 24/7.</p>
          </div>
          <Link to="/book-a-flight-by-phone" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Book by phone <span aria-hidden="true">→</span></Link>
        </div>
      </section>
      <section className="border-b border-border bg-card px-5 py-12 sm:px-8 sm:py-16" aria-labelledby="booking-needs-heading">
        <div className="mx-auto max-w-6xl">
          <p className="label-board text-accent">Popular booking needs</p>
          <h2 id="booking-needs-heading" className="mt-3 max-w-3xl text-balance text-2xl font-semibold leading-tight sm:text-3xl">
            Get help with the kind of trip you are actually planning
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            Explore focused guides for international travel, urgent departures, multi-city itineraries, and family or group trips.
          </p>
          <Link to="/flight-booking-guides" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">Browse all flight-booking guides <span aria-hidden="true">→</span></Link>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Flight booking help", "/flight-booking-assistance"],
              ["Flight booking phone number", "/flight-booking-phone-number"],
              ["Same-day flights", "/same-day-flight-booking"],
              ["International flights", "/international-flight-booking"],
              ["Last-minute flights", "/last-minute-flight-booking"],
              ["Multi-city flights", "/multi-city-flight-booking"],
              ["Group & family flights", "/group-flight-booking"],
              ["Domestic flights", "/domestic-flight-booking"],
              ["Business class", "/business-class-flight-booking"],
              ["One-way flights", "/one-way-flight-booking"],
              ["Family flights", "/family-flight-booking"],
              ["Travel agent by phone", "/travel-agent-by-phone"],
              ["Flight changes & rebooking", "/flight-change-rebooking"],
              ["Book for someone else", "/book-flight-for-someone-else"],
            ].map(([label, to]) => (
              <Link key={to} to={to} className="rounded-xl border border-border bg-card px-5 py-4 text-sm font-semibold text-primary transition-smooth hover:border-primary/30 hover:shadow-subtle">
                {label} <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ServiceGrid />
      <HowItWorks />
      <PreCallChecklist />

      <section className="border-y border-border bg-muted/40 px-5 py-12 sm:px-8 sm:py-16" aria-labelledby="phone-booking-guide-heading">
        <div className="mx-auto max-w-6xl">
          <p className="label-board text-accent">Need a little more detail?</p>
          <h2 id="phone-booking-guide-heading" className="mt-3 max-w-3xl text-balance text-2xl font-semibold leading-tight sm:text-3xl">
            Learn how booking a flight by phone works
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            See what to prepare before calling, which questions to ask about fares and changes, and how a phone booking typically moves from trip details to a confirmed ticket.
          </p>
          <Link
            to="/how-to-book-a-flight-by-phone"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card px-5 py-3 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Read the phone booking guide
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="border-b border-border bg-muted/40 px-5 py-12 sm:px-8 sm:py-16" aria-labelledby="airline-guides-heading">
        <div className="mx-auto max-w-6xl">
          <p className="label-board text-accent">Airline booking assistance</p>
          <h2 id="airline-guides-heading" className="mt-3 max-w-3xl text-balance text-2xl font-semibold leading-tight sm:text-3xl">
            Planning around a specific airline?
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            Explore our practical booking guides for Delta Airlines, United Airlines, and American Airlines, or call a specialist if your trip uses more than one carrier.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {[
              ["Delta Airlines booking assistance", "/delta-airlines"],
              ["United Airlines booking assistance", "/united-airlines"],
              ["American Airlines booking assistance", "/american-airlines"],
              ["Southwest Airlines assistance", "/southwest-airlines"],
              ["British Airways assistance", "/british-airways"],
              ["Lufthansa assistance", "/lufthansa"],
            ].map(([label, to]) => (
              <Link key={to} to={to} className="rounded-xl border border-border bg-card px-5 py-4 text-sm font-semibold text-primary transition-smooth hover:border-primary/30 hover:shadow-subtle">
                {label} <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <HomeFaq />
      <DisclosureBlock />
      <ContactInfoBlock />

      <p className="sr-only">
        {SITE.name} — {SITE.tagline}. {SITE.hours}.
      </p>
    </>
  );
}
