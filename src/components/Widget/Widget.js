// components/Widget/Widget.js
import './widget.css';

export default function Widget({ title, children, className = '' }) {
  return (
    <div className={`rounded-lg border shadow-md bg-white/90 overflow-hidden ${className}`}>
      <div className="px-3 py-1 text-xs font-semibold bg-gray-200 border-b">
        {title}
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}