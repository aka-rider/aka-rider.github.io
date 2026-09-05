'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { common, Lang } from '@/i18n';

type CopyLabel = 'copy' | 'copied' | 'copyFailed';

export default function CodeBlock({
  lang,
  language,
  children,
}: {
  lang: Lang;
  language: string;
  children: React.ReactNode;
}) {
  const figureRef = useRef<HTMLElement>(null);
  const [label, setLabel] = useState<CopyLabel>('copy');
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleCopy = useCallback(() => {
    const pre = figureRef.current?.querySelector('pre');
    const text = pre?.textContent ?? '';
    navigator.clipboard
      .writeText(text)
      .then(() => setLabel('copied'))
      .catch(() => setLabel('copyFailed'));
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setLabel('copy'), 1500);
  }, []);

  return (
    <figure ref={figureRef} className='code'>
      <figcaption>
        <span className='lang'>{language}</span>
        <button
          type='button'
          onClick={handleCopy}
          className={label === 'copy' ? 'copy' : 'copy ok'}
        >
          {common[lang][label]}
        </button>
      </figcaption>
      {children}
    </figure>
  );
}
