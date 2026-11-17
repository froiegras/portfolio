// Skills.js
import React, { useState } from 'react';
import './Skills.css';
import {
  SiPython,
  SiReact,
  SiNextdotjs,
  SiSolid,
  SiTailwindcss,
  SiPostgresql,
  SiRedis,
  SiGo,
  SiMongodb,
} from 'react-icons/si';

const skills = [
  { name: 'Python', icon: SiPython, type: 'Language', level: 4 },
  { name: 'Golang', icon: SiGo, type: 'Language', level: 3 },
  { name: 'ReactJS', icon: SiReact, type: 'Frontend', level: 4 },
  { name: 'NextJS', icon: SiNextdotjs, type: 'Frontend', level: 3 },
  { name: 'SolidJS', icon: SiSolid, type: 'Frontend', level: 3 },
  { name: 'TailwindCSS', icon: SiTailwindcss, type: 'Frontend', level: 3 },
  { name: 'PostgreSQL', icon: SiPostgresql, type: 'Database', level: 3 },
  { name: 'Redis', icon: SiRedis, type: 'Database', level: 3 },
  { name: 'MongoDB', icon: SiMongodb, type: 'Database', level: 2 },
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

        {visible.map(({ name, icon: SkillIcon, type, level }) => (
          <div className="skills-row" role="row" key={name}>
            <span className="skills-name" role="cell">
              {SkillIcon && <SkillIcon className="skill-icon" aria-hidden="true" />} {name}
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