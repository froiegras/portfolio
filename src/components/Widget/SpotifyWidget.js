// components/Widgets/SpotifyWidget.js
import React, { useState, useEffect } from 'react';
import Widget from './Widget';

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
    const id = setInterval(load, 30000); // poll every 30s
    return () => clearInterval(id);
  }, []);

  return (
    <Widget title="Spotify">
      {track?.isPlaying ? (
        <div className="flex gap-3 items-center">
          <img src={track.albumImage} alt="" className="w-14 h-14 rounded" />
          <div>
            <a href={track.url} className="font-semibold block">{track.title}</a>
            <div className="text-sm text-gray-600">{track.artist}</div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500">Not playing anything right now</div>
      )}
    </Widget>
  );
}