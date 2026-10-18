# server/spotify.py
import time

import httpx
from fastapi import APIRouter

from common import CachedValue, env

CLIENT_ID = env("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = env("SPOTIFY_CLIENT_SECRET")
REFRESH_TOKEN = env("SPOTIFY_REFRESH_TOKEN")

router = APIRouter(prefix="/api/spotify")
http = httpx.AsyncClient(timeout=10)

IDLE = {"isPlaying": False}
_token = {"value": None, "exp": 0.0}


async def access_token() -> str:
    if _token["value"] and time.time() < _token["exp"] - 30:
        return _token["value"]
    r = await http.post(
        "https://accounts.spotify.com/api/token",
        data={"grant_type": "refresh_token", "refresh_token": REFRESH_TOKEN},
        auth=(CLIENT_ID, CLIENT_SECRET),
    )
    r.raise_for_status()
    j = r.json()
    _token.update(value=j["access_token"], exp=time.time() + j["expires_in"])
    return _token["value"]


async def fetch_now_playing() -> tuple[dict, int]:
    try:
        r = await http.get(
            "https://api.spotify.com/v1/me/player/currently-playing",
            params={"additional_types": "episode"},       # also report podcasts
            headers={"Authorization": f"Bearer {await access_token()}"},
        )
    except httpx.HTTPError:
        return IDLE, 15

    if r.status_code == 429:                               # rate limited: back off
        return IDLE, int(r.headers.get("Retry-After", 30))
    if r.status_code != 200:                               # 204 = nothing playing
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


now_playing_cache = CachedValue(fetch_now_playing, IDLE)


@router.get("/now-playing")
async def now_playing():
    return await now_playing_cache.get()