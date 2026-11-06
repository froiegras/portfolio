import { useState, useEffect } from 'react';

const BASE = '/media/obsession/';
const MEDIA_RE = /\.(webp|gif|png|jpe?g|avif|mp4|webm)$/i;
const POSTER_RE = /-poster\.[a-z0-9]+$/i;
const DATE_RE = /^(\d{4}-\d{2}(?:-\d{2})?)-/;

const prettify = (stem) => {
  const text = stem.replace(DATE_RE, '').replace(/[-_]+/g, ' ').trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

async function getJson(url, signal) {
  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default function useObsessions() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      const [listing, manifest] = await Promise.all([
        getJson(BASE, signal),
        getJson(`${BASE}manifest.json`, signal),
      ]);
      if (signal.aborted) return;

      const files = Array.isArray(listing)
        ? listing.filter((f) => f.type === 'file').map((f) => f.name)
        : [];
      const overrides =
        manifest && typeof manifest === 'object' && !Array.isArray(manifest) ? manifest : {};
      const url = (name) => BASE + encodeURIComponent(name);

      const entries = files
        .filter((name) => MEDIA_RE.test(name) && !POSTER_RE.test(name))
        .sort((a, b) => b.localeCompare(a))
        .map((file) => {
          const stem = file.replace(/\.[^.]+$/, '');
          const m = overrides[file] || {};
          const poster = files.find((n) =>
            n.toLowerCase().startsWith(`${stem.toLowerCase()}-poster.`)
          );
          return {
            id: file,
            hide: Boolean(m.hide),
            media: url(file),
            poster: poster ? url(poster) : '',
            title: m.title || prettify(stem),
            subtitle: m.subtitle || '',
            alt: m.alt || '',
            link: m.link || '',
            since: m.since || stem.match(DATE_RE)?.[1] || '',
          };
        })
        .filter((entry) => !entry.hide);

      setItems(entries);
    })();

    return () => controller.abort();
  }, []);

  return items;
}