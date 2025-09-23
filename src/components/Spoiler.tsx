'use client';

import { useState } from 'react';

import clsxm from '@/lib/clsxm';

import { getTranslations, Lang } from '@/i18n';

interface SpoilerProps {
  title: string;
  preview?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  lang: Lang;
}

export default function Spoiler({
  title,
  preview,
  children,
  defaultOpen = false,
  className,
  lang,
}: SpoilerProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const t = getTranslations(lang);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className={clsxm('', className)}>
      {/* Title - non-clickable */}
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
        {title}
      </h3>

      {/* Content with fade effect when collapsed - clickable when collapsed */}
      <div
        id="spoiler-content"
        className={clsxm(
          'relative transition-all duration-500 ease-in-out',
          isOpen ? 'max-h-none' : 'max-h-64 overflow-hidden cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800/50 rounded-lg transition-colors duration-200'
        )}
        onClick={!isOpen ? handleToggle : undefined}
        onKeyDown={!isOpen ? handleKeyDown : undefined}
        role={!isOpen ? "button" : undefined}
        tabIndex={!isOpen ? 0 : undefined}
        aria-expanded={!isOpen ? isOpen : undefined}
        aria-controls={!isOpen ? "spoiler-content" : undefined}
      >
        <div className={clsxm('', !isOpen && 'relative p-2')}>
          {children}

          {/* Fade overlay when collapsed */}
          {!isOpen && (
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white dark:from-neutral-900 via-white/80 dark:via-neutral-900/80 to-transparent pointer-events-none" />
          )}
        </div>
      </div>

      {/* Show more/less button at the bottom */}
      {!isOpen && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-200 group"
            aria-expanded={isOpen}
            aria-controls="spoiler-content"
          >
            <span>{t('showMore')}</span>
            {preview}
          </button>
        </div>
      )}

      {/* Show less button when expanded */}
      {isOpen && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-200"
            aria-expanded={isOpen}
            aria-controls="spoiler-content"
          >
            <span>{t('showLess')}</span>
            <div className="transform rotate-180">
              {preview}
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
