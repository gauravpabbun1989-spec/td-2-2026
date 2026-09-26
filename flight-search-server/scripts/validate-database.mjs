import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { access } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const dbPath = fileURLToPath(new URL("../data/flights.json", import.meta.url));
const airportPath = fileURLToPath(new URL("../data/airports.json", import.meta.url));

const db = JSON.parse(await readFile(dbPath, "utf8"));
assert.equal(db.schemaVersion, 1);
assert.ok(Array.isArray(db.flights));

const required = ["airline","airlineCode","flightNumber","departure","arrival"];
for (const flight of db.flights) {
  for (const key of required) assert.ok(flight[key] !== undefined, "missing " + key);
  assert.match(flight.departure.iata, /^[A-Z]{3}$/);
  assert.match(flight.arrival.iata, /^[A-Z]{3}$/);
  assert.match(flight.departure.date, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(flight.departure.time, /^\d{2}:\d{2}$/);
  assert.match(flight.arrival.time, /^\d{2}:\d{2}$/);
  assert.equal(Object.hasOwn(flight, "fare"), false);
}

try {
  await access(airportPath);
  const airports = JSON.parse(await readFile(airportPath, "utf8"));
  assert.equal(airports.schemaVersion, 1);
  assert.ok(Array.isArray(airports.airports));
  for (const airport of airports.airports) assert.match(airport.iata, /^[A-Z0-9]{3}$/);
  console.log("database validation passed:", db.flights.length, "flights;", airports.airports.length, "airports");
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
  console.log("database validation passed:", db.flights.length, "flights; airport reference not generated in repository yet");
}
