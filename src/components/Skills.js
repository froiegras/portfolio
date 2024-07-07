// Skills.js
import React from 'react';

const skills = ['Python', 'SolidJS', 'ReactJS', 'NextJS', 'TailwindCSS', 'PostgreSQL']

function Skills() {
  return (
    <div className='h-screen bg-[#fdfaf8] text-black p-4'>
      <h1 className='font-semibold text-2xl'>Skills</h1>
        <h2>Programming Languages and Tech Stacks</h2>
          <ul className='list-disc pl-5'> 
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
    </div>
  );
}

export default Skills;