import React, { useState, useRef, useId, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import './Tooltip.css';

const focusVisible = (el) => {
  try {
    return el.matches(':focus-visible');
  } catch {
    return true;
  }
};

export default function Tooltip({ text, children }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const triggerRef = useRef(null);
  const tipRef = useRef(null);
  const lastType = useRef('mouse');
  const id = useId();

  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    if (!triggerRef.current || !tipRef.current) return;
    const t = triggerRef.current.getBoundingClientRect();
    const tip = tipRef.current.getBoundingClientRect();
    const margin = 8;
    const left = Math.max(
      margin,
      Math.min(t.left + t.width / 2 - tip.width / 2, window.innerWidth - tip.width - margin)
    );
    const above = t.top - tip.height - 8;
    setPos({ left, top: above >= margin ? above : t.bottom + 8 });
  }, [open, text]);

  useEffect(() => {
    if (!open) return undefined;
    const close = () => setOpen(false);
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    const onDown = (e) => {
      if (!triggerRef.current?.contains(e.target)) close();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    document.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  if (!text) return <>{children}</>;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="tt-trigger"
        aria-describedby={open ? id : undefined}
        onPointerDown={(e) => { lastType.current = e.pointerType; }}
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') setOpen(true); }}
        onPointerLeave={(e) => { if (e.pointerType === 'mouse') setOpen(false); }}
        onClick={() => { if (lastType.current !== 'mouse') setOpen((o) => !o); }}
        onFocus={(e) => { if (focusVisible(e.currentTarget)) setOpen(true); }}
        onBlur={() => setOpen(false)}
      >
        {children}
      </button>

      {open &&
        createPortal(
          <div
            ref={tipRef}
            id={id}
            role="tooltip"
            className="tt"
            style={pos ? { left: pos.left, top: pos.top } : { left: 0, top: 0, visibility: 'hidden' }}
          >
            {text}
          </div>,
          document.body
        )}
    </>
  );
}