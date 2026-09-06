import { ReactNode } from 'react';
import { ImForward3 } from 'react-icons/im';

export default function TLDR({
  title,
  children,
}: {
  title?: string;
  children?: ReactNode;
}) {
  if (!children && !title) {
    return (
      <div className='my-6 font-bold flex items-center gap-2'>
        <ImForward3 className='shrink-0' />
        <span>TL;DR</span>
      </div>
    );
  }

  if (!children) {
    return (
      <h3 className='flex items-center gap-2'>
        <ImForward3 className='shrink-0' />
        <span>TL;DR — {title}</span>
      </h3>
    );
  }

  return (
    <div className='my-6 rounded-xl border border-rule bg-code-bg p-6'>
      <div className='mb-4 flex items-center gap-2 font-bold text-lg'>
        <ImForward3 className='shrink-0' />
        <span>TL;DR{title ? ` — ${title}` : ''}</span>
      </div>
      <div className='[&>*:first-child]:mt-0 [&>*:last-child]:mb-0'>
        {children}
      </div>
    </div>
  );
}
