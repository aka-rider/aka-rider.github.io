'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { common, Lang } from '@/i18n';

type ThemeKey = 'light' | 'dark' | 'system';

const NEXT_THEME: Record<ThemeKey, ThemeKey> = {
  light: 'dark',
  dark: 'system',
  system: 'light',
};

const THEME_LABEL_KEY = {
  light: 'themeLight',
  dark: 'themeDark',
  system: 'themeSystem',
} as const satisfies Record<ThemeKey, keyof (typeof common)['en']>;

interface ThemeToggleProps {
  lang: Lang;
  iconSystem: React.ReactNode;
  iconDark: React.ReactNode;
  iconLight: React.ReactNode;
}

export default function ThemeToggle({
  lang,
  iconSystem,
  iconDark,
  iconLight,
}: ThemeToggleProps) {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className='flex items-center justify-end w-max'>
        <div className='flex items-center p-2 rounded-lg'>
          <span className='w-5 h-5' />
        </div>
      </div>
    );
  }

  const currentTheme: ThemeKey =
    theme === 'light' || theme === 'dark' ? theme : 'system';
  const effectiveTheme =
    currentTheme === 'system' ? systemTheme || 'light' : currentTheme;

  const icon =
    currentTheme === 'system'
      ? iconSystem
      : effectiveTheme === 'dark'
        ? iconDark
        : iconLight;

  const strings = common[lang];
  const label = (key: ThemeKey) => strings[THEME_LABEL_KEY[key]];

  const tooltip =
    currentTheme === 'system'
      ? `${label('system')} (${label(effectiveTheme === 'dark' ? 'dark' : 'light')})`
      : label(currentTheme);

  return (
    <div className='flex items-center justify-end w-max'>
      <button
        onClick={() => setTheme(NEXT_THEME[currentTheme])}
        className='flex items-center cursor-pointer p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200'
        title={tooltip}
        aria-label={`${strings.switchTheme}: ${label(NEXT_THEME[currentTheme])}`}
      >
        {icon}
      </button>
    </div>
  );
}
