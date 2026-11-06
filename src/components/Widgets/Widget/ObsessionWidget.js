import React, { useState, useEffect, useRef } from 'react';
import Widget from '../Widget/Widget';
import './ObsessionWidget.css';
import useObsessions from '../../../hooks/useObsessions';

const AUTO_ROTATE_MS = 0;
const RANDOM_START = false;
const WHEEL_COOLDOWN_MS = 450;
const SWIPE_MIN_PX = 40;
const DOTS_ON_MEDIA = true;

const isVideo = (src) => /\.(mp4|webm)$/i.test(src);
const NONE = [];

function wantsStill() {
  try {
    return (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      Boolean(navigator.connection?.saveData)
    );
  } catch {
    return false;
  }
}

export default function ObsessionWidget({ className = '' }) {
  const obsession = useObsessions() ?? NONE;
  const count = obsession.length;
  const [still] = useState(wantsStill);
  const [index, setIndex] = useState(() =>
    RANDOM_START && count > 0 ? Math.floor(Math.random() * count) : 0
  );
  const [failed, setFailed] = useState(() => new Set());
  const [paused, setPaused] = useState(false);

  const frameRef = useRef(null);
  const lastWheel = useRef(0);
  const touchStart = useRef(null);

  useEffect(() => {
    if (!AUTO_ROTATE_MS || count < 2 || still || paused) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), AUTO_ROTATE_MS);
    return () => clearInterval(timer);
  }, [count, still, paused]);

  useEffect(() => {
    const el = frameRef.current;
    if (!el || count < 2) return undefined;

    const onWheel = (e) => {
      if (e.ctrlKey) return;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 4) return;
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheel.current < WHEEL_COOLDOWN_MS) return;
      lastWheel.current = now;
      setIndex((i) => (i + (delta > 0 ? 1 : -1) + count) % count);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [count]);

  if (count === 0) return null;

  const { id, title, subtitle, media, poster, alt, link, since } = obsession[index];
  const overlay = DOTS_ON_MEDIA && !(still && media && isVideo(media));

  const go = (delta) => setIndex((i) => (i + delta + count) % count);
  const markFailed = () => setFailed((prev) => new Set(prev).add(id));

  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > SWIPE_MIN_PX && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  };

  const tip = [subtitle, since && `since ${since}`].filter(Boolean).join(' · ');

  let visual;
  if (!media || failed.has(id)) {
    visual = <div className="obs-fallback" aria-hidden="true">🔁</div>;
  } else if (isVideo(media)) {
    visual = (
      <video
        key={id}
        className="obs-media"
        src={media}
        poster={poster || undefined}
        autoPlay={!still}
        controls={still}
        muted
        loop
        playsInline
        preload={still ? 'none' : 'metadata'}
        aria-label={alt || title}
        title={tip || undefined}
        onError={markFailed}
      />
    );
  } else {
    visual = (
      <img
        key={id}
        className="obs-media"
        src={still && poster ? poster : media}
        alt={alt || title}
        title={tip || undefined}
        onError={markFailed}
      />
    );
  }

  const headerTitle = link ? (
    <a href={link} target="_blank" rel="noreferrer" className="obs-header-link">
      🔁 {title}
    </a>
  ) : (
    `🔁 ${title}`
  );

  return (
    <Widget title={headerTitle} className={className}>
      <div
        ref={frameRef}
        className={`obs-frame${overlay ? ' obs-frame--overlay' : ''}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {visual}

        <span className="sr-only" aria-live={AUTO_ROTATE_MS ? 'off' : 'polite'}>{title}</span>

        {count > 1 && (
          <div className="obs-dots">
            {obsession.map((o, i) => (
              <button
                key={o.id}
                className="obs-dot"
                onClick={() => setIndex(i)}
                aria-label={`Show ${o.title}`}
                aria-current={i === index ? 'true' : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </Widget>
  );
}