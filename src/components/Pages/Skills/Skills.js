// Skills.js
import React, { useState } from 'react';
import './skills.css';

const skills = [
  { name: 'Python', icon: '🐍', type: 'Language', level: 4 },
  { name: 'Golang', icon: '🐹', type: 'Language', level: 3 },
  { name: 'ReactJS', icon: '⚛️', type: 'Frontend', level: 4 },
  { name: 'NextJS', icon: '▲', type: 'Frontend', level: 3 },
  { name: 'SolidJS', icon: '🔷', type: 'Frontend', level: 3 },
  { name: 'TailwindCSS', icon: '🎨', type: 'Frontend', level: 3 },
  { name: 'PostgreSQL', icon: '🐘', type: 'Database', level: 3 },
  { name: 'Redis', icon: '🧰', type: 'Database', level: 3 },
  { name: 'SSH', icon: '🔑', type: 'Tools', level: 2 },
  { name: 'MongoDB', icon: '🍃', type: 'Database', level: 2 },
];

const LEVEL_LABELS = ['', 'Beginner', 'Learning', 'Comfortable', 'Proficient', 'Expert'];
const types = ['All', ...new Set(skills.map((s) => s.type))];

function Skills() {
  const [filter, setFilter] = useState('All');

  const visible = filter === 'All' ? skills : skills.filter((s) => s.type === filter);

  return (
    <div className="skills-page">
      <fieldset className="skills-filters">
        <legend className="sr-only">Filter skills by type</legend>
        {types.map((t) => (
          <button
            key={t}
            className={`skills-chip${filter === t ? ' active' : ''}`}
            onClick={() => setFilter(t)}
            aria-pressed={filter === t}
          >
            {t}
          </button>
        ))}
      </fieldset>

      <div className="skills-table" role="table">
        <div className="skills-row skills-head" role="row">
          <span role="columnheader">Name</span>
          <span role="columnheader" className="skills-col-type">Type</span>
          <span role="columnheader">Level</span>
        </div>

        {visible.map(({ name, icon, type, level }) => (
          <div className="skills-row" role="row" key={name}>
            <span className="skills-name" role="cell">
              <span aria-hidden="true">{icon}</span> {name}
            </span>
            <span className="skills-col-type" role="cell">{type}</span>
            <span
              className="skills-level"
              role="cell"
              title={LEVEL_LABELS[level]}
              aria-label={`${LEVEL_LABELS[level]} (${level} of 5)`}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <i key={n} className={n <= level ? 'on' : ''} />
              ))}
            </span>
          </div>
        ))}
      </div>

      <p className="skills-status">
        {visible.length} item{visible.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}

export default Skills;