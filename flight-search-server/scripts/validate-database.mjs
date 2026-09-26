import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dbPath = fileURLToPath(new URL("../data/flights.json", import.meta.url));
const airportPath = fileURLToPath(new URL("../data/airports.json", import.meta.url));

const db = JSON.parse(await readFile(dbPath, "utf8"));
assert.equal(db.schemaVersion, 1);
assert.ok(Array.isArray(db.flights));

const airportDb = JSON.parse(await readFile(airportPath, "utf8"));
assert.equal(airportDb.schemaVersion, 1);
assert.ok(Array.isArray(airportDb.airports));

const required = ["airline","airlineCode","flightNumber","departure","arrival"];
for (const flight of db.flights) {
  for (const key of required) assert.ok(flight[key] !== undefined, "missing " + key);
  assert.ok(flight.departure.iata && flight.arrival.iata);
  assert.match(flight.departure.date, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(flight.departure.time, /^\d{2}:\d{2}$/);
  assert.match(flight.arrival.time, /^\d{2}:\d{2}$/);
  assert.equal(Object.hasOwn(flight, "fare"), false);
}
console.log("database validation passed:", db.flights.length, "flights;", airportDb.airports.length, "airports");
