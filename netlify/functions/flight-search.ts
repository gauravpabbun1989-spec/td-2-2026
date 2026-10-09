const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "access-control-allow-headers": "Content-Type, Accept",
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

type GoogleFlightLeg = {
  airline?: string;
  airline_logo?: string;
  flight_number?: string;
  departure_airport?: { id?: string; time?: string; name?: string };
  arrival_airport?: { id?: string; time?: string; name?: string };
  duration?: number;
};

type GoogleFlightOption = {
  flights?: GoogleFlightLeg[];
  total_duration?: number;
  departure_token?: string;
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

function dateAndTime(value: string | undefined, fallbackDate: string) {
  if (!value) return { date: fallbackDate, time: "" };
  const match = value.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{1,2}:\d{2})/);
  if (match) return { date: match[1], time: match[2].padStart(5, "0") };
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return {
      date: `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`,
      time: `${String(parsed.getHours()).padStart(2, "0")}:${String(parsed.getMinutes()).padStart(2, "0")}`,
    };
  }
  return { date: fallbackDate, time: value };
}

function formatDuration(minutes: number | undefined): string | undefined {
  if (typeof minutes !== "number" || !Number.isFinite(minutes) || minutes < 0) return undefined;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins ? `${hours}h ${mins}m` : `${hours}h`;
}

function normalizeOptions(options: GoogleFlightOption[] | undefined, origin: string, destination: string, date: string, cabin: string) {
  return (options ?? []).flatMap((option, index) => {
    const legs = option.flights ?? [];
    if (!legs.length) return [];
    const displayLegs = legs.map((leg) => {
      const departure = dateAndTime(leg.departure_airport?.time, date);
      const arrival = dateAndTime(leg.arrival_airport?.time, departure.date);
      const airlineCode = (leg.flight_number?.match(/^([A-Z0-9]{2,3})\s/i)?.[1] ?? "").toUpperCase() || undefined;
      return {
        airlineName: leg.airline || airlineCode || "Airline",
        airlineCode,
        logoUrl: leg.airline_logo,
        from: leg.departure_airport?.id || origin,
        to: leg.arrival_airport?.id || destination,
        departureTime: departure.time,
        arrivalTime: arrival.time,
        arrivalDate: arrival.date,
        duration: formatDuration(leg.duration),
      };
    });
    const first = displayLegs[0];
    const last = displayLegs[displayLegs.length - 1];
    const airlineNames = [...new Set(displayLegs.map((leg) => leg.airlineName))];
    return [{
      id: `${origin}-${destination}-${date}-${index}-${legs.length}`,
      airlineName: airlineNames.join(" + "),
      airlineCode: displayLegs[0].airlineCode,
      logoUrl: displayLegs[0].logoUrl,
      departure: { iata: first.from, city: "", date: date, time: first.departureTime },
      arrival: { iata: last.to, city: "", date: last.arrivalDate, time: last.arrivalTime },
      duration: formatDuration(option.total_duration) ?? formatDuration(legs.reduce((sum, leg) => sum + (leg.duration ?? 0), 0)),
      stops: Math.max(0, legs.length - 1),
      cabin,
      legs: displayLegs,
    }];
  });
}

async function searchDirection(origin: string, destination: string, date: string, cabin: string, travelers: number, apiKey: string) {
  const travelClass: Record<string, string> = {
    Economy: "1",
    "Premium economy": "2",
    "Premium Economy": "2",
    Business: "3",
    First: "4",
  };
  const params = new URLSearchParams({
    engine: "google_flights",
    departure_id: origin,
    arrival_id: destination,
    outbound_date: date,
    type: "2",
    adults: String(travelers),
    travel_class: travelClass[cabin] ?? "1",
    currency: "USD",
    hl: "en",
    api_key: apiKey,
  });
  const upstream = await fetch(`https://serpapi.com/search.json?${params.toString()}`);
  const payload = await upstream.json() as {
    error?: string;
    best_flights?: GoogleFlightOption[];
    other_flights?: GoogleFlightOption[];
  };
  if (!upstream.ok || payload.error) {
    throw new Error(payload.error || `Flight provider returned HTTP ${upstream.status}.`);
  }
  return normalizeOptions([...(payload.best_flights ?? []), ...(payload.other_flights ?? [])], origin, destination, date, cabin);
}

export default async (request: Request): Promise<Response> => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (request.method !== "GET") return json({ error: "Use GET to search flight schedules." }, 405);

  const url = new URL(request.url);
  // Accept both the current frontend contract and the legacy live-endpoint
  // contract so older links/callers keep working during deployment rollout.
  const origin = (url.searchParams.get("from") ?? url.searchParams.get("origin") ?? "").trim().toUpperCase();
  const destination = (url.searchParams.get("to") ?? url.searchParams.get("destination") ?? "").trim().toUpperCase();
  const departure = url.searchParams.get("departure") ?? url.searchParams.get("departureDate") ?? "";
  const returnDate = url.searchParams.get("return") ?? url.searchParams.get("returnDate") ?? "";
  const rawTrip = url.searchParams.get("trip") ?? url.searchParams.get("tripType") ?? "One way";
  const trip = /round\s*trip/i.test(rawTrip) || rawTrip === "1" ? "Round trip" : "One way";
  const cabin = url.searchParams.get("cabin") ?? "Economy";
  const travelers = Math.min(9, Math.max(1, Number.parseInt(url.searchParams.get("travelers") ?? "1", 10) || 1));

  if (!/^[A-Z0-9]{3}$/.test(origin) || !/^[A-Z0-9]{3}$/.test(destination) || origin === destination) {
    return json({ error: "Choose two different airports with valid three-character IATA codes." }, 400);
  }
  const isValidDate = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const parsed = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  };
  if (!isValidDate(departure) || (trip === "Round trip" && !isValidDate(returnDate))) {
    return json({ error: "Enter a valid departure date and, for round trips, a valid return date (YYYY-MM-DD)." }, 400);
  }
  if (trip === "Round trip" && returnDate < departure) {
    return json({ error: "The return date cannot be before the departure date." }, 400);
  }
  const apiKey = process.env.SERPAPI_KEY ?? process.env.SERP_API_KEY ?? "";
  if (!apiKey) return json({ error: "Flight search is not configured yet. The API administrator must add the SERPAPI_KEY environment variable in Netlify." }, 503);

  try {
    const outbound = await searchDirection(origin, destination, departure, cabin, travelers, apiKey);
    let inbound: ReturnType<typeof normalizeOptions> = [];
    if (trip !== "One way" && returnDate) {
      inbound = await searchDirection(destination, origin, returnDate, cabin, travelers, apiKey);
    }
    return json({ outbound, inbound });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Flight provider request failed. Please try again." }, 502);
  }
};
