import * as React from 'react';

export default function FigCaption({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <figcaption className='text-sm text-slate-600 dark:text-slate-400 text-center mt-3 [text-wrap:balance]'>
      {children}
    </figcaption>
  );
}
