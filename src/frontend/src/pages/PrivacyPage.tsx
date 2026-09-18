import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { breadcrumbSchema } from "@/lib/seo";
import { ADDRESS_LINE, SITE } from "@/lib/site";
import { Link } from "@tanstack/react-router";

const LAST_UPDATED = "September 18, 2026";

type PolicyBlock = {
  id: string;
  heading: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

const POLICY_BLOCKS: readonly PolicyBlock[] = [
  {
    id: "information-we-collect",
    heading: "Information we collect",
    paragraphs: [
      "We collect the information you choose to share with us when you call, email, or submit a callback request through this website. We keep this to what we need to research fares, prepare options, and follow up with you about your trip.",
      "When you submit the callback request form, we store the following fields on our server:",
    ],
    bullets: [
      "Your name and phone number, so a specialist can reach you.",
      "Your email address, for written follow-up and confirmations.",
      "Trip type — round trip, one way, multi-city, business class, first class, group travel, or other.",
      "Origin and destination cities or airports.",
      "Departure date and, for round trips, an optional return date.",
      "Number of travelers and the cabin you are interested in.",
      "Any optional trip details you add, such as seat preferences, flexible dates, or baggage needs.",
    ],
  },
  {
    id: "how-we-use-information",
    heading: "How we use your information",
    paragraphs: [
      "We use the details you provide to respond to your request, compare available flight options, and follow up with you about the trip you asked us to research.",
      "We may also use your phone number or email address to share a confirmation, schedule change, or service update connected to a request or reservation you have with us.",
    ],
  },
  {
    id: "sharing",
    heading: "When we share information",
    paragraphs: [
      "We share information only as needed to deliver the travel services you request. That can include passing traveler and itinerary details to an airline, consolidator, or ticketing partner so a reservation can be issued.",
      "We do not sell your personal information. We do not share it with third parties for their own independent marketing purposes.",
    ],
  },
  {
    id: "cookies",
    heading: "Cookies and analytics",
    paragraphs: [
      "This website currently uses only the cookies and local storage required for the site to function correctly. We do not run advertising or behavioral tracking on this site today.",
      "If we add analytics or measurement tools in the future, we will update this policy to describe what is collected and how it is used before those tools go live.",
    ],
  },
  {
    id: "retention",
    heading: "How long we keep information",
    paragraphs: [
      "We keep callback requests and contact records for as long as we need them to respond to your request, service any reservation you make with us, meet accounting and tax obligations, and resolve questions that come up after travel. When a record is no longer needed for those purposes, we remove it or make it unreadable.",
    ],
  },
  {
    id: "your-choices",
    heading: "Your choices and rights",
    paragraphs: [
      "You can ask us what personal information we hold about you, request a correction, or ask us to delete information we are not required to keep. You can also ask us to stop contacting you about anything other than an active request or reservation.",
      `To make a request, email ${SITE.email} or call ${SITE.phoneDisplay}. We may ask a few questions to confirm your identity before we act on a request.`,
    ],
  },
  {
    id: "security",
    heading: "How we protect information",
    paragraphs: [
      "We use reasonable administrative and technical safeguards to protect the information you share with us. No method of transmission or storage is completely secure, so we cannot promise absolute security, but we work to limit access to the people and systems that need it to serve you.",
    ],
  },
  {
    id: "children",
    heading: "Children's privacy",
    paragraphs: [
      "This website is intended for adults arranging travel. We do not knowingly collect personal information from children. Traveler details for a minor are provided by the adult making the request or booking.",
    ],
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    paragraphs: [
      "We may update this policy as our services or legal obligations change. When we do, we will revise the date shown at the top of this page. Continued use of the site after an update means you accept the revised policy.",
    ],
  },
];

export function PrivacyPage() {
  return (
    <>
      <Seo
        title="Privacy Policy | TicketDepart"
        description="How TicketDepart collects, uses, and protects the personal information you share when you contact our travel specialists or book a flight."
        path="/privacy"
        structuredData={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Privacy Policy", path: "/privacy" },
          ]),
        ]}
      />

      <Section tone="paper" ocid="privacy.page">
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
              Privacy Policy
            </li>
          </ol>
        </nav>

        <p className="label-board text-accent">Legal</p>
        <h1 className="mt-3 max-w-3xl text-balance text-4xl font-semibold leading-tight sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          This policy explains what information {SITE.name} collects when you
          contact us or book travel through this website, how we use it, and the
          choices you have.
        </p>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Last updated {LAST_UPDATED}
        </p>
      </Section>

      <Section tone="muted" aria-labelledby="privacy-policy-heading">
        <SectionHeading
          id="privacy-policy-heading"
          eyebrow="Your information"
          title="What we collect and why"
          description="We keep this plain: we collect what we need to help you plan and book a trip, and nothing more."
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
          <div className="space-y-10">
            {POLICY_BLOCKS.map((block) => (
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
              <p className="label-board text-accent">Questions</p>
              <h3 className="mt-3 text-lg font-semibold">
                Talk to a travel specialist
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                If you have a question about your data or want to make a
                request, our team is available around the clock.
              </p>
              <div className="mt-5">
                <CallCta
                  variant="outline"
                  size="md"
                  ocid="privacy.call_button"
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
                    {SITE.name}
                    <br />
                    {ADDRESS_LINE}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="navy" aria-labelledby="privacy-cta-heading">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <p className="label-board text-accent">Ready when you are</p>
            <h2
              id="privacy-cta-heading"
              className="mt-3 text-balance text-2xl font-semibold leading-tight sm:text-3xl"
            >
              Questions about your booking or your data?
            </h2>
            <p className="mt-3 text-pretty text-base leading-relaxed text-primary-foreground/80">
              Call {SITE.phoneDisplay} and a specialist will help you directly.
            </p>
          </div>
          <CallCta
            variant="solid"
            size="lg"
            ocid="privacy.cta_button"
            className="shrink-0"
          />
        </div>
      </Section>
    </>
  );
}
