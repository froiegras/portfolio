import Interests from './Interests/Interests';
import Skills from './Skills/Skills';
import Work from './Work/Work';
import Projects from './Projects/Projects';
import Playlists from './Playlists/Playlists';
import Photos from './Photos/Photos';
import ReadmeFile from './ReadmeFile/ReadmeFile';
import RecycleBin from './RecycleBin/RecycleBin';

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