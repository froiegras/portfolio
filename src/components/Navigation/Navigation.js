//Navigation.js
import PropTypes from 'prop-types';
import './navigation.css';

function Navigation({ onNavItemClick }) {
  return (
    <nav className='bg-white fixed w-full z-20 bottom-0 end-0 border-t border-black border-4'>
      <div className='grid grid-cols-8 gap-4'>
        <div className='flex flex-wrap items-left p-4'>
          <button className='nav-button' onClick={() => onNavItemClick('home')}>Home</button>
        </div>
        <div className='flex flex-wrap items-center justify-between p-4 col-start-2 col-end-8'>
          <button className='nav-button' onClick={() => onNavItemClick('interests')}>Interests</button>
          <button className='nav-button' onClick={() => onNavItemClick('skills')}>Skills</button>
          <button className='nav-button' onClick={() => onNavItemClick('education')}>Education</button>
          <button className='nav-button' onClick={() => onNavItemClick('work')}>Work Experience</button>
          <button className='nav-button' onClick={() => onNavItemClick('projects')}>Notable Projects</button>
        </div>
      </div>
    </nav>
  );
}

Navigation.propTypes = {
  onNavItemClick: PropTypes.func.isRequired,
};

export default Navigation;