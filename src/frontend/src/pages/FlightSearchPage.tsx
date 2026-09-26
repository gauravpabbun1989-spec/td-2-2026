import { CallCta } from "@/components/CallCta";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { SITE } from "@/lib/site";
import { ArrowRight, Clock3, Luggage, Phone, Search } from "lucide-react";
import { useMemo, useState } from "react";

const AIRPORTS_URL =
  "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat";
const AIR_ROUTES_API = "https://air-routes.com/api/route";

type Airport = { id: string; name: string; city: string; country: string; iata: string; timezone?: string };
type LocationChoice = {
  type: "city" | "airport";
  city: string;
  country: string;
  iata?: string;
  timezone?: string;
  label: string;
};
type FlightSchedule = {
  id: string;
  airlineName: string;
  airlineCode?: string;
  logoUrl?: string;
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
  "Search free Air-Routes scheduled route information by city or airport and travel date, then call TicketDepart to confirm booking details.";

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
      timezone: r[11] === "\\N" ? undefined : r[11] || undefined,
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
  for (const airport of matched) {
    const key = `${airport.city.toLowerCase()}|${airport.country.toLowerCase()}`;
    if (!cityMap.has(key)) cityMap.set(key, airport);
  }
  const cities = Array.from(cityMap.values()).slice(0, 3).map((a) => ({
    type: "city" as const,
    city: a.city,
    country: a.country,
    iata: a.iata,
    timezone: a.timezone,
    label: `${a.city}, ${a.country} — Primary airport (${a.iata})`,
  }));
  const airportChoices = matched.slice(0, 7).map((a) => ({
    type: "airport" as const,
    city: a.city,
    country: a.country,
    iata: a.iata,
    timezone: a.timezone,
    label: `${a.city} — ${a.name} (${a.iata})`,
  }));
  return [...cities, ...airportChoices];
}

