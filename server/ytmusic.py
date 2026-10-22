# server/ytmusic.py
import asyncio
from pathlib import Path

from fastapi import APIRouter
from ytmusicapi import YTMusic

from common import CachedValue

AUTH_FILE = Path(__file__).parent / "browser.json"
MAX_ITEMS = 30

router = APIRouter(prefix="/api/ytmusic")
EMPTY = {"found": False, "tracks": []}

_yt = None

def client() -> YTMusic:
    global _yt
    if _yt is None:
        _yt = YTMusic(str(AUTH_FILE))
    return _yt

def to_track(item: dict) -> dict:
    thumbs = item.get("thumbnails") or []
    video_id = item.get("videoId")
    return {
        "id": video_id,
        "title": item.get("title"),
        "artist": ", ".join(a["name"] for a in item.get("artists") or [] if a.get("name")),
        "image": (thumbs[1] if len(thumbs) > 1 else thumbs[0])["url"] if thumbs else None,
        "url": f"https://music.youtube.com/watch?v={video_id}",
        "played": item.get("played"),        # e.g. "Today", "Yesterday"
    }

async def fetch_recent() -> tuple[dict, int]:
    try:
        # ytmusicapi is blocking, so run it off the event loop
        history = await asyncio.to_thread(lambda: client().get_history())
    except Exception as e:                   # the library raises several of its own error types
        print("ytmusic failed:", type(e).__name__, e)
        return EMPTY, 600

    tracks = [to_track(i) for i in history if i.get("videoId")][:MAX_ITEMS]
    return {"found": bool(tracks), "tracks": tracks}, 300     # cache for 5 minutes

recent_cache = CachedValue(fetch_recent, EMPTY)

@router.get("/recently-played")
async def recently_played():
    return await recent_cache.get()