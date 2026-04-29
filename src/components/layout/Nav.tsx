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
      <nav className='flex flex-row w-full px-4 relative h-14 items-center justify-between'>
        <div className='flex-none flex items-center h-full'>
          <HomeButton lang={lang} />
        </div>

        {children && (
          <div className='flex items-center justify-center flex-1 min-w-0 h-full mx-2 md:mx-4'>
            {children}
          </div>
        )}

        {/* Spacer to balance HomeButton and keep children flawlessly centered */}
        <div className='flex-none w-1 pointer-events-none' aria-hidden='true' />
      </nav>
    </div>
  );
}
