import * as React from 'react';

import clsx from '@/lib/clsxm';

// Shared container styles
export const NAV_CONTAINER_CLASSES =
  'flex gap-2 flex-row h-14 md:h-full items-center ' +
  'overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide touch-pan-x snap-x snap-mandatory px-4 md:px-0 py-0 ' +
  '[mask-image:linear-gradient(to_right,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_16px,rgba(0,0,0,1)_calc(100%-16px),rgba(0,0,0,0)_100%)] ' +
  'md:[mask-image:none]';

// Unified item styles for both buttons (tabs) and links (breadcrumbs)
export const getNavItemClasses = (isActive: boolean) =>
  clsx(
    'uppercase text-sm transition-all duration-200 px-3 py-0 flex items-center h-full shrink-0 snap-start',
    'cursor-pointer m-0 border-b-2',
    isActive
      ? 'text-sky-600 dark:text-sky-400 border-sky-600 dark:border-sky-400 font-bold'
      : 'text-slate-700 dark:text-slate-300 border-transparent hover:text-sky-600 dark:hover:text-sky-400 font-medium'
  );

interface NavigationItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive: boolean;
  label: string;
}

export function NavigationItem({ isActive, label, className, ...props }: NavigationItemProps) {
  return (
    <button
      type='button'
      className={clsx(getNavItemClasses(isActive), className)}
      aria-current={isActive ? 'true' : undefined}
      {...props}
    >
      {label}
    </button>
  );
}
