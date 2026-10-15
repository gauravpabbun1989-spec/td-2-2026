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
  const pointNames = points.map(([name]) => name).filter(Boolean).slice(0, 6);
  const introFocus = intro.split(/\s+/).slice(0, 14).join(" ");
  const subjectLower = subject.toLowerCase();
  const planningContext =
    context ??
    `A useful starting point for ${subjectLower} is to work out what matters most on this trip: the dates you can travel, which airports are practical, how much time you have between connections, and what you need from the cabin and baggage allowance. Those details often narrow the options faster than looking at a long list of flights.`;

  return (
    <Section tone="muted" ocid="page.content_expansion">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Planning details"
          title={`Before you confirm ${subject}`}
          description={`A few practical things to check for ${subjectLower}. This guide covers ${introFocus}.`}
        />
        <div className="mt-10 space-y-6 text-base leading-7 text-muted-foreground">
          <p>{planningContext}</p>
          <p>
            Before you settle on an itinerary, check the details that are easy to
            overlook when comparing flights: the airport code, local arrival
            time, connection length, baggage included in the fare, and the name
            on each ticket. If you are calling about a booking you already have,
            keep the confirmation number handy. It makes it easier to discuss the
            right reservation rather than starting from scratch.
          </p>
          {pointNames.length > 0 && (
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-subtle">
              <h3 className="font-display text-lg font-semibold text-foreground">
                Questions worth asking about {subjectLower}
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                {pointNames.map((name) => (
                  <li key={name}>{name}</li>
                ))}
                <li>Whether a change, cancellation, refund, or credit has a cost or deadline</li>
                <li>Which conditions apply to the exact ticket you are considering</li>
              </ul>
            </div>
          )}
          <p>
            If plans might change, ask what the ticket allows before you pay.
            Change fees, fare differences, refund options, and credit rules are
            not the same thing, and the answer depends on the fare and how the
            reservation was issued. For international trips, check passport,
            visa, transit, and entry rules with the relevant government
            authority; requirements can depend on your citizenship and route.
          </p>
          <p>
            TicketDepart is an independent travel assistance service, not an
            airline or an airline's official customer-service department. We
            can help you talk through the itinerary and booking details, while
            airline schedules, availability, and ticket conditions must be
            confirmed for the specific trip.
          </p>
        </div>
      </div>
    </Section>
  );
}
