import { PocketIc } from "@dfinity/pic";
import { afterAll, beforeAll, expect, it } from "vitest";

import { idlFactory as previousIdlFactory } from "../../.old/src/frontend/src/declarations/backend.did.js";
import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { Cell, _SERVICE } from "../../src/frontend/src/declarations/backend.did";

/**
 * Migration across a real upgrade. The previous revision stored a single
 * `travelDates : Text`; this build splits it into `departureDate : ?Text` and
 * `returnDate : ?Text` and adds `cabin`. A lead written by the deployed version
 * must survive the upgrade with the new shape, or the app deploys green and the
 * user's records are silently gone.
 *
 * The runner only runs `*.upgrade.test.*` when it can build the previous
 * revision from `.old/`, and hands its path in `BACKEND_WASM_PREVIOUS`.
 */

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";
const PREVIOUS_WASM = process.env.BACKEND_WASM_PREVIOUS ?? "";

let pic: PocketIc | undefined;

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
});

afterAll(async () => {
  await pic?.tearDown();
});

/** Flattens one OQL row of `{ name, value }` cells into a name-keyed record. */
function rowToRecord(row: Array<Cell>): Record<string, unknown> {
  const record: Record<string, unknown> = {};
  for (const cell of row) {
    const [, value] = Object.entries(cell.value)[0] ?? [];
    record[cell.name] = value;  }
  return record;
}

it("carries a lead written by the previous version through the upgrade", async () => {
  if (pic === undefined) throw new Error("PocketIC was not created");

  // 1. Install the version the user is actually running.
  const previous = await pic.setupCanister({
    idlFactory: previousIdlFactory,
    wasm: PREVIOUS_WASM,
  });

  // 2. Write a lead through the OLD public API, as the deployed app did.
  const written = await previous.actor.submitTripRequest({
    name: "Ada Lovelace",
    phone: "3105550142",
    email: "ada@example.com",
    tripType: { roundTrip: null },
    origin: "Los Angeles (LAX)",
    destination: "Tokyo (HND)",
    travelDates: "2026-03-14 to 2026-03-28",
    travelers: 2n,
    details: ["Aisle seats"],
  });
  expect(written).toHaveProperty("ok");

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

  // 4. Read the migrated lead back through the new canister's own OQL read
  //    (controller-only, and the installing principal is the controller).
  const upgraded = pic.createActor<_SERVICE>(idlFactory, previous.canisterId);
  const page = await upgraded.execute('{"start":"tripRequest"}');
  expect(page.rows).toHaveLength(1);

  const lead = rowToRecord(page.rows[0]);
  // Survival: the old lead is still there, with its identity and fields intact.
  expect(lead.id).toBe(0n);
  expect(lead.name).toBe("Ada Lovelace");
  expect(lead.phone).toBe("3105550142");
  expect(lead.email).toBe("ada@example.com");
  expect(lead.origin).toBe("Los Angeles (LAX)");
  expect(lead.destination).toBe("Tokyo (HND)");
  expect(lead.travelers).toBe(2n);
  expect(lead.details).toBe("Aisle seats");
  expect(lead.tripType).toBe("roundTrip");
  // New shape: the old free-text `travelDates` became `departureDate`, the
  // absent return date is null, and the cabin defaults to no preference.
  expect(lead.departureDate).toBe("2026-03-14 to 2026-03-28");
  expect(lead.returnDate).toBe("");
  expect(lead.cabin).toBe("noPreference");

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
  expect(result.ok.id).toBe(1n);
});
