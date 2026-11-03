// pages/Playlists/PlaylistDetail.js
import React, { useState, useEffect } from 'react';
import { getPlaylistSongs } from '../../api/spotify';

const duration = (ms) => {
  if (!ms) return '';
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

export default function PlaylistDetail({ playlist, onBack }) {
  const [songs, setSongs] = useState(null);        // null = still loading
  const [total, setTotal] = useState(null);
  const [playing, setPlaying] = useState(null);    // { kind: 'track' | 'episode' | 'playlist', id }

  useEffect(() => {
    const controller = new AbortController();
    setSongs(null);
    setPlaying(null);
    getPlaylistSongs(playlist.id, controller.signal)
      .then((data) => {
        setSongs(data.songs || []);
        setTotal(data.total ?? null);
      })
      .catch((e) => { if (e.name !== 'AbortError') setSongs([]); });
    return () => controller.abort();
  }, [playlist.id]);

  const spotifyUrl = `https://open.spotify.com/playlist/${playlist.id}`;
  const count = playlist.tracks ?? total;

  return (
    <div className="pl-detail">
      <button className="pl-back" onClick={onBack}>← All playlists</button>

      <div className="pl-head">
        <div
          className="pl-head-cover"
          aria-hidden="true"
          style={playlist.cover ? { backgroundImage: `url("${playlist.cover}")` } : undefined}
        >
          {!playlist.cover && '🎵'}
        </div>
        <div>
          <h2 className="pl-head-title">{playlist.name}</h2>
          {playlist.description && <p className="pl-head-sub">{playlist.description}</p>}
          {count != null && <p className="pl-head-sub">{count} songs</p>}
          <div className="pl-head-actions">
            <button className="pl-play" onClick={() => setPlaying({ kind: 'playlist', id: playlist.id })}>
              ▶ Play playlist
            </button>
            <a href={spotifyUrl} target="_blank" rel="noreferrer">Open in Spotify ↗</a>
          </div>
        </div>
      </div>

      {playing && (
        <div className="pl-player">
          <iframe
            key={`${playing.kind}-${playing.id}`}
            title="Spotify player"
            src={`https://open.spotify.com/embed/${playing.kind}/${playing.id}`}
            width="100%"
            height={playing.kind === 'playlist' ? 352 : 152}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
        </div>
      )}

      {songs === null && <p className="pl-note">Loading songs…</p>}

      {songs && songs.length === 0 && (
        <p className="pl-note">
          Couldn't load the songs. <a href={spotifyUrl} target="_blank" rel="noreferrer">Open it in Spotify</a> instead.
        </p>
      )}

      {songs && songs.length > 0 && (
        <>
          <ol className="song-list">
            {songs.map((s, i) => {
              const isPlaying = playing?.id === s.id;
              return (
                <li key={`${s.id}-${i}`}>
                  <button
                    className="song-row"
                    onClick={() => setPlaying({ kind: s.type === 'episode' ? 'episode' : 'track', id: s.id })}
                    aria-current={isPlaying ? 'true' : undefined}
                  >
                    <span className="song-num">{i + 1}</span>
                    {s.image ? (
                      <img className="song-art" src={s.image} alt="" loading="lazy" />
                    ) : (
                      <span className="song-art" aria-hidden="true" />
                    )}
                    <span className="song-text">
                      <span className="song-title">{s.title}</span>
                      <span className="song-artist">{s.artist}</span>
                    </span>
                    <span className="song-time">{duration(s.ms)}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          {total != null && total > songs.length && (
            <p className="pl-note">Showing the first {songs.length} of {total} songs.</p>
          )}
        </>
      )}
    </div>
  );
}