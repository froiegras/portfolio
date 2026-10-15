// components/Widget/Widget.js
import './widget.css';

export default function Widget({ title, children, className = '' }) {
  return (
    <div className={`widget ${className}`}>
      <div className="widget-title">{title}</div>
      <div className="widget-body">{children}</div>
    </div>
  );
}