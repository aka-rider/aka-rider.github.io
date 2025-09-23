import Link from 'next/link';

import { Blog } from '@/lib/blog/Blog';
import { BlogNode } from '@/lib/blog/types';

import FontIcon from '@/components/FontIcon';

import { Lang } from '@/i18n';

interface BreadcrumbsProps {
  lang: Lang;
  breadcrumbs?: BlogNode[];
}

export default function Breadcrumbs({
  lang,
  breadcrumbs = [],
}: BreadcrumbsProps) {
  const renderCrumbContent = (crumb: BlogNode, index: number, isLast: boolean) => (
    <>
      {index > 0 && (
        <span className='text-neutral-500 dark:text-neutral-400 mr-2'>/</span>
      )}
      {crumb.icon && (
        <FontIcon iconName={crumb.icon} size={16} className='mr-1' />
      )}
      <span className={isLast ? 'truncate max-w-xs' : ''}>{crumb.title}</span>
    </>
  );

  return (
    <div className='border-b border-neutral-300 dark:border-neutral-600 gap-4 flex flex-col md:flex-row'>
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const baseClasses = 'uppercase transition-colors duration-200 p-2 m-0 flex items-center';

        // If it's the last item (current node), render without link and with truncation
        if (isLast) {
          return (
            <div
              key={index}
              className={`${baseClasses} font-bold text-primary-600 dark:text-primary-400 md:border-b-2 border-primary-600 dark:border-primary-400`}
            >
              {renderCrumbContent(crumb, index, isLast)}
            </div>
          );
        }

        // Use Blog.getLink() to generate the proper URL for parent nodes
        const href = Blog.getLink(lang, crumb);

        return (
          <Link
            key={index}
            href={href}
            className={`${baseClasses} cursor-pointer font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400`}
          >
            {renderCrumbContent(crumb, index, isLast)}
          </Link>
        );
      })}
    </div>
  );
}
