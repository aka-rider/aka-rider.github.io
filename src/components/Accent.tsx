import * as React from 'react';

import clsxm from '@/lib/clsxm';

interface AccentProps {
  children: React.ReactNode;
  className?: string; // Allow overrides if necessary
}

export function Accent({ children, className }: AccentProps) {
  return (
    <span className={clsxm(
      "transition-all duration-300",
      "text-sky-600 dark:text-sky-400",
      // glow effect
      "text-shadow-[0_0_20px_var(--tw-shadow-color)] text-shadow-sky-200/50 dark:text-shadow-sky-400",
      "[&_*]:text-inherit [&_*]:text-shadow-inherit",
      className
    )}>
      {children}
    </span>
  );
}