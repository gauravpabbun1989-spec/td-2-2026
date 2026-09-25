export type FlightNumberRecord = {
  airlineCode: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  arrivalDateOffset: number;
  operatingDays: string[];
  validFrom?: string;
  validTo?: string;
  source: string;
  verifiedAt: string;
};

export const VERIFIED_FLIGHT_NUMBER_DB: FlightNumberRecord[] = [];

/**
 * Match only an explicitly verified flight number.
 * The route, airline, operating weekday, and scheduled local departure time
 * must all agree. Records can optionally be constrained by validity dates.
 *
 * No flight number is generated or guessed when there is no exact database match.
 */
export function findVerifiedFlight(input: {
  airlineCode: string;
  origin: string;
  destination: string;
  departureTime: string;
  date: string;
}): string | null {
  const normalizedAirline = input.airlineCode.toUpperCase();
  const normalizedOrigin = input.origin.toUpperCase();
  const normalizedDestination = input.destination.toUpperCase();

  const match = VERIFIED_FLIGHT_NUMBER_DB.find((record) => {
    if (record.airlineCode.toUpperCase() !== normalizedAirline) return false;
    if (record.origin.toUpperCase() !== normalizedOrigin) return false;
    if (record.destination.toUpperCase() !== normalizedDestination) return false;
    if (record.departureTime !== input.departureTime) return false;

    const date = input.date;
    if (record.validFrom && date < record.validFrom) return false;
    if (record.validTo && date > record.validTo) return false;

    const weekday = new Date(date + "T00:00:00Z").getUTCDay();
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][weekday];
    return record.operatingDays.includes(day);
  });

  return match ?? null;
}
