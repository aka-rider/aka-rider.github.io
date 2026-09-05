'use client';

import { useTheme } from 'next-themes';
import { FiMoon, FiSun } from 'react-icons/fi';

import { common, Lang } from '@/i18n';

export default function ThemeToggle({ lang }: { lang: Lang }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type='button'
      className='ibtn'
      aria-label={common[lang].switchTheme}
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <FiMoon className='moon' />
      <FiSun className='sun' />
    </button>

  );
}
