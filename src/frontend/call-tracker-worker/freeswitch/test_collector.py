import importlib.util
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
        self.db.execute("""
            CREATE TABLE ringing_notifications (
                call_uuid TEXT PRIMARY KEY, ringing_at TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending',
                attempts INTEGER NOT NULL DEFAULT 0, last_error TEXT,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        """)
        self.event = {
            "Event-Name": "CHANNEL_PROGRESS",
            "Call-Direction": "outbound",
            "Other-Leg-Direction": "inbound",
            "Caller-Destination-Number": "1001",
            "variable_dialed_extension": "1001",
            "Channel-Name": "sofia/internal/1001@100.76.52.119:38838",
            "variable_call_uuid": "9ec7c8dc-d189-49ab-85f3-84cd165fe3c5",
            "Event-Date-Timestamp": "1795286559000000",
        }

    def tearDown(self):
        self.db.close()

    def test_matching_progress_queues_original_inbound_uuid(self):
        with patch.object(collector, "send_pending_ringing") as send:
            collector.queue_ringing_event(self.db, self.event)
        row = self.db.execute(
            "SELECT call_uuid, status FROM ringing_notifications"
        ).fetchone()
        self.assertEqual(row, (
            "9ec7c8dc-d189-49ab-85f3-84cd165fe3c5", "pending"
        ))
        send.assert_called_once_with(self.db)

    def test_duplicate_progress_creates_one_notification(self):
        with patch.object(collector, "send_pending_ringing"):
            collector.queue_ringing_event(self.db, self.event)
            collector.queue_ringing_event(self.db, self.event)
        self.assertEqual(self.db.execute(
            "SELECT COUNT(*) FROM ringing_notifications"
        ).fetchone()[0], 1)

    def test_progress_media_is_not_a_ringing_trigger(self):
        event = dict(self.event, **{"Event-Name": "CHANNEL_PROGRESS_MEDIA"})
        with patch.object(collector, "send_pending_ringing") as send:
            collector.queue_ringing_event(self.db, event)
        self.assertEqual(self.db.execute(
            "SELECT COUNT(*) FROM ringing_notifications"
        ).fetchone()[0], 0)
        send.assert_not_called()

    def test_wrong_extension_is_ignored(self):
        event = dict(self.event, **{"Caller-Destination-Number": "1002"})
        with patch.object(collector, "send_pending_ringing") as send:
            collector.queue_ringing_event(self.db, event)
        self.assertEqual(self.db.execute(
            "SELECT COUNT(*) FROM ringing_notifications"
        ).fetchone()[0], 0)
        send.assert_not_called()

    def test_inbound_callstate_ringing_queues_unique_id(self):
        event = {
            "Event-Name": "CHANNEL_CALLSTATE",
            "Channel-Call-State": "RINGING",
            "Call-Direction": "inbound",
            "Caller-Destination-Number": "1001",
            "Channel-Name": "sofia/external/provider-call",
            "Unique-ID": "bf83751d-59ed-4b69-adfd-9120879da0b0",
            "Event-Date-Timestamp": "1795305281000000",
        }
        with patch.object(collector, "send_pending_ringing") as send:
            collector.queue_ringing_event(self.db, event)
            collector.queue_ringing_event(self.db, event)
        rows = self.db.execute(
            "SELECT call_uuid, status FROM ringing_notifications"
        ).fetchall()
        self.assertEqual(rows, [
            ("bf83751d-59ed-4b69-adfd-9120879da0b0", "pending")
        ])
        self.assertEqual(send.call_count, 2)

    def test_inbound_non_ringing_state_is_ignored(self):
        event = {
            "Event-Name": "CHANNEL_CALLSTATE",
            "Channel-Call-State": "HANGUP",
            "Call-Direction": "inbound",
            "Caller-Destination-Number": "1001",
            "Channel-Name": "sofia/external/provider-call",
            "Unique-ID": "bf83751d-59ed-4b69-adfd-9120879da0b0",
        }
        with patch.object(collector, "send_pending_ringing") as send:
            collector.queue_ringing_event(self.db, event)
        self.assertEqual(self.db.execute(
            "SELECT COUNT(*) FROM ringing_notifications"
        ).fetchone()[0], 0)
        send.assert_not_called()


if __name__ == "__main__":
    unittest.main()
