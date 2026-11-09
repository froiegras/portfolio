const DOCK = [
  { key: 'interests', icon: '⭐', label: 'Interests' },
  { key: 'skills', icon: '🛠️', label: 'Skills' },
  { key: 'work', icon: '💼', label: 'Work' },
  { key: 'projects', icon: '🚀', label: 'Projects' },
];

export default function MobileDock({ current, onOpen, onHome }) {
  return (
    <nav className="m-dock" aria-label="Main">
      {DOCK.map(({ key, icon, label }) => {
        const active = current === key;
        return (
          <button
            key={key}
            className={`m-dock-item${active ? ' active' : ''}`}
            onClick={() => (active ? onHome() : onOpen(key))}
            aria-current={active ? 'page' : undefined}
          >
            <span className="m-dock-icon" aria-hidden="true">{icon}</span>
            <span className="m-dock-label">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}