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
            It can also help to compare an itinerary by what it requires from you, not only by the departure and arrival times. Consider how early you need to reach the airport, whether a connection leaves enough time for the trip, how convenient the airports are, and whether the baggage allowance fits the travelers. On international journeys, consider the arrival airport and any onward ground transportation as part of the overall plan. For a family or group, a slightly different schedule may be worthwhile if it makes the travelers easier to coordinate.
          </p>
          <p>
            Before a booking is confirmed, review the details that can affect the value of the ticket after purchase. Check the passenger names, dates, airports, flight numbers, cabin, baggage allowance, connection points, and any disclosed fare or service conditions. Ask specifically about changes, cancellations, refunds, credits, fare differences, and ticketing deadlines when those issues matter to your plans. Airline policies and availability can vary by itinerary, fare, route, and provider, so the terms attached to the specific booking should be treated as the final reference.
          </p>
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-subtle">
            <h3 className="font-display text-lg font-semibold text-foreground">High-intent flight booking and reservation searches</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Travelers researching {subject.toLowerCase()} may be looking for flight booking assistance, flight booking by phone, reservation support, flight change assistance, flight cancellation assistance, flight rebooking assistance, flight rescheduling help, last-minute flight booking, international flight booking, multi-city flight booking, business class flight booking, family flight booking, group flight booking, baggage assistance, pet flight booking, infant flight booking, and same-day flight booking. U.S. travelers may also search for flights from New York, Los Angeles, Chicago, Miami, Atlanta, Dallas, Orlando, or San Francisco, as well as USA-to-Europe, USA-to-Asia, USA-to-Middle East, USA-to-Latin America, Caribbean, Canada, Mexico, UK, and other international routes. The exact itinerary, airline, airport, fare, baggage allowance, change policy, cancellation terms, and availability should always be confirmed for the specific reservation.
            </p>
          </div>

          <p>
            Different kinds of trips also call for different questions. A last-minute traveler may care most about ticketing deadlines and realistic departure times. A business traveler may prioritize arrival time, cabin, connectivity, and the ability to change dates. Families may need to discuss seats, baggage, child or infant travel details, and manageable connections. Multi-city travelers should review every segment in order, while premium-cabin travelers may want to confirm the aircraft, seat type, lounge or baggage details that actually apply to the selected itinerary. These details should be checked against the specific ticket rather than assumed from a general airline description.
          </p>
          <p>
            If your plans change later, having the original itinerary and booking information available makes the next conversation easier. Keep the confirmation, ticket number, passenger details, and any messages related to schedule changes or requests. TicketDepart provides independent travel assistance and is not an airline or an airline's official customer-service department. Airline names and trademarks are used only to identify the travel options discussed. When you are ready, you can call a specialist with the information you have and work through the available options before deciding how to proceed.
          </p>
        </div>
      </div>
    </Section>
  );
}
