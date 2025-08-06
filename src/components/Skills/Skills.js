// Skills.js
import React from 'react';
import './skills.css';

const skills = ['Python', 'SolidJS', 'ReactJS', 'NextJS', 'TailwindCSS', 'PostgreSQL']

function Skills() {
  return (
    <div className='h-auto text-black p-4'>
      <ul className='skills-list'>
        {skills.map((skill) => (
          <li className='skills-text' key={skill}>
            <p>
              {skill}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Skills;