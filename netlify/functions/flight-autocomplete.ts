const headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "access-control-allow-headers": "Content-Type, Accept",
  "content-type": "application/json; charset=utf-8",
  "cache-control": "public, max-age=300",
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (request.method !== "GET") return new Response(JSON.stringify({ error: "Use GET." }), { status: 405, headers });
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < 2) return new Response(JSON.stringify({ suggestions: [] }), { status: 200, headers });
  if (query.length > 80) return new Response(JSON.stringify({ error: "Search query is too long.", suggestions: [] }), { status: 400, headers });

  try {
    const params = new URLSearchParams({ term: query, locale: "en" });
    params.append("types[]", "airport");
    const response = await fetch("https://autocomplete.travelpayouts.com/places2?" + params.toString(), {
      headers: { accept: "application/json" },
    });
    if (!response.ok) throw new Error("Airport provider unavailable.");
    const payload = await response.json() as Array<{
      code?: string;
      name?: string;
      name_translations?: { en?: string };
      city_name?: string;
      country_name?: string;
      coordinates?: { lat?: number; lon?: number };
    }>;
    const suggestions = (Array.isArray(payload) ? payload : [])
      .filter((item) => /^[A-Z0-9]{3}$/i.test(item.code ?? ""))
      .map((item) => ({
        iata: String(item.code).toUpperCase(),
        name: item.name_translations?.en || item.name || item.code,
        city: item.city_name || "",
        country: item.country_name || "",
        lat: item.coordinates?.lat,
        lon: item.coordinates?.lon,
      }))
      .filter((item, index, items) => items.findIndex((candidate) => candidate.iata === item.iata) === index)
      .slice(0, 12);
    return new Response(JSON.stringify({ suggestions }), { status: 200, headers });
  } catch {
    return new Response(JSON.stringify({ error: "Airport suggestions are temporarily unavailable.", suggestions: [] }), { status: 502, headers });
  }
}
