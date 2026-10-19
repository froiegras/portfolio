// components/BootScreen/BootScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import './BootScreen.css';

// Decorative only: these lines are for show, not real status checks.
const LINES = [
  { text: 'Starting portfolio.exe' },
  { text: 'Loading skills', ok: true },
  { text: 'Mounting /interests', ok: true },
  { text: 'Connecting to Spotify', ok: true },
  { text: 'Connecting to Steam', ok: true },
  { text: 'Welcome.' },
];
const STEP_MS = 1000;   // time between lines

export default function BootScreen({ onDone }) {
  const [step, setStep] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const finish = useCallback(() => setLeaving(true), []);

  // reveal one line at a time, then pause briefly and start fading out
  useEffect(() => {
    if (leaving) return undefined;
    const delay = step >= LINES.length ? 500 : STEP_MS;
    const t = setTimeout(() => (step >= LINES.length ? finish() : setStep((s) => s + 1)), delay);
    return () => clearTimeout(t);
  }, [step, leaving, finish]);

  // after the fade, tell App to remove the screen
  useEffect(() => {
    if (!leaving) return undefined;
    const t = setTimeout(onDone, 500);
    return () => clearTimeout(t);
  }, [leaving, onDone]);

  // click, tap or any key skips it
  useEffect(() => {
    window.addEventListener('keydown', finish);
    window.addEventListener('pointerdown', finish);
    return () => {
      window.removeEventListener('keydown', finish);
      window.removeEventListener('pointerdown', finish);
    };
  }, [finish]);

  return (
    <div className={`boot${leaving ? ' leaving' : ''}`} aria-hidden="true">
      <div className="boot-inner">
        <div className="boot-logo">💻</div>

        <ul className="boot-log">
          {LINES.slice(0, step).map(({ text, ok }) => (
            <li key={text}>
              {text}
              {ok && <span className="boot-ok"> OK</span>}
            </li>
          ))}
        </ul>

        <div className="boot-bar">
          <span style={{ width: `${(step / LINES.length) * 100}%` }} />
        </div>
        <p className="boot-skip">Click or press any key to skip</p>
      </div>
    </div>
  );
}