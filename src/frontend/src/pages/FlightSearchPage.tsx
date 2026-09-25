import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { findVerifiedFlight } from "@/data/flight-number-db";
import { Seo } from "@/components/Seo";
import { SITE } from "@/lib/site";
import { ArrowRight, Clock3, Luggage, Phone, Search } from "lucide-react";
import { useMemo, useState } from "react";

const AIRPORTS_URL =
  "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat";
const AIR_ROUTES_API = "https://air-routes.com/api/route";

type Airport = { id: string; name: string; city: string; country: string; iata: string };
type LocationChoice = {
  type: "city" | "airport";
  city: string;
  country: string;
  iata?: string;
  label: string;
};
type FlightSchedule = {
  id: string;
  airlineName: string;
  airlineCode?: string;
  logoUrl?: string;
  flightNumber: string;
  departure: { iata: string; city: string; date?: string; time: string };
  arrival: { iata: string; city: string; date?: string; time: string };
  duration?: string;
  stops: number;
  cabin?: string;
  baggage?: string;
  status?: string;
};

const PAGE_PATH = "/flight-search";
const PAGE_TITLE = "Flight Schedule Search | TicketDepart";
const PAGE_DESCRIPTION =
  "Search scheduled route information by city or airport and travel date, then call TicketDepart for prices, confirmation, and booking.";

function parseDat(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[i + 1] === "\n") i += 1;
      row.push(field);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    if (row.some((value) => value.trim())) rows.push(row);
  }
  return rows;
}

async function loadAirports(): Promise<Airport[]> {
  const response = await fetch(AIRPORTS_URL);
  if (!response.ok) throw new Error("Airport search data could not be loaded.");
  return parseDat(await response.text())
    .map((r) => ({
      id: r[0] ?? "",
      name: r[1] ?? "",
      city: r[2] ?? "",
      country: r[3] ?? "",
      iata: r[4] === "\\N" ? "" : r[4] ?? "",
    }))
    .filter((a) => a.iata);
}

function choices(airports: Airport[], query: string): LocationChoice[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const matched = airports
    .filter((a) => [a.iata, a.name, a.city, a.country].join(" ").toLowerCase().includes(q))
    .slice(0, 10);
  const cityMap = new Map<string, Airport>();
  matched.forEach((airport) => {
    const key = airport.city.toLowerCase() + "|" + airport.country.toLowerCase();
    if (!cityMap.has(key)) cityMap.set(key, airport);
  });
  const cities = Array.from(cityMap.values()).slice(0, 3).map((a) => ({
    type: "city" as const,
    city: a.city,
    country: a.country,
    iata: a.iata,
    label: a.city + ", " + a.country + " — Primary airport (" + a.iata + ")",
  }));
  const airportChoices = matched.slice(0, 7).map((a) => ({
    type: "airport" as const,
    city: a.city,
    country: a.country,
    iata: a.iata,
    label: a.city + " — " + a.name + " (" + a.iata + ")",
  }));
  return [...cities, ...airportChoices];
}

function normalizeSchedule(payload: unknown, requestedDate: string, requestedCabin: string): FlightSchedule[] {
  const route = payload as {
    route_id?: string;
    from?: string;
    to?: string;
    status?: string;
    flying_min?: number;
    airlines?: Array<{
      airline_code?: string;
      airline?: string;
      schedule?: Array<{ day?: string; times?: string[] }>;
      seasonal_note?: string | null;
    }>;
  };
  if (!route || !Array.isArray(route.airlines)) return [];

  const [origin, destination] = String(route.route_id ?? "").split("-");
  const requestedDay = dateToAirRoutesDay(requestedDate);
  const duration = Number.isFinite(route.flying_min) ? formatDuration(Number(route.flying_min)) : undefined;
  const results: FlightSchedule[] = [];

  route.airlines.forEach((airline, airlineIndex) => {
    (airline.schedule ?? []).forEach((entry, dayIndex) => {
      if (entry.day !== requestedDay) return;
      const times = Array.isArray(entry.times) && entry.times.length ? entry.times : [""];
      times.forEach((time, timeIndex) => {
        const verified = airline.airline_code && time
          ? findVerifiedFlight({
              airlineCode: String(airline.airline_code),
              origin: String(origin ?? ""),
              destination: String(destination ?? ""),
              departureTime: String(time),
              date: requestedDate,
            })
          : null;
        if (!verified) return;

        results.push({
          id: [route.route_id, airline.airline_code, requestedDay, time, verified.flightNumber, airlineIndex, dayIndex, timeIndex].join("-"),
          airlineName: String(airline.airline ?? airline.airline_code ?? "Airline"),
          airlineCode: airline.airline_code ? String(airline.airline_code).toUpperCase() : undefined,
          logoUrl: airline.airline_code
            ? "https://images.kiwi.com/airlines/64/" + encodeURIComponent(String(airline.airline_code).toUpperCase()) + ".png"
            : undefined,
          flightNumber: verified.flightNumber,
          departure: {
            iata: String(origin ?? ""),
            city: "",
            date: requestedDate,
            time: String(time || "Time not supplied"),
          },
          arrival: {
            iata: String(destination ?? ""),
            city: "",
            date: currentRequestedDate,
            time: "",
          },
          duration,
          stops: 0,
          cabin: requestedCabin,
          baggage: "Allowance varies by fare",
          status: String(route.status ?? "Scheduled"),
        });
      });
    });
  });
  return results;
}

