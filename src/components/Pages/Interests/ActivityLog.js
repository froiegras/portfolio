import React, { useState, useEffect } from 'react';
import Gallery from '../../Gallery/Gallery';

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC',
  });

export default function ActivityLog({ rows, label = 'Trail', noun = 'activities', albums }) {
  const [albumNames, setAlbumNames] = useState(() => new Set());
  const [openKey, setOpenKey] = useState(null);
  const [listed, setListed] = useState(false);

  useEffect(() => {
    if (!albums) return undefined;
    const controller = new AbortController();
    fetch(`/media/${albums}/`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : []))
      .then((list) =>
        setAlbumNames(
          new Set(list.filter((f) => f.type === 'directory').map((f) => f.name))
        )
      )
      .catch(() => {})
      .finally(() => { if (!controller.signal.aborted) setListed(true); });
    return () => controller.abort();
  }, [albums]);

  useEffect(() => {
    if (!listed || process.env.NODE_ENV === 'production') return;
    (rows || []).forEach((r) => {
      if (r.album && !albumNames.has(r.album)) {
        console.warn(`No folder "${albums}/${r.album}" found for "${r.name}" (${r.date})`);
      }
    });
  }, [listed, albumNames, rows, albums]);

  if (!rows || rows.length === 0) return null;

  const sorted = [...rows].sort((a, b) => b.date.localeCompare(a.date));
  const totalKm = rows.reduce((sum, r) => sum + (r.km || 0), 0);
  const withGain = rows.filter((r) => r.gain);
  const biggest = withGain.length
    ? withGain.reduce((a, b) => (b.gain > a.gain ? b : a))
    : null;
  const hasDifficulty = rows.some((r) => r.difficulty);
  const colSpan = 3 + (withGain.length > 0 ? 1 : 0) + (hasDifficulty ? 1 : 0);

  const albumOf = (r) => (albums && r.album && albumNames.has(r.album) ? r.album : null);

  return (
    <div className="log">
      <dl className="log-stats">
        <div><dt>{noun}</dt><dd>{rows.length}</dd></div>
        <div><dt>Distance</dt><dd>{Math.round(totalKm * 10) / 10} km</dd></div>
        {biggest && <div><dt>Biggest climb</dt><dd>{biggest.gain} m</dd></div>}
      </dl>

      <div className="log-scroll">
        <table className="log-table">
          <thead>
            <tr>
              <th scope="col">{label}</th>
              <th scope="col">Date</th>
              <th scope="col">Distance</th>
              {withGain.length > 0 && <th scope="col" className="log-hide-sm">Gain</th>}
              {hasDifficulty && <th scope="col" className="log-hide-sm">Difficulty</th>}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => {
              const key = `${r.date}-${r.name}`;
              const album = albumOf(r);
              const isOpen = openKey === key;

              return (
                <React.Fragment key={key}>
                  <tr>
                    <td>
                      <span className="log-name">
                        {r.name}
                        {album && (
                          <button
                            className="log-photo-btn"
                            onClick={() => setOpenKey(isOpen ? null : key)}
                            aria-expanded={isOpen}
                            aria-label={`${isOpen ? 'Hide' : 'Show'} photos of ${r.name}`}
                            title="Photos"
                          >
                            📷
                          </button>
                        )}
                      </span>
                      {r.note && <span className="log-note">{r.note}</span>}
                    </td>
                    <td>{fmtDate(r.date)}</td>
                    <td>{r.km} km</td>
                    {withGain.length > 0 && (
                      <td className="log-hide-sm">{r.gain ? `${r.gain} m` : '–'}</td>
                    )}
                    {hasDifficulty && <td className="log-hide-sm">{r.difficulty || '–'}</td>}
                  </tr>

                  {album && isOpen && (
                    <tr className="log-album-row">
                      <td colSpan={colSpan}>
                        <Gallery folder={`${albums}/${album}`} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}