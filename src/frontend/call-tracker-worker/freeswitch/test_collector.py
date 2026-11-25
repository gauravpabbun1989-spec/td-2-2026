import importlib.util
import json
import sqlite3
import unittest
from pathlib import Path
from unittest.mock import patch

SOURCE = Path(__file__).with_name("collector.py")
spec = importlib.util.spec_from_file_location("collector", SOURCE)
collector = importlib.util.module_from_spec(spec)
spec.loader.exec_module(collector)


class RingingDetectorTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        self.db.executescript("""
            CREATE TABLE calls (
                uuid TEXT PRIMARY KEY, first_seen TEXT, last_seen TEXT,
                direction TEXT, caller TEXT, destination TEXT, context TEXT,
                channel TEXT, sip_call_id TEXT, answered_at TEXT, ended_at TEXT,
                hangup_cause TEXT, duration TEXT, billsec TEXT, last_event TEXT
            );
            CREATE TABLE call_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_time TEXT NOT NULL, event_name TEXT, uuid TEXT, details TEXT
            );
            CREATE TABLE ringing_notifications (
                call_uuid TEXT PRIMARY KEY, ringing_at TEXT NOT NULL,
                destination TEXT, status TEXT NOT NULL DEFAULT 'pending',
                attempts INTEGER NOT NULL DEFAULT 0, last_error TEXT,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE answer_notifications (
                call_uuid TEXT PRIMARY KEY, answered_at TEXT NOT NULL,
                destination TEXT, status TEXT NOT NULL DEFAULT 'pending',
                attempts INTEGER NOT NULL DEFAULT 0, last_error TEXT,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        """)
        self.inbound_uuid = "9ec7c8dc-d189-49ab-85f3-84cd165fe3c5"
        self.did = "18885550123"
        self.add_inbound_create()
        self.event = {
            "Event-Name": "CHANNEL_CALLSTATE",
            "Call-Direction": "outbound",
            "Channel-Call-State": "RINGING",
            "Caller-Destination-Number": "1001",
            "variable_originating_leg_uuid": self.inbound_uuid,
            "Channel-Name": "sofia/internal/1001@100.76.52.119:38838",
            "Event-Date-Timestamp": "1795286559000000",
        }

    def add_inbound_create(self, did=None):
        details = {
            "Unique-ID": self.inbound_uuid,
            "Call-Direction": "inbound",
            "Caller-Destination-Number": did or self.did,
            "Caller-Context": "public",
            "Channel-Name": "sofia/external/provider-call",
        }
        self.db.execute(
            "INSERT INTO call_events(event_time,event_name,uuid,details) VALUES(?,?,?,?)",
            ("2026-11-25T04:00:00+00:00", "CHANNEL_CREATE", self.inbound_uuid, json.dumps(details)),
        )
        self.db.commit()

    def tearDown(self):
        self.db.close()

    def test_agent_1001_ringing_queues_original_uuid_and_called_did(self):
        with patch.object(collector, "send_pending_ringing") as send:
            collector.queue_ringing_event(self.db, self.event)
        row = self.db.execute(
            "SELECT call_uuid,destination,status FROM ringing_notifications"
        ).fetchone()
        self.assertEqual(row, (self.inbound_uuid, self.did, "pending"))
        send.assert_called_once_with(self.db)

    def test_duplicate_agent_ringing_creates_one_notification(self):
        with patch.object(collector, "send_pending_ringing") as send:
            collector.queue_ringing_event(self.db, self.event)
            collector.queue_ringing_event(self.db, self.event)
        self.assertEqual(
            self.db.execute("SELECT COUNT(*) FROM ringing_notifications").fetchone()[0],
            1,
        )
        self.assertEqual(send.call_count, 2)

    def test_invalid_inbound_did_is_not_forwarded(self):
        self.db.execute("DELETE FROM call_events")
        self.add_inbound_create("not-a-number")
        with patch.object(collector, "send_pending_ringing") as send:
            collector.queue_ringing_event(self.db, self.event)
        self.assertEqual(
            self.db.execute("SELECT COUNT(*) FROM ringing_notifications").fetchone()[0],
            0,
        )
        send.assert_not_called()

    def test_wrong_agent_extension_is_ignored(self):
        event = dict(self.event, **{"Caller-Destination-Number": "1002"})
        with patch.object(collector, "send_pending_ringing") as send:
            collector.queue_ringing_event(self.db, event)
        self.assertEqual(
            self.db.execute("SELECT COUNT(*) FROM ringing_notifications").fetchone()[0],
            0,
        )
        send.assert_not_called()

    def test_progress_media_is_not_a_ringing_trigger(self):
        event = dict(self.event, **{"Event-Name": "CHANNEL_PROGRESS_MEDIA"})
        with patch.object(collector, "send_pending_ringing") as send:
            collector.queue_ringing_event(self.db, event)
        self.assertEqual(
            self.db.execute("SELECT COUNT(*) FROM ringing_notifications").fetchone()[0],
            0,
        )
        send.assert_not_called()

    def test_answer_event_preserves_original_called_did(self):
        event = {
            "Event-Name": "CHANNEL_ANSWER",
            "Call-Direction": "outbound",
            "Answer-State": "answered",
            "Caller-Destination-Number": "1001",
            "variable_sip_to_user": "1001",
            "variable_originating_leg_uuid": self.inbound_uuid,
            "Event-Date-Timestamp": "1795286560000000",
        }
        with patch.object(collector, "send_pending_answered") as send:
            collector.queue_answered_event(self.db, event)
        row = self.db.execute(
            "SELECT call_uuid,destination,status FROM answer_notifications"
        ).fetchone()
        self.assertEqual(row, (self.inbound_uuid, self.did, "pending"))
        send.assert_called_once_with(self.db)


if __name__ == "__main__":
    unittest.main()
