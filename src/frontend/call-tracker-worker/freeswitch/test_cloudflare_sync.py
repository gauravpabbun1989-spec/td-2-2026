import importlib.util
import sqlite3
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

SOURCE = Path(__file__).with_name("cloudflare_sync.py")
spec = importlib.util.spec_from_file_location("cloudflare_sync", SOURCE)
sync = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync)


class CompletedCallSyncTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.calls_db = str(Path(self.temp.name) / "calls.sqlite3")
        self.state_db = str(Path(self.temp.name) / "sync-state.sqlite3")
        db = sqlite3.connect(self.calls_db)
        db.executescript("""
            CREATE TABLE calls (
                uuid TEXT PRIMARY KEY, first_seen TEXT, answered_at TEXT,
                ended_at TEXT, billsec TEXT, direction TEXT,
                destination TEXT, sip_call_id TEXT
            );
            CREATE TABLE ringing_notifications (
                call_uuid TEXT PRIMARY KEY, status TEXT NOT NULL
            );
        """)
        db.executemany("""
            INSERT INTO calls(uuid,first_seen,answered_at,ended_at,billsec,direction,destination,sip_call_id)
            VALUES(?,?,?,?,?,?,?,?)
        """, [
            ("accepted-rung", "2026-11-25T04:00:00+00:00", None,
             "2026-11-25T04:00:05+00:00", "0", "inbound", "1001", "sip-1"),
            ("answered-rung", "2026-11-25T04:01:00+00:00", "2026-11-25T04:01:02+00:00",
             "2026-11-25T04:01:10+00:00", "8", "inbound", "1001", "sip-2"),
            ("pending-ring", "2026-11-25T04:02:00+00:00", None,
             "2026-11-25T04:02:05+00:00", "0", "inbound", "1001", "sip-3"),
            ("external-provider", "2026-11-25T04:03:00+00:00", None,
             "2026-11-25T04:03:05+00:00", "0", "inbound", "1001", "sip-4"),
            ("outbound", "2026-11-25T04:04:00+00:00", None,
             "2026-11-25T04:04:05+00:00", "0", "outbound", "1001", "sip-5"),
            ("no-sip-id", "2026-11-25T04:05:00+00:00", None,
             "2026-11-25T04:05:05+00:00", "0", "inbound", "1001", ""),
            ("no-hangup", "2026-11-25T04:06:00+00:00", None,
             None, "0", "inbound", "1001", "sip-7"),
        ])
        db.executemany("INSERT INTO ringing_notifications(call_uuid,status) VALUES(?,?)", [
            ("accepted-rung", "sent"),
            ("answered-rung", "sent"),
            ("pending-ring", "pending"),
            ("external-provider", "sent"),
            ("outbound", "sent"),
            ("no-sip-id", "sent"),
            ("no-hangup", "sent"),
        ])
        db.commit()
        db.close()

    def tearDown(self):
        self.temp.cleanup()

    def test_only_completed_sent_agent_ring_calls_are_selected(self):
        with patch.object(sync, "CALLS_DB", self.calls_db):
            sync.ensure_schema()
            db = sqlite3.connect(self.calls_db)
            db.execute(
                "INSERT INTO call_classifications(call_uuid,classification) VALUES('external-provider','external_provider')"
            )
            db.commit()
            db.close()
            rows = sync.load_calls()
        self.assertEqual([row["uuid"] for row in rows], ["accepted-rung", "answered-rung"])
        # A ring-only call remains eligible as an accepted call; it need not be answered.
        self.assertIsNone(rows[0]["answered_at"])
        self.assertEqual(int(rows[0]["billsec"]), 0)

    def test_known_test_calls_are_classified_and_excluded(self):
        with patch.object(sync, "CALLS_DB", self.calls_db):
            sync.ensure_schema()
            db = sqlite3.connect(self.calls_db)
            classifications = dict(db.execute(
                "SELECT call_uuid,classification FROM call_classifications"
            ))
            db.close()
        self.assertEqual(len(classifications), len(sync.TEST_CALL_UUIDS))
        self.assertTrue(all(value == "test_call" for value in classifications.values()))


if __name__ == "__main__":
    unittest.main()
