# server/steam.py
import asyncio

import httpx
from fastapi import APIRouter

from common import CachedValue, env

KEY = env("STEAM_API_KEY")
STEAM_ID = env("STEAM_ID")
MIN_HOURS = 20
MAX_GAMES = 10

router = APIRouter(prefix="/api/steam")
http = httpx.AsyncClient(timeout=10, base_url="https://api.steampowered.com")
HIDDEN_APPIDS: set[int] = set()

EMPTY = {"found": False}

def to_item(g: dict) -> dict:
    appid = g["appid"]
    icon = g.get("img_icon_url")
    return {
        "appid": appid,
        "name": g.get("name"),
        "hours": round(g["playtime_forever"] / 60),
        "url": f"https://store.steampowered.com/app/{appid}",
        "icon": (
            f"https://media.steampowered.com/steamcommunity/public/images/apps/{appid}/{icon}.jpg"
            if icon else None
        ),
    }

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
        return EMPTY, 60

    played = [g for g in games if g.get("rtime_last_played")]
    if not played:
        return EMPTY, 300

    game = max(played, key=lambda g: g["rtime_last_played"])

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
        "lastPlayed": game["rtime_last_played"],
        "hoursTotal": round(game["playtime_forever"] / 60, 1) if game.get("playtime_forever") else None,
        "inGame": me.get("gameextrainfo"),
    }, (60 if current_id else 300)

last_played_cache = CachedValue(fetch_last_played, EMPTY)

@router.get("/last-played")
async def last_played():
    return await last_played_cache.get()

async def fetch_most_played() -> tuple[dict, int]:
    try:
        games = await owned_games()
    except httpx.HTTPError:
        return {"games": []}, 120

    top = sorted(
        (
            g for g in games
            if g.get("playtime_forever", 0) >= MIN_HOURS * 60
            and g["appid"] not in HIDDEN_APPIDS
        ),
        key=lambda g: g["playtime_forever"],
        reverse=True,
    )[:MAX_GAMES]

    return {"games": [to_item(g) for g in top]}, 1800

most_played_cache = CachedValue(fetch_most_played, {"games": []})

@router.get("/most-played")
async def most_played():
    return await most_played_cache.get()