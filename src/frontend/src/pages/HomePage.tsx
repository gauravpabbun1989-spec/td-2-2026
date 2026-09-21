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

const HOME_TITLE =
  "TicketDepart | Flight Booking Help from Travel Specialists 24/7";
const HOME_DESCRIPTION =
  "Independent U.S. travel agency for international and domestic flight booking, multi-city itineraries, business and first class, and group travel. Speak with a travel specialist 24/7 at +1 855-544-9001.";

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
