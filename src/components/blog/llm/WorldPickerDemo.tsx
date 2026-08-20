'use client';

import { useState } from 'react';

import { Chip } from '@/components/blog/llm/Chip';
import GuessGate from '@/components/blog/llm/GuessGate';
import { ProbabilityBar } from '@/components/blog/llm/ProbabilityBar';
import { worldPickerStrings } from '@/components/blog/llm/strings/worldPicker';

import type { Lang } from '@/i18n';

type FramingId = 'review' | 'casual' | 'legal';

const FRAMING_IDS: readonly FramingId[] = ['review', 'casual', 'legal'];

const DISTRIBUTIONS: Record<
  FramingId,
  ReadonlyArray<readonly [string, number]>
> = {
  review: [
    ['fails', 34],
    ['duplicates', 22],
    ['looks', 16],
    ['should', 15],
    ['is', 13],
  ],
  casual: [
    ['kinda', 30],
    ['sucks', 22],
    ['is', 18],
    ['works', 16],
    ['looks', 14],
  ],
  legal: [
    ['shall', 42],
    ['herein', 20],
    ['is', 16],
    ['constitutes', 12],
    ['remains', 10],
  ],
};

const FRAMING_BUTTON_CLASSES =
  'font-mono text-sm rounded border px-3 py-1.5 border-violet-700/60 dark:border-violet-400/60 bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-400 focus-visible:outline-2 focus-visible:outline-violet-700 dark:focus-visible:outline-violet-400 focus-visible:outline-offset-2 transition-opacity motion-reduce:transition-none';

const LABEL_CLASSES =
  'block font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1';

const BAR_COLUMNS = '7.5rem 1fr 3rem';

export default function WorldPickerDemo({ lang }: { lang: Lang }) {
  const strings = worldPickerStrings[lang];
  const [framing, setFraming] = useState<FramingId>('review');
  const rows = DISTRIBUTIONS[framing];

  return (
    <div className='rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 my-6'>
      <GuessGate lang={lang} guess={strings.guess}>
        <div
          role='group'
          aria-label={strings.framingGroupAria}
          className='flex flex-wrap gap-2 mb-4'
        >
          {FRAMING_IDS.map((id) => {
            const selected = id === framing;
            return (
              <button
                key={id}
                type='button'
                aria-pressed={selected}
                onClick={() => setFraming(id)}
                className={`${FRAMING_BUTTON_CLASSES} ${
                  selected
                    ? 'border-2 font-semibold'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                {strings.framings[id].label}
              </button>
            );
          })}
        </div>

        <span className={LABEL_CLASSES}>{strings.continuationLabel}</span>
        <div className='rounded bg-slate-50 dark:bg-slate-950/60 p-4 font-mono text-sm whitespace-pre-wrap mb-4'>
          <span className='text-violet-700 dark:text-violet-400'>
            {strings.framings[framing].text}
          </span>
          <span className='text-amber-700 dark:text-amber-400'>
            {strings.continuation}
          </span>
          <span
            aria-hidden='true'
            className='inline-block w-[0.6em] h-[1.1em] align-text-bottom bg-cyan-700/50 dark:bg-cyan-400/50'
          />
        </div>

        <span className={LABEL_CLASSES}>{strings.barsLabel}</span>
        <div role='group' aria-label={strings.barsAria} className='my-3'>
          {rows.map(([token, pct]) => (
            <ProbabilityBar
              key={token}
              columns={BAR_COLUMNS}
              label={
                <span className='min-w-0 overflow-hidden'>
                  <Chip variant='tok'>{token}</Chip>
                </span>
              }
              percent={pct}
              valueText={`${pct}%`}
            />
          ))}
        </div>

        <div
          aria-live='polite'
          className='font-mono text-xs text-slate-500 dark:text-slate-400 my-3'
        >
          {strings.framings[framing].label} — {strings.readout}
        </div>

        <div className='font-mono text-xs text-slate-500 dark:text-slate-400 border-t border-dashed border-slate-300 dark:border-slate-600 pt-2.5 mt-4'>
          {strings.honesty}
        </div>
      </GuessGate>
    </div>
  );
}
