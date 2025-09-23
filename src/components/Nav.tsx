'use client';

import React, { useState } from 'react';

import HomeButton from '@/components/HomeButton';
import Social from '@/components/Social';

import { Lang } from '@/i18n';

interface NavProps {
  lang: Lang;
  children?: React.ReactNode;
}

export default function Nav({ lang, children }: NavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Clone children and pass mobile-specific props if it's a SectionNavigation component
  const cloneChildrenWithProps = (children: React.ReactNode) => {
    return React.Children.map(children, (child) => {
      if (
        React.isValidElement(child) &&
        child.type &&
        (child.type as any).name === 'SectionNavigation'
      ) {
        return React.cloneElement(child, {
          onSectionClick: closeMobileMenu,
        } as any);
      }
      return child;
    });
  };

  return (
    <div className='sticky top-0 left-0 w-full z-50 bg-neutral-50 dark:bg-neutral-900'>
      <nav className='flex flex-row justify-between items-center w-full p-4 relative'>
        <div className='flex items-center'>
          <HomeButton lang={lang} />
        </div>

        {/* Desktop navigation - hidden on mobile */}
        <div className='hidden md:flex items-center justify-center flex-1'>
          {cloneChildrenWithProps(children)}
        </div>

        <div className='flex items-center gap-3'>
          <Social />

          {/* Mobile hamburger button - only show if there are children */}
          {children && (
            <button
              className='flex md:hidden flex-col justify-center items-center w-10 h-10 p-2 border border-neutral-300 dark:border-neutral-600 rounded bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label='Toggle mobile menu'
            >
              <div
                className={`w-6 h-1 bg-neutral-700 dark:bg-neutral-300 rounded transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : 'mb-1'}`}
              ></div>
              <div
                className={`w-6 h-1 bg-neutral-700 dark:bg-neutral-300 rounded transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'mb-1'}`}
              ></div>
              <div
                className={`w-6 h-1 bg-neutral-700 dark:bg-neutral-300 rounded transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
              ></div>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && children && (
        <div className='md:hidden absolute top-full left-0 w-full bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-300 dark:border-neutral-600 z-40 shadow-lg'>
          <div className='p-4'>{cloneChildrenWithProps(children)}</div>
        </div>
      )}
    </div>
  );
}
