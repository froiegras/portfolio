// src/components/Widget/registry.js
import ProfileWidget from './Widget/ProfileWidget';
import SpotifyWidget from './Widget/SpotifyWidget';
import SteamWidget from './Widget/SteamWidget';

export const widgets = [
  { id: 'profile', icon: '👤', label: 'Profile', Component: ProfileWidget },
  { id: 'spotify', icon: '🎵', label: 'Spotify', Component: SpotifyWidget },
  { id: 'steam', icon: '🎮', label: 'Steam', Component: SteamWidget },
];