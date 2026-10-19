# server/github.py
import os
from functools import partial

import httpx
from fastapi import APIRouter, HTTPException

from common import CachedValue, env

USERNAME = env("GITHUB_USERNAME")
TOKEN = os.environ.get("GITHUB_TOKEN")

router = APIRouter(prefix="/api/github")
http = httpx.AsyncClient(timeout=10, base_url="https://api.github.com")

MAX_REPOS = 6
HIDE = set()
README_MAX_CHAR = 20_000

def request_headers() -> dict:
    h = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if TOKEN:
        h["Authorization"] = f"Bearer {TOKEN}"
    return h


async def fetch_repos() -> tuple[dict, int]:
    try:
        r = await http.get(
            f"/users/{USERNAME}/repos",
            params={"type": "owner", "sort": "pushed", "per_page": 100},
            headers=request_headers(),
        )
        r.raise_for_status()
    except httpx.HTTPError as e:
        print("github failed:", e)               # safe to print: the token is in a header
        return {"repos": []}, 600

    repos = [
        x for x in r.json()
        if not x["fork"]
        and not x["archived"]
        and x["name"] not in HIDE
        and x["name"].lower() != USERNAME.lower()   # skips your profile README repo
    ][:MAX_REPOS]

    return {
        "repos": [
            {
                "name": x["name"],
                "description": x["description"],
                "language": x["language"],
                "stars": x["stargazers_count"],
                "url": x["html_url"],
                "homepage": x["homepage"] or None,
                "topics": x.get("topics", []),
                "pushed": x["pushed_at"],
                "branch": x["default_branch"],
            }
            for x in repos
        ]
    }, 3600                                       # cache for 1 hour


repos_cache = CachedValue(fetch_repos, {"repos": []})


@router.get("/repos")
async def repos():
    return await repos_cache.get()



async def fetch_readme(name: str) -> tuple[dict, int]:
    try:
        r = await http.get(
            f"/repos/{USERNAME}/{name}/readme",
            headers={**request_headers(), "Accept": "application/vnd.github.raw+json"},
        )
    except httpx.HTTPError as e:
        print("github readme failed:", e)
        return {"markdown": None}, 600

    if r.status_code == 404:                     # the repo has no README
        return {"markdown": None}, 3600
    if r.status_code != 200:
        return {"markdown": None}, 600
    return {"markdown": r.text[:README_MAX_CHAR]}, 3600


readme_caches: dict[str, CachedValue] = {}


@router.get("/readme/{name}")
async def readme(name: str):
    allowed = {x["name"] for x in (await repos_cache.get())["repos"]}
    if name not in allowed:
        raise HTTPException(status_code=404)
    if name not in readme_caches:
        readme_caches[name] = CachedValue(partial(fetch_readme, name), {"markdown": None})
    return await readme_caches[name].get()