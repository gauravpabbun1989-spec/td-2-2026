type Env = {
  ASSETS: Fetcher;
  AVIATION_EDGE_API_KEY: string;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
    },
  });
}

function validDate(value: string) {
  return /^\\d{4}-\\d{2}-\\d{2}$/.test(value);
}

function formatTime(value?: string) {
  if (!value) return "";
  const match = value.match(/T(\\d{2}:\\d{2})/);
  return match?.[1] ?? value;
}

function formatDate(value?: string) {
  return value ? value.slice(0, 10) : "";
}

function durationMinutes(departureTime: string, arrivalTime: string) {
  const start = Date.parse(`1970-01-01T${departureTime}`);
  let end = Date.parse(`1970-01-01T${arrivalTime}`);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return undefined;
  if (end < start) end += 24 * 60 * 1000;
  return Math.round((end - start) / 60000);
}

function formatDuration(minutes?: number) {
  if (!minutes || minutes <= 0) return undefined;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours ? `${hours}h ${mins}m` : `${mins}m`;
}

async function fetchFutureSchedule(
  env: Env,
  airport: string,
  dateValue: string,
  type: "departure" | "arrival",
  routeFilter: string,
) {
  const params = new URLSearchParams({
    key: env.AVIATION_EDGE_API_KEY,
    type,
    iataCode: airport,
    date: dateValue,
  });

  if (type === "departure" && routeFilter) params.set("arr_iataCode", routeFilter);
  if (type === "arrival" && routeFilter) params.set("dep_iataCode", routeFilter);

  const response = await fetch(
    "https://aviation-edge.com/v2/public/flightsFuture?" + params.toString(),
  );

  if (!response.ok) {
    throw new Error("The flight schedule provider could not return the requested date.");
  }

  const payload = await response.json();
  return Array.isArray(payload) ? payload : [];
}

function normalize(item: any, requestedDate: string) {
  const dep = item.departure ?? {};
  const arr = item.arrival ?? {};
  const depTime = String(dep.scheduledTime ?? "");
  const arrTime = String(arr.scheduledTime ?? "");

  if (!dep.iataCode || !arr.iataCode || !depTime || !arrTime) return null;

  return {
    id: String(item.flight?.iataNumber ?? item.flight?.number ?? `${dep.iataCode}-${arr.iataCode}-${depTime}`),
    airlineName: String(item.airline?.name ?? item.airline?.iataCode ?? "Airline"),
    flightNumber: String(item.flight?.iataNumber ?? item.flight?.number ?? ""),
    departure: {
      iata: String(dep.iataCode).toUpperCase(),
      city: "",
      date: requestedDate,
      time: formatTime(depTime),
    },
    arrival: {
      iata: String(arr.iataCode).toUpperCase(),
      city: "",
      date: formatDate(arr.scheduledTime) || requestedDate,
      time: formatTime(arrTime),
    },
    duration: formatDuration(durationMinutes(formatTime(depTime), formatTime(arrTime))),
    stops: 0,
    cabin: undefined,
    baggage: undefined,
    status: "Scheduled",
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname !== "/api/flight-schedules") {
      return env.ASSETS.fetch(request);
    }

    if (request.method !== "GET") return json({ error: "Method not allowed" }, 405);

    const origin = (url.searchParams.get("origin") ?? "").toUpperCase();
    const destination = (url.searchParams.get("destination") ?? "").toUpperCase();
    const departureDate = url.searchParams.get("departureDate") ?? "";
    const returnDate = url.searchParams.get("returnDate") ?? "";
    const tripType = url.searchParams.get("tripType") ?? "One way";

    if (!env.AVIATION_EDGE_API_KEY) {
      return json({ error: "Date-specific flight schedule provider is not configured." }, 503);
    }

    if (!/^[A-Z]{3}$/.test(origin) || !/^[A-Z]{3}$/.test(destination)) {
      return json({ error: "Origin and destination must be IATA airport codes." }, 400);
    }

    if (!validDate(departureDate) || (returnDate && !validDate(returnDate))) {
      return json({ error: "Use YYYY-MM-DD dates." }, 400);
    }

    if (tripType === "Round trip" && (!returnDate || returnDate < departureDate)) {
      return json({ error: "A valid return date is required for a round trip." }, 400);
    }

    try {
      const outbound = await fetchFutureSchedule(
        env,
        origin,
        departureDate,
        "departure",
        destination,
      );

      const flights = outbound
        .map((item) => normalize(item, departureDate))
        .filter(Boolean);

      if (tripType === "Round trip") {
        const inbound = await fetchFutureSchedule(
          env,
          destination,
          returnDate,
          "departure",
          origin,
        );

        flights.push(
          ...inbound
            .map((item) => normalize(item, returnDate))
            .filter(Boolean),
        );
      }

      return json({ flights });
    } catch (error) {
      return json(
        { error: error instanceof Error ? error.message : "Date-specific schedule search failed." },
        502,
      );
    }
  },
};
