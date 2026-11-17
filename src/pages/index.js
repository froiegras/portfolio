import Interests from './Interests/Interests';
import Skills from './Skills/Skills';
import Projects from './Projects/Projects';
import Playlists from './Playlists/Playlists';
import Photos from './Photos/Photos';
import ReadmeFile from './ReadmeFile/ReadmeFile';
import RecycleBin from './RecycleBin/RecycleBin';
import Resume from './Resume/Resume';

export const pages = {
  interests: { Component: Interests, title: 'My Interests' },
  skills: { Component: Skills, title: 'Skills & Abilities' },
  resume: { Component: Resume, title: 'Resume.pdf' },
  projects: { Component: Projects, title: 'Notable Projects' },
  playlists: { Component: Playlists, title: 'Playlists' },
  photos: { Component: Photos, title: 'Photos' },
  readme: { Component: ReadmeFile, title: 'README.txt' },
  trash: { Component: RecycleBin, title: 'Recycle Bin' },
};