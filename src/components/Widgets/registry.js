// src/components/Widget/registry.js
import ProfileWidget from './Widget/ProfileWidget';
import SpotifyWidget from './Widget/SpotifyWidget';
import SteamWidget from './Widget/SteamWidget';
import ObsessionWidget from './Widget/ObsessionWidget';

export const widgets = [
  { id: 'profile', icon: 'user', label: 'Profile', Component: ProfileWidget },
  { id: 'obsession', icon: 'refresh', label: 'On repeat', Component: ObsessionWidget },
  { id: 'spotify', icon: 'music', label: 'Spotify', Component: SpotifyWidget },
  { id: 'steam', icon: 'controller', label: 'Steam', Component: SteamWidget },
];