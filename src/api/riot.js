// src/api/riot.js
export async function getTopChampions(signal) {
  const res = await fetch('/api/riot/top-champions', { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}