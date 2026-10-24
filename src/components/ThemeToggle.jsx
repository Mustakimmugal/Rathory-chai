import React from 'react';
import { useApp } from '../context/AppContext';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';
import './ThemeToggle.css';

export default function ThemeToggle({ showLabel = false }) {
  const { state, setTheme } = useApp();
  const currentTheme = state.theme;

  const cycleTheme = () => {
    if (currentTheme === 'light') setTheme('dark');
    else if (currentTheme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <div className="theme-toggle-container">
      <button
        onClick={cycleTheme}
        className="theme-toggle-btn"
        aria-label={`Current theme: ${currentTheme}. Click to cycle.`}
        title={`Theme: ${currentTheme.toUpperCase()} (Click to toggle)`}
      >
        <div className={`theme-icon-wrap ${state.resolvedTheme}`}>
          {currentTheme === 'light' && <FiSun className="theme-icon sun" />}
          {currentTheme === 'dark' && <FiMoon className="theme-icon moon" />}
          {currentTheme === 'system' && <FiMonitor className="theme-icon system" />}
        </div>
        {showLabel && <span className="theme-label-text">{currentTheme}</span>}
      </button>

      <div className="theme-pill-dropdown">
        <button
          onClick={() => setTheme('light')}
          className={`theme-chip ${currentTheme === 'light' ? 'active' : ''}`}
          title="Light Mode"
        >
          <FiSun />
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={`theme-chip ${currentTheme === 'dark' ? 'active' : ''}`}
          title="Dark Mode"
        >
          <FiMoon />
        </button>
        <button
          onClick={() => setTheme('system')}
          className={`theme-chip ${currentTheme === 'system' ? 'active' : ''}`}
          title="System Auto"
        >
          <FiMonitor />
        </button>
      </div>
    </div>
  );
}
