import { useRef } from 'react';
import Draggable from 'react-draggable';
import useIsDesktop from '../../../hooks/useIsDesktop';

export default function DesktopIcon({ label, icon = '📁', onOpen, position, onMove }) {
  const nodeRef = useRef(null);
  const moved = useRef(false);
  const isDesktop = useIsDesktop();

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds=".home-content"
      disabled={!isDesktop}
      defaultPosition={isDesktop && position ? position : { x: 0, y: 0 }}
      onStart={() => { moved.current = false; }}
      onDrag={() => { moved.current = true; }}
      onStop={(e, data) => onMove?.({ x: data.x, y: data.y })}
    >
      <button
        ref={nodeRef}
        className="desktop-icon"
        onClick={() => { if (!moved.current) onOpen(); }}
      >
        <span className="desktop-icon-img">{icon}</span>
        <span>{label}</span>
      </button>
    </Draggable>
  );
}