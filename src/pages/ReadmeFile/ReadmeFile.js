// components/ReadmeFile/ReadmeFile.js
import React from 'react';
import { profile } from '../../data/profile';
import './ReadmeFile.css';

// Placeholder text: rewrite it in your own words.
const text = (name) => `Hi, I'm ${name}.

I'm a [what you do] from [where] who likes [one or two interests].

WHAT'S ON THIS COMPUTER
-----------------------
Taskbar   Interests, Skills, Education, Work, Projects
Desktop   Playlists, Photos, this file, and the Recycle Bin
Tray      Widgets for Profile, Spotify and Steam. Click one to minimize or restore it.

TIPS
----
* Drag the desktop icons and widgets around.
* The theme button in the taskbar switches between day and night.
* On a phone, windows open full screen.

GET IN TOUCH
------------
Email: you@example.com
`;

export default function ReadmeFile() {
  return <pre className="textfile">{text(profile.name)}</pre>;
}