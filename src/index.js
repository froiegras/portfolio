// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './styles/tailwind.css'; // Import Tailwind CSS styles
import Home from './Home';

ReactDOM.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
  document.getElementById('root')
);