function normalizeSchedule(payload: unknown, requestedDate: string, requestedCabin: string, originTimezone?: string, destinationTimezone?: string): FlightSchedule[] {
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
  const durationMinutes = Number.isFinite(route.flying_min) ? Number(route.flying_min) : undefined;
  const duration = durationMinutes !== undefined ? formatDuration(durationMinutes) : undefined;
  const results: FlightSchedule[] = [];

  route.airlines.forEach((airline, airlineIndex) => {
    (airline.schedule ?? []).forEach((entry, dayIndex) => {
      if (entry.day !== requestedDay) return;
      const times = Array.isArray(entry.times) ? entry.times : [];
      times.forEach((time, timeIndex) => {
        const arrival = calculateArrival(String(time), requestedDate, durationMinutes, originTimezone, destinationTimezone);
        results.push({
          id: `${route.route_id}-${airline.airline_code}-${requestedDay}-${time}-${airlineIndex}-${dayIndex}-${timeIndex}`,
          airlineName: String(airline.airline ?? airline.airline_code ?? "Airline"),
          airlineCode: airline.airline_code ? String(airline.airline_code).toUpperCase() : undefined,
          logoUrl: airline.airline_code
            ? `https://images.kiwi.com/airlines/64/${encodeURIComponent(String(airline.airline_code).toUpperCase())}.png`
            : undefined,
          departure: {
            iata: String(origin ?? ""),
            city: "",
            date: requestedDate,
            time: String(time || "Time not supplied"),
          },
          arrival: {
            iata: String(destination ?? ""),
            city: "",
            date: arrival?.date ?? requestedDate,
            time: arrival?.time ?? (durationMinutes !== undefined ? "Estimated arrival" : "Arrival time unavailable"),
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

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins ? `${hours}h ${mins}m` : `${hours}h`;
}

function calculateArrival(
  departureTime: string,
  departureDate: string,
  durationMinutes?: number,
  originTimezone?: string,
  destinationTimezone?: string,
): { date: string; time: string } | null {
  if (durationMinutes === undefined || !originTimezone || !destinationTimezone) return null;
  const match = departureTime.match(/^(\\d{1,2}):(\\d{2})/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;

  const [year, month, day] = departureDate.split("-").map(Number);
  const localAsUtc = Date.UTC(year, month - 1, day, hours, minutes);
  const originOffset = getTimezoneOffsetMinutes(new Date(localAsUtc), originTimezone);
  const departureUtc = localAsUtc - originOffset * 60_000;
  const arrivalUtc = departureUtc + durationMinutes * 60_000;
  const arrivalOffset = getTimezoneOffsetMinutes(new Date(arrivalUtc), destinationTimezone);
  const arrivalLocal = new Date(arrivalUtc + arrivalOffset * 60_000);
  const yyyy = arrivalLocal.getUTCFullYear();
  const mm = String(arrivalLocal.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(arrivalLocal.getUTCDate()).padStart(2, "0");
  const hh = String(arrivalLocal.getUTCHours()).padStart(2, "0");
  const min = String(arrivalLocal.getUTCMinutes()).padStart(2, "0");
  return { date: `${yyyy}-${mm}-${dd}`, time: `${hh}:${min}` };
}

function getTimezoneOffsetMinutes(date: Date, timezone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  const asUtc = Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day), Number(values.hour), Number(values.minute), Number(values.second));
  return Math.round((asUtc - date.getTime()) / 60_000);
}

function dateToAirRoutesDay(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][weekday] ?? "";
}

async function fetchAirRoutesRoute(origin: string, destination: string, date: string, cabin: string, originTimezone?: string, destinationTimezone?: string) {
  const routeId = `${encodeURIComponent(origin)}-${encodeURIComponent(destination)}`;
  const directResponse = await fetch(`${AIR_ROUTES_API}/${routeId}`);

  if (directResponse.ok) {
    const directResults = normalizeSchedule(
      await directResponse.json(),
      date,
      cabin,
      originTimezone,
      destinationTimezone,
    );
    if (directResults.length) return directResults;
  }

  const connectionsResponse = await fetch(
    `${AIR_ROUTES_API.replace("/route", "/connections")}?from=${encodeURIComponent(origin)}&to=${encodeURIComponent(destination)}&max_stops=2`,
  );
  if (!connectionsResponse.ok) {
    throw new Error(`No route data could be returned for ${origin} to ${destination}.`);
  }

  const payload = (await connectionsResponse.json()) as {
    options?: Array<{
      total_flying_min?: number;
      stops?: number;
      legs?: Array<{
        route_id?: string;
        from?: string;
        to?: string;
        flying_min?: number;
        airlines?: Array<{
          airline_code?: string;
          airline?: string;
          schedule?: Array<{ day?: string; times?: string[] }>;
        }>;
      }>;
    }>;
  };

  const requestedDay = dateToAirRoutesDay(date);
  const results: FlightSchedule[] = [];

  (payload.options ?? []).forEach((option, optionIndex) => {
    const legs = option.legs ?? [];
    if (!legs.length) return;

    const firstLeg = legs[0];
    const lastLeg = legs[legs.length - 1];
    const firstAirline = firstLeg.airlines?.[0];
    const matchingSchedule = firstAirline?.schedule?.find((entry) => entry.day === requestedDay);
    const departureTime = matchingSchedule?.times?.[0];

    if (!departureTime) return;

    const durationMinutes = Number.isFinite(option.total_flying_min)
      ? Number(option.total_flying_min)
      : undefined;

    const arrival = calculateArrival(
      departureTime,
      date,
      durationMinutes,
      originTimezone,
      destinationTimezone,
    );

    results.push({
      id: `${origin}-${destination}-${requestedDay}-${optionIndex}`,
      airlineName: String(firstAirline?.airline ?? firstAirline?.airline_code ?? "Airline"),
      airlineCode: firstAirline?.airline_code
        ? String(firstAirline.airline_code).toUpperCase()
        : undefined,
      logoUrl: firstAirline?.airline_code
        ? `https://images.kiwi.com/airlines/64/${encodeURIComponent(String(firstAirline.airline_code).toUpperCase())}.png`
        : undefined,
      departure: {
        iata: String(firstLeg.from ?? origin),
        city: "",
        date,
        time: String(departureTime),
      },
      arrival: {
        iata: String(lastLeg.to ?? destination),
        city: "",
        date: arrival?.date ?? date,
        time: arrival?.time ?? "Arrival time unavailable",
      },
      duration: durationMinutes !== undefined ? formatDuration(durationMinutes) : undefined,
      stops: Math.max(0, Number(option.stops ?? legs.length - 1)),
      cabin,
      baggage: "Allowance varies by fare",
      status: "Scheduled",
    });
  });

  return results;
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
  const outbound = await fetchAirRoutesRoute(origin, destination, date, cabin, fromChoice.timezone, toChoice.timezone);
  if (!returnDate) return outbound;
  const inbound = await fetchAirRoutesRoute(destination, origin, returnDate, cabin, toChoice.timezone, fromChoice.timezone);
  return [...outbound, ...inbound];
}

export function FlightSearchPage({ embedded = false }: { embedded?: boolean }) {
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
  const [selectedResult, setSelectedResult] = useState<FlightSchedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingAirports, setLoadingAirports] = useState(false);
  const [error, setError] = useState("");
  const [passengerOpen, setPassengerOpen] = useState(false);

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
    setSelectedResult(null);
    try {
      if (!fromChoice || !toChoice) {
        throw new Error("Select a departure and destination from the airport suggestions.");
      }
      if (fromChoice.iata === toChoice.iata) throw new Error("Departure and destination cannot be the same airport.");
      if (!date) throw new Error("Select a departure date.");
      if (tripType === "Round trip" && !returnDate) throw new Error("Select a return date for a round trip.");
      if (tripType === "Round trip" && returnDate < date) throw new Error("Return date cannot be before departure date.");

      const schedules = await fetchSchedules(fromChoice, toChoice, date, returnDate, tripType, cabin, travelers);
      setResults(schedules);
      if (!schedules.length) {
        setError("No scheduled options were returned for this route and date. Try another date or call us for itinerary assistance.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Flight search failed.");
    } finally {
      setLoading(false);
    }
  };

  const selectChoice = (
    choice: LocationChoice,
    setValue: (value: string) => void,
    setChoice: (value: LocationChoice) => void,
  ) => {
    setChoice(choice);
    setValue(choice.type === "city" ? `${choice.city}, ${choice.country} (${choice.iata})` : `${choice.city} (${choice.iata})`);
  };

  const suggestionList = (
    values: LocationChoice[],
    setValue: (value: string) => void,
    setChoice: (choice: LocationChoice) => void,
  ) =>
    values.length > 0 ? (
      <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-border bg-card p-1 shadow-elevated">
        {values.map((choice, index) => (
          <button
            type="button"
            key={`${choice.type}-${choice.city}-${choice.iata ?? index}`}
            onClick={() => selectChoice(choice, setValue, setChoice)}
            className="block w-full rounded-xl px-4 py-3 text-left hover:bg-muted"
          >
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                {choice.type}
              </span>
              <strong className="text-sm">{choice.city}</strong>
              {choice.iata && <span className="text-xs font-bold text-primary">{choice.iata}</span>}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{choice.label}</p>
          </button>
        ))}
      </div>
    ) : null;

  const summary = selectedResult
    ? `${selectedResult.departure.iata} → ${selectedResult.arrival.iata} · ${selectedResult.departure.date ?? date} · ${selectedResult.departure.time}`
    : "";

  return (
    <>
      {!embedded && <Seo title={PAGE_TITLE} description={PAGE_DESCRIPTION} path={PAGE_PATH} />}

      <section
        className={embedded
          ? "relative z-10 -mt-12 overflow-visible bg-transparent py-0 sm:-mt-20"
          : "relative overflow-visible bg-cover bg-center py-16 sm:py-24"}
        style={embedded
          ? undefined
          : { backgroundImage: "linear-gradient(rgba(0, 28, 45, 0.42), rgba(0, 28, 45, 0.58)), url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85)" }}
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {!embedded && (
            <div className="mx-auto max-w-5xl text-center text-white">
              <p className="label-board text-white/90">Flight booking engine</p>
              <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.08] sm:text-5xl">Search flight options</h1>
              <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/90">
                Search scheduled route options, choose an itinerary, then continue by phone for current fare and booking confirmation.
              </p>
            </div>
          )}

          <div className="overflow-visible rounded-[1.75rem] border border-border bg-card p-4 shadow-elevated sm:p-6">
            <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
              {["Round trip", "One way"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => { setTripType(type); if (type === "One way") setReturnDate(""); }}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${tripType === type ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
                >
                  {type}
                </button>
              ))}
              <span className="ml-auto hidden text-xs text-muted-foreground sm:block">Flights · {travelers} traveler{travelers === "1" ? "" : "s"} · {cabin}</span>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-[1.25fr_1.25fr_0.8fr_0.8fr_0.7fr]">
              <label className="relative rounded-2xl border border-border bg-background p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">From</span>
                <input
                  value={from}
                  onFocus={() => void ensureAirports()}
                  onChange={(e) => { setFrom(e.target.value); setFromChoice(null); }}
                  placeholder={loadingAirports ? "Loading airports…" : "City or airport"}
                  className="mt-2 h-9 w-full bg-transparent text-base font-semibold outline-none"
                  autoComplete="off"
                />
                {fromChoice?.iata && <span className="text-xs font-bold text-primary">{fromChoice.iata}</span>}
                {suggestionList(fromMatches, setFrom, setFromChoice)}
              </label>

              <label className="relative rounded-2xl border border-border bg-background p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">To</span>
                <input
                  value={to}
                  onFocus={() => void ensureAirports()}
                  onChange={(e) => { setTo(e.target.value); setToChoice(null); }}
                  placeholder="City or airport"
                  className="mt-2 h-9 w-full bg-transparent text-base font-semibold outline-none"
                  autoComplete="off"
                />
                {toChoice?.iata && <span className="text-xs font-bold text-primary">{toChoice.iata}</span>}
                {suggestionList(toMatches, setTo, setToChoice)}
              </label>

              <label className="rounded-2xl border border-border bg-background p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Depart</span>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-2 h-9 w-full bg-transparent text-sm font-semibold outline-none" />
              </label>

              <label className="rounded-2xl border border-border bg-background p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Return</span>
                <input type="date" value={returnDate} min={date || undefined} disabled={tripType === "One way"} onChange={(e) => setReturnDate(e.target.value)} className="mt-2 h-9 w-full bg-transparent text-sm font-semibold outline-none disabled:opacity-40" />
              </label>

              <label className="rounded-2xl border border-border bg-background p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Travelers</span>
                <select value={travelers} onChange={(e) => setTravelers(e.target.value)} className="mt-2 h-9 w-full bg-transparent text-sm font-semibold outline-none">
                  {Array.from({ length: 9 }, (_, i) => String(i + 1)).map((count) => <option key={count} value={count}>{count}</option>)}
                </select>
              </label>
            </div>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Cabin</span>
                <select value={cabin} onChange={(e) => setCabin(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 font-semibold text-foreground">
                  <option>Economy</option><option>Premium Economy</option><option>Business</option><option>First</option>
                </select>
              </label>
              <button type="button" onClick={search} disabled={loading} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-8 font-semibold text-primary-foreground shadow-subtle disabled:opacity-60 sm:w-auto">
                <Search aria-hidden="true" className="size-4" />{loading ? "Searching…" : "Search flights"}
              </button>
            </div>

            {error && <p role="alert" className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</p>}
          </div>
        </div>
      </section>

      <Section tone="muted" ocid="flight_search.results" aria-labelledby="flight_search_results_heading">
        <SectionHeading
          id="flight_search_results_heading"
          eyebrow={results.length ? "Available schedule options" : "Flight booking"}
          title={results.length ? `${results.length} option${results.length === 1 ? "" : "s"} found` : "Search results"}
          description={results.length ? "Choose a schedule below. Fare, seat inventory, baggage, taxes, and final booking availability are confirmed before payment." : "Enter your route and dates above to search scheduled flight options."}
        />

        {results.length > 0 ? (
          <div className="mt-8 grid gap-4">
            {results.map((result) => {
              const selected = selectedResult?.id === result.id;
              return (
                <article key={result.id} className={`rounded-2xl border bg-card p-5 shadow-subtle transition ${selected ? "border-primary ring-2 ring-primary/10" : "border-border"}`}>
                  <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex h-14 w-24 items-center justify-center rounded-xl border border-border bg-background p-2">
                          {result.logoUrl ? <img src={result.logoUrl} alt="" className="max-h-10 max-w-20 object-contain" loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : <span className="text-sm font-bold text-muted-foreground">{result.airlineCode ?? "AIR"}</span>}
                        </div>
                        <div>
                          <p className="font-bold">{result.airlineName}</p>
                          <p className="text-xs text-muted-foreground">{result.airlineCode ?? "Airline"} · {result.stops === 0 ? "Nonstop" : `${result.stops} stop${result.stops === 1 ? "" : "s"}`} · {result.duration ?? "Schedule"}</p>
                        </div>
                        {result.status && <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">{result.status}</span>}
                      </div>

                      <div className="mt-5 grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
                        <div>
                          <p className="text-2xl font-bold">{result.departure.time}</p>
                          <p className="font-semibold">{result.departure.iata}</p>
                          {result.departure.date && <p className="text-xs text-muted-foreground">{result.departure.date}</p>}
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                          <Clock3 className="size-4" /> {result.duration ?? "Schedule"} <ArrowRight className="size-5 text-accent" />
                        </div>
                        <div className="sm:text-right">
                          <p className="text-2xl font-bold">{result.arrival.time}</p>
                          <p className="font-semibold">{result.arrival.iata}</p>
                          {result.arrival.date && <p className="text-xs text-muted-foreground">{result.arrival.date}</p>}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Luggage className="size-3.5" /> {result.baggage ?? "Baggage varies by fare"}</span>
                        <span>Cabin: {result.cabin}</span>
                        <span>Scheduled information</span>
                      </div>
                    </div>

                    <div className="flex w-full flex-col gap-2 lg:w-56">
                      <button
                        type="button"
                        onClick={() => { setSelectedResult(result); setPassengerOpen(true); }}
                        className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-5 font-semibold text-primary-foreground"
                      >
                        Select flight
                      </button>
                      <a href={SITE.phoneHref} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-primary/20 bg-background px-5 text-sm font-semibold text-primary">
                        <Phone className="size-4" /> Call to book
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-border bg-card p-7 text-sm text-muted-foreground">
            Your search results will appear here. This engine does not invent fares or availability.
          </div>
        )}

        {selectedResult && passengerOpen && (
          <div className="mt-8 rounded-3xl border border-primary/20 bg-card p-6 shadow-elevated sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="label-board text-accent">Continue booking</p>
                <h3 className="mt-2 text-2xl font-bold">{summary}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {selectedResult.airlineName} · {cabin} · {travelers} traveler{travelers === "1" ? "" : "s"}
                </p>
              </div>
              <button type="button" onClick={() => setPassengerOpen(false)} className="text-sm font-semibold text-muted-foreground hover:text-foreground">Close</button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label><span className="text-sm font-semibold">First name</span><input className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4" placeholder="First name" /></label>
              <label><span className="text-sm font-semibold">Last name</span><input className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4" placeholder="Last name" /></label>
              <label><span className="text-sm font-semibold">Email</span><input type="email" className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4" placeholder="Email address" /></label>
              <label><span className="text-sm font-semibold">Phone</span><input type="tel" className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4" placeholder="Phone number" /></label>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-muted-foreground">No payment is taken here. A specialist confirms live fare, inventory, taxes, baggage and booking conditions before any payment authorization.</p>
              <a href={SITE.phoneHref} className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground"><Phone className="size-4" /> Continue by phone</a>
            </div>
          </div>
        )}
      </Section>

      {!embedded && <Section tone="muted" ocid="flight_search.disclosure">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Schedule information is displayed from Air-Routes and filtered to the selected travel date(s). Departure times are provider-supplied schedules; arrival time is calculated from published flying time and airport time zones when available. This is not live fare inventory or live flight status. Current fare, availability, baggage, taxes, and booking conditions are confirmed by phone before booking.{" "}
          {SITE.disclosure}
        </p>
      </Section>}
    </>
  );
}
