# server/steam.py
import asyncio

import httpx
from fastapi import APIRouter

from common import CachedValue, env

KEY = env("STEAM_API_KEY")
STEAM_ID = env("STEAM_ID")

router = APIRouter(prefix="/api/steam")
http = httpx.AsyncClient(timeout=10, base_url="https://api.steampowered.com")

EMPTY = {"found": False}

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

last_played_cache = CachedValue(fetch_last_played, EMPTY)


@router.get("/last-played")
async def last_played():
    return await last_played_cache.get()