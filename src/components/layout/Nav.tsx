'use client';

import React from 'react';

import HomeButton from '@/components/HomeButton';

import { Lang } from '@/i18n';

interface NavProps {
  lang: Lang;
  children?: React.ReactNode;
}

export default function Nav({ lang, children }: NavProps) {
  return (
    <div
      className='sticky top-0 left-0 w-full z-50 transition-colors duration-300 bg-white/70 dark:bg-slate-950/70 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-800/50'
    >
      <nav className='flex flex-row w-full px-4 relative h-14 items-center'>
        <div className='flex-none flex items-center h-full mr-2 md:mr-4'>
          <HomeButton lang={lang} />
        </div>

        {children && (
          <div className='flex items-center flex-1 h-full overflow-x-auto no-scrollbar'>
            {children}
          </div>
        )}
      </nav>
    </div>
  );
}
