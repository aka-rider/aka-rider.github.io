'use client';

import { useState } from 'react';

import {
  CHIP_INTERACTIVE_CLASSES,
  CHIP_SELECTED_CLASSES,
  chipClasses,
} from '@/components/blog/llm/Chip';
import { fill } from '@/components/blog/llm/format';
import { guessGateStrings } from '@/components/blog/llm/strings/guessGate';

import type { Lang } from '@/i18n';

export type Guess = {
  readonly question: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly payoff: string;
};

const OPTION_CLASSES = chipClasses(
  'tok',
  CHIP_INTERACTIVE_CLASSES,
  'disabled:cursor-default disabled:opacity-70',
);

const CORRECT_OPTION_CLASSES =
  'outline-2 outline-cyan-700 dark:outline-cyan-400 outline-offset-2';

const SKIP_LINK_CLASSES =
  'font-mono text-sm text-slate-500 dark:text-slate-400 underline focus-visible:outline-2 focus-visible:outline-cyan-700 dark:focus-visible:outline-cyan-400 focus-visible:outline-offset-2 cursor-pointer disabled:cursor-default disabled:no-underline disabled:opacity-70';

type GuessGateProps = {
  lang: Lang;
  guess: Guess;
  onReveal?: () => void;
  children: React.ReactNode;
};

export default function GuessGate({
  lang,
  guess,
  onReveal,
  children,
}: GuessGateProps) {
  const strings = guessGateStrings[lang];
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const reveal = (choice: number | null) => {
    onReveal?.();
    setPicked(choice);
    setRevealed(true);
  };

  const prefix =
    picked === null
      ? strings.skippedPrefix
      : fill(strings.guessedPrefix, { guess: guess.options[picked] ?? '' });

  return (
    <div className='mb-4'>
      <div className='font-mono text-sm text-slate-500 dark:text-slate-400 mb-2'>
        {guess.question}
      </div>
      <div
        role='group'
        aria-label={guess.question}
        className='flex flex-wrap items-center gap-1.5'
      >
        {guess.options.map((option, i) => (
          <button
            key={option}
            type='button'
            disabled={revealed}
            aria-pressed={revealed && i === picked}
            onClick={() => reveal(i)}
            className={`${OPTION_CLASSES} ${
              revealed && i === picked ? CHIP_SELECTED_CLASSES : ''
            } ${
              revealed && i === guess.correctIndex ? CORRECT_OPTION_CLASSES : ''
            }`}
          >
            {option}
          </button>
        ))}
        <button
          type='button'
          disabled={revealed}
          onClick={() => reveal(null)}
          className={SKIP_LINK_CLASSES}
        >
          {strings.skip}
        </button>
      </div>
      <div aria-live='polite' className='font-mono text-sm mt-2'>
        {revealed ? (
          <span className='text-slate-700 dark:text-slate-300'>
            {prefix}
            {guess.payoff}
          </span>
        ) : null}
      </div>
      {revealed ? (
        <div className='transition-opacity duration-300 motion-reduce:transition-none opacity-100 starting:opacity-0'>
          {children}
        </div>
      ) : null}
    </div>
  );
}
