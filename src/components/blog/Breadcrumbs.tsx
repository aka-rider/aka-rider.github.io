import { FiChevronRight } from 'react-icons/fi';

import { Blog } from '@/lib/blog/Blog';
import { BlogNode } from '@/lib/blog/types';
import clsx from '@/lib/clsxm';

import { getNavItemClasses } from '@/components/layout/NavigationPrimitives';
import UnstyledLink from '@/components/links/UnstyledLink';

import { Lang } from '@/i18n';

// Inline shared constants from styles.ts to avoid dependency
const BLOG_NAV_CONTAINER = 'border-b border-slate-200 dark:border-slate-800 flex h-14 items-center gap-2 flex-wrap px-0 py-0';

interface BreadcrumbsProps {
  lang: Lang;
  breadcrumbs?: BlogNode[];
}

export default function Breadcrumbs({
  lang,
  breadcrumbs = [],
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={BLOG_NAV_CONTAINER}
    >
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const baseClasses = getNavItemClasses(isLast);

        const content = (
          <>
            {isLast && index > 0 && (
              <FiChevronRight className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0 relative top-[1px]" aria-hidden="true" />
            )}
            <span className={clsx(isLast && 'truncate max-w-[200px] md:max-w-xs')}>{crumb.title}</span>
          </>
        );

        if (isLast) {
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
