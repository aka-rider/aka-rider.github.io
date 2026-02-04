import clsx from '@/lib/clsxm';

// Centering shared navigation styles to enforce a consistent look and feel across different blog components
export const BLOG_NAV_CONTAINER = 'border-b border-slate-200 dark:border-slate-800 flex';

export const getBlogNavItemClasses = (isActive: boolean) =>
  clsx(
    'uppercase text-sm transition-colors duration-200 p-2 flex items-center bg-transparent border-none',
    isActive
      ? 'text-sky-600 dark:text-sky-400 md:border-b-2 border-sky-600 dark:border-sky-400 font-bold'
      : 'text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 font-medium'
  );