import { DEFAULT_SHARE_IMAGE, type SeoInput } from "@/lib/seo";
import { absoluteUrl, SITE } from "@/lib/site";
import { useEffect } from "react";

const MANAGED_ATTR = "data-seo-managed";
const OG_LOCALE = "en_US";
const TWITTER_SITE = "@ticketdepart";

function serviceCta(path: string): string {
  const normalized = path.toLowerCase();
  if (normalized.includes("cancellation")) return "Call Now: +1-888-958-0280 | Get Flight Cancelled";
  if (normalized.includes("change")) return "Call Now: +1-888-958-0280 | Get Flight Changed";
  if (normalized.includes("last-minute")) return "Call Now: +1-888-958-0280 | Get Last-Minute Flight Booked";
  if (normalized.includes("multi-city")) return "Call Now: +1-888-958-0280 | Get Multi-City Flight Booked";
  if (normalized.includes("group")) return "Call Now: +1-888-958-0280 | Get Group Flight Booked";
  if (normalized.includes("business-class") || normalized.includes("corporate")) return "Call Now: +1-888-958-0280 | Get Business Class Flight Booked";
  if (normalized.includes("international")) return "Call Now: +1-888-958-0280 | Get International Flight Booked";
  if (normalized.includes("airline-reservation-assistance")) return "Call Now: +1-888-958-0280 | Get Airline Reservation Help";
  return "Call Now: +1-888-958-0280 | Get Flight Booked";
}

function buildListingDescription(description: string, path: string): string {
  const cta = serviceCta(path);
  const cleaned = description
    .replace(/\+?1[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{4}/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.]\s*$/, "");
  const maxLength = 158;
  const available = Math.max(40, maxLength - cta.length - 3);
  const summary = cleaned.length > available ? cleaned.slice(0, available - 1).trimEnd() + "…" : cleaned;
  return cta + " | " + summary;
}

function upsertMeta(
  selector: string,
  create: () => HTMLMetaElement,
  content: string,
): void {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = create();
    element.setAttribute(MANAGED_ATTR, "true");
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function upsertLink(rel: string, href: string, hreflang?: string): void {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    if (hreflang) element.setAttribute("hreflang", hreflang);
    element.setAttribute(MANAGED_ATTR, "true");
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

/**
 * Applies per-route document metadata: title, description, canonical URL,
 * Open Graph / Twitter tags, robots directives, hreflang alternates, and
 * JSON-LD structured data. The static tags in index.html remain as the
 * pre-render fallback and are updated in place.
 */
export function Seo({
  title,
  description,
  path,
  image = DEFAULT_SHARE_IMAGE,
  structuredData = [],
  indexable = true,
}: SeoInput) {
  const canonical = absoluteUrl(path);
  const listingDescription = buildListingDescription(description, path);
  const serialized = JSON.stringify(structuredData);

  useEffect(() => {
    document.title = title;

    upsertMeta(
      'meta[name="description"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        return meta;
      },
      listingDescription,
    );

    upsertMeta(
      'meta[name="robots"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("name", "robots");
        return meta;
      },
      indexable ? "index, follow, max-image-preview:large" : "noindex, nofollow",
    );

    upsertMeta(
      'meta[property="og:title"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("property", "og:title");
        return meta;
      },
      title,
    );

    upsertMeta(
      'meta[property="og:description"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("property", "og:description");
        return meta;
      },
      listingDescription,
    );

    upsertMeta(
      'meta[property="og:type"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("property", "og:type");
        return meta;
      },
      "website",
    );

    upsertMeta(
      'meta[property="og:site_name"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("property", "og:site_name");
        return meta;
      },
      "TicketDepart",
    );

    upsertMeta(
      'meta[property="og:locale"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("property", "og:locale");
        return meta;
      },
      OG_LOCALE,
    );

    upsertMeta(
      'meta[property="og:url"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("property", "og:url");
        return meta;
      },
      canonical,
    );

    upsertMeta(
      'meta[property="og:image"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("property", "og:image");
        return meta;
      },
      image,
    );

    upsertMeta(
      'meta[property="og:image:alt"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("property", "og:image:alt");
        return meta;
      },
      `${title} — ${listingDescription}`,
    );

    upsertMeta(
      'meta[name="twitter:card"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("name", "twitter:card");
        return meta;
      },
      "summary_large_image",
    );

    upsertMeta(
      'meta[name="twitter:site"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("name", "twitter:site");
        return meta;
      },
      TWITTER_SITE,
    );

    upsertMeta(
      'meta[name="twitter:title"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("name", "twitter:title");
        return meta;
      },
      title,
    );

    upsertMeta(
      'meta[name="twitter:description"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("name", "twitter:description");
        return meta;
      },
      listingDescription,
    );

    upsertMeta(
      'meta[name="twitter:image"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("name", "twitter:image");
        return meta;
      },
      image,
    );

    upsertLink("canonical", canonical);
    upsertLink("alternate", canonical, "en-US");
    upsertLink("alternate", canonical, "x-default");

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute(MANAGED_ATTR, "true");
    script.textContent = serialized;
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [title, description, listingDescription, canonical, image, serialized, indexable]);

  return null;
}
