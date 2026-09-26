import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dataPath = process.env.TICKETDEPART_FLIGHT_DATABASE
  ? path.resolve(process.env.TICKETDEPART_FLIGHT_DATABASE)
  : fileURLToPath(new URL("../data/flights.json", import.meta.url));

let cache = null;

async function loadDatabase() {
  if (cache) return cache;
  const raw = await readFile(dataPath, "utf8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed.flights)) {
    throw new Error("Flight database must contain a flights array");
  }
  cache = parsed;
  return cache;
}

function sameDate(value, requestedDate) {
  return String(value || "").slice(0, 10) === requestedDate;
}

function normalizeFlight(flight, direction) {
  return {
    airline: flight.airline,
    airlineCode: flight.airlineCode,
    flightNumber: flight.flightNumber,
    direction,
    departure: {
      iata: flight.departure.iata,
      terminal: flight.departure.terminal || null,
      date: flight.departure.date,
      time: flight.departure.time,
    },
    arrival: {
      iata: flight.arrival.iata,
      terminal: flight.arrival.terminal || null,
      date: flight.arrival.date,
      time: flight.arrival.time,
    },
    durationMinutes: flight.durationMinutes ?? null,
    stops: flight.stops ?? 0,
    connections: flight.connections || [],
    aircraft: flight.aircraft || null,
    cabin: flight.cabin || null,
    baggage: flight.baggage || null,
    operatingCarrier: flight.operatingCarrier || null,
    marketingCarrier: flight.marketingCarrier || null,
    sourceUpdatedAt: flight.sourceUpdatedAt || null,
    informationStatus: "scheduled-database",
    fare: undefined,
  };
}

export async function searchLocalScheduleDatabase(query) {
  const database = await loadDatabase();
  const outbound = database.flights
    .filter((flight) =>
      flight.departure?.iata === query.from &&
      flight.arrival?.iata === query.to &&
      sameDate(flight.departure?.date, query.departure)
    )
    .map((flight) => normalizeFlight(flight, "outbound"));

  const inbound = query.returnDate
    ? database.flights
        .filter((flight) =>
          flight.departure?.iata === query.to &&
          flight.arrival?.iata === query.from &&
          sameDate(flight.departure?.date, query.returnDate)
        )
        .map((flight) => normalizeFlight(flight, "inbound"))
    : [];

  return [...outbound, ...inbound];
}
