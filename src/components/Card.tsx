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
        'p-6 rounded-lg',
        'border border-transparent',
        'transition-all duration-200 ease-out',
        'hover:border-neutral-200 dark:hover:border-neutral-700',
        'hover:bg-neutral-50 dark:hover:bg-neutral-800/50',
        'hover:shadow-md hover:-translate-y-0.5',
        className,
      )}
      {...rest}
    >
      {title && (
        <h3 className='text-xl font-semibold mb-3 text-neutral-900 dark:text-neutral-100'>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
