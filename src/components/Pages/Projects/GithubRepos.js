// components/Projects/GithubRepos.js
import React, { useState, useEffect } from 'react';
import { getRepos } from '../../../api/github';
import Readme from './Readme';

export default function GithubRepos() {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    getRepos(controller.signal)
      .then((data) => setRepos(data.repos))
      .catch((e) => { if (e.name !== 'AbortError') setRepos([]); });
    return () => controller.abort();
  }, []);

  if (repos.length === 0) return null;

  return (
    <section>
      <h2 className="projects-subhead">More on GitHub</h2>
      <div className="projects-grid">
        {repos.map((r) => (
          <article key={r.name} className="project-card">
            <h3 className="project-text">
              <a href={r.url} target="_blank" rel="noreferrer">{r.name}</a>
            </h3>
            {r.description && <p className="project-summary">{r.description}</p>}
            <ul className="project-tags">
              {r.language && <li>{r.language}</li>}
              {r.topics.slice(0, 3).map((t) => <li key={t}>{t}</li>)}
              {r.stars > 0 && <li>★ {r.stars}</li>}
            </ul>
            <Readme repo={r} />
            {r.homepage && (
              <div className="project-links">
                <a href={r.homepage} target="_blank" rel="noreferrer">Live ↗</a>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}