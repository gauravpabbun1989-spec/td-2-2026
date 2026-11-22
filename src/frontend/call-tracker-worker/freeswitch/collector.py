#!/usr/bin/env python3
"""FreeSWITCH ESL collector and idempotent ringing-event notifier."""
import json
import os
import socket
import sqlite3
import time
import urllib.request
import uuid
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from urllib.parse import unquote

CONFIG = "/etc/freeswitch/autoload_configs/event_socket.conf.xml"
DB = "/var/lib/ticketdepart-calltracker/calls.sqlite3"
RINGING_ENDPOINT = "https://ticketdepart-call-tracker.gaurav-pabbun.workers.dev/v1/calls/ringing"


def utc_now():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def read_frame(stream):
    headers = {}
    while True:
        line = stream.readline()
        if not line:
            return None, b""
        line = line.decode("utf-8", "replace").strip()
        if not line:
            break
        if ":" in line:
            key, value = line.split(":", 1)
            headers[key.strip().lower()] = value.strip()
    length = int(headers.get("content-length", "0") or 0)
    return headers, stream.read(length) if length else b""


def parse_event(body):
    result = {}
    for line in body.decode("utf-8", "replace").splitlines():
        if ":" in line:
            key, value = line.split(":", 1)
            result[key.strip()] = unquote(value.strip())
    return result


def send_pending_ringing(db):
    secret = os.environ.get("CALL_INGEST_SECRET", "")
    if not secret:
        print("Ringing notifier: CALL_INGEST_SECRET unavailable", flush=True)
        return
    rows = db.execute("""
        SELECT call_uuid, ringing_at, tracking_token FROM ringing_notifications
        WHERE status = 'pending' ORDER BY created_at LIMIT 20
    """).fetchall()
    for call_uuid, ringing_at, tracking_token in rows:
        payload_data = {
            "call_uuid": call_uuid, "destination": "1030605",
            "agent_extension": "1001", "ringing_at": ringing_at,
        }
        if tracking_token:
            payload_data["tracking_token"] = tracking_token
        payload = json.dumps(payload_data).encode()
        request = urllib.request.Request(
            RINGING_ENDPOINT, data=payload,
            headers={
                "Authorization": "Bearer " + secret,
                "Content-Type": "application/json",
                "User-Agent": "TicketDepart-CallTracker/1.0",
            }, method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=10) as response:
                result = json.loads(response.read().decode())
                if response.status not in (200, 202) or result.get("ok") is not True:
                    raise RuntimeError("Worker did not confirm ringing event")
            db.execute("""
                UPDATE ringing_notifications
                SET status='sent', attempts=attempts+1, last_error=NULL,
                    tracking_token=NULL
                WHERE call_uuid=?
            """, (call_uuid,))
            db.commit()
            print("Ringing event accepted by Worker for " + call_uuid, flush=True)
        except Exception as exc:
            db.execute("""
                UPDATE ringing_notifications
                SET attempts=attempts+1, last_error=? WHERE call_uuid=?
            """, (type(exc).__name__, call_uuid))
            db.commit()
            print("Ringing delivery pending for " + call_uuid + ": " +
                  type(exc).__name__, flush=True)


def queue_ringing_event(db, event_data):
    # Inbound calls to the agent extension ring on the external leg. FreeSWITCH
    # reports this as CHANNEL_CALLSTATE with Channel-Call-State=RINGING.
    inbound_ring = (
        event_data.get("Event-Name") == "CHANNEL_CALLSTATE"
        and event_data.get("Channel-Call-State") == "RINGING"
        and event_data.get("Call-Direction") == "inbound"
        and event_data.get("Caller-Destination-Number") == "1001"
        and event_data.get("Channel-Name", "").startswith("sofia/external/")
    )

    # Retain support for the previously handled bridged/internal progress event.
    bridged_ring = (
        event_data.get("Event-Name") == "CHANNEL_PROGRESS"
        and event_data.get("Call-Direction") == "outbound"
        and event_data.get("Other-Leg-Direction") == "inbound"
        and event_data.get("Caller-Destination-Number") == "1001"
        and event_data.get("variable_dialed_extension") == "1001"
        and event_data.get("Channel-Name", "").startswith("sofia/internal/1001@")
    )
    if not (inbound_ring or bridged_ring):
        return

    uuid_value = (
        event_data.get("Unique-ID", "")
        if inbound_ring else event_data.get("variable_call_uuid", "")
    )
    try:
        original_uuid = str(uuid.UUID(uuid_value))
    except (ValueError, TypeError, AttributeError):
        return
    try:
        ringing_at = datetime.fromtimestamp(
            int(event_data.get("Event-Date-Timestamp")) / 1_000_000,
            timezone.utc,
        ).isoformat(timespec="seconds")
    except (ValueError, TypeError, OverflowError):
        ringing_at = utc_now()
    tracking_token = event_data.get("variable_td_tracking_token", "")
    if not (isinstance(tracking_token, str) and tracking_token.isdigit() and len(tracking_token) == 8):
        tracking_token = None
    db.execute("""
        INSERT OR IGNORE INTO ringing_notifications
            (call_uuid, ringing_at, tracking_token, status, attempts)
        VALUES (?, ?, ?, 'pending', 0)
    """, (original_uuid, ringing_at, tracking_token))
    db.commit()
    send_pending_ringing(db)


