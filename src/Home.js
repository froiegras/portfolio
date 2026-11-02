// App.js
import { useState, useCallback, Suspense, lazy } from 'react';

import Folder from './components/Folder/Folder';
import Navigation from './components/Navigation/Navigation';
import DesktopIcon from './components/DesktopIcon/DesktopIcon';
import BootScreen from './components/BootScreen/BootScreen';
import WidgetFrame from './components/Widget/WidgetFrame';

import { pages } from './pages';
import { widgets } from './components/Widget/registry';
import { desktopItems } from './data/desktop';
import hasWebGL from './utils/webgl';

import './Home.css';

const Room = lazy(() => import('./components/Room/Room'));

function shouldShowRoom() {
  try {
    if (new URLSearchParams(window.location.search).has('room')) return true;
    if (navigator.connection?.saveData) return false;
    if (sessionStorage.getItem('entered') === '1') return false;
  } catch {
  }
  return hasWebGL();
}

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
  const [minimized, setMinimized] = useState(() => new Set());
  const [phase, setPhase] = useState(() => (shouldShowRoom() ? 'room' : 'desktop'));

  const handleEnter = useCallback(() => {
  try {
    sessionStorage.setItem('entered', '1');
  } catch {
  }
  setPhase('desktop');
}, []);

  const setWidgetMinimized = useCallback((id, value) => {
    setMinimized((prev) => {
      const next = new Set(prev);
      if (value) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const handleMinimizeWidget = useCallback((id) => setWidgetMinimized(id, true), [setWidgetMinimized]);

  const handleWidgetClick = (id) => {
    if (selectedComponent !== 'home') {
      setSelectedComponent('home');
      setWidgetMinimized(id, false);
      return;
    }
    setWidgetMinimized(id, !minimized.has(id));
  };

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

  const renderContent = () => {
  if (selectedComponent === 'home') {
    return (
      <div className="home-content p-2">
        <div className="home-main">
          <h1 className="text-3xl font-bold mb-2">Hello |˶˙ᵕ˙ )ﾉﾞit's me Froi</h1>

          <div className="icon-grid mb-8">
            {desktopItems.map(({ id, label, icon }) => (
              <DesktopIcon key={id} label={label} icon={icon} onOpen={() => setSelectedComponent(id)} />
            ))}
          </div>
        </div>

        <aside className="widget-dock" aria-label="Widgets">
          {widgets.map(({ id, Component }) => (
            <WidgetFrame
              key={id}
              id={id}
              minimized={minimized.has(id)}
              onMinimize={handleMinimizeWidget}
            >
              <Component />
            </WidgetFrame>
          ))}
        </aside>
      </div>
    );
  }
    const page = pages[selectedComponent];
    if (page) {
      const { Component, title } = page;
      return (
        <Folder
          key={selectedComponent}
          originKey={selectedComponent}
          title={title}
          onClose={handleCloseFolder}
        >
          <Component onNavigate={handleNavItemClick} />
        </Folder>
      );
    }

    const selectedItem = pages[selectedComponent];
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

  if (phase === 'room') {
    return (
      <Suspense fallback={<div className="room" />}>
        <Room onEnter={handleEnter} />
      </Suspense>
    );
  }

  return (
    <>
      {booting && <BootScreen onDone={handleBootDone} />}
      <div className="app-shell desktop-enter">
        <main className="app-main">{renderContent()}</main>
        <Navigation
          onNavItemClick={handleNavItemClick}
          current={selectedComponent}
          minimizedWidgets={minimized}
          onWidgetClick={handleWidgetClick}
        />
      </div>
    </>
  );
}

export default Home;
