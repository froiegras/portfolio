// components/Widgets/SpotifyWidget.js
import { useState, useEffect } from 'react';
import Widget from '../Widget/Widget';
import { getNowPlaying } from '../../api/spotify';
import './SpotifyWidget.css';

export default function SpotifyWidget({ className = '' }) {
  const [track, setTrack] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      if (document.hidden) return;              // skip polling in background tabs
      try {
        setTrack(await getNowPlaying(controller.signal));
      } catch (e) {
        if (e.name !== 'AbortError') setTrack(null);
      }
    };

    load();
    const id = setInterval(load, 15000);
    return () => {
      controller.abort();
      clearInterval(id);
    };
  }, []);

  return (
    <Widget title="🎵 Now Playing" className={className}>
      {track?.isPlaying ? (
        <div className="spotify-row">
          {track.albumImage && (
            <img src={track.albumImage} alt="" className="spotify-art" />
          )}
          <div className="spotify-info">
            <a
              href={track.url}
              target="_blank"
              rel="noreferrer"
              className="spotify-track"
            >
              {track.title}
            </a>
            <div className="spotify-artist">{track.artist}</div>
          </div>
          <div className="spotify-bars" aria-hidden="true">
            <span /><span /><span />
          </div>
        </div>
      ) : (
        <div className="spotify-idle">Not playing anything right now or I'm on Youtube Music (｡•̀ᴗ-)</div>
      )}
    </Widget>
  );
}