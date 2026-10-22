// components/ThemeToggle/ThemeToggle.js
import React from 'react';
import useTheme from '../../hooks/useTheme';
import './ThemeToggle.css';

const ICONS = { auto: '🌗', light: '☀️', dark: '🌙' };
const NAMES = { auto: 'Auto (by time of day)', light: 'Light', dark: 'Dark' };

export default function ThemeToggle() {
  const { pref, theme, cycle } = useTheme();
  const label = `Theme: ${NAMES[pref]}${pref === 'auto' ? `, currently ${theme}` : ''}. Click to change.`;

  return (
    <button className="theme-toggle" onClick={cycle} aria-label={label} title={label}>
      <span aria-hidden="true">{ICONS[pref]}</span>
    </button>
  );
}