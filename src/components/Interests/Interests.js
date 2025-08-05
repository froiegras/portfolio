// Education.js
import React from 'react';
import './interests.css';

function Interests() {
  return (
    <div className='h-screen bg-[#fdfaf8] text-black p-4'>
      <h1>Interests</h1>
      <ul>
        <li>Programming <p className='subtext'>making fun discord bots or scripts that makes my life easier like folder organizer, file renamer, playlist importer from Spotify to Youtube Music</p></li>
        <li>Kpop! <p className='subtext'>especially TWICE</p></li>
        <li>Video Games <p className='subtext'>Monster Hunter World/Wilds, Apex Legends, Euro Truck Simulator 2 and more</p></li>
        <li>Sports <p className='subtext'>Frisbee is my favorite sport and casually bikes from time to time</p></li>
        <li>Hiking <p className='subtext'>picked this up quite recently</p></li>
      </ul>
    </div>
  );
}

export default Interests;