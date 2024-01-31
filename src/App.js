// App.js
import React from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Education from './components/Education';
import Skills from './components/Skills';
import Work from './components/Work';
import Footer from './components/Footer';

function App() {
  return (
    <div>
      <Header />
      <Navigation />
      <br />
      <Education />
      <br />
      <Skills />
      <br />
      <Work />
      <Footer />
    </div>
  );
}

export default App;
