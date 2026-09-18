import { ADDRESS_LINE, LEGAL_ITEMS, NAV_ITEMS, SITE } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone, Plane } from "lucide-react";

const CAFFEINE_URL = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
  typeof window !== "undefined" ? window.location.hostname : "ticketdepart",
)}`;

/**
 * Dark navy footer carrying business identity, contact details, navigation,
 * and the independent-agency disclosure.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      data-ocid="site.footer"
      className="border-t border-primary/20 bg-primary text-primary-foreground"
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Plane aria-hidden="true" className="size-5 -rotate-45" />
              </span>
              <span className="font-display text-lg font-bold tracking-tight">
                {SITE.name}
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/75">
              {SITE.description}
            </p>
            <p className="label-board mt-5 text-accent">{SITE.hours}</p>
          </div>

          <div>
            <h2 className="label-board text-primary-foreground/60">Contact</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={SITE.phoneHref}
                  data-ocid="footer.call_link"
                  className="flex items-start gap-2.5 rounded-md text-primary-foreground/85 transition-smooth hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                >
                  <Phone
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0"
                  />
                  <span>{SITE.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={SITE.emailHref}
                  data-ocid="footer.email_link"
                  className="flex items-start gap-2.5 rounded-md break-all text-primary-foreground/85 transition-smooth hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                >
                  <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                  <span>{SITE.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-primary-foreground/85">
                <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                <address className="not-italic">{ADDRESS_LINE}</address>
              </li>
              <li className="flex items-start gap-2.5 text-primary-foreground/85">
                <Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                <span>Open 24 hours, 7 days a week</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="label-board text-primary-foreground/60">Explore</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    data-ocid={`footer.link.${item.label.toLowerCase().replace(/\s+/g, "_")}`}
                    className="rounded-md text-primary-foreground/85 transition-smooth hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h2 className="label-board mt-6 text-primary-foreground/60">
              Legal
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {LEGAL_ITEMS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    data-ocid={`footer.link.${item.label.toLowerCase().replace(/\s+/g, "_")}`}
                    className="rounded-md text-primary-foreground/85 transition-smooth hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/15 pt-8">
          <p className="text-xs leading-relaxed text-primary-foreground/60">
            {SITE.disclosure}
          </p>
          <div className="mt-6 flex flex-col gap-2 text-xs text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {SITE.legalName}. All rights reserved.
            </p>
            <p>
              Built with love using{" "}
              <a
                href={CAFFEINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm underline underline-offset-4 transition-smooth hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
