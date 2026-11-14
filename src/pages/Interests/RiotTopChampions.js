// pages/Interests/RiotTopChampions.js
import React, { useState, useEffect } from 'react';
import { getTopChampions } from '../../api/riot';

export default function RiotTopChampions({ caption, fallback = [] }) {
  const [champs, setChamps] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    getTopChampions(controller.signal)
      .then((data) => setChamps(data.champions || []))
      .catch((e) => { if (e.name !== 'AbortError') setChamps([]); });
    return () => controller.abort();
  }, []);

  const live = Boolean(champs?.length);

  const items = live
    ? champs.map((c) => ({
        key: c.id,
        label: c.name,
        icon: c.icon,
        note: `mastery ${c.level} · ${c.points.toLocaleString()} pts`,
      }))
    : fallback.map((f) => ({ key: f.label, label: f.label, note: f.note }));

  if (items.length === 0) return null;

  return (
    <>
      {live && caption && <p className="subtext">{caption}</p>}
      <ul className="interest-tree">
        {items.map(({ key, label, note, icon }) => (
          <li key={key}>
            {icon && (
              <img src={icon} alt="" className="interest-game-icon riot-icon" loading="lazy" />
            )}
            {label}
            {note && <span className="interest-note"> {note}</span>}
          </li>
        ))}
      </ul>
    </>
  );
}