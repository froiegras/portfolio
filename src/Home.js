// App.js
import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Navigation from './components/Navigation/Navigation';
import Education from './components/Education/Education';
import Skills from './components/Skills/Skills';
import Work from './components/Work/Work';
import Projects from './components/Projects/Projects';
import Interests from './components/Interests/Interests';

function Home() {
  const [selectedComponent, setSelectedComponent] = useState('home');

  const handleNavItemClick = (component) => {
    setSelectedComponent(component);
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); // Show loader for 1.5s
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className='p-5 bg-[#fdfaf8] h-screen flex items-center justify-center'>
        <h1>Welcome to my portfolio!</h1>
      </div>
    );
  }

    return (
      <div className='p-5 bg-[#fdfaf8]'>
      <Header />
      <div className="grid grid-cols-5">
        <Navigation onNavItemClick = {handleNavItemClick} />
        <div className='col-span-4'>
        {selectedComponent === 'home'}
        {selectedComponent === 'Interests' && <Interests />}
        {selectedComponent === 'Skills' && <Skills />}
        {selectedComponent === 'Education' && <Education />}
        {selectedComponent === 'Work' && <Work />}
        {selectedComponent === 'Projects' && <Projects />}
        </div>
      </div>
    </div>
    );
}

export default Home;
