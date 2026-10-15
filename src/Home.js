// App.js
import React, { useState } from 'react';
import Folder from './components/Folder/Folder';
import Navigation from './components/Navigation/Navigation';
import Skills from './components/Pages/Skills/Skills';
import Work from './components/Pages/Work/Work';
import Projects from './components/Pages/Projects/Projects';
import Interests from './components/Pages/Interests/Interests';
import SpotifyWidget from './components/Widget/SpotifyWidget';
import DesktopIcon from './components/DesktopIcon/DesktopIcon';
import './home.css';

function Home() {
  const [selectedComponent, setSelectedComponent] = useState('home');

  const handleNavItemClick = (componentName) => {
    setSelectedComponent(componentName);
  };

  const handleCloseFolder = () => {
    setSelectedComponent('home');
  };

  const pageMap = {
    'interests': { component: <Interests onNavigate={handleNavItemClick} />, title: 'My Interests' },
    'skills': { component: <Skills />, title: 'Skills & Abilities' },
    'work': { component: <Work />, title: 'Work Experience' },
    'projects': { component: <Projects />, title: 'Projects' },
  };

  const renderContent = () => {
    if (selectedComponent === 'home') {
      return (
        <div className='home-content p-8'>
          <h1 className='text-3xl font-bold mb-4'>Hi, issa me Froi</h1>

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
