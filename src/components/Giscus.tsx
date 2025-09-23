'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

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
  lang?: string;
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
  lang = 'en',
}: GiscusProps) {
  const ref = useRef<any>(null);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine the actual theme to use
  const resolvedTheme = theme === 'system' ? systemTheme : theme;
  const giscusTheme = resolvedTheme === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    if (!mounted) return;

    const container = ref.current;
    if (!container) return;

    // Remove any existing giscus iframe and script
    const existingScript = container.querySelector('script');
    const existingIframe = container.querySelector('iframe.giscus-frame');
    if (existingScript) existingScript.remove();
    if (existingIframe) existingIframe.remove();

    // Create and configure the script element
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

    // Cleanup function
    return () => {
      if (container && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [mounted, repo, repoId, category, categoryId, mapping, strict, reactionsEnabled, emitMetadata, inputPosition, giscusTheme, lang]);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="giscus-container mt-8 p-4">
        <div className="h-32 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-lg" />
        <div className="mt-2 text-center text-sm text-neutral-500 dark:text-neutral-400">
          Loading comments...
        </div>
      </div>
    );
  }

  return <div ref={ref} className="giscus-container mt-8" />;
}