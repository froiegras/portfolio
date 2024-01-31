// App.js
import React, { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Education from './components/Education';
import Skills from './components/Skills';
import Work from './components/Work';
import Footer from './components/Footer';

function App() {
  const [selectedComponent, setSelectedComponent] = useState('home');

  const handleNavItemClick = (component) => {
    setSelectedComponent(component);
  };

  return (
    <div>
      <Header />
      <Navigation onNavItemClick = {handleNavItemClick} />
      {selectedComponent === 'home' && <Education />}
      {selectedComponent === 'education' && <Education />}
      {selectedComponent === 'skills' && <Skills />}
      {selectedComponent === 'work' && <Work />}
      <Footer />
    </div>
  );
}

export default App;
