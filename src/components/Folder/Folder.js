import { useRef, useLayoutEffect } from 'react';
import './Folder.css';

const reduceMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Folder({ children, title, onClose, originKey }) {
  const ref = useRef(null);
  const closing = useRef(false);

  const getTucked = () => {
    const target = document.querySelector(`[data-nav-key="${originKey}"]`);
    if (!target || !ref.current) return null;
    const w = ref.current.getBoundingClientRect();
    const t = target.getBoundingClientRect();
    return {
      x: t.left + t.width / 2 - (w.left + w.width / 2),
      y: t.top + t.height / 2 - (w.top + w.height / 2),
      sx: t.width / w.width,
      sy: t.height / w.height,
    };
  };

  const tucked = (m) => `translate(${m.x}px, ${m.y}px) scale(${m.sx}, ${m.sy})`;

  useLayoutEffect(() => {
    const m = getTucked();
    if (!m || reduceMotion()) return;
    ref.current.animate(
      [
        { transform: tucked(m), opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 300, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    if (closing.current) return;
    closing.current = true;

    const m = getTucked();
    if (!m || reduceMotion()) {
      onClose();
      return;
    }
    ref.current
      .animate(
        [
          { transform: 'none', opacity: 1 },
          { transform: tucked(m), opacity: 0 },
        ],
        { duration: 250, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' }
      )
      .finished.then(onClose);
  };

  return (
    <section ref={ref} className="window" role="dialog" aria-label={title || 'Folder'}>
      <header className="window-titlebar">
        <span className="window-title">📁 {title || 'Folder'}</span>
        <div className="window-controls">
          <button className="topbar-buttons minimize hidden md:flex" onClick={handleClose} aria-label="Minimize">-</button>
          <button className="topbar-buttons maximize hidden md:flex" aria-label="Maximize">+</button>
          <button className="topbar-buttons close" onClick={handleClose} aria-label="Close">X</button>
        </div>
      </header>
      <div className="window-body">{children}</div>
    </section>
  );
}

export default Folder;