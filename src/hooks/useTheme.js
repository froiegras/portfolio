import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'theme-pref';
const DAY_START = 6;
const DAY_END = 18;
const MODES = ['auto', 'light', 'dark'];

function timeTheme() {
  const h = new Date().getHours();
  return h >= DAY_START && h < DAY_END ? 'light' : 'dark';
}

function readPref() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return MODES.includes(v) ? v : 'auto';
  } catch {
    return 'auto';
  }
}

export default function useTheme() {
  const [pref, setPref] = useState(readPref);
  const [clockTheme, setClockTheme] = useState(timeTheme);

  useEffect(() => {
    const id = setInterval(() => setClockTheme(timeTheme()), 60000);
    return () => clearInterval(id);
  }, []);

  const theme = pref === 'auto' ? clockTheme : pref;

  useEffect(() => {
    const root = document.documentElement;
    if (root.getAttribute('data-theme') !== theme) {
      root.classList.add('theme-transition');
      root.setAttribute('data-theme', theme);
      setTimeout(() => root.classList.remove('theme-transition'), 400);
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#e2e6f2' : '#1c1c1e');
  }, [theme]);

  const cycle = useCallback(() => {
    const next = MODES[(MODES.indexOf(pref) + 1) % MODES.length];
    setPref(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
    }
  }, [pref]);

  return { pref, theme, cycle };
}