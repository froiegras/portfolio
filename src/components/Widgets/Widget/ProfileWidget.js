import {
  FaInstagram,
  FaGithub,
  FaDiscord,
  FaSteam,
  FaSpotify,
  FaYoutube,
} from 'react-icons/fa6';
import Widget from './Widget';
import Tooltip from '../../Shared/Tooltip/Tooltip';
import { profile } from '../../../data/profile';
import './ProfileWidget.css';
import Icon from '../../Shared/Icons/Icons';

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
    <Widget title={<><Icon name="user" /> Profile</>} className={className}>
      <div className="profile-head">
        <div className="profile-avatar">
          {avatar?.startsWith('/') ? (
            <img src={avatar} alt="" />
          ) : (
            <Icon name={avatar} size="1.25rem" />
          )}
        </div>
        <div>
          <p className="profile-name">{name}</p>
          {tagline && <p className="profile-tagline">{tagline}</p>}
        </div>
      </div>

      {rows.length > 0 && (
        <dl className="profile-details">
          {rows.map(({ label, value, hint }) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>
                <Tooltip text={hint}>{value}</Tooltip>
              </dd>
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