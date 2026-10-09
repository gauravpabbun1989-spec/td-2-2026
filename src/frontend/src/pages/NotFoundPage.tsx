import { CallCta } from "@/components/CallCta";
import { Section } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { SITE } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Compass, Phone } from "lucide-react";

type RecoveryLink = {
  to: string;
  label: string;
  description: string;
  ocid: string;
};

/**
 * Descriptive recovery routes. Each link explains where it goes so a lost
 * visitor can choose the right path without guessing.
 */
const RECOVERY_LINKS: readonly RecoveryLink[] = [
  {
    to: "/",
    label: "TicketDepart homepage",
    description: "Start over and see how our travel desk works.",
    ocid: "not_found.link.home",
  },
  {
    to: "/flight-booking",
    label: "Flight booking",
    description:
      "See how we research and book domestic and international flights.",
    ocid: "not_found.link.flight_booking",
  },
  {
    to: "/delta-airlines",
    label: "Delta Airlines guide",
    description: "Routes, cabins, and booking help for Delta Airlines flights.",
    ocid: "not_found.link.delta",
  },
  {
    to: "/united-airlines",
    label: "United Airlines guide",
    description:
      "Routes, cabins, and booking help for United Airlines flights.",
    ocid: "not_found.link.united",
  },
  {
    to: "/american-airlines",
    label: "American Airlines guide",
    description: "Routes, cabins, and booking help for American flights.",
    ocid: "not_found.link.american",
  },
  {
    to: "/contact",
    label: "Contact a travel specialist",
    description: "Send your trip details or call our 24/7 travel desk.",
    ocid: "not_found.link.contact",
  },
];

/**
 * Custom 404. Gives lost visitors a clear route back to the key pages and the
 * phone conversion control.
 */
export function NotFoundPage() {
  return (
    <>
      <Seo
        title="Page Not Found | TicketDepart"
        description="The page you were looking for could not be found. Browse TicketDepart flight booking, airline guides, or call a travel specialist at +1 888-958-0280."
        path="/404"
        indexable={false}
      />

      <Section tone="paper" ocid="not_found.page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="label-board text-accent">Error 404</p>
          <h1 className="mt-4 text-balance text-4xl font-bold leading-tight sm:text-5xl">
            This page has departed
          </h1>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            The page you were looking for is not on our board. It may have been
            moved or the address may be mistyped. A travel specialist can point
            you in the right direction right now.
          </p>

          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <CallCta size="lg" ocid="not_found.call_button" />
            <Link
              to="/"
              data-ocid="not_found.home_link"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-card px-6 text-base font-medium text-primary transition-smooth hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to home
            </Link>
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-card p-6 text-left shadow-subtle">
            <div className="flex items-center gap-2.5">
              <Compass aria-hidden="true" className="size-5 text-accent" />
              <h2 className="font-display text-lg font-semibold">
                Where would you like to go?
              </h2>
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {RECOVERY_LINKS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    data-ocid={item.ocid}
                    className="flex min-h-11 flex-col justify-center rounded-lg px-3 py-2.5 transition-smooth hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <span className="flex items-center justify-between gap-2 text-sm font-medium text-foreground">
                      {item.label}
                      <span
                        aria-hidden="true"
                        className="text-muted-foreground"
                      >
                        →
                      </span>
                    </span>
                    <span className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
            <Phone aria-hidden="true" className="size-4" />
            <span>{SITE.hours}</span>
            <span aria-hidden="true">·</span>
            <a
              href={SITE.phoneHref}
              data-ocid="not_found.phone_link"
              className="rounded-sm font-semibold text-primary underline underline-offset-4 transition-smooth hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {SITE.phoneDisplay}
            </a>
          </p>
        </div>
      </Section>
    </>
  );
}
