import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { Section, SectionHeading } from "@/components/Section";
import { Seo } from "@/components/Seo";
import { SITE } from "@/lib/site";
import { ArrowRight, Phone, Search } from "lucide-react";
import { useMemo, useState } from "react";

const AIR_ROUTES_API = "https://air-routes.com/api/route";
const AIR_ROUTES_AIRPORTS_API = "https://air-routes.com/api/airports";

type Airport = { id: string; name: string; city: string; country: string; iata: string; lat?: number; lon?: number; timezone?: string };
const POPULAR_AIRPORTS: Airport[] = [
  ["JFK","John F. Kennedy International Airport","New York","United States",40.6413,-73.7781],
  ["LGA","LaGuardia Airport","New York","United States",40.7769,-73.8740],
  ["EWR","Newark Liberty International Airport","Newark","United States",40.6895,-74.1745],
  ["LAX","Los Angeles International Airport","Los Angeles","United States",33.9416,-118.4085],
  ["ORD","O'Hare International Airport","Chicago","United States",41.9742,-87.9073],
  ["DFW","Dallas/Fort Worth International Airport","Dallas","United States",32.8998,-97.0403],
  ["ATL","Hartsfield-Jackson Atlanta International Airport","Atlanta","United States",33.6407,-84.4277],
  ["MIA","Miami International Airport","Miami","United States",25.7959,-80.2870],
  ["SFO","San Francisco International Airport","San Francisco","United States",37.6213,-122.3790],
  ["SEA","Seattle-Tacoma International Airport","Seattle","United States",47.4502,-122.3088],
  ["BOS","Boston Logan International Airport","Boston","United States",42.3656,-71.0096],
  ["DEN","Denver International Airport","Denver","United States",39.8561,-104.6737],
  ["LAS","Harry Reid International Airport","Las Vegas","United States",36.0840,-115.1537],
  ["PHX","Phoenix Sky Harbor International Airport","Phoenix","United States",33.4352,-112.0101],
  ["IAH","George Bush Intercontinental Airport","Houston","United States",29.9902,-95.3368],
  ["LHR","London Heathrow Airport","London","United Kingdom",51.4700,-0.4543],
  ["CDG","Charles de Gaulle Airport","Paris","France",49.0097,2.5479],
  ["FRA","Frankfurt Airport","Frankfurt","Germany",50.0379,8.5622],
  ["AMS","Amsterdam Airport Schiphol","Amsterdam","Netherlands",52.3105,4.7683],
  ["DXB","Dubai International Airport","Dubai","United Arab Emirates",25.2532,55.3657],
  ["DOH","Hamad International Airport","Doha","Qatar",25.2731,51.6081],
  ["YYZ","Toronto Pearson International Airport","Toronto","Canada",43.6777,-79.6248],
  ["YVR","Vancouver International Airport","Vancouver","Canada",49.1967,-123.1815],
  ["MEX","Mexico City International Airport","Mexico City","Mexico",19.4361,-99.0719],
].map(([iata,name,city,country,lat,lon], index) => ({ id: `fallback-${iata}-${index}`, name: String(name), city: String(city), country: String(country), iata: String(iata), lat: Number(lat), lon: Number(lon) }));

type LocationChoice = {
  type: "city" | "airport";
  city: string;
  country: string;
  iata?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  label: string;
};
type FlightLeg = {
  airlineName: string;
  airlineCode?: string;
  logoUrl?: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  arrivalDate?: string;
  duration?: string;
  layoverMinutes?: number;
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
  legs?: FlightLeg[];
};

const PAGE_PATH = "/flight-search";
const PAGE_TITLE = "Flight Schedule Search | TicketDepart";
const PAGE_DESCRIPTION =
  "Search flight options by city or airport and travel date, then call TicketDepart to confirm booking details.";

