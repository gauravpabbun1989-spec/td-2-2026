import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { breadcrumbSchema } from "@/lib/seo";
import { ADDRESS_LINE, SITE } from "@/lib/site";
import { Link } from "@tanstack/react-router";

const LAST_UPDATED = "September 18, 2026";

type TermsBlock = {
  id: string;
  heading: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

const TERMS_BLOCKS: readonly TermsBlock[] = [
  {
    id: "use-of-site",
    heading: "Use of this website",
    paragraphs: [
      `This website is operated by ${SITE.legalName} to help travelers learn about our services and reach a travel specialist. By using the site, you agree to use it lawfully and only for its intended purpose.`,
      "You agree not to interfere with the operation of the site, attempt to access areas that are not intended for you, or use automated tools to copy content or submit requests at volume.",
    ],
  },
  {
    id: "independent-agency",
    heading: "Independent travel agency — no airline affiliation",
    paragraphs: [
      `${SITE.name} is an independent travel agency. We are not an airline, and we are not affiliated with, endorsed by, or the official customer service of any airline.`,
      "We do not sell tickets directly. We help you research and compare flights, and any reservation is issued by the airline or an authorized distributor and ticketed in your own name.",
      "Airline names, logos, and trademarks that appear on this site belong to their respective owners and are used only to identify the carriers whose flights we can help you book. Any airline name on this site does not imply a partnership, agency appointment, or endorsement.",
    ],
  },
  {
    id: "booking-services",
    heading: "Booking services and pricing",
    paragraphs: [
      "We help travelers research, hold, and book flights. Fares, schedules, seat availability, and baggage rules are set by the airline and can change at any time before a ticket is issued.",
      "A fare is not confirmed until it is ticketed and you receive a confirmation from us. Prices shown or quoted before ticketing are subject to change and may include service fees charged by our agency in addition to the airline's fare.",
      "Any service fee we charge is disclosed to you before you authorize a purchase.",
    ],
  },
  {
    id: "your-responsibilities",
    heading: "Your responsibilities",
    paragraphs: [
      "You are responsible for the accuracy of the information you give us and for reviewing your confirmation carefully once you receive it.",
    ],
    bullets: [
      "Provide traveler names exactly as they appear on the government-issued identification used for travel.",
      "Confirm travel dates, times, airports, and connections before you authorize a ticket.",
      "Check passport, visa, and entry requirements for every country on your itinerary.",
      "Review the airline's baggage allowance, seat selection, and change rules for your fare.",
    ],
  },
  {
    id: "changes-and-cancellations",
    heading: "Changes, cancellations, and refunds",
    paragraphs: [
      "Changes, cancellations, and refunds are governed by the fare rules of the airline that issued your ticket. Many fares are non-refundable and some are non-changeable.",
      "Where a fare allows a change or refund, the airline may charge a fee and any difference in fare. Our agency may also charge a service fee for handling the change. We will explain the applicable costs before we proceed.",
      "Refunds are issued by the airline and can take several billing cycles to appear once approved.",
    ],
  },
  {
    id: "service-limitations",
    heading: "Service limitations",
    paragraphs: [
      "We act as an intermediary between you and the travel suppliers that provide your flights. We do not operate aircraft, control schedules, or determine whether a flight departs on time.",
      "Schedule changes, delays, cancellations, weather disruptions, and denied boarding are handled by the airline under its own policies and applicable law. We will help you understand your options and contact the airline on your behalf, but we cannot guarantee a specific outcome.",
      "This website and its content are provided on an as-is basis. We work to keep information accurate and current, but we do not warrant that every fare, schedule, or detail shown is free of error at the moment you read it.",
    ],
  },
  {
    id: "liability",
    heading: "Limitation of liability",
    paragraphs: [
      "To the extent permitted by law, our liability for any claim connected to this website or our booking services is limited to the service fees we charged you for the booking at issue. We are not liable for indirect or consequential losses.",
      "Nothing in these terms limits any right you have under applicable consumer protection law.",
    ],
  },
  {
    id: "governing-law",
    heading: "Governing law",
    paragraphs: [
      "These terms are governed by the laws of the State of California, United States, without regard to conflict-of-law rules. Any dispute will be handled in the state or federal courts located in California.",
    ],
  },
  {
    id: "contact",
    heading: "Contact us",
    paragraphs: [
      `If you have a question about these terms, contact ${SITE.legalName} at ${SITE.email} or ${SITE.phoneDisplay}, or write to us at ${ADDRESS_LINE}.`,
    ],
  },
];

export function TermsPage() {
  return (
    <>
      <Seo
        title="Terms of Service | TicketDepart"
        description="The terms that govern your use of the TicketDepart website and our independent travel agency booking services."
        path="/terms"
        structuredData={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Terms of Service", path: "/terms" },
          ]),
        ]}
      />

      <Section tone="paper" ocid="terms.page">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link
                to="/"
                className="rounded-sm transition-smooth hover:text-foreground"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-muted-foreground/60">
              /
            </li>
            <li aria-current="page" className="font-medium text-foreground">
              Terms of Service
            </li>
          </ol>
        </nav>

        <p className="label-board text-accent">Legal</p>
        <h1 className="mt-3 max-w-3xl text-balance text-4xl font-semibold leading-tight sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          These terms govern your use of the {SITE.name} website and the travel
          booking services provided by our independent travel agency.
        </p>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Last updated {LAST_UPDATED}
        </p>
      </Section>

      <Section tone="muted" aria-labelledby="terms-detail-heading">
        <SectionHeading
          id="terms-detail-heading"
          eyebrow="The details"
          title="What you agree to when you use our services"
          description="We have kept these terms readable. If anything is unclear, call us and a specialist will walk you through it."
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
          <div className="space-y-10">
            {TERMS_BLOCKS.map((block) => (
              <article key={block.id} id={block.id} className="scroll-mt-24">
                <h3 className="text-xl font-semibold leading-snug sm:text-2xl">
                  {block.heading}
                </h3>
                {block.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
                {block.bullets ? (
                  <ul className="mt-4 space-y-2">
                    {block.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-3 text-base leading-relaxed text-muted-foreground"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-border bg-card p-6 shadow-subtle">
              <p className="label-board text-accent">Need help?</p>
              <h3 className="mt-3 text-lg font-semibold">
                Speak with a travel specialist
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Our team can explain fare rules, change fees, and what is
                included before you book.
              </p>
              <div className="mt-5">
                <CallCta
                  variant="outline"
                  size="md"
                  ocid="terms.call_button"
                  className="w-full"
                />
              </div>
              <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
                <div>
                  <dt className="label-board text-muted-foreground">Email</dt>
                  <dd className="mt-1">
                    <a
                      href={SITE.emailHref}
                      className="break-words font-medium text-foreground transition-smooth hover:text-accent"
                    >
                      {SITE.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="label-board text-muted-foreground">Mail</dt>
                  <dd className="mt-1 text-muted-foreground">
                    {SITE.legalName}
                    <br />
                    {ADDRESS_LINE}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="navy" aria-labelledby="terms-cta-heading">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <p className="label-board text-accent">Ready when you are</p>
            <h2
              id="terms-cta-heading"
              className="mt-3 text-balance text-2xl font-semibold leading-tight sm:text-3xl"
            >
              Have a question before you book?
            </h2>
            <p className="mt-3 text-pretty text-base leading-relaxed text-primary-foreground/80">
              Call {SITE.phoneDisplay} and a specialist will help you directly.
            </p>
          </div>
          <CallCta
            variant="solid"
            size="lg"
            ocid="terms.cta_button"
            className="shrink-0"
          />
        </div>
      </Section>
    </>
  );
}
