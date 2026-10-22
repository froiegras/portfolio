import React, { useState, useEffect } from 'react';
import { getRecentlyPlayed } from '../../../api/ytmusic';

export default function YouTubeMusicRecent({ caption, only, limit = 5 }) {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    getRecentlyPlayed(controller.signal)
      .then((data) => setTracks(data.tracks || []))
      .catch((e) => { if (e.name !== 'AbortError') setTracks([]); });
    return () => controller.abort();
  }, []);

  const wanted = (only || []).map((a) => a.toLowerCase());
  const seen = new Set();

  const shown = tracks
    .filter((t) => {
      if (!t.id || seen.has(t.id)) return false;
      seen.add(t.id);
      return (
        wanted.length === 0 ||
        wanted.some((a) => (t.artist || '').toLowerCase().includes(a))
      );
    })
    .slice(0, limit);

  if (shown.length === 0) return null;

  return (
    <>
      {caption && <p className="subtext">{caption}</p>}
      <ul className="interest-tree">
        {shown.map((t) => (
          <li key={t.id}>
            {t.image && (
              <img src={t.image} alt="" className="interest-game-icon" loading="lazy" />
            )}
            <a href={t.url} target="_blank" rel="noreferrer">{t.title}</a>
            <span className="interest-note"> {t.artist}</span>
          </li>
        ))}
      </ul>
    </>
  );
}