def open_database():
    db = sqlite3.connect(DB, timeout=30)
    db.execute("""
        CREATE TABLE IF NOT EXISTS calls (
            uuid TEXT PRIMARY KEY, first_seen TEXT, last_seen TEXT,
            direction TEXT, caller TEXT, destination TEXT, context TEXT,
            channel TEXT, sip_call_id TEXT, answered_at TEXT, ended_at TEXT,
            hangup_cause TEXT, duration TEXT, billsec TEXT, last_event TEXT
        )
    """)
    db.execute("""
        CREATE TABLE IF NOT EXISTS ringing_notifications (
            call_uuid TEXT PRIMARY KEY, ringing_at TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            attempts INTEGER NOT NULL DEFAULT 0, last_error TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    """)
    db.execute("""
        CREATE TABLE IF NOT EXISTS call_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT, event_time TEXT NOT NULL,
            event_name TEXT, uuid TEXT, details TEXT
        )
    """)
    columns = {row[1] for row in db.execute("PRAGMA table_info(ringing_notifications)")}
    if "tracking_token" not in columns:
        db.execute("ALTER TABLE ringing_notifications ADD COLUMN tracking_token TEXT")
    db.commit()
    return db


def main():
    root = ET.parse(CONFIG).getroot()
    params = {item.get("name"): item.get("value") for item in root.findall(".//param")}
    host = params.get("listen-ip", "127.0.0.1")
    port = int(params.get("listen-port", "8021"))
    password = params.get("password")
    if host not in ("127.0.0.1", "::1", "localhost") or not password:
        raise RuntimeError("Event Socket must have a password and loopback-only binding")
    db = open_database()
    print("TicketDepart collector starting; database ready", flush=True)
    send_pending_ringing(db)
    while True:
        sock = stream = None
        try:
            sock = socket.create_connection((host, port), timeout=15)
            sock.settimeout(None)
            stream = sock.makefile("rb")
            headers, _ = read_frame(stream)
            if not headers or headers.get("content-type") != "auth/request":
                raise RuntimeError("Unexpected Event Socket greeting")
            sock.sendall(("auth " + password + "\n\n").encode())
            headers, _ = read_frame(stream)
            reply = headers.get("reply-text", "") if headers else ""
            if not reply.startswith("+OK"):
                raise RuntimeError("Event Socket authentication failed")
            sock.sendall(
                b"event plain CHANNEL_CREATE CHANNEL_STATE CHANNEL_CALLSTATE "
                b"CHANNEL_PROGRESS CHANNEL_PROGRESS_MEDIA CHANNEL_ANSWER "
                b"CHANNEL_BRIDGE CHANNEL_UNBRIDGE CHANNEL_HANGUP_COMPLETE\n\n"
            )
            headers, _ = read_frame(stream)
            reply = headers.get("reply-text", "") if headers else ""
            if not reply.startswith("+OK"):
                raise RuntimeError("Event subscription failed")
            print("Connected to FreeSWITCH; listening for call events", flush=True)
            while True:
                headers, body = read_frame(stream)
                if headers is None:
                    raise RuntimeError("Event Socket disconnected")
                if headers.get("content-type") != "text/event-plain":
                    continue
                event_data = parse_event(body)
                event_name = event_data.get("Event-Name", "")
                call_uuid = event_data.get("Unique-ID")
                if not call_uuid:
                    continue
                stamp = utc_now()
                answered_at = stamp if event_name == "CHANNEL_ANSWER" else None
                ended_at = stamp if event_name == "CHANNEL_HANGUP_COMPLETE" else None
                db.execute("""
                    INSERT INTO calls (
                        uuid, first_seen, last_seen, direction, caller,
                        destination, context, channel, sip_call_id,
                        answered_at, ended_at, hangup_cause, duration,
                        billsec, last_event
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(uuid) DO UPDATE SET
                        last_seen=excluded.last_seen,
                        direction=COALESCE(excluded.direction, direction),
                        caller=COALESCE(excluded.caller, caller),
                        destination=COALESCE(excluded.destination, destination),
                        context=COALESCE(excluded.context, context),
                        channel=COALESCE(excluded.channel, channel),
                        sip_call_id=COALESCE(excluded.sip_call_id, sip_call_id),
                        answered_at=COALESCE(excluded.answered_at, answered_at),
                        ended_at=COALESCE(excluded.ended_at, ended_at),
                        hangup_cause=COALESCE(excluded.hangup_cause, hangup_cause),
                        duration=COALESCE(excluded.duration, duration),
                        billsec=COALESCE(excluded.billsec, billsec),
                        last_event=excluded.last_event
                """, (
                    call_uuid, stamp, stamp, event_data.get("variable_direction"),
                    event_data.get("Caller-Caller-ID-Number"),
                    event_data.get("Caller-Destination-Number"),
                    event_data.get("Caller-Context"), event_data.get("Channel-Name"),
                    event_data.get("variable_sip_call_id"), answered_at, ended_at,
                    event_data.get("Hangup-Cause"), event_data.get("variable_duration"),
                    event_data.get("variable_billsec"), event_name,
                ))
                db.execute("""
                    INSERT INTO call_events(event_time, event_name, uuid, details)
                    VALUES (?, ?, ?, ?)
                """, (stamp, event_name, call_uuid, json.dumps(event_data)))
                db.commit()
                print("Saved " + event_name + " for call " + call_uuid, flush=True)
                queue_ringing_event(db, event_data)
        except Exception as exc:
            print("Collector connection issue: " + str(exc), flush=True)
            time.sleep(5)
        finally:
            try:
                if stream:
                    stream.close()
                if sock:
                    sock.close()
            except Exception:
                pass


if __name__ == "__main__":
    main()
