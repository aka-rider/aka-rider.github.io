import React from 'react';
import { VscChevronRight } from 'react-icons/vsc';

export default function Spoiler({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className='group my-6 w-full overflow-hidden rounded-lg border border-rule bg-surface px-6 py-4'>
      <summary className='flex cursor-pointer items-center font-medium text-text hover:text-accent'>
        <VscChevronRight className='mr-2 shrink-0 transition-transform duration-200 group-open:rotate-90' />
        {title}
      </summary>
      <div className='mt-4 w-full overflow-x-auto text-text-2'>{children}</div>
    </details>
  );
}
