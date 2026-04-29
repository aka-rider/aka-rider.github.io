import { FiChevronRight } from 'react-icons/fi';

import { Blog } from '@/lib/blog/Blog';
import { BlogNode } from '@/lib/blog/types';
import clsx from '@/lib/clsxm';

import { getNavItemClasses } from '@/components/layout/NavigationPrimitives';
import UnstyledLink from '@/components/links/UnstyledLink';

import { Lang } from '@/i18n';

// Inline shared constants from styles.ts to avoid dependency
const BLOG_NAV_CONTAINER = 'border-b border-slate-200 dark:border-slate-800 flex flex-row h-14 items-center gap-1 md:gap-2 px-4 md:px-0 py-0 overflow-x-auto whitespace-nowrap scrollbar-hide ' +
  '[mask-image:linear-gradient(to_right,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_16px,rgba(0,0,0,1)_calc(100%-16px),rgba(0,0,0,0)_100%)] ' +
  'md:[mask-image:none]';

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
      aria-label="Breadcrumb"
      className={BLOG_NAV_CONTAINER}
    >
      {breadcrumbs.map((crumb, index) => {
        const isActive = index === resolvedActive;
        const baseClasses = getNavItemClasses(isActive);

        const content = (
          <>
            {index > 0 && (
              <FiChevronRight className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" aria-hidden="true" />
            )}
            <span className={clsx(isActive && 'truncate max-w-[200px] md:max-w-xs')}>{crumb.title}</span>
          </>
        );

        if (isActive) {
          return (
            <div key={index} className={baseClasses} aria-current="page">
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
