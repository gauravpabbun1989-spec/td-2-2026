/**
 * Single source of truth for business identity, contact details, and
 * navigation. Every page and chrome component reads from here so the
 * phone number, address, and disclosure copy can never drift.
 */

export const SITE = {
  name: "TicketDepart",
  legalName: "TicketDepart Travel",
  tagline: "Independent travel agency",
  description:
    "Flight booking assistance for domestic and international trips, with help from a real specialist by phone.",
  phoneDisplay: "+1-888-958-0280",
  phoneHref: "tel:+18889580280",
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
  ctaLabel: "Call 24/7 for Flight Reservation Assistance",
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
  "United Kingdom",
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
  { label: "Flight Booking", to: "/flight-booking/" },
  { label: "Search Flights", to: "/flight-search/" },
  { label: "Book by Phone", to: "/book-a-flight-by-phone/" },
  { label: "International", to: "/international-flight-booking/" },
  { label: "Last-Minute", to: "/last-minute-flight-booking/" },
  { label: "Contact", to: "/contact/" },
] as const;

/** Legal pages, linked from the footer rather than the primary navigation. */
export const AIRLINE_ITEMS: readonly NavItem[] = [
  { label: "Delta", to: "/delta-airlines/" },
  { label: "United", to: "/united-airlines/" },
  { label: "American", to: "/american-airlines/" },
  { label: "Southwest", to: "/southwest-airlines/" },
  { label: "JetBlue", to: "/jetblue-airways/" },
  { label: "Alaska", to: "/alaska-airlines/" },
  { label: "British Airways", to: "/british-airways/" },
  { label: "Lufthansa", to: "/lufthansa/" },
  { label: "Air Canada", to: "/air-canada/" },
  { label: "SWISS", to: "/swiss-air/" },
  { label: "Qatar Airways", to: "/qatar-airways/" },
  { label: "Emirates", to: "/emirates/" },
  { label: "Norse Atlantic Airways", to: "/norse-atlantic-airways/" },
] as const;

export const LEGAL_ITEMS: readonly NavItem[] = [
  { label: "Privacy Policy", to: "/privacy/" },
  { label: "Terms of Service", to: "/terms/" },
] as const;

/** Absolute site origin used for canonical URLs and structured data. */
export function siteOrigin(): string {
  return "https://ticketdepart.com";
}

export function absoluteUrl(path: string): string {
  const origin = siteOrigin().replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  // Keep the homepage at "/" and use the trailing-slash form served by the static route directories.
  const cleanPath = normalized.replace(/\/+$/, "");
  const isAsset = /\.[a-z0-9]{2,8}$/i.test(cleanPath);
  const canonicalPath =
    cleanPath === "/" ? "/" : isAsset ? cleanPath : `${cleanPath}/`;
  return `${origin}${canonicalPath}`;
}
