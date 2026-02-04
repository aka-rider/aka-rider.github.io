import { FiChevronRight } from 'react-icons/fi';

import { Blog } from '@/lib/blog/Blog';
import { BLOG_NAV_CONTAINER, getBlogNavItemClasses } from '@/lib/blog/styles';
import { BlogNode } from '@/lib/blog/types';
import clsx from '@/lib/clsxm';

import UnstyledLink from '@/components/links/UnstyledLink';

import { Lang } from '@/i18n';

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
      className={clsx(BLOG_NAV_CONTAINER, 'gap-2 flex-wrap items-center px-0 py-0')}
    >
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const baseClasses = getBlogNavItemClasses(isLast);

        const content = (
          <>
            {isLast && index > 0 && (
              <FiChevronRight className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" aria-hidden="true" />
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
