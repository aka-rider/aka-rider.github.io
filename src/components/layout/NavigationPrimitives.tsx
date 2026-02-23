import * as React from 'react';

import clsx from '@/lib/clsxm';

// Shared container styles
// The border is applied to the container, creating the underline for the nav bar
export const NAV_CONTAINER_CLASSES = 'flex gap-4 flex-col md:flex-row h-full items-center border-b border-slate-200 dark:border-slate-800';

// Unified item styles for both buttons (tabs) and links (breadcrumbs)
// h-full fills the container height
// relative top-[1px] pushes the item down so its active border overlaps the container border
export const getNavItemClasses = (isActive: boolean) =>
  clsx(
    'uppercase text-sm transition-all duration-200 px-3 flex items-center h-full relative top-[1px]',
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
