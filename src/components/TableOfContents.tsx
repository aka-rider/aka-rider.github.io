'use client';

import React, { useEffect, useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';

import clsxm from '@/lib/clsxm';

import UnstyledLink from '@/components/links/UnstyledLink';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  /** CSS selector for the container to extract headings from */
  containerSelector?: string;
  title?: string;
}

/**
 * Auto-generates table of contents from headings in the DOM.
 * Extracts h2-h4 elements with IDs from the specified container.
 */
export default function TableOfContents({
  containerSelector = 'article',
  title = 'Table of Contents',
}: TableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

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

  if (items.length === 0) {
    return null;
  }

  const closeOnMobile = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <nav
      aria-label='Table of contents'
      className='my-8 pl-4 border-l-2 border-slate-200 dark:border-slate-700'
    >
      {/* Header - clickable on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full flex items-center justify-between py-2 md:cursor-default text-left'
        aria-expanded={isOpen}
      >
        <span className='text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400'>
          {title}
        </span>
        <HiChevronDown
          className={clsxm(
            'w-4 h-4 text-slate-400 transition-transform duration-200 md:hidden',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {/* Content - collapsible on mobile, always visible on desktop */}
      <div
        className={clsxm(
          'overflow-hidden transition-all duration-300 ease-out',
          'md:max-h-none md:opacity-100',
          isOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0 md:max-h-none md:opacity-100',
        )}
      >
        <ul className='py-2 text-sm list-none space-y-1'>
          {items.map((item) => (
            <li
              key={item.id}
              style={{ paddingLeft: `${(item.level - 2) * 0.75}rem` }}
            >
              <UnstyledLink
                href={`#${item.id}`}
                onClick={closeOnMobile}
                className='text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors'
              >
                {item.text}
              </UnstyledLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
