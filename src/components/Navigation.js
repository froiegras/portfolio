//Navigation.js
import React from 'react';
import PropTypes from 'prop-types';

function Navigation({ onNavItemClick }) {
  return (
    <nav>
      <div className='h-screen bg-gray-800 text-white p-4'>
        <button onClick={() => onNavItemClick('cover')}>Cover Letter</button> <br />
        <button onClick={() => onNavItemClick('skills')}>Skills</button> <br />
        <button onClick={() => onNavItemClick('education')}>Education</button> <br />
        <button onClick={() => onNavItemClick('work')}>Work Experience</button>
        <button onClick={() => onNavItemClick('projects')}>Notable Projects</button> <br />
      </div>
    </nav>
  );
}

Navigation.propTypes = {
  onNavItemClick: PropTypes.func.isRequired,
};

export default Navigation;