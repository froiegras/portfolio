//Navigation.js
import React from 'react';
import PropTypes from 'prop-types';

function Navigation({ onNavItemClick }) {
  return (
    <nav className='w-full bg-[#fdfaf8] border-t-2 border-black'>
      <div className='h-screen  text-black p-4 w-fit'>
        <button onClick={() => onNavItemClick('home')}>Home</button> <br />
        <button onClick={() => onNavItemClick('interests')}>Interests</button> <br />
        <button onClick={() => onNavItemClick('skills')}>Skills</button> <br />
        <button onClick={() => onNavItemClick('education')}>Education</button> <br />
        <button onClick={() => onNavItemClick('work')}>Work Experience</button> <br />
        <button onClick={() => onNavItemClick('projects')}>Notable Projects</button> <br />
      </div>
    </nav>
  );
}

Navigation.propTypes = {
  onNavItemClick: PropTypes.func.isRequired,
};

export default Navigation;