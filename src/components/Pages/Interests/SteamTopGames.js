// components/Interests/SteamTopGames.js
import React, { useState, useEffect } from 'react';
import { getMostPlayed } from '../../../api/steam';

export default function SteamTopGames({ fallback = [] }) {
  const [games, setGames] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    getMostPlayed(controller.signal)
      .then((data) => setGames(data.games))
      .catch((e) => { if (e.name !== 'AbortError') setGames([]); });
    return () => controller.abort();
  }, []);

  const live = Boolean(games?.length);

  const items = live
    ? games.map((g) => ({
        key: g.appid,
        label: g.name,
        note: `${g.hours} hrs`,
        url: g.url,
        icon: g.icon,
      }))
    : fallback.map((f) => ({ key: f.label, label: f.label, note: f.note }));

  return (
    <>
      {live && <p className="subtext">Most played on Steam (20+ hours)</p>}
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