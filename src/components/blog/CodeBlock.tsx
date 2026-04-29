'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

export default function CodeBlock({ children, ...props }: React.ComponentProps<'figure'>) {
  const figureRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState('');

  useEffect(() => {
    const code = figureRef.current?.querySelector('code');
    setLanguage(code?.getAttribute('data-language') || '');
  }, []);

  const handleCopy = useCallback(() => {
    const pre = figureRef.current?.querySelector('pre');
    if (!pre) return;
    const text = pre.textContent || '';
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <figure ref={figureRef} {...props} className='relative group'>
      {children}
      <div className='absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
        {language && (
          <span className='text-xs text-slate-400 dark:text-slate-500 select-none'>
            {language}
          </span>
        )}
        <button
          onClick={handleCopy}
          className='p-1.5 rounded bg-slate-700/60 hover:bg-slate-700/90 text-slate-300 transition-colors'
          aria-label='Copy code'
          type='button'
        >
          {copied ? (
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='w-4 h-4'>
              <path fillRule='evenodd' d='M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z' clipRule='evenodd' />
            </svg>
          ) : (
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='w-4 h-4'>
              <path d='M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z' />
              <path d='M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z' />
            </svg>
          )}
        </button>
      </div>
    </figure>
  );
}
