import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";

type Props = {
  airline?: string;
  routeLabel?: string;
  country?: string;
  hub?: string;
  airportLabel?: string;
};

export function FlightServiceIntentSection({
  airline,
  routeLabel,
  country,
  hub,
  airportLabel,
}: Props) {
  const subject = airline
    ? `${airline} flight`
    : routeLabel
      ? `${routeLabel} flight`
      : "flight";
  const destinationContext = country
    ? ` for travelers in the United States traveling to ${country}`
    : "";
  const hubContext = hub ? ` The main connection hub is ${hub}.` : "";
  const airportContext = airportLabel ? ` Major gateway context: ${airportLabel}.` : "";

  // Keep airline + service combinations explicit for visitors searching for
  // airline-specific changes, cancellations, and rebooking help. The shared
  // layout remains the same; the wording reflects the service intent.
  const topics = [
    [
      airline ? `${airline} Changes` : "Flight Changes",
      `Review possible date, time, airport, or routing changes to an existing ${subject}. Eligibility and fare differences depend on the ticket and provider rules.`,
    ],
    [
      airline ? `${airline} Cancellation` : "Flight Cancellation",
      `Discuss cancellation timing, refund or credit possibilities, deadlines, and the effect on the existing ${subject} before authorizing a request.`,
    ],
    [
      airline ? `${airline} Rebooking` : "Flight Rebooking",
      `Compare replacement dates and routes for an existing ${subject}; options depend on ticket terms and current availability.`,
    ],
    [
      airline ? `${airline} Rescheduling` : "Flight Rescheduling",
      "Discuss alternative travel dates and schedules and confirm any fare difference or ticket restriction before a change is made.",
    ],
    [
      airline ? `${airline} Changes by Phone` : "Flight Changes by Phone",
      `A specialist can review the booking details and explain possible next steps for ${subject} changes before you decide how to proceed.`,
    ],
    [
      airline ? `${airline} Cancellation Assistance` : "Flight Cancellation Assistance",
      "Review the ticket rules, cancellation deadline, and possible refund or credit outcome before authorizing cancellation.",
    ],
    [
      airline ? `${airline} Flight Booking` : "Flight Booking by Phone",
      "Discuss dates, routing, travelers, cabin preferences, baggage questions, and fare conditions for a new reservation before authorizing a booking.",
    ],
    [
      airline ? `${airline} Rebooking by Phone` : "Rebooking by Phone",
      "Discuss replacement dates, routing, connection options, and availability for an existing reservation.",
    ],
  ] as const;

  return (
    <Section tone="paper" ocid="flight_service_intent">
      <SectionHeading
        eyebrow="Flight changes, cancellations & rebooking"
        title={`${subject.charAt(0).toUpperCase() + subject.slice(1)} support when plans change`}
        description={`Need to change, cancel, rebook, reschedule, or book a ${subject}${destinationContext}? Review the service options below and call when you want to discuss the details with a travel specialist.${hubContext}${airportContext}`}
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
