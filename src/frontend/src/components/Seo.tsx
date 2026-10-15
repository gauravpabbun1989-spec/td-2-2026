import { DEFAULT_SHARE_IMAGE, type SeoInput, webPageSchema } from "@/lib/seo";
import { absoluteUrl, SITE } from "@/lib/site";
import { useEffect } from "react";

const MANAGED_ATTR = "data-seo-managed";
const OG_LOCALE = "en_US";
const TWITTER_SITE = "@ticketdepart";

function trimToLimit(value: string, max: number): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  const candidate = normalized.slice(0, max + 1).replace(/\s+\S*$/, "").trim();
  return candidate.replace(/[|,:;\-]+$/, "").trim();
}

function normalizeTitle(value: string): string {
  const title = value.replace(/\s+/g, " ").trim();
  if (title.length <= 60) return title;
  const withoutBrand = title.replace(/\s*\|\s*TicketDepart\s*$/i, "").trim();
  return withoutBrand.length <= 60 ? withoutBrand : trimToLimit(withoutBrand, 60);
}

function normalizeDescription(value: string): string {
  return trimToLimit(value, 155);
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
  const normalizedTitle = normalizeTitle(title);
  const normalizedDescription = normalizeDescription(
    description.replace(
      /(?:\+?1[\s().-]*)?855[\s().-]*544[\s().-]*9001/g,
      SITE.phoneDisplay,
    ),
  );
  const descriptionPhoneDigits = SITE.phoneDisplay.replace(/\D/g, "");
  const listingDescription = normalizedDescription.replace(/\D/g, "").includes(descriptionPhoneDigits)
    ? normalizedDescription
    : trimToLimit(
        `${trimToLimit(normalizedDescription, 125).replace(/\.$/, "")} Call ${SITE.phoneDisplay}.`,
        155,
      );
  const effectiveStructuredData =
    structuredData.length > 0
      ? structuredData
      : [
          webPageSchema({
            title: normalizedTitle,
            description: listingDescription,
            path,
          }),
        ];
  const serialized = JSON.stringify(effectiveStructuredData);

  useEffect(() => {
    document.title = normalizedTitle;

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
      normalizedTitle,
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
      `${normalizedTitle} — ${listingDescription}`,
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
      normalizedTitle,
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
  }, [normalizedTitle, listingDescription, canonical, image, serialized, indexable]);

  return null;
}
