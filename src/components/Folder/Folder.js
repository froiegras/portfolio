// Folder.js
import React from 'react';
import './folder.css';

function Folder({ children, title, onClose }) {
  return (
    <div className='window bg-white border-2 border-gray-300 rounded-lg shadow-lg'>
      <div className='topbar bg-gray-100 flex items-center justify-between p-2 border-b border-gray-300 rounded-t-lg'>
        <div className='text-sm font-medium text-gray-700'>
          {title || 'Folder'}
        </div>
        <div className='flex items-center space-x-1'>
          <button className='topbar-buttons w-6 h-6 bg-yellow-400 hover:bg-yellow-500'>
            -
          </button>
          <button className='topbar-buttons w-6 h-6 bg-green-400 hover:bg-green-500'>
            +
          </button>
          <button
            className='topbar-buttons close w-6 h-6 bg-red-400 hover:bg-red-500'
            onClick={onClose}
          >
            X
          </button>
        </div>
      </div>
      <div className='folder-content p-4'>
        {children}
      </div>
    </div>
  );
}

export default Folder;