import { PocketIc } from "@dfinity/pic";
import { Principal } from "@icp-sdk/core/principal";
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
 *
 * The notification email goes through the platform email extension, which in
 * production reads `INTEGRATIONS_GATEWAY_*` (or `INTEGRATIONS_CANISTER_ID`)
 * from the canister's environment. A local replica has neither, so the
 * extension would trap before the app could report an outcome. The lane sets
 * `INTEGRATIONS_CANISTER_ID` to a principal with no email service, which makes
 * the extension return a real `#err` — the exact failure branch the accepted
 * requirement asks the backend to surface without losing the lead.
 */

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";
// Set only on a converted project: the last pre-EM revision, whose schema this
// app's migration chain replays from.
const BASELINE_WASM = process.env.BACKEND_WASM_BASELINE;

/**
 * A principal that exists but exposes no `broadcast_email` method, so the
 * email extension's call rejects and its own `try/catch` turns that into
 * `#err`. This is the platform's documented failure path, not a stub.
 */
const NO_EMAIL_SERVICE_PRINCIPAL = "aaaaa-aa";

const ADMIN = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
const NON_ADMIN = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");

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
  const environmentVariables = [
    { name: "INTEGRATIONS_CANISTER_ID", value: NO_EMAIL_SERVICE_PRINCIPAL },
  ];
  if (BASELINE_WASM === undefined) {
    ({ actor } = await pic.setupCanister<_SERVICE>({
      idlFactory,
      wasm: BACKEND_WASM,
      environmentVariables,
    }));
    return;
  }
  // `[baseline, current]`, the same install contract the hosted deploy uses for
  // a converted project. The upgrade replays the chain from the legacy schema.
  const installed = await pic.setupCanister<_SERVICE>({
    idlFactory,
    wasm: BASELINE_WASM,
    environmentVariables,
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
  const { lead: stored, email } = result.ok;
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

  // The email extension could not reach a service, so the result reports the
  // failure instead of claiming a send. The lead is still returned as stored.
  expect(email).toHaveProperty("failed");
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
  expect(result.ok.lead.returnDate).toEqual(["2026-03-28"]);
  expect(result.ok.lead.cabin).toEqual({ business: null });
  expect(result.ok.lead.travelers).toBe(2n);
  expect(result.ok.lead.details).toEqual(["Window seats if possible"]);
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

it("rejects listLeads for an anonymous caller", async () => {
  actor.setPrincipal(Principal.anonymous());
  await expect(actor.listLeads()).rejects.toThrow(/Unauthorized/i);
});

it("rejects listLeads for a signed-in non-admin caller", async () => {
  // The first non-anonymous principal to initialize becomes the admin, and
  // registers the second caller as a plain user.
  actor.setPrincipal(ADMIN);
  await actor._initialize_access_control();
  await actor.assignCallerUserRole(NON_ADMIN, { user: null });

  actor.setPrincipal(NON_ADMIN);
  expect(await actor.isCallerAdmin()).toBe(false);
  await expect(actor.listLeads()).rejects.toThrow(/Unauthorized/i);
});

it("returns every stored lead newest-first to an admin caller", async () => {
  actor.setPrincipal(ADMIN);
  // Idempotent for an already-registered caller, so this test does not depend
  // on the order the caller-isolation test ran in.
  await actor._initialize_access_control();
  expect(await actor.isCallerAdmin()).toBe(true);

  const leads = await actor.listLeads();
  expect(leads.length).toBeGreaterThanOrEqual(2);

  // Newest first: the round trip submitted after the one-way lead.
  expect(leads[0].name).toBe("Jordan Ellis");
  expect(leads[0].tripType).toEqual({ roundTrip: null });
  expect(leads[0].returnDate).toEqual(["2026-03-28"]);
  expect(leads[0].cabin).toEqual({ business: null });
  expect(leads[0].travelers).toBe(2n);
  expect(leads[0].details).toEqual(["Window seats if possible"]);

  // The full field set is present on every stored lead.
  for (const lead of leads) {
    expect(typeof lead.id).toBe("bigint");
    expect(typeof lead.submittedAt).toBe("bigint");
    expect(typeof lead.name).toBe("string");
    expect(typeof lead.phone).toBe("string");
    expect(typeof lead.email).toBe("string");
    expect(typeof lead.origin).toBe("string");
    expect(typeof lead.destination).toBe("string");
    expect(Array.isArray(lead.departureDate)).toBe(true);
    expect(Array.isArray(lead.returnDate)).toBe(true);
    expect(typeof lead.travelers).toBe("bigint");
    expect(lead.cabin).toBeDefined();
    expect(Array.isArray(lead.details)).toBe(true);
  }
});
