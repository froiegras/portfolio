//Navigation.js
import React from 'react';
import PropTypes from 'prop-types';
import './navigation.css';

function Navigation({ onNavItemClick }) {
  const now = new Date();
  const [time, setTime] = React.useState(now.toLocaleTimeString());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const date = now.toLocaleDateString();

  return (
    <nav className='bg-white fixed w-full z-20 bottom-0 end-0 border-t border-black border-4'>
      <div className='grid grid-cols-8 gap-4'>
        <div className='flex flex-wrap items-left p-4 col-span-1'>
          <button className='nav-button' onClick={() => onNavItemClick('home')}>Home</button>
        </div>
        <div className='flex flex-wrap items-center justify-between p-4 col-start-2 col-end-8'>
          <button className='nav-button' onClick={() => onNavItemClick('interests')}>Interests</button>
          <button className='nav-button' onClick={() => onNavItemClick('skills')}>Skills</button>
          <button className='nav-button' onClick={() => onNavItemClick('education')}>Education</button>
          <button className='nav-button' onClick={() => onNavItemClick('work')}>Work Experience</button>
          <button className='nav-button' onClick={() => onNavItemClick('projects')}>Notable Projects</button>
        </div>
        <div className='flex flex-col justify-end items-center p-4 col-start-8 col-end-9'>
          <span className='text-base font-mono mr-4'>{time}</span>
          <span className='text-base font-mono mr-4'>{date}</span>
        </div>
      </div>
    </nav>
  );
}

Navigation.propTypes = {
  onNavItemClick: PropTypes.func.isRequired,
};

export default Navigation;