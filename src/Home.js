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
import SteamWidget from './components/Widget/SteamWidget';
import './Home.css';

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
      <div className="home-content p-8">
        <div className="home-main">
          <h1 className="text-3xl font-bold mb-2">Welcome to My Portfolio</h1>
          <p className="mb-6">Select a section from the navigation to learn more about me.</p>

          <div className="icon-grid mb-8">
            {Object.entries(pageMap).map(([key, { title }]) => (
              <DesktopIcon key={key} label={title} onOpen={() => setSelectedComponent(key)} />
            ))}
          </div>
        </div>

        <aside className="widget-dock" aria-label="Widgets">
          <SpotifyWidget />
          <SteamWidget />
        </aside>
      </div>
    );
  }

    const selectedItem = pageMap[selectedComponent];
    if (selectedItem) {
      return (
        <Folder
          key={selectedComponent}
          originKey={selectedComponent}
          title={selectedItem.title}
          onClose={handleCloseFolder}
        >
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
