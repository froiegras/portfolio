import { useRef, useState, useMemo, useLayoutEffect } from 'react';
import Draggable from 'react-draggable';
import useIsDesktop from '../../hooks/useIsDesktop';
import { FrameContext } from './FrameContext';

const reduceMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function WidgetFrame({ id, minimized, onMinimize, className = '', children }) {
  const shellRef = useRef(null);
  const innerRef = useRef(null);
  const exitAnim = useRef(null);
  const pendingEnter = useRef(false);
  const prevMinimized = useRef(minimized);
  const [hidden, setHidden] = useState(minimized);
  const isDesktop = useIsDesktop();

  const getTucked = () => {
    const icon = document.querySelector(`[data-tray-id="${id}"]`);
    const el = innerRef.current;
    if (!icon || !el) return null;
    const w = el.getBoundingClientRect();
    const t = icon.getBoundingClientRect();
    return {
      x: t.left + t.width / 2 - (w.left + w.width / 2),
      y: t.top + t.height / 2 - (w.top + w.height / 2),
      sx: t.width / w.width,
      sy: t.height / w.height,
    };
  };
  const tucked = (m) => `translate(${m.x}px, ${m.y}px) scale(${m.sx}, ${m.sy})`;

  useLayoutEffect(() => {
    if (prevMinimized.current === minimized) return;
    prevMinimized.current = minimized;
    const el = innerRef.current;

    if (minimized) {
      const m = getTucked();
      if (!m || !el || reduceMotion()) {
        setHidden(true);
        return;
      }
      const anim = el.animate(
        [
          { transform: 'none', opacity: 1 },
          { transform: tucked(m), opacity: 0 },
        ],
        { duration: 240, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' }
      );
      exitAnim.current = anim;
      anim.finished.then(() => setHidden(true)).catch(() => {});
    } else {
      exitAnim.current?.cancel();
      exitAnim.current = null;
      if (hidden) {
        pendingEnter.current = true;
        setHidden(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minimized]);

  useLayoutEffect(() => {
    if (hidden || !pendingEnter.current) return;
    pendingEnter.current = false;
    const m = getTucked();
    if (!m || reduceMotion()) return;
    innerRef.current.animate(
      [
        { transform: tucked(m), opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 280, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden]);

  const frame = useMemo(() => ({ minimize: () => onMinimize(id) }), [id, onMinimize]);

  return (
    <Draggable
      nodeRef={shellRef}
      handle=".widget-title"
      cancel="a, button"
      bounds=".home-content"
      disabled={!isDesktop}
    >
      <div ref={shellRef} className={`widget-shell ${className}`} hidden={hidden}>
        <div ref={innerRef}>
          <FrameContext.Provider value={frame}>{children}</FrameContext.Provider>
        </div>
      </div>
    </Draggable>
  );
}