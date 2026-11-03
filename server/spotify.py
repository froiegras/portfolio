# server/spotify.py
import asyncio, time, html, httpx, re

from functools import partial
from common import CachedValue, env
from fastapi import APIRouter, HTTPException

CLIENT_ID = env("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = env("SPOTIFY_CLIENT_SECRET")
REFRESH_TOKEN = env("SPOTIFY_REFRESH_TOKEN")

router = APIRouter(prefix="/api/spotify")
http = httpx.AsyncClient(timeout=10)

SONG_CAP = 200
MAX_TRACKS = 10
TIME_RANGE = "long_term"
IDLE = {"isPlaying": False}
GENRES = {"kpop": "k-pop"}
ARTISTS = {"twice": "TWICE"}
HIDE_PLAYLISTS: set[str] = set()

_token = {"value": None, "exp": 0.0}
_artist_genres: dict[str, list[str]] = {}
_limit = asyncio.Semaphore(5)

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
            params={"additional_types": "episode"},
            headers={"Authorization": f"Bearer {await access_token()}"},
        )
    except httpx.HTTPError:
        return IDLE, 15

    if r.status_code == 429:
        return IDLE, int(r.headers.get("Retry-After", 30))
    if r.status_code != 200:
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

async def api_get(path: str, **params) -> dict:
    r = await http.get(
        f"https://api.spotify.com/v1{path}",
        params=params,
        headers={"Authorization": f"Bearer {await access_token()}"},
    )
    r.raise_for_status()
    return r.json()


async def genres_of(artist_id: str) -> list[str]:
    if artist_id not in _artist_genres:
        async with _limit:
            _artist_genres[artist_id] = (await api_get(f"/artists/{artist_id}")).get("genres", [])
    return _artist_genres[artist_id]


def to_track(t: dict) -> dict:
    images = (t.get("album") or {}).get("images") or []
    return {
        "id": t["id"],
        "title": t["name"],
        "artist": ", ".join(a["name"] for a in t["artists"]),
        "image": images[-1]["url"] if images else None,
        "url": t["external_urls"]["spotify"],
    }


async def fetch_top_by_genre(genre: str) -> tuple[dict, int]:
    try:
        top = await api_get("/me/top/tracks", time_range=TIME_RANGE, limit=50)
        tracks = top.get("items", [])
        ids = {a["id"] for t in tracks for a in t["artists"] if a.get("id")}
        await asyncio.gather(*(genres_of(i) for i in ids))
    except httpx.HTTPError as e:
        print("top-tracks failed:", e)
        return {"tracks": []}, 600

    def matches(track: dict) -> bool:
        return any(
            genre in g.lower()
            for a in track["artists"]
            for g in _artist_genres.get(a.get("id"), [])
        )

    picked = [t for t in tracks if matches(t)][:MAX_TRACKS]
    return {"tracks": [to_track(t) for t in picked]}, 6 * 3600


async def fetch_top_by_artist(name: str) -> tuple[dict, int]:
    try:
        top = await api_get("/me/top/tracks", time_range=TIME_RANGE, limit=50)
    except httpx.HTTPError as e:
        print("top-tracks failed:", e)
        return {"tracks": []}, 600

    wanted = name.casefold()
    picked = [
        t for t in top.get("items", [])
        if any(a["name"].casefold() == wanted for a in t["artists"])
    ][:MAX_TRACKS]
    return {"tracks": [to_track(t) for t in picked]}, 6 * 3600

top_caches = {
    **{key: CachedValue(partial(fetch_top_by_genre, text), {"tracks": []})
       for key, text in GENRES.items()},
    **{key: CachedValue(partial(fetch_top_by_artist, name), {"tracks": []})
       for key, name in ARTISTS.items()},
}


_me = {"id": None}


async def my_id() -> str:
    if not _me["id"]:
        _me["id"] = (await api_get("/me"))["id"]
    return _me["id"]


def plain(text: str) -> str:
    """Spotify descriptions can contain HTML tags and entities like &#x27;"""
    return html.unescape(re.sub(r"<[^>]+>", "", text or "")).strip()


def to_playlist(p: dict) -> dict:
    images = p.get("images") or []
    meta = p.get("items") or p.get("tracks") or {}
    return {
        "id": p["id"],
        "name": p["name"],
        "description": plain(p.get("description")),
        "cover": (images[1] if len(images) > 1 else images[0])["url"] if images else None,
        "tracks": meta.get("total"),
        "url": p["external_urls"]["spotify"],
    }


async def fetch_playlists() -> tuple[dict, int]:
    try:
        me = await my_id()
        found, offset = [], 0
        while offset < 200:
            page = await api_get("/me/playlists", limit=50, offset=offset)
            found += page.get("items", [])
            if not page.get("next"):
                break
            offset += 50
    except httpx.HTTPError as e:
        print("playlists failed:", e)
        return {"playlists": []}, 600

    mine = [
        p for p in found
        if p
        and p["owner"]["id"] == me
        and p.get("public")
        and p["id"] not in HIDE_PLAYLISTS
    ]
    return {"playlists": [to_playlist(p) for p in mine]}, 3600
playlists_cache = CachedValue(fetch_playlists, {"playlists": []})


@router.get("/playlists")
async def playlists():
    return await playlists_cache.get()

def to_song(entry: dict) -> dict | None:
    item = entry.get("item") or entry.get("track")
    if not item or not item.get("id"):
        return None
    images = (item.get("album") or {}).get("images") or item.get("images") or []
    artist = ", ".join(a["name"] for a in item.get("artists") or [] if a.get("name")) \
        or (item.get("show") or {}).get("name", "")
    return {
        "id": item["id"],
        "type": item.get("type", "track"),
        "title": item["name"],
        "artist": artist,
        "image": images[-1]["url"] if images else None,
        "ms": item.get("duration_ms"),
        "url": (item.get("external_urls") or {}).get("spotify"),
    }


async def fetch_playlist_songs(playlist_id: str) -> tuple[dict, int]:
    songs, total, offset = [], None, 0
    try:
        while offset < SONG_CAP:
            page = await api_get(
                f"/playlists/{playlist_id}/items",
                limit=50,
                offset=offset,
                additional_types="track,episode",
            )
            total = page.get("total", total)
            songs += [s for s in map(to_song, page.get("items", [])) if s]
            if not page.get("next"):
                break
            offset += 50
    except httpx.HTTPError as e:
        print("playlist songs failed:", e)
        return {"songs": [], "total": 0}, 300
    return {"songs": songs, "total": total}, 3600


song_caches: dict[str, CachedValue] = {}

@router.get("/playlists/{playlist_id}/songs")
async def playlist_songs(playlist_id: str):
    allowed = {p["id"] for p in (await playlists_cache.get())["playlists"]}
    if playlist_id not in allowed:
        raise HTTPException(status_code=404)
    if playlist_id not in song_caches:
        song_caches[playlist_id] = CachedValue(
            partial(fetch_playlist_songs, playlist_id), {"songs": [], "total": 0}
        )
    return await song_caches[playlist_id].get()

@router.get("/top-tracks/{key}")
async def top_tracks(key: str):
    cache = top_caches.get(key)
    if cache is None:
        raise HTTPException(status_code=404)
    return await cache.get()
