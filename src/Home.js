// App.js
import React, { useState } from 'react';
import Folder from './components/Folder/Folder';
import Navigation from './components/Navigation/Navigation';
import Education from './components/Education/Education';
import Skills from './components/Skills/Skills';
import Work from './components/Work/Work';
import Projects from './components/Projects/Projects';
import Interests from './components/Interests/Interests';
import SpotifyWidget from './components/Widget/SpotifyWidget';
import DesktopIcon from './components/DesktopIcon/DesktopIcon';
import './home.css';

function Home() {
  const [selectedComponent, setSelectedComponent] = useState('home');

  const pageMap = {
    'interests': { component: <Interests />, title: 'My Interests' },
    'skills': { component: <Skills />, title: 'Skills & Abilities' },
    'education': { component: <Education />, title: 'Educational Background' },
    'work': { component: <Work />, title: 'Work Experience' },
    'projects': { component: <Projects />, title: 'Notable Projects' }
  };

  const handleNavItemClick = (componentName) => {
    setSelectedComponent(componentName);
  };

  const handleCloseFolder = () => {
    setSelectedComponent('home');
  };

  const renderContent = () => {
    if (selectedComponent === 'home') {
      return (
        <div className='home-content p-8'>
          <h1 className='text-3xl font-bold mb-4'>Welcome to My Portfolio</h1>
          <p>Select a section from the navigation below to learn more about me.</p>

          <div className="icon-grid mb-8">
            {Object.entries(pageMap).map(([key, { title }]) => (
              <DesktopIcon key={key} label={title} onOpen={() => setSelectedComponent(key)} />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <SpotifyWidget />
          </div>
        </div>
      );
    }

    const selectedItem = pageMap[selectedComponent];
    if (selectedItem) {
      return (
        <Folder title={selectedItem.title} onClose={handleCloseFolder}>
          {selectedItem.component}
        </Folder>
      );
    }

    return null;
  };

  return (
    <div className="app-shell">
      <main className="app-main">{renderContent()}</main>
      <Navigation onNavItemClick={handleNavItemClick} current={selectedComponent} />
    </div>
  );
}

export default Home;
