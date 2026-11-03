// components/ReadmeFile/ReadmeFile.js
import { profile } from '../../data/profile';
import './ReadmeFile.css';

const text = (name) => `Hi, I'm ${name}.

I'm a software engineer who likes video games, music, and coding (only when it works).

WHAT'S ON THIS COMPUTER
-----------------------
Taskbar   Interests ❤️, Skills 🔧, Work 💼, Projects 👨‍💻
Desktop   Playlists, Photos, this README, and the Recycle Bin
Tray      Widgets for Profile, Spotify and Steam. Click one to minimize or restore it.

TIPS
----
* Drag the desktop icons and widgets around.
* The theme button in the taskbar switches between day and night.
* On a phone, windows open full screen.

GET IN TOUCH
------------
@froidfish
@aluminumfroil
@froiegras
@sigmundfroi
@frenchfrois
`;

export default function ReadmeFile() {
  return <pre className="textfile">{text(profile.name)}</pre>;
}