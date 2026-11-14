# server/riot.py
import os
import time
from urllib.parse import quote

import httpx
from fastapi import APIRouter

from common import CachedValue

KEY = os.environ.get("RIOT_API_KEY", "")
NAME = os.environ.get("RIOT_NAME", "")
TAG = os.environ.get("RIOT_TAG", "")
PLATFORM = os.environ.get("RIOT_PLATFORM", "ph2")      # your game server
REGION = os.environ.get("RIOT_REGION", "asia")         # used for the account lookup

COUNT = 5                                              # how many champions to show

router = APIRouter(prefix="/api/riot")
http = httpx.AsyncClient(timeout=10)                   # no default headers, so the key is never sent to Data Dragon

EMPTY = {"champions": []}
_puuid = {"value": None}
_dd = {"exp": 0.0, "version": None, "champs": {}}


async def riot_get(url: str):
    r = await http.get(url, headers={"X-Riot-Token": KEY})
    r.raise_for_status()
    return r.json()


async def puuid() -> str:
    if not _puuid["value"]:
        data = await riot_get(
            f"https://{REGION}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/"
            f"{quote(NAME, safe='')}/{quote(TAG, safe='')}"
        )
        _puuid["value"] = data["puuid"]
    return _puuid["value"]


# Data Dragon: Riot's free static data, used to turn champion IDs into names and icons
async def champion_data() -> tuple[str, dict]:
    if _dd["champs"] and time.time() < _dd["exp"]:
        return _dd["version"], _dd["champs"]

    r = await http.get("https://ddragon.leagueoflegends.com/api/versions.json")
    r.raise_for_status()
    version = r.json()[0]

    r = await http.get(f"https://ddragon.leagueoflegends.com/cdn/{version}/data/en_US/champion.json")
    r.raise_for_status()
    champs = {
        int(c["key"]): {"name": c["name"], "icon": c["image"]["full"]}
        for c in r.json()["data"].values()
    }
    _dd.update(version=version, champs=champs, exp=time.time() + 86400)
    return version, champs

async def fetch_top() -> tuple[dict, int]:
    missing = [
        name for name, value in (("RIOT_API_KEY", KEY), ("RIOT_NAME", NAME), ("RIOT_TAG", TAG))
        if not value
    ]
    if missing:
        print("riot: not set in server/.env:", ", ".join(missing))
        return {"champions": [], "why": "missing " + ", ".join(missing)}, 30

    step = "account lookup"
    try:
        player = await puuid()
        step = "champion mastery"
        top = await riot_get(
            f"https://{PLATFORM}.api.riotgames.com/lol/champion-mastery/v4/"
            f"champion-masteries/by-puuid/{player}/top?count={COUNT}"
        )
        step = "data dragon"
        version, champs = await champion_data()
    except httpx.HTTPStatusError as e:
        why = f"{step}: HTTP {e.response.status_code}"
        print("riot failed ->", why)
        return {"champions": [], "why": why}, 30
    except httpx.HTTPError as e:
        why = f"{step}: {type(e).__name__}"
        print("riot failed ->", why)
        return {"champions": [], "why": why}, 30

    champions = []
    for m in top:
        c = champs.get(m["championId"])
        if not c:
            continue
        champions.append({
            "id": m["championId"],
            "name": c["name"],
            "icon": f"https://ddragon.leagueoflegends.com/cdn/{version}/img/champion/{c['icon']}",
            "level": m.get("championLevel"),
            "points": m.get("championPoints"),
        })

    if not champions:
        why = f"mastery returned {len(top)} entries on platform {PLATFORM}"
        print("riot ->", why)
        return {"champions": [], "why": why}, 30

    return {"champions": champions}, 6 * 3600

top_cache = CachedValue(fetch_top, EMPTY)


@router.get("/top-champions")
async def top_champions():
    return await top_cache.get()