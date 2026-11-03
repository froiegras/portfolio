// pages/Playlists/Playlists.js
import React, { useState, useEffect } from 'react';
import { getPlaylists } from '../../api/spotify';
import { playlistGroups } from '../../data/playlists';
import './Playlists.css';
import PlaylistDetail from './PlaylistDetail';

const clean = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v));

function buildSections(live, curated) {
  if (live.length === 0) return curated;

  const byId = new Map(live.map((p) => [p.id, p]));
  const claimed = new Set();

  const sections = curated
    .map((g) => ({
      id: g.id,
      name: g.name,
      playlists: g.playlists
        .filter((c) => byId.has(c.id))
        .map((c) => {
          claimed.add(c.id);
          return { ...byId.get(c.id), ...clean(c) };
        }),
    }))
    .filter((s) => s.playlists.length > 0);

  const rest = live.filter((p) => !claimed.has(p.id));
  if (rest.length > 0) {
    sections.push({
      id: 'more',
      name: sections.length > 0 ? 'More playlists' : 'Playlists',
      playlists: rest,
    });
  }
  return sections;
}

export default function Playlists() {
  const [live, setLive] = useState(null);           // null = still loading
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    getPlaylists(controller.signal)
      .then((data) => setLive(data.playlists || []))
      .catch((e) => { if (e.name !== 'AbortError') setLive([]); });
    return () => controller.abort();
  }, []);

  if (live === null) return <p className="pl-note">Loading playlists…</p>;
  if (open) return <PlaylistDetail playlist={open} onBack={() => setOpen(null)} />;

  const sections = buildSections(live, playlistGroups);

  return (
    <div className="pl">
      {sections.map((group) => (
        <section key={group.id}>
          <h2 className="pl-group">{group.name}</h2>
          <ul className="pl-grid">
            {group.playlists.map((p) => (
              <li key={p.id}>
                <button className="pl-tile" onClick={() => setOpen(p)}>
                  <span
                    className="pl-cover"
                    aria-hidden="true"
                    style={p.cover ? { backgroundImage: `url("${p.cover}")` } : undefined}
                  >
                    {!p.cover && '🎵'}
                  </span>
                  <span className="pl-name">{p.name}</span>
                  <span className="pl-count">
                    {p.tracks != null ? `${p.tracks} songs` : '\u00a0'}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}