import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './input.css';

// Initialize theme before React renders
const savedTheme = localStorage.getItem('theme-preference');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const shouldUseDark = savedTheme === 'dark' || (savedTheme === null && systemPrefersDark);

if (shouldUseDark) {
  document.body.classList.add('dark');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
