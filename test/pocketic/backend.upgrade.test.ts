import { PocketIc } from "@dfinity/pic";
import { Principal } from "@icp-sdk/core/principal";
import { afterAll, beforeAll, expect, it } from "vitest";

import { idlFactory as previousIdlFactory } from "../../.old/src/frontend/src/declarations/backend.did.js";
import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

/**
 * Migration across a real upgrade. The previous revision stored leads in the
 * same `TripRequest` shape but returned a bare record from `submitTripRequest`
 * and had no admin `listLeads`. This build wraps the record in
 * `SubmitSuccess { lead; email }` and adds the admin read. A lead written by
 * the deployed version must survive the upgrade and still be readable through
 * the new admin API, or the app deploys green and the user's records are
 * silently gone.
 *
 * The runner only runs `*.upgrade.test.*` when it can build the previous
 * revision from `.old/`, and hands its path in `BACKEND_WASM_PREVIOUS`.
 */

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";
const PREVIOUS_WASM = process.env.BACKEND_WASM_PREVIOUS ?? "";

/**
 * A principal that exists but exposes no `broadcast_email` method, so the
 * email extension returns a real `#err` instead of trapping on a missing
 * platform environment variable. Set at install so it survives the upgrade.
 */
const NO_EMAIL_SERVICE_PRINCIPAL = "aaaaa-aa";

const ADMIN = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");

let pic: PocketIc | undefined;

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
});

afterAll(async () => {
  await pic?.tearDown();
});

it("carries a lead written by the previous version through the upgrade", async () => {
  if (pic === undefined) throw new Error("PocketIC was not created");

  // 1. Install the version the user is actually running.
  const previous = await pic.setupCanister({
    idlFactory: previousIdlFactory,
    wasm: PREVIOUS_WASM,
    environmentVariables: [
      { name: "INTEGRATIONS_CANISTER_ID", value: NO_EMAIL_SERVICE_PRINCIPAL },
    ],
  });

  // 2. Write a lead through the OLD public API, as the deployed app did. The
  //    old contract already wraps the stored record in `SubmitSuccess`, so the
  //    lead is at `ok.lead` — the same shape this build keeps.
  const written = await previous.actor.submitTripRequest({
    name: "Ada Lovelace",
    phone: "3105550142",
    email: "ada@example.com",
    tripType: { roundTrip: null },
    origin: "Los Angeles (LAX)",
    destination: "Tokyo (HND)",
    departureDate: ["2026-03-14"],
    returnDate: ["2026-03-28"],
    travelers: 2n,
    cabin: { business: null },
    details: ["Aisle seats"],
  });
  expect(written).toHaveProperty("ok");
  if (!("ok" in written)) throw new Error("expected an ok result");
  expect(written.ok.lead.name).toBe("Ada Lovelace");

  // 3. Upgrade to the version this build produces. The migration runs here.
  //    `wasm_memory_persistence: keep` is REQUIRED: these canisters are built
  //    with enhanced orthogonal persistence, and an upgrade without it is
  //    rejected with "Missing upgrade option".
  await pic.upgradeCanister({
    canisterId: previous.canisterId,
    wasm: BACKEND_WASM,
    upgradeModeOptions: {
      skip_pre_upgrade: [],
      wasm_memory_persistence: [{ keep: null }],
    },
  });

  // 4. Read the migrated lead back through the new admin API. The installing
  //    principal is the controller and becomes the admin on first initialize.
  const upgraded = pic.createActor<_SERVICE>(idlFactory, previous.canisterId);
  upgraded.setPrincipal(ADMIN);
  await upgraded._initialize_access_control();
  expect(await upgraded.isCallerAdmin()).toBe(true);

  const leads = await upgraded.listLeads();
  expect(leads).toHaveLength(1);

  const lead = leads[0];
  // Survival: the old lead is still there, with its identity and fields intact.
  expect(lead.id).toBe(0n);
  expect(lead.name).toBe("Ada Lovelace");
  expect(lead.phone).toBe("3105550142");
  expect(lead.email).toBe("ada@example.com");
  expect(lead.origin).toBe("Los Angeles (LAX)");
  expect(lead.destination).toBe("Tokyo (HND)");
  expect(lead.travelers).toBe(2n);
  expect(lead.details).toEqual(["Aisle seats"]);
  expect(lead.tripType).toEqual({ roundTrip: null });
  expect(lead.departureDate).toEqual(["2026-03-14"]);
  expect(lead.returnDate).toEqual(["2026-03-28"]);
  expect(lead.cabin).toEqual({ business: null });
  expect(typeof lead.submittedAt).toBe("bigint");

  // 5. The upgraded canister still accepts the new-shape input, and the next
  //    lead continues the id sequence rather than restarting it.
  const result = await upgraded.submitTripRequest({
    name: "Grace Hopper",
    phone: "3105550143",
    email: "grace@example.com",
    tripType: { oneWay: null },
    origin: "Los Angeles (LAX)",
    destination: "Tokyo (HND)",
    departureDate: ["2026-04-01"],
    returnDate: [],
    travelers: 1n,
    cabin: { economy: null },
    details: [],
  });
  expect(result).toHaveProperty("ok");
  if (!("ok" in result)) throw new Error("expected an ok result");
  expect(result.ok.lead.id).toBe(1n);
});
