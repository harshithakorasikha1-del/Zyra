// components/ThemeToggle.js
import React, { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className='p-2 rounded-lg dark:hover:bg-gray-700 hover:bg-gray-100 transition'
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? (
        <FiSun size={20} className='text-yellow-500' />
      ) : (
        <FiMoon size={20} className='text-gray-700' />
      )}
    </button>
  );
};

export default ThemeToggle;
