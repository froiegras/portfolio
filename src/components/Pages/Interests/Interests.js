// Interests.js
import { useState } from 'react';
import './Interests.css';
import SteamTopGames from './SteamTopGames';
// import Gallery from '../../Gallery/Gallery';
import SpotifyTopTracks from './SpotifyTopTracks';
import GithubRepoList from './GithubRepoList';

const P = process.env.PUBLIC_URL + '/assets/gallery';

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
    github: true,
    link: { text: 'See my projects', page: 'projects' },
  },
  {
    id: 'kpop',
    icon: '🎬',
    name: 'Kpop.mp4',
    summary: 'I like music especially TWICE.',
    items: [
      { label: 'TWICE', note: 'my favorite group' },     // fallback if Spotify returns nothing
    ],
    spotify: [
      { key: 'twice', caption: 'Most played TWICE songs (past year)' },
      { key: 'kpop', caption: 'Most played K-pop overall (past year)' },
    ],
  },
  {
    id: 'games',
    icon: '🎮',
    name: 'Video Games.exe',
    summary: 'I like video games',
    items: [
      { label: 'Monster Hunter World / Wilds' },
      { label: 'Apex Legends' },
      { label: 'Euro Truck Simulator 2' },
    ],
    steam: true,
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
      { label: 'Mt. Example', note: '2025' },
      { label: 'Another Trail', note: '2026' },
    ],
    photos: [
      { src: `${P}/hiking/mt-example.webp`, alt: 'View from the summit of Mt. Example', caption: 'Mt. Example, 2025' },
      { src: `${P}/hiking/trail-2.webp`, alt: 'Forest trail in the morning', caption: 'Another Trail, 2026' },
      { src: `${P}/hiking/mt-example.webp`, alt: 'Summit view', caption: 'Mt. Example, 2025' },
      {
        type: 'video',
        src: `${P}/hiking/ridge-walk.mp4`,
        poster: `${P}/hiking/ridge-walk-poster.webp`,
        alt: 'Walking along a ridge at sunrise',
        caption: 'Ridge walk',
      },
    ],
  },
];

function Interests({ onNavigate }) {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId((current) => (current === id ? null : id));

  return (
    <div className="interests-list">
      {interests.map(({ id, icon, name, summary, items, link, photos, steam, spotify, github }) => {
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
                {steam && <SteamTopGames fallback={items} />}

                {spotify?.map(({ key, caption }, i) => (
                  <SpotifyTopTracks
                    key={key}
                    genreKey={key}
                    caption={caption}
                    fallback={i === 0 ? items : []}
                  />
                ))}

                {github && (
                  <GithubRepoList caption="Recently active repos on my GitHub" fallback={items} />
                )}

                {!steam && !spotify && !github && items && (
                  <ul className="interest-tree">
                    {items.map(({ label, note }) => (
                      <li key={label}>
                        {label}
                        {note && <span className="interest-note"> {note}</span>}
                      </li>
                    ))}
                  </ul>
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