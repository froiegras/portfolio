// Interests.js
import React, { useState } from 'react';
import Gallery from '../../Gallery/Gallery';
import SteamTopGames from './SteamTopGames';
import SpotifyTopTracks from './SpotifyTopTracks';
import GithubRepoList from './GithubRepoList';
import ActivityLog from './ActivityLog';
import { trails } from '../../../data/trails';
import { generated as rides } from '../../../data/rides.generated';
import './Interests.css';

const interests = [
  {
    id: 'coding',
    icon: '💻',
    name: 'Coding.exe',
    summary: 'Making fun Discord bots and scripts that make my life easier.',
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
    icon: '🍭',
    name: 'Kpop.mp4',
    summary: 'Especially TWICE.',
    items: [{ label: 'TWICE', note: 'my favorite group' }],
    spotify: [
      { key: 'twice', caption: 'Most played TWICE songs (past year)' },
      { key: 'kpop', caption: 'Most played K-pop overall (past year)' },
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
    steam: true,
  },
  {
    id: 'sports',
    icon: '🏅',
    name: 'Sports.json',
    summary: 'Anything outdoors and active.',
    children: [
      {
        id: 'frisbee',
        icon: '🥏',
        name: 'Frisbee.py',
        summary: 'My favorite sport.',
        items: [
          { label: 'Teams', note: 'UFO (CSA-Makati), MUFC (Pick-ups)' },
          { label: 'Position', note: 'Cutter' },
        ],
        gallery: 'frisbee',
      },
      {
        id: 'biking',
        icon: '🚴',
        name: 'Biking.exe',
        summary:'Casual rides from time to time.',
        log: { rows: rides, label: 'Ride', noun: 'rides' },
        gallery: 'biking',
      },
      {
        id: 'hiking',
        icon: '🥾',
        name: 'Hiking.png',
        summary: 'I like waking up early to walk up a mountain /s',
        log: { rows: trails, label: 'Trail', noun: 'hikes', albums: 'hiking' },
        gallery: 'hiking',
      },
    ],
  },
];

function InterestPanel({ item, onNavigate }) {
  const { summary, items, steam, spotify, github, log, gallery, link, children } = item;

  return (
    <>
      {summary && <p className="subtext">{summary}</p>}

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

      {log && <ActivityLog {...log} />}
      {gallery && <Gallery folder={gallery} />}

      {link &&
        (link.page ? (
          <button className="interest-link" onClick={() => onNavigate(link.page)}>
            {link.text} →
          </button>
        ) : (
          <a className="interest-link" href={link.href} target="_blank" rel="noreferrer">
            {link.text} ↗
          </a>
        ))}

      {children && <Accordion items={children} onNavigate={onNavigate} nested />}
    </>
  );
}

function Accordion({ items, onNavigate, nested = false }) {
  const [openId, setOpenId] = useState(null);
  const toggle = (id) => setOpenId((current) => (current === id ? null : id));

  return (
    <div className={`interests-list${nested ? ' nested' : ''}`}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className={`interest-item${isOpen ? ' open' : ''}`}>
            <button
              className="interest-header"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={`panel-${item.id}`}
            >
              <span className="interest-chevron" aria-hidden="true">▸</span>
              <span className="interest-icon" aria-hidden="true">{item.icon}</span>
              <span className="interest-name">{item.name}</span>
            </button>

            <div id={`panel-${item.id}`} className="interest-panel">
              <div className="interest-panel-inner">
                <InterestPanel item={item} onNavigate={onNavigate} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Interests({ onNavigate }) {
  return <Accordion items={interests} onNavigate={onNavigate} />;
}

export default Interests;