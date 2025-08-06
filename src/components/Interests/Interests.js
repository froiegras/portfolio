// Education.js
import React from 'react';
import './interests.css';

function Interests() {
  return (
    <div className='h-auto text-black p-4'>
      <ul className='interests-list'>
        {/*
          TODO: Add icons next to "file names"
          Possible idea: Add tooltip like hovering actual files in file explorer,
          change values to Category?: Sports, may be subject to change.
        */}
        {/* TODO: Redirect to Projects page*/}
        <li className='interests-text'>Coding.exe
          {/* <p className='subtext'>making fun discord bots or scripts that makes my life easier like folder organizer, file renamer, playlist importer from Spotify to Youtube Music</p> */}
        </li>
        {/* TODO: Redirect to Spotify profile?*/}
        <li className='interests-text'>Kpop.mp4
          {/* <p className='subtext'>especially TWICE</p> */}
        </li>
        {/* TODO: Redirect to Steam profile?*/}
        <li className='interests-text'>Video Games.exe
          {/* <p className='subtext'>Monster Hunter World/Wilds, Apex Legends, Euro Truck Simulator 2 and more</p> */}
        </li>
        {/* TODO: Slow dropdown list that looks like directory into sports I played*/}
        <li className='interests-text'>Sports.py
          {/* <p className='subtext'>Frisbee is my favorite sport and casually bikes from time to time</p> */}
        </li>
        {/* TODO: Slow dropdown list that looks like directory into hikes I've been*/}
        <li className='interests-text'>Hiking.txt
          {/* <p className='subtext'>picked this up quite recently</p> */}
        </li>
      </ul>
    </div>
  );
}

export default Interests;