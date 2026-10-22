// components/Widget/SpotifyWidget.js
import { useState, useEffect } from 'react';
import Widget from '../Widget/Widget';
import { getNowPlaying } from '../../api/spotify';
import './SpotifyWidget.css';
import { getRecentlyPlayed } from '../../api/ytmusic';

export default function SpotifyWidget({ className = '' }) {
  let body, title;
  const [track, setTrack] = useState(null);
  const [last, setLast] = useState(null);


  useEffect(() => {
    if (track?.isPlaying !== false) return undefined;
    const controller = new AbortController();
    getRecentlyPlayed(controller.signal)
      .then((d) => setLast(d.tracks?.[0] || null))
      .catch(() => {});
    return () => controller.abort();
  }, [track?.isPlaying]);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      if (document.hidden) return;
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

  if (track?.isPlaying) {
    title = '🎵 Now Playing';
    body = (
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
    );
  } else if (last) {
    title = '▶ Last Played';
    body = (
      <a className="spotify-last" href={last.url} target="_blank" rel="noreferrer">
        <span className="spotify-last-label">Last played on YouTube Music</span>
        <span className="spotify-track">{last.title}</span>
        <span className="spotify-artist">{last.artist}</span>
      </a>
    );
  } else {
    body = <div className="spotify-idle">Not playing anything right now</div>;
  }

  return (
    <Widget title={title} className={className}>
      {body}
    </Widget>
  );
}