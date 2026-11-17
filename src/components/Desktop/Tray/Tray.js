import { widgets } from '../../Widgets/registry';
import Icon from '../../Shared/Icons/Icons';
import './Tray.css';

export default function Tray({ minimized, onWidgetClick }) {
  return (
    <ul className="tray" aria-label="Widgets">
      {widgets.map(({ id, icon, label }) => {
        const isMin = minimized.has(id);
        return (
          <li key={id}>
            <button
              className={`tray-icon${isMin ? ' minimized' : ''}`}
              data-tray-id={id}
              onClick={() => onWidgetClick(id)}
              aria-label={`${label} widget`}
              aria-pressed={!isMin}
              title={`${label}: click to ${isMin ? 'restore' : 'minimize'}`}
            >
              <Icon name={icon} size="1rem" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}