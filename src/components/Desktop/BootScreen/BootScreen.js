// components/BootScreen/BootScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import './BootScreen.css';

const LINES = [
  { text: 'Starting portfolio' },
  { text: 'Loading web pages', ok: true },
  { text: 'Mounting components', ok: true },
  { text: 'Connecting to Spotify', ok: true },
  { text: 'Connecting to Steam', ok: true },
];
const STEP_MS = 300;

const USER_NAME = 'Froi';
const PASSWORD_LENGTH = 10;

export default function BootScreen({ onDone }) {
  const [stage, setStage] = useState('boot');
  const [leaving, setLeaving] = useState(false);
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState(0);
  const [signingIn, setSigningIn] = useState(false);

  const finish = useCallback(() => setLeaving(true), []);

  useEffect(() => {
    if (leaving || stage !== 'boot') return undefined;
    const done = step >= LINES.length;
    const t = setTimeout(
      () => (done ? setStage('login') : setStep((s) => s + 1)),
      done ? 500 : STEP_MS
    );
    return () => clearTimeout(t);
  }, [stage, step, leaving]);

  useEffect(() => {
    if (leaving || stage !== 'login') return undefined;
    let t;
    if (typed < PASSWORD_LENGTH) {
      const delay = typed === 0 ? 700 : 90 + Math.random() * 130;
      t = setTimeout(() => setTyped((n) => n + 1), delay);
    } else if (!signingIn) {
      t = setTimeout(() => setSigningIn(true), 400);
    } else {
      t = setTimeout(finish, 800);
    }
    return () => clearTimeout(t);
  }, [stage, typed, signingIn, leaving, finish]);

  useEffect(() => {
    if (!leaving) return undefined;
    const t = setTimeout(onDone, 500);
    return () => clearTimeout(t);
  }, [leaving, onDone]);

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
      {stage === 'boot' ? (
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
      ) : (
        <div className="boot-inner login">
          <div className="login-avatar">👤</div>
          <p className="login-name">{USER_NAME}</p>

          <div className="login-field">
            {Array.from({ length: typed }, (_, i) => (
              <span key={i} className="login-dot" />
            ))}
            {!signingIn && <span className="login-caret" />}
          </div>

          <p className="login-status">{signingIn ? 'Signing in…' : '\u00a0'}</p>
        </div>
      )}
    </div>
  );
}