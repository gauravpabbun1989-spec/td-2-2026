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

export function findVerifiedFlight(input: {
  airlineCode: string;
  origin: string;
  destination: string;
  departureTime: string;
  date: string;
}): FlightNumberRecord | null {
  const normalizedAirline = input.airlineCode.toUpperCase();
  const normalizedOrigin = input.origin.toUpperCase();
  const normalizedDestination = input.destination.toUpperCase();

  return (
    VERIFIED_FLIGHT_NUMBER_DB.find((record) => {
      if (record.airlineCode.toUpperCase() !== normalizedAirline) return false;
      if (record.origin.toUpperCase() !== normalizedOrigin) return false;
      if (record.destination.toUpperCase() !== normalizedDestination) return false;
      if (record.departureTime !== input.departureTime) return false;
      if (!record.arrivalTime || record.arrivalDateOffset < 0) return false;
      if (record.validFrom && input.date < record.validFrom) return false;
      if (record.validTo && input.date > record.validTo) return false;

      const weekday = new Date(input.date + "T00:00:00Z").getUTCDay();
      const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][weekday];
      return record.operatingDays.includes(day);
    }) ?? null
  );
}
