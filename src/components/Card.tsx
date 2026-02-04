import React from 'react';

import clsxm from '@/lib/clsxm';

interface CardProps extends React.ComponentPropsWithoutRef<'div'> {
  title?: string;
  children: React.ReactNode;
}

export default function Card({
  title,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={clsxm(
        'p-4 rounded-lg',
        'border border-transparent',
        'transition-all duration-200 ease-out',
        'hover:border-slate-200 dark:hover:border-slate-700',
        'hover:bg-white dark:hover:bg-slate-800/50',
        'hover:shadow-md hover:-translate-y-0.5',
        className,
      )}
      {...rest}
    >
      {title && (
        <h3 className='text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100'>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
