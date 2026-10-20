import { useContext } from 'react';
import { FrameContext } from './FrameContext';
import './Widget.css';

export default function Widget({ title, children, className = '' }) {
  const frame = useContext(FrameContext);

  return (
    <div className={`widget ${className}`}>
      <div className="widget-title">
        <span>{title}</span>
        {frame && (
          <button
            className="widget-min"
            onClick={frame.minimize}
            aria-label="Minimize"
            title="Minimize"
          >
            –
          </button>
        )}
      </div>
      <div className="widget-body">{children}</div>
    </div>
  );
}