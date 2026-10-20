// src/components/Widget/registry.js
import ProfileWidget from './ProfileWidget';
import SpotifyWidget from './SpotifyWidget';
import SteamWidget from './SteamWidget';

export const widgets = [
  { id: 'profile', icon: '👤', label: 'Profile', Component: ProfileWidget },
  { id: 'spotify', icon: '🎵', label: 'Spotify', Component: SpotifyWidget },
  { id: 'steam', icon: '🎮', label: 'Steam', Component: SteamWidget },
];