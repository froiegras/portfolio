# server/main.py
from fastapi import FastAPI

import spotify
import steam

app = FastAPI(docs_url=None, redoc_url=None)

app.include_router(spotify.router)
app.include_router(steam.router)


@app.get("/api/health")
async def health():
    return {"ok": True}