/**
 * Single source of truth for business identity, contact details, and
 * navigation. Every page and chrome component reads from here so the
 * phone number, address, and disclosure copy can never drift.
 */

export const SITE = {
  name: "TicketDepart",
  legalName: "Ticketdepart",
  tagline: "Independent travel agency",
  description:
    "TicketDepart is an independent U.S. travel agency helping travelers plan and book domestic and international flights with a real specialist on the phone.",
  phoneDisplay: "+1 855-544-9001",
  phoneHref: "tel:+18555449001",
  email: "support@ticketdestinations.com",
  emailHref: "mailto:support@ticketdestinations.com",
  address: {
    street: "444 Alaska Avenue",
    city: "Torrance",
    region: "CA",
    postalCode: "90503",
    country: "US",
  },
  hours: "Travel specialists available 24/7",
  ctaLabel: "Speak with a Travel Specialist",
  disclosure:
    "TicketDepart is an independent travel agency. We are not affiliated with, endorsed by, or sponsored by any airline. All airline names and trademarks belong to their respective owners and are used for identification purposes only.",
} as const;

export const ADDRESS_LINE = `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}`;

/**
 * Regions the agency serves, used for `areaServed` in structured data.
 * Kept as a plain list so schema builders stay declarative.
 */
export const AREA_SERVED: readonly string[] = [
  "United States",
  "Canada",
  "Mexico",
  "Caribbean",
  "Europe",
  "Asia",
] as const;

/** Canonical 24/7 opening hours used by the Organization schema. */
export const OPENING_HOURS = {
  days: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],
  opens: "00:00",
  closes: "23:59",
} as const;

export type NavItem = {
  label: string;
  to: string;
};

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Flight Booking", to: "/flight-booking" },
  { label: "Delta Airlines", to: "/delta-airlines" },
  { label: "United Airlines", to: "/united-airlines" },
  { label: "American Airlines", to: "/american-airlines" },
  { label: "Contact", to: "/contact" },
] as const;

/** Legal pages, linked from the footer rather than the primary navigation. */
export const LEGAL_ITEMS: readonly NavItem[] = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
] as const;

/** Absolute site origin used for canonical URLs and structured data. */
export function siteOrigin(): string {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }
  return "https://ticketdepart.com";
}

export function absoluteUrl(path: string): string {
  const origin = siteOrigin().replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalized}`;
}
