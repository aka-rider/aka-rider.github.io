'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import { common, Lang } from '@/i18n';

interface GiscusProps {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping?: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
  strict?: '0' | '1';
  reactionsEnabled?: '0' | '1';
  emitMetadata?: '0' | '1';
  inputPosition?: 'top' | 'bottom';
  lang: Lang;
}

export default function Giscus({
  repo,
  repoId,
  category,
  categoryId,
  mapping = 'pathname',
  strict = '0',
  reactionsEnabled = '1',
  emitMetadata = '0',
  inputPosition = 'bottom',
  lang,
}: GiscusProps) {
  ReactDOM.prefetchDNS('https://giscus.app');

  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || ready) return;

    const node = wrapperRef.current;
    if (!node) return;

    let isNear = false;
    const tryActivate = () => {
      if (isNear && !document.prerendering) setReady(true);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        isNear = entries.some((entry) => entry.isIntersecting);
        tryActivate();
      },
      { rootMargin: '100% 0px' },
    );
    observer.observe(node);
    document.addEventListener('prerenderingchange', tryActivate);

    return () => {
      observer.disconnect();
      document.removeEventListener('prerenderingchange', tryActivate);
    };
  }, [mounted, ready]);

  const resolvedTheme = theme === 'system' ? systemTheme : theme;
  const giscusTheme = resolvedTheme === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    if (!ready) return;

    const container = containerRef.current;
    if (!container) return;

    const existingScript = container.querySelector('script');
    const existingIframe = container.querySelector('iframe.giscus-frame');
    if (existingScript) existingScript.remove();
    if (existingIframe) existingIframe.remove();

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', mapping);
    script.setAttribute('data-strict', strict);
    script.setAttribute('data-reactions-enabled', reactionsEnabled);
    script.setAttribute('data-emit-metadata', emitMetadata);
    script.setAttribute('data-input-position', inputPosition);
    script.setAttribute('data-theme', giscusTheme);
    script.setAttribute('data-lang', lang);
    script.setAttribute('crossOrigin', 'anonymous');
    script.async = true;

    container.appendChild(script);

    return () => {
      if (container && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [
    ready,
    repo,
    repoId,
    category,
    categoryId,
    mapping,
    strict,
    reactionsEnabled,
    emitMetadata,
    inputPosition,
    giscusTheme,
    lang,
  ]);

  if (!ready) {
    return (
      <div ref={wrapperRef} className='giscus-container mt-8 p-4'>
        <div className='h-32 animate-pulse bg-code-bg rounded-lg' />
        <div className='mt-2 text-center text-sm text-muted'>
          {common[lang].loadingComments}
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className='giscus-container mt-8' />;
}
