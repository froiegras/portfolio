// Folder.js
import React from 'react';
import './folder.css';

function Folder({ children, title, onClose }) {
  return (
    <section className="window" role="dialog" aria-label={title || 'Folder'}>
      <header className="window-titlebar">
        <span className="window-title">📁 {title || 'Folder'}</span>
        <div className="window-controls">
          <button className="topbar-buttons minimize hidden md:flex" aria-label="Minimize">-</button>
          <button className="topbar-buttons maximize hidden md:flex" aria-label="Maximize">+</button>
          <button className="topbar-buttons close" onClick={onClose} aria-label="Close">X</button>
        </div>
      </header>
      <div className="window-body">{children}</div>
    </section>
  );
}

export default Folder;