async function loadAirports(query: string): Promise<Airport[]> {
  const q = query.trim();
  if (!q) return POPULAR_AIRPORTS;
  if (q.length < 2) return POPULAR_AIRPORTS.filter((airport) => [airport.iata, airport.city].join(" ").toLowerCase().startsWith(q.toLowerCase())).slice(0, 10);
  try {
    const response = await fetch(`${AIR_ROUTES_AIRPORTS_API}?q=${encodeURIComponent(q)}`);
    if (!response.ok) throw new Error("Airport search could not be loaded.");
  const payload = (await response.json()) as {
    airports?: Array<{
      airport_code?: string;
      name?: string;
      city?: string;
      country?: string;
      lat?: number | null;
      lon?: number | null;
    }>;
  };
  const remote = (payload.airports ?? [])
    .map((airport, index) => ({
      id: `${airport.airport_code ?? "airport"}-${index}`,
      name: String(airport.name ?? ""),
      city: String(airport.city ?? ""),
      country: String(airport.country ?? ""),
      iata: String(airport.airport_code ?? "").toUpperCase(),
      lat: typeof airport.lat === "number" ? airport.lat : undefined,
      lon: typeof airport.lon === "number" ? airport.lon : undefined,
    }))
    .filter((airport) => airport.iata);
    return remote.length ? remote : POPULAR_AIRPORTS.filter((airport) => [airport.iata, airport.name, airport.city, airport.country].join(" ").toLowerCase().includes(q.toLowerCase())).slice(0, 10);
  } catch {
    return POPULAR_AIRPORTS.filter((airport) => [airport.iata, airport.name, airport.city, airport.country].join(" ").toLowerCase().includes(q.toLowerCase())).slice(0, 10);
  }
}

const timezoneCache = new Map<string, string>();

async function resolveAirportTimezone(choice: LocationChoice): Promise<string | undefined> {
  if (choice.timezone) return choice.timezone;
  if (typeof choice.lat !== "number" || typeof choice.lon !== "number") return undefined;
  const key = choice.iata ?? `${choice.lat.toFixed(4)},${choice.lon.toFixed(4)}`;
  const cached = timezoneCache.get(key);
  if (cached) return cached;
  try {
    const response = await fetch(`https://api.geotimezone.com/public/timezone?latitude=${encodeURIComponent(String(choice.lat))}&longitude=${encodeURIComponent(String(choice.lon))}`);
    if (!response.ok) return undefined;
    const payload = (await response.json()) as { iana_timezone?: string };
    if (!payload.iana_timezone) return undefined;
    timezoneCache.set(key, payload.iana_timezone);
    return payload.iana_timezone;
  } catch {
    return undefined;
  }
}
function choices(airports: Airport[], query: string): LocationChoice[] {
  const q = query.trim().toLowerCase();
  if (!q)
    return airports.slice(0, 8).map((a) => ({
      type: "airport" as const,
      city: a.city,
      country: a.country,
      iata: a.iata,
      lat: a.lat,
      lon: a.lon,
      label: `${a.city} — ${a.name} (${a.iata})`,
    }));
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
    lat: a.lat,
    lon: a.lon,
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

function normalizeSchedule(
  payload: unknown,
  requestedDate: string,
  requestedCabin: string,
  originTimezone?: string,
  destinationTimezone?: string,
): FlightSchedule[] {
  const route = payload as {
    route_id?: string;
    flying_min?: number;
    airlines?: Array<{
      airline_code?: string;
      airline?: string;
      schedule?: Array<{ day?: string; times?: string[] }>;
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
      (entry.times ?? []).forEach((time, timeIndex) => {
        const arrival = calculateArrival(String(time), requestedDate, durationMinutes, originTimezone, destinationTimezone);
        const airlineName = String(airline.airline ?? airline.airline_code ?? "Airline");
        const airlineCode = airline.airline_code ? String(airline.airline_code).toUpperCase() : undefined;
        const logoUrl = airlineCode
          ? `https://images.kiwi.com/airlines/64/${encodeURIComponent(airlineCode)}.png`
          : undefined;
        results.push({
          id: `${route.route_id}-${airline.airline_code}-${requestedDay}-${time}-${airlineIndex}-${dayIndex}-${timeIndex}`,
          airlineName,
          airlineCode,
          logoUrl,
          departure: { iata: String(origin ?? ""), city: "", date: requestedDate, time: String(time || "Time not supplied") },
          arrival: {
            iata: String(destination ?? ""),
            city: "",
            date: arrival?.date ?? requestedDate,
            time: arrival?.time ?? (durationMinutes !== undefined ? "Estimated arrival" : "Arrival time unavailable"),
          },
          duration,
          stops: 0,
          cabin: requestedCabin,
          legs: [{
            airlineName,
            airlineCode,
            logoUrl,
            from: String(origin ?? ""),
            to: String(destination ?? ""),
            departureTime: String(time || "Time not supplied"),
            arrivalTime: arrival?.time ?? "Arrival time unavailable",
            arrivalDate: arrival?.date ?? requestedDate,
            duration,
          }],
        });
      });
    });
  });
  return results;
}

function formatDisplayTime(time: string): string {
  const match = time.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return time;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return time;
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins ? `${hours}h ${mins}m` : `${hours}h`;
}

