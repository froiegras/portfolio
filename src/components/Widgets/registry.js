// src/components/Widget/registry.js
import ProfileWidget from './Widget/ProfileWidget';
import SpotifyWidget from './Widget/SpotifyWidget';
import SteamWidget from './Widget/SteamWidget';
import ObsessionWidget from './Widget/ObsessionWidget';

export const widgets = [
  { id: 'profile', icon: '👤', label: 'Profile', Component: ProfileWidget },
  { id: 'spotify', icon: '🎵', label: 'Spotify', Component: SpotifyWidget },
  { id: 'steam', icon: '🎮', label: 'Steam', Component: SteamWidget },
  { id: 'obsession', icon: '🔁', label: 'On repeat', Component: ObsessionWidget },
];