# server/common.py
import asyncio
import os
import time
from collections.abc import Awaitable, Callable

from dotenv import load_dotenv

load_dotenv()


def env(name: str) -> str:
    """Read a required setting from .env, with a clear error if it's missing."""
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(f"Missing {name} in server/.env")
    return value


class CachedValue:
    """Calls `fetch` at most once per TTL, no matter how many visitors ask.

    `fetch` must return (data, seconds_to_cache_it).
    """

    def __init__(self, fetch: Callable[[], Awaitable[tuple[dict, int]]], initial: dict):
        self._fetch = fetch
        self._data = initial
        self._expires = 0.0
        self._lock = asyncio.Lock()

    async def get(self) -> dict:
        async with self._lock:
            if time.time() >= self._expires:
                self._data, ttl = await self._fetch()
                self._expires = time.time() + ttl
            return self._data