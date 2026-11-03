// Navigation.js
import React from 'react';
import PropTypes from 'prop-types';
import './Navigation.css';
import Tray from '../../Desktop/Tray/Tray';
import { isMobile } from '../../../utils/device';
import ThemeToggle from '../../Desktop/ThemeToggle/ThemeToggle';
import { ReactComponent as HomeIcon } from '../../../assets/home.svg';

function Navigation({ onNavItemClick, current, minimizedWidgets, onWidgetClick }) {
  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const items = [
    { key: 'interests', label: 'Interests', emoji: '❤️' },
    { key: 'skills', label: 'Skills', emoji: '🔧' },
    { key: 'work', label: 'Work Experience', emoji: '💼' },
    { key: 'projects', label: 'Projects', emoji: '👨‍💻' },
  ];

  const cls = (key) => `nav-button${current === key ? ' active' : ''}`;

  return (
    <nav className="taskbar">
      <button className={`${cls('home')} nav-home`} onClick={() => onNavItemClick('home')} aria-label="Home">
        <HomeIcon className="nav-home-icon" />
      </button>

      <div className="taskbar-items">
        {items.map(({ key, label, emoji }) => (
          <button
            key={key}
            data-nav-key={key}
            className={cls(key)}
            onClick={() => onNavItemClick(key)}
            aria-label={label}
          >
            <span className="emoji">{emoji}</span>
            <span className="label">{label}</span>
          </button>
        ))}
      </div>

      <Tray minimized={minimizedWidgets} onWidgetClick={onWidgetClick} />
      <ThemeToggle />

      <div className="taskbar-clock">
        <span>{now.toLocaleTimeString()}</span>
        <span className="taskbar-date">{now.toLocaleDateString()}</span>
      </div>
    </nav>
  );
}

Navigation.propTypes = {
  onNavItemClick: PropTypes.func.isRequired,
  current: PropTypes.string,
};

export default Navigation;