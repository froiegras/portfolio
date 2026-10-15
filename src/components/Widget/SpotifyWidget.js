// components/Widgets/SpotifyWidget.js
import { useState, useEffect } from 'react';
import Widget from '../Widget/Widget';
import './SpotifyWidget.css';

export default function SpotifyWidget() {
  const [track, setTrack] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/now-playing');
        setTrack(await res.json());
      } catch {
        setTrack(null);
      }
    };
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <Widget title="🎵 Now Playing" className="widget-top-right">
      {track?.isPlaying ? (
        <div className="spotify-row">
          <img src={track.albumImage} alt="" className="spotify-art" />
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
        <div className="spotify-idle">Not playing anything right now</div>
      )}
    </Widget>
  );
}