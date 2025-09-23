'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { HiOutlineCog } from 'react-icons/hi2';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getDisplayTheme = () => {
    if (theme === 'system') {
      return systemTheme || 'light';
    }
    return theme || 'light';
  };

  const getIcon = () => {
    if (theme === 'system') {
      return <HiOutlineCog className='w-5 h-5' />;
    }
    return getDisplayTheme() === 'dark' ? (
      <MdOutlineDarkMode className='w-5 h-5' />
    ) : (
      <MdOutlineLightMode className='w-5 h-5' />
    );
  };

  const getTooltip = () => {
    if (theme === 'system') {
      return `System (${systemTheme || 'light'})`;
    }
    return theme === 'dark' ? 'Dark' : 'Light';
  };

  return (
    <div className='flex items-center justify-end w-max'>
      <button
        onClick={cycleTheme}
        className='flex items-center cursor-pointer p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200'
        title={getTooltip()}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
      >
        <span className='relative inline-flex h-5 w-10 items-center rounded-full bg-neutral-300 dark:bg-neutral-600 transition-colors duration-200'>
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-neutral-200 transition-transform duration-200 ${getDisplayTheme() === 'dark' ? 'translate-x-5' : 'translate-x-1'
              }`}
          />
        </span>
        <span className='pl-2' title={getTooltip()}>
          {getIcon()}
        </span>
      </button>
    </div>
  );
}
