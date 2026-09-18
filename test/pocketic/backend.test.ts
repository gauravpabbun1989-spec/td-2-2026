import { PocketIc } from "@dfinity/pic";
import { afterAll, beforeAll, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

/**
 * PocketIC backend lane for TicketDepart. Installs the app's own compiled
 * `src/backend/dist/backend.wasm` into the platform's replica and calls the
 * real public API, so a canister whose methods are unimplemented stubs that
 * trap at runtime cannot pass the gate.
 *
 * The lane speaks the declarations' Candid shapes: `?T` is `[] | [T]`, a
 * variant is `{ variantName: null }`, and `Nat` is `bigint`.
 */

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";
// Set only on a converted project: the last pre-EM revision, whose schema this
// app's migration chain replays from.
const BASELINE_WASM = process.env.BACKEND_WASM_BASELINE;

let pic: PocketIc | undefined;
let actor: _SERVICE;

/** A valid one-way input with every required field populated. */
function validInput() {
  return {
    name: "Jordan Ellis",
    phone: "3105550142",
    email: "jordan@example.com",
    tripType: { oneWay: null },
    origin: "Los Angeles (LAX)",
    destination: "Tokyo (HND)",
    departureDate: ["2026-03-14"],
    returnDate: [],
    travelers: 1n,
    cabin: { noPreference: null },
    details: [],
  };
}

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  if (BASELINE_WASM === undefined) {
    ({ actor } = await pic.setupCanister<_SERVICE>({
      idlFactory,
      wasm: BACKEND_WASM,
    }));
    return;
  }
  // `[baseline, current]`, the same install contract the hosted deploy uses for
  // a converted project. The upgrade replays the chain from the legacy schema.
  const installed = await pic.setupCanister<_SERVICE>({
    idlFactory,
    wasm: BASELINE_WASM,
  });
  await pic.upgradeCanister({
    canisterId: installed.canisterId,
    wasm: BACKEND_WASM,
    arg: new Uint8Array(),
  });
  actor = installed.actor;
});

afterAll(async () => {
  await pic?.tearDown();
});

it("answers getApiDoc instead of trapping", async () => {
  const doc = await actor.getApiDoc();
  expect(typeof doc).toBe("string");
  expect(doc.length).toBeGreaterThan(0);
});

it("stores a one-way trip request and returns the full record", async () => {
  const result = await actor.submitTripRequest(validInput());

  expect(result).toHaveProperty("ok");
  if (!("ok" in result)) throw new Error("expected an ok result");
  const stored = result.ok;
  expect(stored.name).toBe("Jordan Ellis");
  expect(stored.phone).toBe("3105550142");
  expect(stored.email).toBe("jordan@example.com");
  expect(stored.tripType).toEqual({ oneWay: null });
  expect(stored.origin).toBe("Los Angeles (LAX)");
  expect(stored.destination).toBe("Tokyo (HND)");
  expect(stored.departureDate).toEqual(["2026-03-14"]);
  expect(stored.returnDate).toEqual([]);
  expect(stored.travelers).toBe(1n);
  expect(stored.cabin).toEqual({ noPreference: null });
  expect(stored.details).toEqual([]);
  expect(typeof stored.id).toBe("bigint");
  expect(typeof stored.submittedAt).toBe("bigint");
});

it("stores a round trip with return date and cabin", async () => {
  const result = await actor.submitTripRequest({
    ...validInput(),
    tripType: { roundTrip: null },
    returnDate: ["2026-03-28"],
    travelers: 2n,
    cabin: { business: null },
    details: ["Window seats if possible"],
  });

  expect(result).toHaveProperty("ok");
  if (!("ok" in result)) throw new Error("expected an ok result");
  expect(result.ok.returnDate).toEqual(["2026-03-28"]);
  expect(result.ok.cabin).toEqual({ business: null });
  expect(result.ok.travelers).toBe(2n);
  expect(result.ok.details).toEqual(["Window seats if possible"]);
});

it("rejects an invalid email with a caller-actionable error", async () => {
  const result = await actor.submitTripRequest({
    ...validInput(),
    email: "not-an-email",
  });
  expect(result).toEqual({ err: { invalidEmail: null } });
});

it("rejects a missing departure date", async () => {
  const result = await actor.submitTripRequest({
    ...validInput(),
    departureDate: [],
  });
  expect(result).toEqual({ err: { invalidDepartureDate: null } });
});

it("rejects a traveler count below one", async () => {
  const result = await actor.submitTripRequest({
    ...validInput(),
    travelers: 0n,
  });
  expect(result).toEqual({ err: { invalidTravelers: null } });
});
