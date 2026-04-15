'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface ThemeToggleProps {
  iconSystem: React.ReactNode;
  iconDark: React.ReactNode;
  iconLight: React.ReactNode;
}

export default function ThemeToggle({ iconSystem, iconDark, iconLight }: ThemeToggleProps) {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className='flex items-center justify-end w-max'>
        <div className='flex items-center p-2 rounded-lg'>
          <span className='relative inline-flex h-5 w-10 items-center rounded-full bg-slate-300 dark:bg-slate-600'>
            <span className='inline-block h-4 w-4 transform rounded-full bg-white dark:bg-slate-200 translate-x-1' />
          </span>
          <span className='pl-2 w-5 h-5' />
        </div>
      </div>
    );
  }

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
    if (theme === 'system') return iconSystem;
    return getDisplayTheme() === 'dark' ? iconDark : iconLight;
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
        className='flex items-center cursor-pointer p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200'
        title={getTooltip()}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
      >
        <span className='relative inline-flex h-5 w-10 items-center rounded-full bg-slate-300 dark:bg-slate-600 transition-colors duration-200'>
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-slate-200 transition-transform duration-200 ${getDisplayTheme() === 'dark' ? 'translate-x-5' : 'translate-x-1'
              }`}
          />
        </span>
        <span className='pl-2'>
          {getIcon()}
        </span>
      </button>
    </div>
  );
}
