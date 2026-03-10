'use client';

import React, { useEffect, useState } from 'react';
import { HiListBullet, HiXMark } from 'react-icons/hi2';

import UnstyledLink from '@/components/links/UnstyledLink';

import { common, Lang } from '@/i18n';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Desktop (2xl+): sticky right sidebar with progressive disclosure — h2 always visible,
 * h3/h4 revealed only for the currently active section.
 * Mobile/tablet: FAB at bottom-right that opens a bottom-sheet TOC.
 */
export default function TableOfContents({
  containerSelector = 'article',
  lang,
}: {
  containerSelector?: string;
  lang: Lang;
}) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeH2Id, setActiveH2Id] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Extract headings from DOM
  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const headings = container.querySelectorAll('h2[id], h3[id], h4[id]');
    const tocItems: TocItem[] = [];

    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1), 10);
      tocItems.push({
        id: heading.id,
        text: heading.textContent || '',
        level,
      });
    });

    setItems(tocItems);
  }, [containerSelector]);

  // Track which h2 section the user is reading
  useEffect(() => {
    if (items.length === 0) return;

    const h2Items = items.filter((i) => i.level === 2);
    if (h2Items.length === 0) return;

    const firstId = h2Items[0]!.id;

    const handleScroll = () => {
      const scrollY = window.scrollY + 120;
      let current: string | null = firstId;

      for (const item of h2Items) {
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= scrollY) {
          current = item.id;
        }
      }

      setActiveH2Id(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  // Lock body scroll & handle Escape when sheet is open
  useEffect(() => {
    if (!sheetOpen) return;

    document.body.style.overflow = 'hidden';
    const handleKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setSheetOpen(false);
    };
    document.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKey);
    };
  }, [sheetOpen]);

  if (items.length === 0) return null;

  const title = common[lang].tableOfContents;

  // Progressive disclosure: h2 always shown, h3/h4 only under the active h2
  const desktopItems = (() => {
    const result: TocItem[] = [];
    let currentH2: string | null = null;

    for (const item of items) {
      if (item.level === 2) {
        currentH2 = item.id;
        result.push(item);
      } else if (currentH2 === activeH2Id) {
        result.push(item);
      }
    }

    return result;
  })();

  return (
    <>
      {/* Desktop (2xl+): sticky sidebar to the right of article */}
      <aside
        className='hidden 2xl:block absolute top-0 left-full h-full ml-8 w-44'
        aria-label={title}
      >
        <nav className='sticky top-20'>
          <span className='text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500'>
            {title}
          </span>
          <ul className='mt-3 list-none space-y-1.5 text-[0.8125rem] leading-snug'>
            {desktopItems.map((item) => (
              <li
                key={item.id}
                style={item.level > 2 ? { paddingLeft: `${(item.level - 2) * 0.75}rem` } : undefined}
              >
                <UnstyledLink
                  href={`#${item.id}`}
                  className={
                    item.level === 2 && item.id === activeH2Id
                      ? 'text-sky-600 dark:text-sky-400 font-medium transition-colors'
                      : 'text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-slate-200 transition-colors'
                  }
                >
                  {item.text}
                </UnstyledLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile / tablet: FAB + bottom sheet */}
      <div className='2xl:hidden'>
        {/* Floating action button */}
        <button
          onClick={() => setSheetOpen(true)}
          className='fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 dark:bg-slate-200 dark:text-slate-900'
          aria-label={title}
        >
          <HiListBullet className='h-5 w-5' />
        </button>

        {/* Bottom sheet */}
        {sheetOpen && (
          <div
            className='fixed inset-0 z-50 flex flex-col justify-end'
            role='dialog'
            aria-label={title}
            aria-modal='true'
          >
            {/* Backdrop */}
            <div
              className='absolute inset-0 bg-black/40 backdrop-blur-sm'
              onClick={() => setSheetOpen(false)}
              aria-hidden='true'
            />

            {/* Sheet content */}
            <div className='relative max-h-[70vh] overflow-y-auto rounded-t-2xl bg-white px-6 pb-8 pt-6 shadow-2xl animate-slide-up dark:bg-slate-900'>
              {/* Decorative drag handle */}
              <div className='absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-slate-300 dark:bg-slate-600' />

              <div className='mb-4 flex items-center justify-between'>
                <span className='text-sm font-medium text-slate-900 dark:text-slate-50'>
                  {title}
                </span>
                <button
                  onClick={() => setSheetOpen(false)}
                  className='rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300'
                  aria-label='Close'
                >
                  <HiXMark className='h-5 w-5' />
                </button>
              </div>

              <ul className='list-none space-y-2 text-base'>
                {items.map((item) => (
                  <li
                    key={item.id}
                    style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}
                  >
                    <UnstyledLink
                      href={`#${item.id}`}
                      onClick={() => setSheetOpen(false)}
                      className='block py-1 text-slate-700 hover:text-sky-600 dark:text-slate-400 dark:hover:text-slate-200 transition-colors'
                    >
                      {item.text}
                    </UnstyledLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