function addDaysToIsoDate(date: string, offset: number): string {
  const parsed = new Date(date + "T00:00:00Z");
  parsed.setUTCDate(parsed.getUTCDate() + offset);
  return parsed.toISOString().slice(0, 10);
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins ? hours + "h " + mins + "m" : hours + "h";
}

function dateToAirRoutesDay(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][weekday] ?? "";
}

async function fetchAirRoutesRoute(origin: string, destination: string, date: string, cabin: string) {
  const response = await fetch(AIR_ROUTES_API + "/" + encodeURIComponent(origin) + "-" + encodeURIComponent(destination));
  if (!response.ok) {
    throw new Error("Air-Routes could not return route information for " + origin + " to " + destination + ".");
  }
  return normalizeSchedule(await response.json(), date, cabin);
}

async function fetchSchedules(
  fromChoice: LocationChoice,
  toChoice: LocationChoice,
  date: string,
  returnDate: string,
  tripType: string,
  cabin: string,
  travelers: string,
): Promise<FlightSchedule[]> {
  void tripType;
  void travelers;
  const origin = fromChoice.iata ?? "";
  const destination = toChoice.iata ?? "";
  if (!origin || !destination) throw new Error("Select airports with valid IATA codes.");
  const outbound = await fetchAirRoutesRoute(origin, destination, date, cabin);
  if (!returnDate) return outbound;
  const inbound = await fetchAirRoutesRoute(destination, origin, returnDate, cabin);
  return [...outbound, ...inbound];
}

