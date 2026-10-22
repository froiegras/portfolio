// src/api/ytmusic.js
export async function getRecentlyPlayed(signal) {
  const res = await fetch('/api/ytmusic/recently-played', { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}