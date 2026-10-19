# get_refresh_token.py
import os, urllib.parse, webbrowser
from http.server import BaseHTTPRequestHandler, HTTPServer
import httpx
from dotenv import load_dotenv

load_dotenv()
CID = os.environ["SPOTIFY_CLIENT_ID"]
SECRET = os.environ["SPOTIFY_CLIENT_SECRET"]
REDIRECT = 'http://127.0.0.1:8080/callback'

SCOPE = "user-read-currently-playing user-top-read"

result = {}

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        q = urllib.parse.urlparse(self.path)
        if q.path == "/callback":
            result["code"] = urllib.parse.parse_qs(q.query).get("code", [None])[0]
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"Done. You can close this tab.")
    def log_message(self, *args):
        pass

url = "https://accounts.spotify.com/authorize?" + urllib.parse.urlencode({
    "client_id": CID,
    "response_type": "code",
    "redirect_uri": REDIRECT,
    "scope": SCOPE,
})
webbrowser.open(url)
HTTPServer(("127.0.0.1", 8080), Handler).handle_request()

r = httpx.post(
    "https://accounts.spotify.com/api/token",
    data={"grant_type": "authorization_code", "code": result["code"], "redirect_uri": REDIRECT},
    auth=(CID, SECRET),
)
r.raise_for_status()
print("SPOTIFY_REFRESH_TOKEN=" + r.json()["refresh_token"])