export function FlightSearchPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromChoice, setFromChoice] = useState<LocationChoice | null>(null);
  const [toChoice, setToChoice] = useState<LocationChoice | null>(null);
  const [tripType, setTripType] = useState("Round trip");
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [travelers, setTravelers] = useState("1");
  const [cabin, setCabin] = useState("Economy");
  const [airports, setAirports] = useState<Airport[]>([]);
  const [results, setResults] = useState<FlightSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAirports, setLoadingAirports] = useState(false);
  const [error, setError] = useState("");

  const ensureAirports = async () => {
    if (airports.length) return airports;
    setLoadingAirports(true);
    try {
      const loaded = await loadAirports();
      setAirports(loaded);
      return loaded;
    } finally {
      setLoadingAirports(false);
    }
  };

  const fromMatches = useMemo(() => choices(airports, from), [airports, from]);
  const toMatches = useMemo(() => choices(airports, to), [airports, to]);

  const search = async () => {
    setLoading(true);
    setError("");
    setResults([]);
    try {
      if (!fromChoice || !toChoice) {
        throw new Error("Select a city or airport from the suggestions for both departure and destination.");
      }
      if (!date) throw new Error("Select a departure date.");
      if (tripType === "Round trip" && !returnDate) throw new Error("Select a return date for a round trip.");
      if (tripType === "Round trip" && returnDate < date) throw new Error("Return date cannot be before departure date.");
      const schedules = await fetchSchedules(
        fromChoice,
        toChoice,
        date,
        returnDate,
        tripType,
        cabin,
        travelers,
      );
      setResults(schedules);
      if (!schedules.length) setError("No scheduled flights were returned for this search.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Schedule search failed.");
    } finally {
      setLoading(false);
    }
  };

  const suggestionList = (
    values: LocationChoice[],
    setValue: (value: string) => void,
    setChoice: (choice: LocationChoice) => void,
  ) =>
    values.length > 0 ? (
      <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-border bg-card p-1 shadow-elevated">
        {values.map((choice, index) => (
          <button
            type="button"
            key={choice.type + "-" + choice.city + "-" + (choice.iata ?? index)}
            onClick={() => {
              setChoice(choice);
              setValue(
                choice.type === "city"
                  ? choice.city + ", " + choice.country
                  : choice.city + " (" + choice.iata + ")",
              );
            }}
            className="block w-full rounded-lg px-3 py-3 text-left text-sm hover:bg-muted"
          >
            <span className="mr-2 rounded-full border border-border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              {choice.type === "city" ? "City" : "Airport"}
            </span>
            <strong>{choice.type === "city" ? choice.label : choice.city}</strong>
            {choice.type === "airport" && (
              <span className="text-muted-foreground"> — {choice.label.split(" — ")[1]}</span>
            )}
          </button>
        ))}
      </div>
    ) : null;

  return (
    <>
      <Seo title={PAGE_TITLE} description={PAGE_DESCRIPTION} path={PAGE_PATH} />
      <section
        className="relative overflow-visible bg-cover bg-center py-16 sm:py-24"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 28, 45, 0.42), rgba(0, 28, 45, 0.58)), url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85)",
        }}
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center text-white">
            <p className="label-board text-white/90">Flight Schedule Search</p>
            <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
              Find scheduled flights by city or airport
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg">
              Choose your route, dates, travelers, and cabin. Review verified departure and arrival times, then call
              TicketDepart for prices, confirmation, and booking.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-white/30 bg-white/95 p-5 shadow-elevated backdrop-blur-sm sm:p-7">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="relative">
                <span className="text-sm font-semibold">From city or airport</span>
                <input
                  value={from}
                  onFocus={() => void ensureAirports()}
                  onChange={(e) => {
                    setFrom(e.target.value);
                    setFromChoice(null);
                  }}
                  placeholder={loadingAirports ? "Loading airports…" : "Enter city, airport, or IATA code"}
                  className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                {suggestionList(fromMatches, setFrom, setFromChoice)}
              </label>

              <label className="relative">
                <span className="text-sm font-semibold">To city or airport</span>
                <input
                  value={to}
                  onFocus={() => void ensureAirports()}
                  onChange={(e) => {
                    setTo(e.target.value);
                    setToChoice(null);
                  }}
                  placeholder="Enter city, airport, or IATA code"
                  className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                {suggestionList(toMatches, setTo, setToChoice)}
              </label>

              <label>
                <span className="text-sm font-semibold">Trip type</span>
                <select
                  value={tripType}
                  onChange={(e) => {
                    setTripType(e.target.value);
                    if (e.target.value === "One way") setReturnDate("");
                  }}
                  className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option>Round trip</option>
                  <option>One way</option>
                </select>
              </label>

              <label>
                <span className="text-sm font-semibold">Departure date</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </label>

              <label>
                <span className="text-sm font-semibold">Return date</span>
                <input
                  type="date"
                  value={returnDate}
                  min={date || undefined}
                  disabled={tripType === "One way"}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </label>

              <label>
                <span className="text-sm font-semibold">Travelers</span>
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {Array.from({ length: 9 }, (_, i) => String(i + 1)).map((count) => (
                    <option key={count} value={count}>
                      {count} {count === "1" ? "traveler" : "travelers"}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="text-sm font-semibold">Cabin / class</span>
                <select
                  value={cabin}
                  onChange={(e) => setCabin(e.target.value)}
                  className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option>Economy</option>
                  <option>Premium Economy</option>
                  <option>Business</option>
                  <option>First</option>
                </select>
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={search}
                disabled={loading}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground disabled:opacity-60"
              >
                <Search aria-hidden="true" className="size-4" />
                {loading ? "Finding schedules…" : "Search schedules"}
              </button>
              <span className="text-sm text-muted-foreground">
                {tripType} · {date ? "Depart: " + date + " · " : ""}{returnDate ? "Return: " + returnDate + " · " : ""}
                {travelers} traveler{travelers === "1" ? "" : "s"} · {cabin}
              </span>
            </div>
            {error && (
              <p role="alert" className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                {error}
              </p>
            )}
          </div>
        </div>
      </section>

      <Section tone="muted" ocid="flight_search.results" aria-labelledby="flight_search_results_heading">
        <SectionHeading
          id="flight_search_results_heading"
          eyebrow="Flight schedules"
          title={results.length ? results.length + " scheduled flight" + (results.length === 1 ? "" : "s") : "Scheduled flight times"}
          description="Each result is shown only when a verified flight number and arrival time match the selected route, date, airline, and scheduled departure time."
        />

        {results.length > 0 ? (
          <div className="mt-10 grid gap-4">
            {results.map((result) => (
              <article key={result.id} className="rounded-2xl border border-border bg-card p-5 shadow-subtle sm:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex min-w-[112px] flex-col items-center justify-center rounded-xl border border-border bg-background px-4 py-3 text-center">
                        {result.logoUrl ? (
                          <img
                            src={result.logoUrl}
                            alt={result.airlineName + " logo"}
                            className="h-12 w-20 object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-12 w-20 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground">
                            {result.airlineCode ?? "AIR"}
                          </div>
                        )}
                        <span className="mt-2 text-xs font-bold text-foreground">{result.airlineName}</span>
                        <span className="mt-0.5 text-[11px] text-muted-foreground">
                          {"Flight " + result.flightNumber}
                        </span>
                      </div>
                      {result.status && <span className="rounded-full border border-border px-3 py-1">{result.status}</span>}
                    </div>

                    <div className="mt-5 grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
                      <div>
                        <p className="text-2xl font-bold">{result.departure.time}</p>
                        <p className="font-semibold">{result.departure.iata}</p>
                        <p className="text-sm text-muted-foreground">{result.departure.city}</p>
                        {result.departure.date && <p className="text-xs text-muted-foreground">{result.departure.date}</p>}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Clock3 aria-hidden="true" className="size-4" />
                        {result.duration ?? "Schedule"}
                        <ArrowRight aria-hidden="true" className="size-5 text-accent" />
                        {result.stops === 0 ? "Nonstop" : result.stops + " stop" + (result.stops === 1 ? "" : "s")}
                      </div>
                      <div className="sm:text-right">
                        <p className="text-lg font-bold">{result.arrival.time || "Time not supplied"}</p>
                        <p className="font-semibold">{result.arrival.iata}</p>
                        <p className="text-sm text-muted-foreground">{result.arrival.city}</p>
                        {result.arrival.date && <p className="text-xs text-muted-foreground">{result.arrival.date}</p>}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                      {result.cabin && <span>Class: {result.cabin}</span>}
                      {result.baggage && (
                        <span className="inline-flex items-center gap-1">
                          <Luggage aria-hidden="true" className="size-3.5" /> {result.baggage}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex w-full shrink-0 flex-col items-center lg:w-64">
                    <a
                      href={SITE.phoneHref}
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground"
                    >
                      <Phone aria-hidden="true" className="size-4" /> Call for Prices / Confirm / Book
                    </a>
                    <p className="mt-2 text-center text-[11px] leading-4 text-muted-foreground">
                      *Complimentary extra add-ons may be available with select fares. Availability and eligibility vary.
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-border bg-card p-7 text-sm text-muted-foreground">
            Search for a route and date to see scheduled departure and arrival times.
          </div>
        )}
      </Section>

      <Section tone="paper" ocid="flight_search.cta">
        <div className="grid gap-8 rounded-3xl border border-border bg-card p-7 shadow-elevated sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="label-board text-accent">Ready to book?</p>
            <h2 className="mt-3 text-3xl font-bold">Call to confirm the schedule</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              A specialist can provide current pricing and confirm the flight number, schedule, baggage allowance, and booking conditions for your selected trip.
            </p>
          </div>
          <CallCta size="lg" ocid="flight_search.call_button" />
        </div>
      </Section>

      <Section tone="muted" ocid="flight_search.disclosure">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Results are filtered to the selected travel date(s) and displayed only when the local verified flight database contains a matching flight number and arrival time. Air-Routes supplies route operating-day and departure-time information; it does not supply the verified flight number or arrival time. Current fare, availability, baggage, and booking conditions are confirmed before booking.{" "}
          {SITE.disclosure}
        </p>
      </Section>
    </>
  );
}
