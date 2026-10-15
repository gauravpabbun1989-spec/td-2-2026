import { Section, SectionHeading } from "@/components/Section";

type PageContentExpansionProps = {
  subject: string;
  intro: string;
  points: readonly string[][];
  context?: string;
};

export function PageContentExpansion({
  subject,
  intro,
  points,
  context,
}: PageContentExpansionProps) {
  const pointNames = points.map(([name]) => name).filter(Boolean);
  const introFocus = intro.split(/\s+/).slice(0, 12).join(" ");
  const planningContext =
    context ??
    `For ${subject.toLowerCase()}, compare the details that actually affect this itinerary: travel dates, departure and arrival airports, connections, cabin, baggage, and the rules attached to the specific ticket.`;

  return (
    <Section tone="muted" ocid="page.content_expansion">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Planning details"
          title={`Before you confirm ${subject}`}
          description={`Use these final checks for ${subject.toLowerCase()}. This page focuses on: ${introFocus}.`}
        />
        <div className="mt-10 space-y-6 text-base leading-7 text-muted-foreground">
          <p>{planningContext}</p>
          <p>
            Keep the decision specific to your trip. Confirm the passenger names,
            travel dates, airport codes, flight times, connection points, cabin,
            baggage allowance, ticketing deadline, and any disclosed service fee.
            For an existing reservation, have the confirmation or ticket details
            ready so the correct booking can be reviewed.
          </p>
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-subtle">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Details to resolve for {subject.toLowerCase()}
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
              {pointNames.slice(0, 6).map((name) => (
                <li key={name}>{name}</li>
              ))}
              <li>Applicable changes, cancellations, refunds, credits, or fare differences</li>
              <li>Live availability and the terms for the exact reservation</li>
            </ul>
          </div>
          <p>
            Changes and cancellations are not interchangeable: the available
            outcome depends on the ticket rules, how the reservation was issued,
            provider policy, and current availability. Ask about the cost and
            consequences before authorizing a change or cancellation. For
            international travel, verify current passport, visa, transit, and
            entry requirements with the relevant government or consular authority.
          </p>
          <p>
            TicketDepart provides independent travel assistance and is not an
            airline or an airline's official customer-service department. Airline
            names identify the travel options being discussed; they do not imply
            affiliation, endorsement, or official airline support.
          </p>
        </div>
      </div>
    </Section>
  );
}
