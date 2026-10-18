// src/api/steam.js
export async function getLastPlayed(signal) {
  const res = await fetch('/api/steam/last-played', { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}