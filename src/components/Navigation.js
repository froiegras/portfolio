//Navigation.js
import React from 'react';

function Navigation() {
  return (
    <nav className="flex h-screen sticky">
        <ul className="sidebar bg-gray-800 text-white p-4 w-flex">
          <li><a href="#education">Education</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#work-experience">Work Experience</a></li>
        </ul>
    </nav>
  );
}

export default Navigation;