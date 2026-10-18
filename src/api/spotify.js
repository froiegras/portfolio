// src/api/spotify.js
export async function getNowPlaying(signal) {
  const res = await fetch('/api/spotify/now-playing', { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}