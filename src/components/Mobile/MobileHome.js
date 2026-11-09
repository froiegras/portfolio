import ThemeToggle from '../Desktop/ThemeToggle/ThemeToggle';
import { widgets } from '../Widgets/registry';
import { desktopItems } from '../../data/desktop';

// widgets listed together share one slide and are stacked; the ids must match registry.js
const SLIDES = [
  ['profile'],
  ['obsession', 'spotify', 'steam'],
];

function buildSlides() {
  const byId = new Map(widgets.map((w) => [w.id, w]));
  const used = new Set();

  const slides = SLIDES
    .map((ids) => ids.map((id) => byId.get(id)).filter(Boolean))
    .filter((group) => group.length > 0);

  slides.forEach((group) => group.forEach((w) => used.add(w.id)));
  widgets.filter((w) => !used.has(w.id)).forEach((w) => slides.push([w]));
  return slides;
}

const slides = buildSlides();

export default function MobileHome({ onOpen }) {
  return (
    <div className="m-home">
      <header className="m-home-head">
        <h1 className="m-home-title">Welcome to My Portfolio</h1>
        <ThemeToggle />
      </header>

      <section className="m-widgets" aria-label="Widgets">
        {slides.map((group) => (
          <div
            key={group.map((w) => w.id).join('+')}
            className={`m-slide${group.length > 1 ? ' m-stack' : ''}`}
          >
            {group.map(({ id, Component }) => (
              <div key={id} className="m-widget-card">
                <Component />
              </div>
            ))}
          </div>
        ))}
      </section>

      <ul className="m-apps">
        {desktopItems.map(({ id, label, icon }) => (
          <li key={id}>
            <button className="m-app-icon" onClick={() => onOpen(id)}>
              <span className="m-app-icon-img" aria-hidden="true">{icon}</span>
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}