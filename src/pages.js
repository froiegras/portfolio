import Interests from './components/Pages/Interests/Interests';
import Skills from './components/Pages/Skills/Skills';
import Work from './components/Pages/Work/Work';
import Projects from './components/Pages/Projects/Projects';
import Playlists from './components/Playlists/Playlists';
import Photos from './components/Photos/Photos';
import ReadmeFile from './components/ReadmeFile/ReadmeFile';
import RecycleBin from './components/RecycleBin/RecycleBin';

export const pages = {
  interests: { Component: Interests, title: 'My Interests' },
  skills: { Component: Skills, title: 'Skills & Abilities' },
  work: { Component: Work, title: 'Work Experience' },
  projects: { Component: Projects, title: 'Notable Projects' },
  playlists: { Component: Playlists, title: 'Playlists' },
  photos: { Component: Photos, title: 'Photos' },
  readme: { Component: ReadmeFile, title: 'README.txt' },
  trash: { Component: RecycleBin, title: 'Recycle Bin' },
};