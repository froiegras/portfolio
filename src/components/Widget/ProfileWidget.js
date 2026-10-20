import {
  FaInstagram,
  FaGithub,
  FaDiscord,
  FaSteam,
  FaSpotify,
  FaYoutube,
} from 'react-icons/fa6';
import Widget from '../Widget/Widget';
import { profile } from '../../data/profile';
import './ProfileWidget.css';

const ICONS = {
  instagram: FaInstagram,
  github: FaGithub,
  discord: FaDiscord,
  steam: FaSteam,
  spotify: FaSpotify,
  youtube: FaYoutube,
};

function ageFrom(year, month) {
  const now = new Date();
  return now.getFullYear() - year - (now.getMonth() + 1 < month ? 1 : 0);
}

export default function ProfileWidget({ className = '' }) {
  const { name, avatar, tagline, birthYear, birthMonth, details = [], socials = [] } = profile;

  const rows = [
    ...(birthYear ? [{ label: 'Age', value: ageFrom(birthYear, birthMonth || 1) }] : []),
    ...details,
  ];

  return (
    <Widget title="👤 Profile" className={className}>
      <div className="profile-head">
        <div className="profile-avatar">
          {avatar?.startsWith('/') ? (
            <img src={avatar} alt="" />
          ) : (
            <span aria-hidden="true">{avatar}</span>
          )}
        </div>
        <div>
          <p className="profile-name">{name}</p>
          {tagline && <p className="profile-tagline">{tagline}</p>}
        </div>
      </div>

      {rows.length > 0 && (
        <dl className="profile-details">
          {rows.map(({ label, value }) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {socials.length > 0 && (
        <ul className="profile-socials">
          {socials.map(({ id, label, url }) => {
            const Icon = ICONS[id];
            if (!Icon) return null;
            return (
              <li key={id}>
                <a href={url} target="_blank" rel="noreferrer" aria-label={label} title={label}>
                  <Icon aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </Widget>
  );
}