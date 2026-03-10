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
    <details className='group my-6 w-full overflow-hidden rounded-lg border border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-950'>
      <summary className='flex cursor-pointer items-center font-medium text-slate-900 hover:text-sky-600 dark:text-slate-200 dark:hover:text-sky-400'>
        <VscChevronRight className='mr-2 shrink-0 transition-transform duration-200 group-open:rotate-90' />
        {title}
      </summary>
      <div className='not-prose mt-4 w-full overflow-x-auto text-slate-900 dark:text-slate-300'>
        <div className='prose max-w-none text-[1rem] leading-normal dark:prose-invert prose-p:text-[1rem] prose-pre:text-[0.9rem] prose-p:text-slate-800 dark:prose-p:text-slate-300'>
          {children}
        </div>
      </div>
    </details>
  );
}
