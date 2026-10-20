// components/Tray/Tray.js
import React from 'react';
import { widgets } from '../Widget/registry';
import './Tray.css';

export default function Tray({ minimized, onWidgetClick }) {
  return (
    <ul className="tray" aria-label="Widgets">
      {widgets.map(({ id, icon, label }) => {
        const isMin = minimized.has(id);
        return (
          <li key={id}>
            <button
              className={`tray-icon${isMin ? ' minimized' : ''}`}
              data-tray-id={id}
              onClick={() => onWidgetClick(id)}
              aria-label={`${label} widget`}
              aria-pressed={!isMin}
              title={`${label}: click to ${isMin ? 'restore' : 'minimize'}`}
            >
              <span aria-hidden="true">{icon}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}