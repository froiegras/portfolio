# server/steam.py
import asyncio, os, time
import httpx
from dotenv import load_dotenv
from fastapi import APIRouter

load_dotenv()
KEY = os.environ["STEAM_API_KEY"]
STEAM_ID = os.environ["STEAM_ID"]

router = APIRouter()
http = httpx.AsyncClient(timeout=10, base_url="https://api.steampowered.com")

EMPTY = {"found": False}
_cache = {"data": EMPTY, "exp": 0.0}
_lock = asyncio.Lock()


async def owned_games() -> list:
    r = await http.get(
        "/IPlayerService/GetOwnedGames/v1/",
        params={
            "key": KEY,
            "steamid": STEAM_ID,
            "include_appinfo": 1,
            "include_played_free_games": 1,
        },
    )
    r.raise_for_status()
    return r.json().get("response", {}).get("games", [])


async def player_summary() -> dict:
    r = await http.get(
        "/ISteamUser/GetPlayerSummaries/v2/",
        params={"key": KEY, "steamids": STEAM_ID},
    )
    r.raise_for_status()
    players = r.json().get("response", {}).get("players", [])
    return players[0] if players else {}


async def fetch_last_played() -> tuple[dict, int]:
    """Returns (data, seconds to cache it)."""
    try:
        games, me = await asyncio.gather(owned_games(), player_summary())
    except httpx.HTTPError:
        return EMPTY, 60          # don't print the error: its URL contains your key

    played = [g for g in games if g.get("rtime_last_played")]
    if not played:
        return EMPTY, 300         # private profile, or nothing played yet

    game = max(played, key=lambda g: g["rtime_last_played"])

    # if you're in a game right now, show that one instead
    current_id = me.get("gameid")
    if current_id:
        game = next((g for g in games if str(g["appid"]) == current_id), game)

    appid = game["appid"]
    return {
        "found": True,
        "name": game.get("name"),
        "appid": appid,
        "image": f"https://cdn.cloudflare.steamstatic.com/steam/apps/{appid}/header.jpg",
        "url": f"https://store.steampowered.com/app/{appid}",
        "lastPlayed": game["rtime_last_played"],            # unix seconds
        # "hoursTotal": round(game.get("playtime_forever", 0) / 60, 1),
        "hoursTotal": round(game["playtime_forever"] / 60, 1) if game.get("playtime_forever") else None,
        "inGame": me.get("gameextrainfo"),                  # None unless playing now
    }, (60 if current_id else 300)


@router.get("/api/steam/last-played")
async def last_played():
    async with _lock:
        if time.time() >= _cache["exp"]:
            data, ttl = await fetch_last_played()
            _cache.update(data=data, exp=time.time() + ttl)
        return _cache["data"]