// src/api/spotify.js
export async function getNowPlaying(signal) {
  const res = await fetch('/api/spotify/now-playing', { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getTopTracks(key, signal) {
  const res = await fetch(`/api/spotify/top-tracks/${key}`, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}