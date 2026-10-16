// Widget.js
import { useRef } from 'react';
import Draggable from 'react-draggable';
import useIsDesktop from '../../hooks/useIsDesktop';
import './Widget.css';

export default function Widget({ title, children, className = '' }) {
  const nodeRef = useRef(null);
  const isDesktop = useIsDesktop();

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".widget-title"
      cancel="a, button"
      bounds=".home-content"
      disabled={!isDesktop}
    >
      <div ref={nodeRef} className={`widget ${className}`}>
        <div className="widget-title">{title}</div>
        <div className="widget-body">{children}</div>
      </div>
    </Draggable>
  );
}