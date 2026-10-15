// components/DesktopIcon/DesktopIcon.js
import { useRef } from 'react';
import Draggable from 'react-draggable';
import useIsDesktop from '../../hooks/useIsDesktop';

export default function DesktopIcon({ label, onOpen }) {
  const nodeRef = useRef(null);
  const moved = useRef(false);
  const isDesktop = useIsDesktop();

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds=".home-content"
      disabled={!isDesktop}
      onStart={() => { moved.current = false; }}
      onDrag={() => { moved.current = true; }}
    >
      <button
        ref={nodeRef}
        className="desktop-icon"
        onClick={() => { if (!moved.current) onOpen(); }}
      >
        <span className="desktop-icon-img">📁</span>
        <span>{label}</span>
      </button>
    </Draggable>
  );
}