import { Section, SectionHeading } from "@/components/Section";

type PageContentExpansionProps = {
  subject: string;
  intro: string;
  points: readonly [string, string][];
  context?: string;
};

export function PageContentExpansion({
  subject,
  intro,
  points,
  context,
}: PageContentExpansionProps) {
  const pointNames = points.slice(0, 4).map(([name]) => name);
  const pointDetails = points.slice(0, 4).map(([, detail]) => detail);

  return (
    <Section tone="muted" ocid="page.content_expansion">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Planning details"
          title={`A practical guide to ${subject}`}
          description="The useful part of flight planning is understanding how the individual choices fit together."
        />
        <div className="mt-10 space-y-6 text-base leading-7 text-muted-foreground">
          <p>
            {intro} {context ?? `For ${subject.toLowerCase()}, the right choice can depend on more than the departure and arrival cities. Travel dates, airport convenience, connection time, cabin preference, baggage, and the flexibility of the ticket can all affect which itinerary makes sense for your trip.`}
          </p>
          <p>
            Start with the details you know and work outward from there. {pointNames.join(", ")} are useful starting points because each can change the practical shape of an itinerary. {pointDetails.slice(0, 2).join(" ")} If one part of the plan is flexible, mention that early. A wider date range, an alternate airport, or a willingness to connect can create different itinerary choices, although availability and pricing always depend on the live inventory and fare rules that apply at the time.
          </p>
          <p>
            It is also worth looking beyond the first itinerary that appears. A nonstop flight may save connection time, while a connecting itinerary can provide a different schedule or airport combination. For international travel, connection airports, terminal changes, transit requirements, and arrival times can matter. For family, group, corporate, or premium-cabin travel, seating, baggage, schedule priorities, and cabin inclusions may deserve equal attention. The goal is to compare the complete trip rather than one isolated flight detail.
          </p>
          <p>
            Before a booking is confirmed, review the details that can affect the value of the ticket after purchase. Check the passenger names, dates, airports, flight numbers, cabin, baggage allowance, connection points, and any disclosed fare or service conditions. Ask specifically about changes, cancellations, refunds, credits, fare differences, and ticketing deadlines when those issues matter to your plans. Airline policies and availability can vary by itinerary, fare, route, and provider, so the terms attached to the specific booking should be treated as the final reference.
          </p>
          <p>
            If your plans change later, having the original itinerary and booking information available makes the next conversation easier. Keep the confirmation, ticket number, passenger details, and any messages related to schedule changes or requests. TicketDepart provides independent travel assistance and is not an airline or an airline's official customer-service department. Airline names and trademarks are used only to identify the travel options discussed. When you are ready, you can call a specialist with the information you have and work through the available options before deciding how to proceed.
          </p>
        </div>
      </div>
    </Section>
  );
}
