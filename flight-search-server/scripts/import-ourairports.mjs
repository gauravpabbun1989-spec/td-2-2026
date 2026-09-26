import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const sourceUrl = process.env.OURAIRPORTS_URL ||
  "https://davidmegginson.github.io/ourairports-data/airports.csv";
const outputPath = path.resolve(process.env.OUTPUT || new URL("../data/airports.json", import.meta.url).pathname);

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], n = text[i + 1];
    if (c === '"' && quoted && n === '"') { field += '"'; i++; continue; }
    if (c === '"') { quoted = !quoted; continue; }
    if (c === "," && !quoted) { row.push(field); field = ""; continue; }
    if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && n === "\n") i++;
      row.push(field); rows.push(row); row = []; field = ""; continue;
    }
    field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const headers = rows.shift().map((x) => x.trim());
  return rows.filter((r) => r.length === headers.length).map((r) =>
    Object.fromEntries(headers.map((h, i) => [h, r[i]])));
}

const response = await fetch(sourceUrl);
if (!response.ok) throw new Error("OurAirports download failed: " + response.status);
const rows = parseCsv(await response.text());
const airports = rows
  .filter((r) => r.iata_code && r.scheduled_service === "yes")
  .map((r) => ({
    iata: r.iata_code,
    icao: r.gps_code || null,
    name: r.name,
    city: r.municipality || null,
    countryCode: r.iso_country || null,
    latitude: Number(r.latitude_deg),
    longitude: Number(r.longitude_deg),
    timezone: r.tz_database_time_zone || null,
    type: r.type || null,
  }));

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, JSON.stringify({
  schemaVersion: 1,
  source: {
    name: "OurAirports",
    url: sourceUrl,
    license: "Public domain / Unlicense",
    retrievedAt: new Date().toISOString(),
  },
  airports,
}, null, 2) + "\n");

console.log("Imported " + airports.length + " scheduled-service airports to " + outputPath);
