import React from 'react';
import { NAV_ITEMS } from '../constants';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ activeTab, onTabChange, onUploadScroll }) => {
  // Always show the Upload PDF button, and handle logic in App.jsx
  return (
    <nav className="apple-nav">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="apple-nav-brand overflow-hidden" 
            style={{
              opacity: 1,
              transform: 'translateY(0px) rotate(0deg) scale(1)',
              filter: 'blur(0px)',
              transition: 'opacity 0.8s 0.8s, transform 0.8s 0.8s, filter 0.8s 0.8s',
              animation: 'slideIn 1.2s ease-out'
            }}
          >
            PDF Insights
          </div>
          {/* Navigation items and theme toggle */}
          <div className="flex items-center space-x-2 ">
            {/* Navigation Items */}
            <div className="flex space-x-2">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    
                      onTabChange(item.id);
                    
                  }}
                  className={`apple-nav-item whitespace-nowrap flex-shrink-0 ${
                    activeTab === item.id ? 'active' : ''
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
