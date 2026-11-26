#!/usr/bin/env python3
"""Sync completed, already-ringing call metadata to the call-tracker Worker.

This job is deliberately not a conversion sender. It updates answer, hangup,
and billsec metadata for calls that were already accepted at agent-leg ringing.
"""
import argparse
import json
import os
import sqlite3
import urllib.request
import urllib.error

CALLS_DB = "/var/lib/ticketdepart-calltracker/calls.sqlite3"
STATE_DB = "/var/lib/ticketdepart-calltracker/cloudflare-sync.sqlite3"
ENDPOINT = "https://ticketdepart-call-tracker.gaurav-pabbun.workers.dev/v1/calls/ingest"
PUBLIC_DID = "18885649049"

# Calls explicitly classified by the account owner as test traffic. Keep these
# out of production call reporting and never upload them to the Worker.
TEST_CALL_UUIDS = (
    "0ff5b89c-9e18-4c0b-a24f-80c4c6fe6dbf",
    "f47780ee-de86-47e3-8c1b-1c918dc3ae4b",
    "285d3552-f740-406c-9937-9159e4ce0cde",
    "dcb7d993-dd7d-4e91-87b6-89d0e7f9bf53",
    "14f24988-e936-4902-ac9b-b77332f785d4",
    "30816862-bd9a-4bb5-88ab-a9632cee5828",
    "bdf81815-447a-4c04-a122-3f656035f2a1",
    "9ec7c8dc-d189-49ab-85f3-84cd165fe3c5",
)


def ensure_schema():
    db = sqlite3.connect(CALLS_DB)
    db.execute("""
        CREATE TABLE IF NOT EXISTS call_classifications (
            call_uuid TEXT PRIMARY KEY,
            classification TEXT NOT NULL,
            classified_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    """)
    db.executemany("""
        INSERT INTO call_classifications(call_uuid, classification)
        VALUES (?, 'test_call')
        ON CONFLICT(call_uuid) DO UPDATE SET classification='test_call'
    """, [(call_uuid,) for call_uuid in TEST_CALL_UUIDS])
    db.commit()
    db.close()


def load_calls():
    db = sqlite3.connect(f"file:{CALLS_DB}?mode=ro", uri=True)
    db.row_factory = sqlite3.Row
    rows = db.execute("""
        SELECT c.uuid, c.first_seen, c.answered_at, c.ended_at, c.billsec
        FROM calls c
        JOIN ringing_notifications r
          ON r.call_uuid = c.uuid
         AND r.status = 'sent'
        LEFT JOIN call_classifications x
          ON x.call_uuid = c.uuid
        WHERE c.direction = 'inbound'
          AND c.destination = '1001'
          AND c.sip_call_id IS NOT NULL
          AND c.sip_call_id != ''
          AND c.ended_at IS NOT NULL
          -- Metadata sync only: exclude tests and known external-provider calls.
          -- Unknown calls remain unmatched in D1 and never create conversions.
          AND COALESCE(x.classification, '') NOT IN ('test_call', 'external_provider')
        ORDER BY c.first_seen
    """).fetchall()
    db.close()
    return rows


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--send",
        action="store_true",
        help="Upload completed call metadata; this endpoint creates no conversions",
    )
    args = parser.parse_args()

    ensure_schema()
    rows = load_calls()
    state = sqlite3.connect(STATE_DB)
    state.execute("""
        CREATE TABLE IF NOT EXISTS synced_calls (
            call_uuid TEXT PRIMARY KEY,
            synced_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    already = {row[0] for row in state.execute("SELECT call_uuid FROM synced_calls")}
    pending = [row for row in rows if row["uuid"] not in already]

    print(f"Completed agent-ringing calls found: {len(rows)}")
    print(f"Already synced: {len(already)}")
    print(f"Pending upload: {len(pending)}")

    if not args.send:
        print("DRY RUN ONLY: no calls uploaded.")
        state.close()
        return

    secret = os.environ.get("CALL_INGEST_SECRET", "")
    if not secret:
        raise SystemExit("CALL_INGEST_SECRET is missing.")

    for start in range(0, len(pending), 50):
        batch = pending[start:start + 50]
        calls = []
        for row in batch:
            try:
                billsec = int(row["billsec"] or 0)
            except (TypeError, ValueError):
                billsec = 0
            calls.append({
                "call_uuid": row["uuid"],
                "destination": PUBLIC_DID,
                "agent_extension": "1001",
                "created_at": row["first_seen"],
                "answered_at": row["answered_at"] or None,
                "hangup_at": row["ended_at"],
                "billsec": billsec,
            })

        request = urllib.request.Request(
            ENDPOINT,
            data=json.dumps({"calls": calls}).encode(),
            headers={
                "Authorization": "Bearer " + secret,
                "Content-Type": "application/json",
                "User-Agent": "TicketDepartCallTracker/1.0",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=20) as response:
                result = json.loads(response.read().decode())
                if response.status != 200 or result.get("ok") is not True:
                    raise RuntimeError("Ingestion endpoint did not confirm success")
                if result.get("received") != len(batch):
                    raise RuntimeError("Ingestion endpoint received an unexpected count")
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, ValueError) as exc:
            raise SystemExit(f"Upload failed; batch remains pending: {type(exc).__name__}") from exc

        state.executemany(
            "INSERT OR IGNORE INTO synced_calls(call_uuid) VALUES (?)",
            [(row["uuid"],) for row in batch],
        )
        state.commit()
        print(f"Uploaded and recorded {len(batch)} calls.")

    state.close()
    print("Sync completed.")


if __name__ == "__main__":
    main()
