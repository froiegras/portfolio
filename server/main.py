# main.py
import asyncio, os, time
import httpx
from dotenv import load_dotenv
from fastapi import FastAPI

load_dotenv()
CID = os.environ["SPOTIFY_CLIENT_ID"]
SECRET = os.environ["SPOTIFY_CLIENT_SECRET"]
REFRESH = os.environ["SPOTIFY_REFRESH_TOKEN"]

app = FastAPI(docs_url=None, redoc_url=None)   # hide the auto docs page
http = httpx.AsyncClient(timeout=10)

_token = {"value": None, "exp": 0.0}
_cache = {"data": {"isPlaying": False}, "exp": 0.0}
_lock = asyncio.Lock()

IDLE = {"isPlaying": False}


async def access_token() -> str:
    if _token["value"] and time.time() < _token["exp"] - 30:
        return _token["value"]
    r = await http.post(
        "https://accounts.spotify.com/api/token",
        data={"grant_type": "refresh_token", "refresh_token": REFRESH},
        auth=(CID, SECRET),
    )
    r.raise_for_status()
    j = r.json()
    _token.update(value=j["access_token"], exp=time.time() + j["expires_in"])
    return _token["value"]


async def fetch_now_playing() -> tuple[dict, int]:
    """Returns (data, seconds to cache it)."""
    try:
        r = await http.get(
            "https://api.spotify.com/v1/me/player/currently-playing",
            headers={"Authorization": f"Bearer {await access_token()}"},
        )
    except httpx.HTTPError:
        return IDLE, 15

    if r.status_code == 429:                       # rate limited: back off
        return IDLE, int(r.headers.get("Retry-After", 30))
    if r.status_code != 200:                       # 204 = nothing playing
        return IDLE, 10

    j = r.json()
    item = j.get("item")
    if not item or not j.get("is_playing"):
        return IDLE, 10

    images = (item.get("album") or {}).get("images") or item.get("images") or []
    artist = ", ".join(a["name"] for a in item.get("artists", [])) \
        or (item.get("show") or {}).get("name", "")

    return {
        "isPlaying": True,
        "title": item["name"],
        "artist": artist,
        "albumImage": images[1]["url"] if len(images) > 1 else (images[0]["url"] if images else None),
        "url": item["external_urls"]["spotify"],
    }, 10


@app.get("/api/spotify/now-playing")
async def now_playing():
    async with _lock:                              # one Spotify call at a time
        if time.time() >= _cache["exp"]:
            data, ttl = await fetch_now_playing()
            _cache.update(data=data, exp=time.time() + ttl)
        return _cache["data"]