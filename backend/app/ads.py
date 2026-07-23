"""Mock ad inventory and ad decisioning.

Media points at Google's public IMA SDK sample assets so the demo plays
real video without you hosting any files.
"""

import random

from .events import log_event

MOCK_ADS = [
    {
        "id": "ad_001",
        "title": "Acme Cloud — Ship Faster",
        "duration": "00:00:06",
        "media": "https://storage.googleapis.com/gvabox/media/samples/stock.mp4",
    },
    {
        "id": "ad_002",
        "title": "Nimbus Analytics",
        "duration": "00:00:06",
        "media": "https://storage.googleapis.com/gvabox/media/samples/stock.mp4",
    },
    {
        "id": "ad_003",
        "title": "Forge DevTools",
        "duration": "00:00:06",
        "media": "https://storage.googleapis.com/gvabox/media/samples/stock.mp4",
    },
]

# Frequency capping: don't show the same viewer the same ad twice in a row
# within a session. Keyed by session_id, in-memory is fine for this (it's
# a runtime cache, not history — the events table is the source of truth).
_last_ad_for_session: dict[str, str] = {}


def pick_ad(slot: str, session_id: str) -> dict:
    """Ad decisioning: rotate through inventory, avoid an immediate repeat
    for the same session. A real ad server does this with bidding; this
    does it with a coin flip and a frequency cap, but it's the same
    *shape* of decision."""
    candidates = [a for a in MOCK_ADS if a["id"] != _last_ad_for_session.get(session_id)]
    ad = random.choice(candidates or MOCK_ADS)
    _last_ad_for_session[session_id] = ad["id"]
    log_event("decision", ad["id"], slot, session_id)
    return ad