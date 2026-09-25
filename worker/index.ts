type Env = {
  ASSETS: Fetcher;
  AMADEUS_CLIENT_ID: string;
  AMADEUS_CLIENT_SECRET: string;
  AMADEUS_API_BASE_URL: string;
};

type AmadeusSegment = {
  carrierCode?: string;
  number?: string;
  departure?: { iataCode?: string; at?: string };
  arrival?: { iataCode?: string; at?: string };
  duration?: string;
  numberOfStops?: number;
};

type AmadeusItinerary = {
  duration?: string;
  segments?: AmadeusSegment[];
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
  if (!value) return "";
  return value.slice(0, 10);
}

function cabinName(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function getToken(env: Env) {
  const base = env.AMADEUS_API_BASE_URL.replace(/\\/$/, "");
  const response = await fetch(base + "/v1/security/oauth2/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: env.AMADEUS_CLIENT_ID,
      client_secret: env.AMADEUS_CLIENT_SECRET,
    }),
  });
  if (!response.ok) throw new Error("Flight data provider authentication failed.");
  const payload = (await response.json()) as { access_token?: string };
  if (!payload.access_token) throw new Error("Flight data provider returned no access token.");
  return payload.access_token;
}

function toFlight(
  offer: any,
  itinerary: AmadeusItinerary,
  dictionaries: { carriers?: Record<string, string> },
  requestedDate: string,
  cabin: string,
  baggage?: string,
  idSuffix = "",
) {
  const segments = itinerary.segments ?? [];
  if (!segments.length) return null;
  const first = segments[0];
  const last = segments[segments.length - 1];
  const departureAt = first.departure?.at ?? "";
  const arrivalAt = last.arrival?.at ?? "";
  if (!departureAt || !arrivalAt) return null;
  if (formatDate(departureAt) !== requestedDate) return null;

  const carrier = first.carrierCode ?? "";
  return {
    id: String(offer.id ?? "flight") + idSuffix,
    airlineName: dictionaries.carriers?.[carrier] ?? carrier,
    flightNumber: carrier + (first.number ?? ""),
    departure: {
      iata: first.departure?.iataCode ?? "",
      city: "",
      date: formatDate(departureAt),
      time: formatTime(departureAt),
    },
    arrival: {
      iata: last.arrival?.iataCode ?? "",
      city: "",
      date: formatDate(arrivalAt),
      time: formatTime(arrivalAt),
    },
    duration: itinerary.duration,
    stops: segments.reduce((total, segment) => total + Number(segment.numberOfStops ?? 0), 0),
    cabin: cabinName(cabin),
    baggage,
    status: "Scheduled",
  };
}

function getBaggage(offer: any) {
  const details = offer.travelerPricings?.[0]?.fareDetailsBySegment ?? [];
  const quantities = details
    .map((detail: any) => detail.includedCheckedBags?.quantity)
    .filter((value: unknown) => typeof value === "number");
  if (!quantities.length) return undefined;
  const max = Math.max(...quantities);
  return max === 1 ? "1 checked bag" : max + " checked bags";
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
    const travelers = Math.max(1, Math.min(9, Number(url.searchParams.get("travelers") ?? "1")));
    const cabin = (url.searchParams.get("cabin") ?? "Economy").toUpperCase().replace(" ", "_");

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
      const token = await getToken(env);
      const base = env.AMADEUS_API_BASE_URL.replace(/\\/$/, "");
      const params = new URLSearchParams({
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate,
        adults: String(travelers),
        travelClass: cabin,
        max: "50",
      });
      if (tripType === "Round trip") params.set("returnDate", returnDate);

      const response = await fetch(base + "/v2/shopping/flight-offers?" + params.toString(), {
        headers: { Authorization: "Bearer " + token },
      });
      if (!response.ok) {
        return json({ error: "The flight data provider could not return schedules for this date." }, 502);
      }

      const payload = (await response.json()) as {
        data?: any[];
        dictionaries?: { carriers?: Record<string, string> };
      };
      const dictionaries = payload.dictionaries ?? {};
      const flights = (payload.data ?? [])
        .flatMap((offer: any) => {
          const outbound = toFlight(
            offer,
            offer.itineraries?.[0] ?? {},
            dictionaries,
            departureDate,
            cabin,
            getBaggage(offer),
          );
          const result = outbound ? [outbound] : [];
          if (tripType === "Round trip" && returnDate) {
            const inbound = toFlight(
              offer,
              offer.itineraries?.[1] ?? {},
              dictionaries,
              returnDate,
              cabin,
              getBaggage(offer),
              "-return",
            );
            if (inbound) result.push(inbound);
          }
          return result;
        })
        .filter(Boolean);

      return json({ flights });
    } catch (error) {
      return json(
        { error: error instanceof Error ? error.message : "Flight schedule search failed." },
        502,
      );
    }
  },
};
