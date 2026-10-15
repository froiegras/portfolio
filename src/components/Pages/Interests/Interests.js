// Interests.js
import { useState } from 'react';
import './interests.css';

const interests = [
  {
    id: 'coding',
    icon: '💻',
    name: 'Coding.exe',
    summary:
      'Making fun Discord bots and scripts that make my life easier.',
    items: [
      { label: 'Folder organizer' },
      { label: 'File renamer' },
      { label: 'Spotify → YouTube Music playlist importer' },
    ],
    link: { text: 'See my projects', page: 'projects' },
  },
  {
    id: 'kpop',
    icon: '🎬',
    name: 'Kpop.mp4',
    summary: 'I listen to anything especially TWICE.',
    items: [
      { label: 'Favorite album', note: 'placeholder' },
      { label: 'Favorite song', note: 'placeholder' },
    ],
  },
  {
    id: 'games',
    icon: '🎮',
    name: 'Video Games.exe',
    summary: 'Mostly co-op and action games.',
    items: [
      { label: 'Monster Hunter World / Wilds' },
      { label: 'Apex Legends' },
      { label: 'Euro Truck Simulator 2' },
    ],
  },
  {
    id: 'sports',
    icon: '🏅',
    name: 'Sports.py',
    summary: 'Frisbee is my favorite, and I casually bike from time to time.',
    items: [
      { label: 'Frisbee', note: 'favorite' },
      { label: 'Biking', note: 'casual' },
    ],
  },
  {
    id: 'hiking',
    icon: '🥾',
    name: 'Hiking.png',
    summary: 'Picked this up quite recently.',
    items: [
      { label: 'Mt. Example', note: '2025' }, // placeholders
      { label: 'Another Trail', note: '2026' },
    ],
  },
];

function Interests({ onNavigate }) {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId((current) => (current === id ? null : id));

  return (
    <div className="interests-list">
      {interests.map(({ id, icon, name, summary, items, link }) => {
        const isOpen = openId === id;
        return (
          <div key={id} className={`interest-item${isOpen ? ' open' : ''}`}>
            <button
              className="interest-header"
              onClick={() => toggle(id)}
              aria-expanded={isOpen}
              aria-controls={`panel-${id}`}
            >
              <span className="interest-chevron" aria-hidden="true">▸</span>
              <span className="interest-icon" aria-hidden="true">{icon}</span>
              <span className="interest-name">{name}</span>
            </button>

            <div id={`panel-${id}`} className="interest-panel">
              <div className="interest-panel-inner">
                <p className="subtext">{summary}</p>
                {items && (
                  <ul className="interest-tree">
                    {items.map(({ label, note }) => (
                      <li key={label}>
                        {label}
                        {note && <span className="interest-note"> {note}</span>}
                      </li>
                    ))}
                  </ul>
                )}
                {link && (
                  <button className="interest-link" onClick={() => onNavigate(link.page)}>
                    {link.text} →
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Interests;