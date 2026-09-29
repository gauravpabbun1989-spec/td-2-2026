import { AREA_SERVED, OPENING_HOURS, SITE, absoluteUrl } from "@/lib/site";

export type SeoInput = {
  title: string;
  description: string;
  path: string;
  /** Absolute https URL for the social share image. */
  image?: string;
  /** JSON-LD graph nodes rendered into the document head. */
  structuredData?: Record<string, unknown>[];
  /** Whether search engines should index this route. */
  indexable?: boolean;
};

export const DEFAULT_SHARE_IMAGE = absoluteUrl(
  "/assets/generated/hero-flight.dim_1600x1100.jpg",
);

export type Breadcrumb = {
  name: string;
  path: string;
};

export function breadcrumbSchema(items: Breadcrumb[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** ContactPoint node carrying the phone, email, and 24/7 availability. */
export function contactPointSchema(): Record<string, unknown> {
  return {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: SITE.phoneDisplay,
    email: SITE.email,
    areaServed: [...AREA_SERVED],
    availableLanguage: ["English"],
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [...OPENING_HOURS.days],
      opens: OPENING_HOURS.opens,
      closes: OPENING_HOURS.closes,
    },
  };
}

export function organizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: SITE.name,
    legalName: SITE.legalName,
    description: SITE.description,
    url: absoluteUrl("/"),
    telephone: SITE.phoneDisplay,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    areaServed: [...AREA_SERVED],
    contactPoint: contactPointSchema(),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [...OPENING_HOURS.days],
      opens: OPENING_HOURS.opens,
      closes: OPENING_HOURS.closes,
    },
  };
}

export function websiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: absoluteUrl("/"),
    description: SITE.description,
  };
}

/** WebPage node describing the current route. */
export function webPageSchema(input: {
  title: string;
  description: string;
  path: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    isPartOf: {
      "@type": "WebSite",
      name: SITE.name,
      url: absoluteUrl("/"),
    },
    about: {
      "@type": "TravelAgency",
      name: SITE.name,
      telephone: SITE.phoneDisplay,
    },
  };
}

/** Service node for the flight-planning service offered on a route. */
export function serviceSchema(input: {
  name: string;
  description: string;
  path: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    serviceType: "Flight booking assistance",
    url: absoluteUrl(input.path),
    areaServed: [...AREA_SERVED],
    provider: {
      "@type": "TravelAgency",
      name: SITE.name,
      telephone: SITE.phoneDisplay,
      email: SITE.email,
      url: absoluteUrl("/"),
    },
  };
}
