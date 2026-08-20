import React from 'react';
import { HiOutlineCog } from 'react-icons/hi2';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';

import HomeButton from '@/components/HomeButton';
import LangSwitcher from '@/components/LangSwitcher';
import ThemeToggle from '@/components/ThemeToggle';

import { Lang } from '@/i18n';

interface NavProps {
  lang: Lang;
  children?: React.ReactNode;
}

export default function Nav({ lang, children }: NavProps) {
  return (
    <div className='sticky top-0 left-0 w-full z-50 transition-colors duration-300 bg-white/70 dark:bg-slate-950/70 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-800/50'>
      <nav className='flex flex-row w-full px-4 relative h-14 items-center justify-between'>
        <div className='flex-none flex items-center h-full'>
          <HomeButton lang={lang} />
        </div>

        {children && (
          <div className='flex items-center justify-center flex-1 min-w-0 h-full mx-2 md:mx-4'>
            {children}
          </div>
        )}

        <div className='flex-none flex items-center gap-1 md:gap-3 h-full'>
          <LangSwitcher currentLang={lang} />
          <ThemeToggle
            lang={lang}
            iconSystem={<HiOutlineCog className='w-5 h-5' />}
            iconDark={<MdOutlineDarkMode className='w-5 h-5' />}
            iconLight={<MdOutlineLightMode className='w-5 h-5' />}
          />
        </div>
      </nav>
    </div>
  );
}
