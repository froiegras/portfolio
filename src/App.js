// App.js
import React, { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Education from './components/Education';
import Skills from './components/Skills';
import Work from './components/Work';
import Projects from './components/Projects';
import Cover from './components/Cover';
import Footer from './components/Footer';

function App() {
  const [selectedComponent, setSelectedComponent] = useState('projects');

  const handleNavItemClick = (component) => {
    setSelectedComponent(component);
  };

  return (
    <div className='p-5 bg-[#fdfaf8]'>
      <Header />
      <div className="grid grid-cols-5">
        <Navigation onNavItemClick = {handleNavItemClick} />
        <div className='col-span-4'>
        {selectedComponent === 'cover' && <Cover />}
        {selectedComponent === 'skills' && <Skills />}
        {selectedComponent === 'education' && <Education />}
        {selectedComponent === 'work' && <Work />}
        {selectedComponent === 'projects' && <Projects />}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
