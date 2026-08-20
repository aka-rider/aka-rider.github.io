import { FiChevronRight } from 'react-icons/fi';

import { Blog } from '@/lib/blog/Blog';
import { BlogNode } from '@/lib/blog/types';
import clsx from '@/lib/clsxm';

import { NAV_CONTAINER_CLASSES } from '@/components/layout/NavigationPrimitives';
import UnstyledLink from '@/components/links/UnstyledLink';

import { common, Lang } from '@/i18n';

interface BreadcrumbsProps {
  lang: Lang;
  breadcrumbs?: BlogNode[];
  /** Index of the "current page" breadcrumb (rendered as non-clickable). -1 means none are active. */
  activeIndex?: number;
}

export default function Breadcrumbs({
  lang,
  breadcrumbs = [],
  activeIndex,
}: BreadcrumbsProps) {
  const resolvedActive = activeIndex ?? breadcrumbs.length - 1;

  return (
    <nav
      aria-label={common[lang].breadcrumb}
      className={clsx(NAV_CONTAINER_CLASSES, 'gap-1 md:gap-2')}
    >
      {breadcrumbs.map((crumb, index) => {
        const isActive = index === resolvedActive;
        const baseClasses = clsx(
          'text-sm flex items-center h-full shrink-0',
          isActive
            ? 'text-slate-900 dark:text-slate-100 font-medium'
            : 'text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200',
        );

        const content = (
          <>
            {index > 0 && (
              <FiChevronRight
                className='w-4 h-4 text-slate-400 mr-2 flex-shrink-0'
                aria-hidden='true'
              />
            )}
            <span
              className={clsx(isActive && 'truncate max-w-[200px] md:max-w-xs')}
            >
              {crumb.title}
            </span>
          </>
        );

        if (isActive) {
          return (
            <div key={index} className={baseClasses} aria-current='page'>
              {content}
            </div>
          );
        }

        return (
          <UnstyledLink
            key={index}
            href={Blog.getLink(lang, crumb)}
            className={clsx(baseClasses, 'cursor-pointer')}
          >
            {content}
          </UnstyledLink>
        );
      })}
    </nav>
  );
}
