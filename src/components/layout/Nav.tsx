'use client';

import React, { useEffect, useRef, useState } from 'react';

import HomeButton from '@/components/HomeButton';

import { Lang } from '@/i18n';

interface NavProps {
  lang: Lang;
  children?: React.ReactNode;
}

export default function Nav({ lang, children }: NavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Close menu on outside click
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

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
    <div className='sticky top-0 left-0 w-full z-50 bg-white dark:bg-slate-950'>
      <nav className='flex flex-row justify-between items-center w-full px-4 py-3 relative'>
        <div className='flex items-center'>
          <HomeButton lang={lang} />
        </div>

        {/* Desktop navigation - hidden on mobile */}
        <div className='hidden md:flex items-center justify-center flex-1'>
          {cloneChildrenWithProps(children)}
        </div>

        <div className='flex items-center gap-3'>
          {/* Mobile hamburger button - only show if there are children */}
          {children && (
            <button
              ref={buttonRef}
              className='flex md:hidden flex-col justify-center items-center w-10 h-10 p-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label='Toggle mobile menu'
              aria-expanded={isMobileMenuOpen}
            >
              <div
                className={`w-6 h-1 bg-slate-700 dark:bg-slate-300 rounded transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : 'mb-1'}`}
              ></div>
              <div
                className={`w-6 h-1 bg-slate-700 dark:bg-slate-300 rounded transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'mb-1'}`}
              ></div>
              <div
                className={`w-6 h-1 bg-slate-700 dark:bg-slate-300 rounded transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
              ></div>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile menu dropdown with slide animation */}
      {children && (
        <div
          ref={menuRef}
          className={`md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 z-40 shadow-lg overflow-hidden transition-all duration-300 ease-out ${isMobileMenuOpen
            ? 'max-h-96 opacity-100'
            : 'max-h-0 opacity-0 border-b-0'
            }`}
        >
          <div className='p-4'>{cloneChildrenWithProps(children)}</div>
        </div>
      )}
    </div>
  );
}
