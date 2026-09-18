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
      <HomeFaq />
      <DisclosureBlock />
      <ContactInfoBlock />

      <p className="sr-only">
        {SITE.name} — {SITE.tagline}. {SITE.hours}.
      </p>
    </>
  );
}
