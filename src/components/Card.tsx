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
        'p-6 border border-neutral-200 dark:border-neutral-700 shadow-xs transition-colors duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800',
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
