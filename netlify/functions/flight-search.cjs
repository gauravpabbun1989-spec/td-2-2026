const crypto = require("node:crypto");

function json(body, status = 200, cacheable = false) {
  return {
    statusCode: status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": cacheable
        ? "public, max-age=60, s-maxage=900"
        : "no-store",
      "access-control-allow-origin": "*",
    },
    body: JSON.stringify(body),
  };
}

function formatDuration(minutes) {
  if (!minutes || minutes <= 0) return undefined;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours ? `${hours}h ${mins}m` : `${mins}m`;
}
function normalize(option, index, cabin) {
  const segments = option.flights || [];
  const first = segments[0];
  const last = segments[segments.length - 1];

  const airlines = [
    ...new Set(segments.map((s) => s.airline).filter(Boolean)),
  ];

  const legs = segments.map((s, i) => ({
    airlineName: s.airline || "Airline",
    airlineCode: s.flight_number
      ? s.flight_number.split(/\s+/)[0]
      : undefined,
    logoUrl: s.airline_logo,
    from: s.departure_airport?.id || "",
    to: s.arrival_airport?.id || "",
    departureTime: s.departure_airport?.time || "",
    arrivalTime: s.arrival_airport?.time || "",
    arrivalDate: s.arrival_airport?.time?.slice(0, 10),
    duration: formatDuration(s.duration),
  }));

  return {
    id:
      "serpapi-" +
      index +
      "-" +
      (option.departure_token ||
        option.booking_token ||
        crypto.randomUUID()),
    airlineName: airlines.join(" + ") || "Airline",
    airlineCode: legs[0]?.airlineCode,
    logoUrl: option.airline_logo || legs[0]?.logoUrl,
    departure: {
      iata: first?.departure_airport?.id || "",
      city: first?.departure_airport?.name || "",
      date: first?.departure_airport?.time?.slice(0, 10),
      time: first?.departure_airport?.time?.slice(11, 16) || "",
    },
    arrival: {
      iata: last?.arrival_airport?.id || "",
      city: last?.arrival_airport?.name || "",
      date: last?.arrival_airport?.time?.slice(0, 10),
      time: last?.arrival_airport?.time?.slice(11, 16) || "",
    },
    duration: formatDuration(option.total_duration),
    stops: Math.max(0, segments.length - 1),
    cabin,
    price:
      typeof option.price === "number"
        ? option.price
        : undefined,
    departureToken: option.departure_token,
    bookingToken: option.booking_token,
    legs,
  };
}
exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return json({ error: "Method not allowed" }, 405);
  }

  const apiKey = process.env.SERPAPI_KEY;

  if (!apiKey) {
    return json(
      {
        error:
          "Flight search is not configured yet. Please try again shortly.",
      },
      503
    );
  }

  const q = event.queryStringParameters || {};

  const origin = String(q.origin || "").toUpperCase();
  const destination = String(q.destination || "").toUpperCase();
  const departureDate = String(q.departureDate || "");
  const returnDate = String(q.returnDate || "");
  const tripType = String(q.tripType || "One way");
  const travelers = Math.min(
    9,
    Math.max(1, Number(q.travelers || "1"))
  );
  const cabin = String(q.cabin || "Economy");
  const departureToken = String(q.departureToken || "");

  if (departureToken.length > 10000) {
    return json(
      { error: "Invalid flight selection token." },
      400
    );
  }

  if (!departureToken) {
    if (
      !/^[A-Z]{3}$/.test(origin) ||
      !/^[A-Z]{3}$/.test(destination)
    ) {
      return json(
        {
          error:
            "Origin and destination must be IATA airport codes.",
        },
        400
      );
    }

    if (origin === destination) {
      return json(
        {
          error:
            "Origin and destination cannot be the same airport.",
        },
        400
      );
    }

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(departureDate) ||
      (tripType === "Round trip" &&
        !/^\d{4}-\d{2}-\d{2}$/.test(returnDate))
    ) {
      return json(
        { error: "Use valid YYYY-MM-DD travel dates." },
        400
      );
    }

    if (
      tripType === "Round trip" &&
      returnDate < departureDate
    ) {
      return json(
        {
          error: "Return date cannot be before departure date.",
        },
        400
      );
    }
  }
  const travelClass =
    {
      Economy: "1",
      "Premium Economy": "2",
      Business: "3",
      First: "4",
    }[cabin] || "1";

  const params = new URLSearchParams({
    engine: "google_flights",
    api_key: apiKey,
    gl: "us",
    hl: "en",
    currency: "USD",
    type: tripType === "Round trip" ? "1" : "2",
    travel_class: travelClass,
  });

  if (departureToken) {
    params.set("departure_token", departureToken);
  } else {
    params.set("departure_id", origin);
    params.set("arrival_id", destination);
    params.set("outbound_date", departureDate);

    if (tripType === "Round trip") {
      params.set("return_date", returnDate);
    }

    params.set("adults", String(travelers));
  }

  try {
    const response = await fetch(
      "https://serpapi.com/search.json?" + params.toString(),
      {
        headers: {
          accept: "application/json",
        },
        signal: AbortSignal.timeout(15000),
      }
    );

    const payload = await response.json();

    if (!response.ok || payload.error) {
      return json(
        {
          error:
            payload.error ||
            "SerpApi flight search failed.",
        },
        502
      );
    }
    const options = [
      ...(payload.best_flights || []),
      ...(payload.other_flights || []),
    ].slice(0, 20);

    const flights = options.map((option, index) =>
      normalize(option, index, cabin)
    );

    return json(
      {
        outbound: departureToken ? [] : flights,
        inbound: departureToken ? flights : [],
        source: "SerpApi Google Flights",
        live: true,
        travelers,
        cabin,
      },
      200,
      true
    );
  } catch (error) {
    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Flight search failed.",
      },
      502
    );
  }
};
