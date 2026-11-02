// components/Playlists/Playlists.js
import React, { useState } from 'react';
import { playlistGroups } from '../../data/playlists';
import './Playlists.css';

export default function Playlists() {
  const [active, setActive] = useState(null);

  return (
    <div className="pl">
      {active && (
        <div className="pl-player">
          <iframe
            key={active.id}
            title={`${active.name} on Spotify`}
            src={`https://open.spotify.com/embed/playlist/${active.id}`}
            width="100%"
            height="352"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
        </div>
      )}

      {playlistGroups.map((group) => (
        <section key={group.id}>
          <h2 className="pl-group">{group.name}</h2>
          <ul className="pl-grid">
            {group.playlists.map((p) => {
              const selected = active?.id === p.id;
              return (
                <li key={p.id}>
                  <button
                    className={`pl-tile${selected ? ' active' : ''}`}
                    onClick={() => setActive(selected ? null : p)}
                    aria-pressed={selected}
                  >
                    <span
                      className="pl-cover"
                      aria-hidden="true"
                      style={p.cover ? { backgroundImage: `url("${p.cover}")` } : undefined}
                    >
                      {!p.cover && '🎵'}
                    </span>
                    <span className="pl-name">{p.name}</span>
                    {p.description && <span className="pl-desc">{p.description}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}