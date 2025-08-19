import React, { useState, useEffect } from 'react';

const ThemeToggle = ({ onThemeChange }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-preference');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (savedTheme === null && systemPrefersDark);
    
    setIsDark(shouldUseDark);
    if (shouldUseDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, []);

  const handleToggle = (e) => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    
    localStorage.setItem('theme-preference', newTheme ? 'dark' : 'light');
    
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  return (
    <div className="apple-theme-toggle" onClick={handleToggle}>
      <div className={`apple-toggle-track ${isDark ? 'active' : ''}`}>
        <div className={`apple-toggle-thumb ${isDark ? 'active' : ''}`}>
          <div className={`apple-toggle-icon ${isDark ? 'moon' : 'sun'}`}></div>
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;
