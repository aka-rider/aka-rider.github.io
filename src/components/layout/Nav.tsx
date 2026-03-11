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
      <nav className='flex flex-row justify-between w-full px-4 relative h-14 items-center'>
        <div className='flex items-center h-full'>
          <HomeButton lang={lang} />
        </div>

        {/* Desktop navigation - hidden on mobile */}
        {/* We use flex-1 to push content, but items-center to align them. */}
        <div className='hidden md:flex items-center justify-center flex-1 h-full mx-4'>
          {children}
        </div>
      </nav>

      {/* Mobile navigation - second tier tab row */}
      {children && (
        <div className='md:hidden w-full border-t border-slate-200/30 dark:border-slate-800/30'>
          {children}
        </div>
      )}
    </div>
  );
}
