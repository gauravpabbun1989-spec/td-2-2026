import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";

type Props = {
  airline?: string;
  routeLabel?: string;
  country?: string;
  hub?: string;
  airportLabel?: string;
};

export function FlightServiceIntentSection({ airline, routeLabel, country, hub, airportLabel }: Props) {
  const subject = airline ? `${airline} flight` : routeLabel ? `${routeLabel} flight` : "your flight";
  const brand = airline ? `${airline} ` : "";
  const destinationContext = country
    ? ` for travelers in the United States traveling to ${country}`
    : "";
  const hubContext = hub ? ` The main connection hub is ${hub}.` : "";
  const airportContext = airportLabel ? ` Major gateway context: ${airportLabel}.` : "";

  const topics = [
    [`${brand}change flight`, `Review a date, time, airport, or routing change on an existing ${subject} and discuss applicable fare differences or restrictions.`],
    [`${brand}cancel flight`, `Discuss cancellation options for an existing ${subject}, including whether the ticket terms may allow a refund, credit, or another outcome.`],
    [`${brand}rebook flight`, "If plans changed or a flight was cancelled, compare replacement dates and routing and review availability before rebooking."],
    [`${brand}reschedule flight`, "For a date or schedule change, discuss alternative flights and the conditions attached to the existing reservation."],
    [`${brand}flight change by phone`, "Phone assistance is useful when the itinerary is complex, involves multiple travelers, or needs a careful review of the existing ticket."],
    [`${brand}flight cancellation assistance`, "A specialist can explain the next steps before you authorize a cancellation or change, with final outcomes determined by the ticket and applicable airline rules."],
    [`${brand}flight booking by phone`, "Discuss a new reservation by phone, including dates, routing, travelers, cabin preferences, baggage questions, and fare conditions before you authorize a booking."],
    [`${brand}rebook flight by phone`, "Phone assistance can help when you need to compare replacement dates, routing, connection options, or availability on an existing reservation."],
  ] as const;

  return (
    <Section tone="paper" ocid="flight_service_intent">
      <SectionHeading
        eyebrow="Flight changes, cancellations & rebooking"
        title={`${subject.charAt(0).toUpperCase() + subject.slice(1)} support when plans change`}
        description={`Need to change, cancel, rebook, reschedule, or book ${subject}${destinationContext}? Review the common service requests below and call when you want to discuss the details with a travel specialist.${hubContext}${airportContext}`}
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map(([title, body]) => (
          <article key={title} className="rounded-2xl border border-border bg-card p-5 shadow-subtle">
            <h3 className="font-display text-base font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <CallCta size="lg" ocid="flight_service_intent.call" />
      </div>
    </Section>
  );
}
