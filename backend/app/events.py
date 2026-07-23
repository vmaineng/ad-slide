"""Event logging and retrieval.

Every event (request, decision, impression, quartile, complete) is written
to a Supabase table (`ad_events`, see schema.sql) so history persists
across restarts and the frontend dashboard reads real rows, not memory.

If Supabase env vars aren't set, events fall back to an in-memory list so
the demo still runs before you've wired up a project.
"""

import time
import uuid
from datetime import datetime

from .supabase_client import supabase

# Fallback in-memory log used only if Supabase env vars aren't set yet.
_fallback_events: list[dict] = []


def log_event(
    event_type: str,
    ad_id: str | None = None,
    slot: str | None = None,
    session_id: str | None = None,
) -> None:
    row = {"type": event_type, "ad_id": ad_id, "slot": slot, "session_id": session_id}
    if supabase:
        supabase.table("ad_events").insert(row).execute()
    else:
        row["id"] = str(uuid.uuid4())
        row["ts"] = time.time()
        _fallback_events.append(row)
        if len(_fallback_events) > 300:
            del _fallback_events[: len(_fallback_events) - 300]


def _to_epoch(iso_str: str) -> float:
    return datetime.fromisoformat(iso_str.replace("Z", "+00:00")).timestamp()


def fetch_events(limit: int = 50, session_id: str | None = None) -> list[dict]:
    """Used by the /events route to feed the frontend activity dashboard."""
    if supabase:
        query = supabase.table("ad_events").select("*").order("created_at", desc=True).limit(limit)
        if session_id:
            query = query.eq("session_id", session_id)
        result = query.execute()

        return [
            {
                "id": row["id"],
                "type": row["type"],
                "ad_id": row["ad_id"],
                "slot": row["slot"],
                "session_id": row["session_id"],
                "ts": _to_epoch(row["created_at"]),
            }
            for row in result.data
        ]

    ordered = sorted(_fallback_events, key=lambda e: e["ts"], reverse=True)
    if session_id:
        ordered = [e for e in ordered if e.get("session_id") == session_id]
    return ordered[:limit]