function addMinutesToTime(time: string, minutes: number, date: string): { time: string; date: string } {
  const match = time.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return { time: "Arrival time unavailable", date };
  const total = Number(match[1]) * 60 + Number(match[2]) + minutes;
  const normalized = ((total % 1440) + 1440) % 1440;
  const dateOffset = Math.floor(total / 1440);
  const [year, month, day] = date.split("-").map(Number);
  const arrivalDate = new Date(Date.UTC(year, month - 1, day + dateOffset));
  return {
    time: `${String(Math.floor(normalized / 60)).padStart(2, "0")}:${String(normalized % 60).padStart(2, "0")}`,
    date: `${arrivalDate.getUTCFullYear()}-${String(arrivalDate.getUTCMonth() + 1).padStart(2, "0")}-${String(arrivalDate.getUTCDate()).padStart(2, "0")}`,
  };
}

function localDateTimeToUtc(date: string, time: string, timezone: string): number | null {
  const match = time.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  const [year, month, day] = date.split("-").map(Number);
  const localAsUtc = Date.UTC(year, month - 1, day, hours, minutes);
  const offset = getTimezoneOffsetMinutes(new Date(localAsUtc), timezone);
  return localAsUtc - offset * 60_000;
}
function calculateArrival(
  departureTime: string,
  departureDate: string,
  durationMinutes?: number,
  originTimezone?: string,
  destinationTimezone?: string,
): { date: string; time: string } | null {
  if (durationMinutes === undefined) return null;
  if (!originTimezone || !destinationTimezone) return addMinutesToTime(departureTime, durationMinutes, departureDate);
  const match = departureTime.match(/^(\d{1,2}):(\d{2})/);
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

function addDays(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + days));
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}-${String(next.getUTCDate()).padStart(2, "0")}`;
}

function utcToLocalDateTime(timestamp: number, timezone: string): { date: string; time: string } | null {
  try {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(timestamp));
    const values = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
    return { date: `${values.year}-${values.month}-${values.day}`, time: `${values.hour}:${values.minute}` };
  } catch {
    return null;
  }
}
function dateToAirRoutesDay(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][weekday] ?? "";
}

async function fetchAirRoutesRoute(
  origin: string,
  destination: string,
  date: string,
  cabin: string,
  actor: { searchFlightRoute: (origin: string, destination: string) => Promise<{ status: bigint | number; body: string }>; searchFlightConnections: (origin: string, destination: string) => Promise<{ status: bigint | number; body: string }> },
  originTimezone?: string,
  destinationTimezone?: string,
) {
  if (!actor) throw new Error("Flight schedule service is still connecting. Please try again in a moment.");
  try {
    const directResponse = await actor.searchFlightRoute(origin, destination);
    if (Number(directResponse.status) === 200) {
      const directResults = normalizeSchedule(JSON.parse(directResponse.body), date, cabin, originTimezone, destinationTimezone);
      if (directResults.length) return directResults;
    }
  } catch {
    // Continue to the connection search if the direct-route request is unavailable.
  }

  let connectionsResponse: { status: bigint | number; body: string };
  try {
    connectionsResponse = await actor.searchFlightConnections(origin, destination);
  } catch {
    throw new Error("Flight schedule service is temporarily unavailable. Please try again in a moment or call us for itinerary assistance.");
  }
  if (Number(connectionsResponse.status) !== 200) throw new Error("No scheduled options could be returned for this route.");

  const payload = JSON.parse(connectionsResponse.body) as {
    options?: Array<{
      total_flying_min?: number;
      stops?: number;
      legs?: Array<{
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

  for (let optionIndex = 0; optionIndex < (payload.options ?? []).length; optionIndex += 1) {
    const option = payload.options?.[optionIndex];
    const legs = option?.legs ?? [];
    if (!legs.length) continue;

    const airportsByIata = new Map<string, LocationChoice>();
    const allIatas = Array.from(new Set(legs.flatMap((leg) => [String(leg.from ?? ""), String(leg.to ?? "")]).filter(Boolean)));
    for (const iata of allIatas) {
      const matches = await loadAirports(iata);
      const airport = matches.find((item) => item.iata === iata) ?? matches[0];
      if (airport) airportsByIata.set(iata, { type: "airport", city: airport.city, country: airport.country, iata: airport.iata, lat: airport.lat, lon: airport.lon, label: airport.name });
    }

    const displayLegs: FlightLeg[] = [];
    let previousArrivalUtc: number | null = null;
    let previousArrivalDate = date;
    let firstDepartureUtc: number | null = null;
    let finalArrivalUtc: number | null = null;
    let valid = true;

    for (let legIndex = 0; legIndex < legs.length; legIndex += 1) {
      const leg = legs[legIndex];
      const fromIata = String(leg.from ?? origin);
      const toIata = String(leg.to ?? destination);
      const fromChoice = airportsByIata.get(fromIata);
      const toChoice = airportsByIata.get(toIata);
      const fromTimezone = await resolveAirportTimezone(fromChoice ?? { type: "airport", city: "", country: "", iata: fromIata, label: fromIata });
      const toTimezone = await resolveAirportTimezone(toChoice ?? { type: "airport", city: "", country: "", iata: toIata, label: toIata });
      if (!fromTimezone || !toTimezone) { valid = false; break; }

      const airline = leg.airlines?.[0];
      const candidateDates = legIndex === 0 ? [date] : [previousArrivalDate, addDays(previousArrivalDate, 1)];
      const candidateTimes = candidateDates.flatMap((candidateDate) => {
        const day = dateToAirRoutesDay(candidateDate);
        const entry = airline?.schedule?.find((item) => item.day === day);
        return (entry?.times ?? []).map((time) => ({ time, date: candidateDate }));
      });
      if (!candidateTimes.length) { valid = false; break; }

      let chosenDepartureUtc: number | null = null;
      let chosenDepartureLocal = "";
        for (const candidate of candidateTimes) {
        const candidateDate = candidate.date;
        const candidateTime = candidate.time;
        const candidateUtc = localDateTimeToUtc(candidateDate, candidateTime, fromTimezone);
        if (candidateUtc === null) continue;
        if (previousArrivalUtc !== null && candidateUtc < previousArrivalUtc + 45 * 60_000) continue;
        if (chosenDepartureUtc === null || candidateUtc < chosenDepartureUtc) {
          chosenDepartureUtc = candidateUtc;
          chosenDepartureLocal = candidateTime;
        }
      }
      if (chosenDepartureUtc === null) { valid = false; break; }

      const legDuration = Number.isFinite(leg.flying_min) ? Number(leg.flying_min) : undefined;
      if (legDuration === undefined) { valid = false; break; }
      const arrivalUtc = chosenDepartureUtc + legDuration * 60_000;
      const arrivalLocal = utcToLocalDateTime(arrivalUtc, toTimezone);
      if (!arrivalLocal) { valid = false; break; }

      const layoverMinutes = previousArrivalUtc === null ? undefined : Math.round((chosenDepartureUtc - previousArrivalUtc) / 60_000);
      const airlineCode = airline?.airline_code ? String(airline.airline_code).toUpperCase() : undefined;
      displayLegs.push({
        airlineName: String(airline?.airline ?? airline?.airline_code ?? "Airline"),
        airlineCode,
        logoUrl: airlineCode ? `https://images.kiwi.com/airlines/64/${encodeURIComponent(airlineCode)}.png` : undefined,
        from: fromIata,
        to: toIata,
        departureTime: chosenDepartureLocal,
        arrivalTime: arrivalLocal.time,
        arrivalDate: arrivalLocal.date,
        duration: formatDuration(legDuration),
        layoverMinutes,
      });
      if (firstDepartureUtc === null) firstDepartureUtc = chosenDepartureUtc;
      previousArrivalUtc = arrivalUtc;
      previousArrivalDate = arrivalLocal.date;
      finalArrivalUtc = arrivalUtc;
    }

    if (!valid || !displayLegs.length || firstDepartureUtc === null || finalArrivalUtc === null) continue;
    const elapsedMinutes = Math.round((finalArrivalUtc - firstDepartureUtc) / 60_000);
    const firstLeg = legs[0];
    const lastLeg = legs[legs.length - 1];
    results.push({
      id: `${origin}-${destination}-${requestedDay}-${optionIndex}`,
      airlineName: displayLegs.map((leg) => leg.airlineName).filter((name, index, names) => names.indexOf(name) === index).join(" + "),
      airlineCode: displayLegs[0]?.airlineCode,
      logoUrl: displayLegs[0]?.logoUrl,
      departure: { iata: String(firstLeg.from ?? origin), city: "", date, time: displayLegs[0]?.departureTime ?? "" },
      arrival: { iata: String(lastLeg.to ?? destination), city: "", date: displayLegs.at(-1)?.arrivalDate ?? date, time: displayLegs.at(-1)?.arrivalTime ?? "" },
      duration: formatDuration(elapsedMinutes),
      stops: Math.max(0, Number(option?.stops ?? legs.length - 1)),
      cabin,
      legs: displayLegs,
    });
  }
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
  actor: { searchFlightRoute: (origin: string, destination: string) => Promise<{ status: bigint | number; body: string }>; searchFlightConnections: (origin: string, destination: string) => Promise<{ status: bigint | number; body: string }> },
): Promise<{ outbound: FlightSchedule[]; inbound: FlightSchedule[] }> {
  void travelers;
  const origin = fromChoice.iata ?? "";
  const destination = toChoice.iata ?? "";
  if (!origin || !destination) throw new Error("Select airports with valid IATA codes.");
  const [originTimezone, destinationTimezone] = await Promise.all([resolveAirportTimezone(fromChoice), resolveAirportTimezone(toChoice)]);
  const outbound = await fetchAirRoutesRoute(origin, destination, date, cabin, originTimezone, destinationTimezone, actor);
  if (tripType === "One way" || !returnDate) return { outbound, inbound: [] };
  const inbound = await fetchAirRoutesRoute(destination, origin, returnDate, cabin, destinationTimezone, originTimezone, actor);
  return { outbound, inbound };
}
export function FlightSearchPage({ embedded = false }: { embedded?: boolean }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const { actor, isFetching: isActorFetching } = useActor(createActor);

  const [fromChoice, setFromChoice] = useState<LocationChoice | null>(null);
  const [toChoice, setToChoice] = useState<LocationChoice | null>(null);
  const [tripType, setTripType] = useState("Round trip");
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [travelers, setTravelers] = useState("1");
  const [cabin, setCabin] = useState("Economy");
  const [fromAirports, setFromAirports] = useState<Airport[]>([]);
  const [toAirports, setToAirports] = useState<Airport[]>([]);
  const [airportSearch, setAirportSearch] = useState<"from" | "to" | "">("");
  const [results, setResults] = useState<FlightSchedule[]>([]);
  const [returnResults, setReturnResults] = useState<FlightSchedule[]>([]);
  const [selectedResult, setSelectedResult] = useState<FlightSchedule | null>(null);
  const [selectedOutbound, setSelectedOutbound] = useState<FlightSchedule | null>(null);
  const [selectedReturn, setSelectedReturn] = useState<FlightSchedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingAirports, setLoadingAirports] = useState(false);
  const [error, setError] = useState("");
  const [passengerOpen, setPassengerOpen] = useState(false);

  const ensureAirports = async (query: string, side: "from" | "to") => {
    if (query.trim().length < 2) {
      if (side === "from") setFromAirports([]);
      else setToAirports([]);
      return;
    }
    setLoadingAirports(true);
    try {
      const loaded = await loadAirports(query);
      if (side === "from") setFromAirports(loaded);
      else setToAirports(loaded);
    } catch {
      if (side === "from") setFromAirports([]);
      else setToAirports([]);
    } finally {
      setLoadingAirports(false);
    }
  };

  const fromMatches = useMemo(() => choices(fromAirports, from), [fromAirports, from]);
  const toMatches = useMemo(() => choices(toAirports, to), [toAirports, to]);
  const search = async () => {
    setLoading(true);
    setError("");
    setResults([]);
    setReturnResults([]);
    setSelectedResult(null);
    setSelectedOutbound(null);
    setSelectedReturn(null);
    setPassengerOpen(false);
    try {
      if (!fromChoice || !toChoice) throw new Error("Select a departure and destination from the airport suggestions.");
      if (fromChoice.iata === toChoice.iata) throw new Error("Departure and destination cannot be the same airport.");
      if (!date) throw new Error("Select a departure date.");
      if (tripType === "Round trip" && !returnDate) throw new Error("Select a return date for a round trip.");
      if (tripType === "Round trip" && returnDate < date) throw new Error("Return date cannot be before departure date.");

      if (!actor || isActorFetching) throw new Error("Flight schedule service is still connecting. Please try again in a moment.");
      const schedules = await fetchSchedules(fromChoice, toChoice, date, returnDate, tripType, cabin, travelers, actor);
      setResults(schedules.outbound);
      setReturnResults(schedules.inbound);
      if (!schedules.outbound.length) setError("No scheduled options were returned for this route and date. Try another date or call us for itinerary assistance.");
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
    setAirportSearch("");
  };

  const suggestionList = (
    values: LocationChoice[],
    setValue: (value: string) => void,
    setChoice: (choice: LocationChoice) => void,
  ) =>
    values.length > 0 ? (
      <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-border bg-card p-1 shadow-elevated">
        {values.map((choice, index) => (
          <button type="button" key={`${choice.type}-${choice.city}-${choice.iata ?? index}`} onClick={() => selectChoice(choice, setValue, setChoice)} className="block w-full rounded-xl px-4 py-3 text-left hover:bg-muted">
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{choice.type}</span>
              <strong className="text-sm">{choice.city}</strong>
              {choice.iata && <span className="text-xs font-bold text-primary">{choice.iata}</span>}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{choice.label}</p>
          </button>
        ))}
      </div>
    ) : null;

  const summary = selectedOutbound
    ? selectedReturn
      ? `${selectedOutbound.departure.iata} → ${selectedOutbound.arrival.iata} · ${selectedOutbound.departure.date ?? date} · ${selectedOutbound.departure.time} | ${selectedReturn.departure.iata} → ${selectedReturn.arrival.iata} · ${selectedReturn.departure.date ?? returnDate} · ${selectedReturn.departure.time}`
      : `${selectedOutbound.departure.iata} → ${selectedOutbound.arrival.iata} · ${selectedOutbound.departure.date ?? date} · ${selectedOutbound.departure.time}`
    : "";

  return (
    <>
      {!embedded && <Seo title={PAGE_TITLE} description={PAGE_DESCRIPTION} path={PAGE_PATH} />}
      <section className={embedded ? "relative z-20 -mt-40 overflow-visible bg-transparent py-0 sm:-mt-48 lg:-mt-56" : "relative overflow-visible bg-cover bg-center py-16 sm:py-24"} style={embedded ? undefined : { backgroundImage: "linear-gradient(rgba(0, 28, 45, 0.42), rgba(0, 28, 45, 0.58)), url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85)" }}>
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {!embedded && (
            <div className="mx-auto max-w-5xl text-center text-white">
              <p className="label-board text-white/90">Flight booking engine</p>
              <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.08] sm:text-5xl">Search flight options</h1>
              <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/90">Search flight options, choose an itinerary, then continue by phone for current fare and booking confirmation.</p>
            </div>
          )}

          <div className={`overflow-visible rounded-2xl border border-border bg-card p-2 shadow-elevated sm:p-2.5 ${embedded ? "lg:ml-auto lg:max-w-2xl" : ""}`}>
            <div className="flex flex-wrap items-center gap-1 border-b border-border pb-1.5">
              {["Round trip", "One way"].map((type) => (
                <button key={type} type="button" onClick={() => { setTripType(type); if (type === "One way") setReturnDate(""); }} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${tripType === type ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}>{type}</button>
              ))}
              <span className="ml-auto hidden text-xs text-muted-foreground sm:block">Flights · {travelers} traveler{travelers === "1" ? "" : "s"} · {cabin}</span>
            </div>

            <div className="mt-1.5 grid gap-1 lg:grid-cols-[1.2fr_1.2fr_0.85fr_0.85fr_0.65fr]">
              <label className="relative rounded-xl border border-border bg-background p-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">From</span>
                <input value={from} onFocus={() => void ensureAirports(from, "from")} onChange={(e) => { setFrom(e.target.value); setFromChoice(null); setAirportSearch("from"); void ensureAirports(e.target.value, "from"); }} placeholder={loadingAirports ? "Loading airports…" : "City or airport"} className="mt-1 h-7 w-full bg-transparent text-sm font-semibold outline-none" autoComplete="off" />
                {fromChoice?.iata && <span className="text-xs font-bold text-primary">{fromChoice.iata}</span>}
                {airportSearch === "from" && suggestionList(fromMatches, setFrom, setFromChoice)}
              </label>

              <label className="relative rounded-2xl border border-border bg-background p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">To</span>
                <input value={to} onFocus={() => void ensureAirports(to, "to")} onChange={(e) => { setTo(e.target.value); setToChoice(null); setAirportSearch("to"); void ensureAirports(e.target.value, "to"); }} placeholder="City or airport" className="mt-1 h-7 w-full bg-transparent text-sm font-semibold outline-none" autoComplete="off" />
                {toChoice?.iata && <span className="text-xs font-bold text-primary">{toChoice.iata}</span>}
                {airportSearch === "to" && suggestionList(toMatches, setTo, setToChoice)}
              </label>

              <label className="rounded-xl border border-border bg-background p-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Depart</span>
                <input type="date" min={new Date().toISOString().slice(0, 10)} value={date} onChange={(e) => { const nextDate = e.target.value; setDate(nextDate); if (returnDate && returnDate < nextDate) setReturnDate(nextDate); }} className="mt-1 h-7 w-full bg-transparent text-xs font-semibold outline-none" />
              </label>

              <label className="rounded-2xl border border-border bg-background p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Return</span>
                <input type="date" value={returnDate} min={date || undefined} disabled={tripType === "One way"} onChange={(e) => setReturnDate(e.target.value)} className="mt-1 h-7 w-full bg-transparent text-xs font-semibold outline-none disabled:opacity-40" />
              </label>

              <label className="rounded-2xl border border-border bg-background p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Travelers</span>
                <select value={travelers} onChange={(e) => setTravelers(e.target.value)} className="mt-1 h-7 w-full bg-transparent text-xs font-semibold outline-none">
                  {Array.from({ length: 9 }, (_, i) => String(i + 1)).map((count) => <option key={count} value={count}>{count}</option>)}
                </select>
              </label>
            </div>

            <div className="mt-1.5 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Cabin</span>
                <select value={cabin} onChange={(e) => setCabin(e.target.value)} className="rounded-lg border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground">
                  <option>Economy</option><option>Premium Economy</option><option>Business</option><option>First</option>
                </select>
              </label>
              <button type="button" onClick={search} disabled={loading} className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-subtle disabled:opacity-60 sm:w-auto">
                <Search aria-hidden="true" className="size-4" />{loading ? "Searching…" : "Search flights"}
              </button>
            </div>

            {error && <p role="alert" className="mt-2 rounded-lg border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive">{error}</p>}
          </div>
        </div>
      </section>

      <Section tone="muted" ocid="flight_search.results" aria-labelledby="flight_search_results_heading">
        <SectionHeading id="flight_search_results_heading" eyebrow={results.length ? "Flight options" : "Flight booking"} title={results.length ? `${results.length} outbound option${results.length === 1 ? "" : "s"}${tripType === "Round trip" && returnResults.length ? ` · ${returnResults.length} return` : ""}` : "Search results"} description={results.length ? "Choose an itinerary below, then continue by phone to confirm and book." : "Enter your route and dates above to search flight options."} />

        {results.length > 0 ? (
          <div className="mt-8 grid gap-4">
            {results.map((result) => {
              const selected = selectedOutbound?.id === result.id;
              const legs = result.legs?.length ? result.legs : [{
                airlineName: result.airlineName, airlineCode: result.airlineCode, logoUrl: result.logoUrl,
                from: result.departure.iata, to: result.arrival.iata, departureTime: result.departure.time,
                arrivalTime: result.arrival.time, arrivalDate: result.arrival.date, duration: result.duration,
              }];
              return (
                <article key={result.id} className={`rounded-2xl border bg-card p-5 shadow-subtle transition ${selected ? "border-primary ring-2 ring-primary/10" : "border-border"}`}>
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-20 items-center justify-center rounded-xl border border-border bg-background p-2">
                        {result.logoUrl ? <img src={result.logoUrl} alt="" className="max-h-8 max-w-16 object-contain" loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : <span className="text-xs font-bold text-muted-foreground">{result.airlineCode ?? "AIR"}</span>}
                      </div>
                      <div>
                        <p className="font-bold">{legs.map((leg) => leg.airlineName).filter((name, index, names) => names.indexOf(name) === index).join(" + ")}</p>
                        <p className="text-xs text-muted-foreground">{result.stops === 0 ? "Nonstop" : `${result.stops} stop${result.stops === 1 ? "" : "s"}`} · {result.duration ?? "Schedule"} · {result.cabin}</p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-background/60 p-4">
                      {legs.map((leg, index) => (
                        <div key={`${result.id}-leg-${index}`} className={index > 0 ? "mt-5 border-t border-border pt-5" : ""}>
                          {legs.length > 1 && <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Leg {index + 1}</p>}
                          <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
                            <div>
                              <p className="text-xl font-bold">{formatDisplayTime(leg.departureTime)}</p>
                              <p className="font-semibold">{leg.from}</p>
                            </div>
                            <div className="text-center text-xs text-muted-foreground">
                              <ArrowRight className="mx-auto size-5 text-accent" />
                              {leg.duration ?? "Schedule"}
                            </div>
                            <div className="sm:text-right">
                              <p className="text-xl font-bold">{formatDisplayTime(leg.arrivalTime)}{leg.arrivalDate && leg.arrivalDate !== date ? " (+1 day)" : ""}</p>
                              <p className="font-semibold">{leg.to}</p>
                            </div>
                          </div>
                          <p className="mt-2 text-xs font-medium text-muted-foreground">{leg.airlineName}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                      <button type="button" onClick={() => { if (tripType === "Round trip") { setSelectedOutbound(result); setSelectedResult(null); setPassengerOpen(false); } else { setSelectedResult(result); setSelectedOutbound(result); setPassengerOpen(true); } }} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground sm:w-auto">
                        <Phone className="size-4" /> Call to Confirm / Book
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-border bg-card p-7 text-sm text-muted-foreground">Your search results will appear here.</div>
        )}

        {tripType === "Round trip" && returnResults.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-4 text-lg font-bold">Return flight options</h3>
            <div className="grid gap-4">
              {returnResults.map((result) => {
                const legs = result.legs?.length ? result.legs : [{ airlineName: result.airlineName, airlineCode: result.airlineCode, logoUrl: result.logoUrl, from: result.departure.iata, to: result.arrival.iata, departureTime: result.departure.time, arrivalTime: result.arrival.time, arrivalDate: result.arrival.date, duration: result.duration }];
                return (
                  <article key={result.id} className="rounded-2xl border border-border bg-card p-5 shadow-subtle">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-20 items-center justify-center rounded-xl border border-border bg-background p-2">{result.logoUrl ? <img src={result.logoUrl} alt="" className="max-h-8 max-w-16 object-contain" loading="lazy" /> : <span className="text-xs font-bold text-muted-foreground">{result.airlineCode ?? "AIR"}</span>}</div>
                      <div><p className="font-bold">{legs.map((leg) => leg.airlineName).filter((name, index, names) => names.indexOf(name) === index).join(" + ")}</p><p className="text-xs text-muted-foreground">{result.stops === 0 ? "Nonstop" : `${result.stops} stop${result.stops === 1 ? "" : "s"}`} · {result.duration ?? "Schedule"} · {result.cabin}</p></div>
                    </div>
                    <div className="mt-5 rounded-2xl border border-border bg-background/60 p-4">{legs.map((leg, index) => <div key={`${result.id}-return-${leg.from}-${leg.to}-${leg.departureTime}-${leg.arrivalTime}-${leg.airlineCode ?? leg.airlineName}`} className={index > 0 ? "mt-5 border-t border-border pt-5" : ""}><div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]"><div><p className="text-xl font-bold">{formatDisplayTime(leg.departureTime)}</p><p className="font-semibold">{leg.from}</p></div><div className="text-center text-xs text-muted-foreground"><ArrowRight className="mx-auto size-5 text-accent" />{leg.duration ?? "Schedule"}</div><div className="sm:text-right"><p className="text-xl font-bold">{formatDisplayTime(leg.arrivalTime)}{leg.arrivalDate && leg.arrivalDate !== returnDate ? " (+1 day)" : ""}</p><p className="font-semibold">{leg.to}</p></div></div><p className="mt-2 text-xs font-medium text-muted-foreground">{leg.airlineName}</p>{leg.layoverMinutes !== undefined && <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-xs font-semibold text-muted-foreground">{formatDuration(leg.layoverMinutes)} layover</p>}</div>)}</div>
                    <div className="mt-4 flex justify-end"><button type="button" onClick={() => { setSelectedReturn(result); if (selectedOutbound) { setSelectedResult(result); setPassengerOpen(true); } }} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground"><Phone className="size-4" /> Call to Confirm / Book</button></div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {selectedResult && passengerOpen && (
          <div className="mt-8 rounded-3xl border border-primary/20 bg-card p-6 shadow-elevated sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="label-board text-accent">Continue booking</p>
                <h3 className="mt-2 text-2xl font-bold">{summary}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{selectedResult.airlineName} · {cabin} · {travelers} traveler{travelers === "1" ? "" : "s"}</p>
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
              <p className="text-xs leading-5 text-muted-foreground">A reservation specialist will confirm the itinerary and booking details by phone before payment.</p>
              <a href={SITE.phoneHref} className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground"><Phone className="size-4" /> Continue by phone</a>
            </div>
          </div>
        )}
      </Section>

      {!embedded && <Section tone="muted" ocid="flight_search.disclosure">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Flight options are shown for the route and travel date selected. A reservation specialist will confirm the itinerary and booking details by phone before payment.{" "}
          {SITE.disclosure}
        </p>
      </Section>}
    </>
  );
}