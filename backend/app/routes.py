
from fastapi import APIRouter, Request
from fastapi.responses import Response

from .ads import MOCK_ADS, pick_ad
from .events import fetch_events, log_event
from .supabase_client import supabase
from .vast import build_vast

router = APIRouter()


@router.get("/vast-tag")
def get_vast_tag(request: Request, slot: str = "preroll", session_id: str = "anon"):
    """This is the URL you hand to the IMA SDK as `adTagUrl`. Each hit is
    logged as a 'request' event, then decisioned and returned as VAST."""
    log_event("request", slot=slot, session_id=session_id)
    ad = pick_ad(slot, session_id)
    base = str(request.base_url).rstrip("/")
    xml = build_vast(ad, slot, session_id, base)
    return Response(content=xml, media_type="application/xml")


@router.get("/track/{event_type}")
def track(event_type: str, ad_id: str, slot: str, session_id: str = "anon"):
    """The IMA SDK fires a real HTTP GET at each of these URLs as playback
    hits each tracking event. This is what makes ad verification/analytics
    possible in real ad tech — every quartile is a pixel fire."""
    log_event(event_type, ad_id, slot, session_id)
    return Response(status_code=204)


@router.get("/events")
def get_events(limit: int = 50, session_id: str | None = None):
    """Polled by the frontend dashboard to render the live activity feed."""
    return {"events": fetch_events(limit=limit, session_id=session_id)}


@router.get("/health")
def health():
    return {
        "status": "ok",
        "storage": "supabase" if supabase else "in-memory (set SUPABASE_URL/SUPABASE_KEY)",
        "ads_in_rotation": len(MOCK_ADS),
    }