// components/Interests/GithubRepoList.js
import React, { useState, useEffect } from 'react';
import { getRepos } from '../../../api/github';

export default function GithubRepoList({ limit = 5, caption, fallback = [] }) {
  const [repos, setRepos] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    getRepos(controller.signal)
      .then((data) => setRepos(data.repos))
      .catch((e) => { if (e.name !== 'AbortError') setRepos([]); });
    return () => controller.abort();
  }, []);

  const live = Boolean(repos?.length);

  const items = live
    ? repos.slice(0, limit).map((r) => ({
        key: r.name,
        label: r.name,
        note: r.language,
        url: r.url,
        hint: r.description,
      }))
    : fallback.map((f) => ({ key: f.label, label: f.label, note: f.note }));

  if (items.length === 0) return null;

  return (
    <>
      {live && caption && <p className="subtext">{caption}</p>}
      <ul className="interest-tree">
        {items.map(({ key, label, note, url, hint }) => (
          <li key={key}>
            {url ? (
              <a href={url} target="_blank" rel="noreferrer" title={hint || undefined}>
                {label}
              </a>
            ) : (
              label
            )}
            {note && <span className="interest-note"> {note}</span>}
          </li>
        ))}
      </ul>
    </>
  );
}