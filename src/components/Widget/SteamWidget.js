// components/Widget/SteamWidget.js
import React, { useState, useEffect } from 'react';
import Widget from '../Widget/Widget';
import { getLastPlayed } from '../../api/steam';
import './SteamWidget.css';

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

function timeAgo(unixSeconds) {
  const diff = unixSeconds - Date.now() / 1000;
  const steps = [
    ['year', 31536000], ['month', 2592000], ['day', 86400],
    ['hour', 3600], ['minute', 60],
  ];
  for (const [unit, secs] of steps) {
    if (Math.abs(diff) >= secs) return rtf.format(Math.round(diff / secs), unit);
  }
  return 'just now';
}

export default function SteamWidget({ className = '' }) {
  const [game, setGame] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      if (document.hidden) return;
      try {
        setGame(await getLastPlayed(controller.signal));
      } catch (e) {
        if (e.name !== 'AbortError') setGame(null);
      }
    };

    load();
    const id = setInterval(load, 60000);
    return () => { controller.abort(); clearInterval(id); };
  }, []);

  const playingNow = Boolean(game?.inGame);

  return (
    <Widget title="🎮 Steam" className={className}>
      {game?.found ? (
        <a className="steam-row" href={game.url} target="_blank" rel="noreferrer">
          <img src={game.image} alt="" className="steam-art" loading="lazy" />
          <div className="steam-info">
            <span className={`steam-status${playingNow ? ' live' : ''}`}>
              {playingNow ? 'Playing now' : `Last played ${timeAgo(game.lastPlayed)}`}
            </span>
            <span className="steam-name">{game.name}</span>
            {game.hoursTotal != null && (
              <span className="steam-hours">{game.hoursTotal} hrs on record</span>
            )}
          </div>
        </a>
      ) : (
        <div className="steam-idle">No recent games to show</div>
      )}
    </Widget>
  );
}