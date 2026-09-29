'use client';

import { animToggleStrings } from '@/components/blog/llm/strings/animToggle';

import type { Lang } from '@/i18n';

const TOGGLE_BUTTON_CLASSES =
  'block mx-auto mt-2 font-mono text-xs rounded border px-2 py-1 min-h-6 text-muted border-slate-300 dark:border-slate-600 focus-visible:outline-2 focus-visible:outline-cyan-700 dark:focus-visible:outline-cyan-400 focus-visible:outline-offset-2';

export function AnimToggle({
  lang,
  paused,
  onToggle,
}: {
  lang: Lang;
  paused: boolean;
  onToggle: () => void;
}) {
  const strings = animToggleStrings[lang];
  return (
    <button
      type='button'
      aria-pressed={paused}
      onClick={onToggle}
      className={TOGGLE_BUTTON_CLASSES}
    >
      {paused ? strings.play : strings.pause}
    </button>
  );
}
