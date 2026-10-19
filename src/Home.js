// App.js
import React, { useState, useCallback  } from 'react';
import Folder from './components/Folder/Folder';
import Navigation from './components/Navigation/Navigation';
import Skills from './components/Pages/Skills/Skills';
import Work from './components/Pages/Work/Work';
import Projects from './components/Pages/Projects/Projects';
import Interests from './components/Pages/Interests/Interests';
import SpotifyWidget from './components/Widget/SpotifyWidget';
import DesktopIcon from './components/DesktopIcon/DesktopIcon';
import SteamWidget from './components/Widget/SteamWidget';
import BootScreen from './components/BootScreen/BootScreen';
import './Home.css';

function shouldBoot() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return sessionStorage.getItem('booted') !== '1';
  } catch {
    return true;
  }
}

function Home() {
  const [selectedComponent, setSelectedComponent] = useState('home');
  const [booting, setBooting] = useState(shouldBoot);

  const handleBootDone = useCallback(() => {
  try {
    sessionStorage.setItem('booted', '1');
  } catch {
    // ignore: it will just play again next time
  }
  setBooting(false);
}, []);

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
      <div className="home-content p-2">
        <div className="home-main">
          <h1 className="text-3xl font-bold mb-2">Hello |˶˙ᵕ˙ )ﾉﾞit's me Froi</h1>

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
    <>
      {booting && <BootScreen onDone={handleBootDone} />}
      <div className="app-shell">
        <main className="app-main">{renderContent()}</main>
        <Navigation onNavItemClick={handleNavItemClick} current={selectedComponent} />
      </div>
    </>
  );
}

export default Home;
