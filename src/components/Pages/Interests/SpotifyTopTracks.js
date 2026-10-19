// components/Interests/SpotifyTopTracks.js
import React, { useState, useEffect } from 'react';
import { getTopTracks } from '../../../api/spotify';

export default function SpotifyTopTracks({ genreKey, caption, fallback = [] }) {
  const [tracks, setTracks] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    getTopTracks(genreKey, controller.signal)
      .then((data) => setTracks(data.tracks))
      .catch((e) => { if (e.name !== 'AbortError') setTracks([]); });
    return () => controller.abort();
  }, [genreKey]);

  const live = Boolean(tracks?.length);

  const items = live
    ? tracks.map((t) => ({
        key: t.id,
        label: t.title,
        note: t.artist,
        url: t.url,
        icon: t.image,
      }))
    : fallback.map((f) => ({ key: f.label, label: f.label, note: f.note }));

  if (items.length === 0) return null;
  return (
    <>
      {live && caption && <p className="subtext">{caption}</p>}
      <ul className="interest-tree">
        {items.map(({ key, label, note, url, icon }) => (
          <li key={key}>
            {icon && <img src={icon} alt="" className="interest-game-icon" loading="lazy" />}
            {url ? <a href={url} target="_blank" rel="noreferrer">{label}</a> : label}
            {note && <span className="interest-note"> {note}</span>}
          </li>
        ))}
      </ul>
    </>
  );
}