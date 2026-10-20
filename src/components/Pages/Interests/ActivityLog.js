import React from 'react';

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC',
  });

export default function ActivityLog({ rows, label = 'Trail', noun = 'activities' }) {
  if (!rows || rows.length === 0) return null;

  const sorted = [...rows].sort((a, b) => a.date.localeCompare(a.date));
  const totalKm = rows.reduce((sum, r) => sum + (r.km || 0), 0);
  const withGain = rows.filter((r) => r.gain);
  const biggest = withGain.length
    ? withGain.reduce((a, b) => (b.gain > a.gain ? b : a))
    : null;
  const hasDifficulty = rows.some((r) => r.difficulty);

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
            {sorted.map((r) => (
              <tr key={`${r.date}-${r.name}`}>
                <td>
                  <span className="log-name">{r.name}</span>
                  {r.note && <span className="log-note">{r.note}</span>}
                </td>
                <td>{fmtDate(r.date)}</td>
                <td>{r.km} km</td>
                {withGain.length > 0 && (
                  <td className="log-hide-sm">{r.gain ? `${r.gain} m` : '–'}</td>
                )}
                {hasDifficulty && <td className="log-hide-sm">{r.difficulty || '–'}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}