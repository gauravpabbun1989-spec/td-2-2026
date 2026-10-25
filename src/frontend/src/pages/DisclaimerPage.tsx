import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { breadcrumbSchema } from "@/lib/seo";
import { ADDRESS_LINE, SITE } from "@/lib/site";
import { Link } from "@tanstack/react-router";

export function DisclaimerPage() {
  return (
    <>
      <Seo title="TicketDepart Disclaimer | Booking Information" description="Important information about TicketDepart booking assistance, airline relationships, fares, fees, ticket issuance, and ticket conditions." path="/disclaimer" structuredData={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Disclaimer", path: "/disclaimer" }])]} />
      <Section tone="paper">
        <nav aria-label="Breadcrumb" className="mb-8"><ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><li><Link to="/" className="rounded-sm hover:text-foreground">Home</Link></li><li aria-hidden="true">/</li><li aria-current="page" className="font-medium text-foreground">Disclaimer</li></ol></nav>
        <p className="label-board text-accent">Legal information</p>
        <h1 className="mt-3 max-w-3xl text-balance text-4xl font-semibold leading-tight sm:text-5xl">Disclaimer</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">Please review this information about our travel assistance and the terms that may apply to a booking.</p>
      </Section>
      <Section tone="muted"><div className="mx-auto max-w-3xl space-y-8">
        <article><h2 className="text-xl font-semibold">Independent travel agency</h2><p className="mt-3 leading-relaxed text-muted-foreground">{SITE.name} is an independent travel agency. We are not an airline and are not affiliated with, endorsed by, or the official customer service department of any airline. Airline names and trademarks belong to their respective owners and are used to identify carriers only.</p></article>
        <article><h2 className="text-xl font-semibold">Quotes, fares, and ticket issuance</h2><p className="mt-3 leading-relaxed text-muted-foreground">A quote is not a ticket or a guarantee that a fare remains available. Prices, schedules, seat availability, baggage allowances, and fare conditions may change before ticketing. A booking should be considered ticketed only after ticket issuance is confirmed and the relevant confirmation is received.</p></article>
        <article><h2 className="text-xl font-semibold">Pricing and agency fees</h2><p className="mt-3 leading-relaxed text-muted-foreground">Before authorizing payment, confirm the total price, including taxes and any agency service fee, what the fare includes, the payment recipient, and the supplier or ticket issuer. Any agency service fee must be disclosed before purchase authorization. Please ask for clarification before paying if any amount or condition is unclear.</p></article>
        <article><h2 className="text-xl font-semibold">Changes, cancellations, and refunds</h2><p className="mt-3 leading-relaxed text-muted-foreground">Change, cancellation, refund, and credit eligibility depends on the ticket issuer, fare conditions, payment method, and applicable law. Some fares are non-refundable or non-changeable. A refund request is not an approval; the responsible supplier must confirm the outcome.</p></article>
        <article><h2 className="text-xl font-semibold">Contact</h2><p className="mt-3 leading-relaxed text-muted-foreground">For questions, contact {SITE.legalName} at <a className="underline underline-offset-2" href={SITE.emailHref}>{SITE.email}</a> or <a className="underline underline-offset-2" href={SITE.phoneHref}>{SITE.phoneDisplay}</a>, or write to {ADDRESS_LINE}.</p><div className="mt-5"><CallCta variant="outline" size="md" ocid="disclaimer.call_button" /></div></article>
      </div></Section>
      <Section tone="paper"><SectionHeading eyebrow="Related information" title="More about our services" description="Read the full terms and privacy information for additional details." /><div className="mt-5 flex flex-wrap gap-5 text-sm"><Link to="/terms/" className="underline underline-offset-4">Terms of Service</Link><Link to="/privacy/" className="underline underline-offset-4">Privacy Policy</Link><Link to="/contact/" className="underline underline-offset-4">Contact</Link></div></Section>
    </>
  );
}
