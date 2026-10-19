// src/api/github.js
export async function getRepos(signal) {
  const res = await fetch('/api/github/repos', { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getReadme(name, signal) {
  const res = await fetch(`/api/github/readme/${encodeURIComponent(name)}`, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}