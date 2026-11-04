import React, { useState, useEffect } from 'react';
import Widget from '../Widget/Widget';
import { obsession } from '../../../data/obsession';
import './ObsessionWidget.css';

const AUTO_ROTATE_MS = 0;       // 8000 would advance every 8 seconds, and 0 turns it off
const RANDOM_START = false;     // true starts on a random entry each visit

const isVideo = (src) => /\.(mp4|webm)$/i.test(src);

// reduced motion or "data saver": don't autoplay or rotate
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
  const count = obsession.length;
  const [still] = useState(wantsStill);
  const [index, setIndex] = useState(() =>
    RANDOM_START && count > 0 ? Math.floor(Math.random() * count) : 0
  );
  const [failed, setFailed] = useState(() => new Set());
  const [paused, setPaused] = useState(false);

  // optional auto-advance, paused while the visitor hovers or focuses the widget
  useEffect(() => {
    if (!AUTO_ROTATE_MS || count < 2 || still || paused) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), AUTO_ROTATE_MS);
    return () => clearInterval(id);
  }, [count, still, paused]);

  if (count === 0) return null;

  const entry = obsession[index];
  const { id, label, title, subtitle, media, poster, alt, link, since } = entry;

  const go = (delta) => setIndex((i) => (i + delta + count) % count);
  const markFailed = () => setFailed((prev) => new Set(prev).add(id));

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
        onError={markFailed}
      />
    );
  }

  const heading = link ? (
    <a href={link} target="_blank" rel="noreferrer" className="obs-title">{title}</a>
  ) : (
    <p className="obs-title">{title}</p>
  );

  return (
    <Widget title={`🔁 ${label}`} className={className}>
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {visual}

        <div className="obs-text" aria-live={AUTO_ROTATE_MS ? 'off' : 'polite'}>
          {heading}
          {subtitle && <p className="obs-sub">{subtitle}</p>}
          {since && <p className="obs-since">since {since}</p>}
        </div>

        {count > 1 && (
          <div className="obs-nav">
            <button className="obs-arrow" onClick={() => go(-1)} aria-label="Previous">‹</button>

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

            <span className="obs-count">{index + 1} / {count}</span>
            <button className="obs-arrow" onClick={() => go(1)} aria-label="Next">›</button>
          </div>
        )}
      </div>
    </Widget>
  );
}