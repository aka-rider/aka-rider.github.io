'use client';

import { useState } from 'react';

import { TokenChip } from '@/components/blog/llm/Chip';
import GuessGate from '@/components/blog/llm/GuessGate';
import { ProbabilityBar } from '@/components/blog/llm/ProbabilityBar';
import { worldPickerStrings } from '@/components/blog/llm/strings/worldPicker';

import type { Lang } from '@/i18n';

type FramingId = 'travel' | 'vegas' | 'minecraft';

const FRAMING_IDS: readonly FramingId[] = ['travel', 'vegas', 'minecraft'];

export const WORLD_PICKER_DISTRIBUTIONS: Record<
  FramingId,
  ReadonlyArray<readonly [string, number]>
> = {
  travel: [
    [' Paris', 52],
    [' France', 18],
    [' the', 14],
    [' a', 10],
    [' central', 6],
  ],
  vegas: [
    [' Las', 46],
    [' the', 20],
    [' a', 16],
    [' Nevada', 10],
    [' downtown', 8],
  ],
  minecraft: [
    [' my', 44],
    [' the', 22],
    [' a', 18],
    [' your', 10],
    [' spawn', 6],
  ],
};

const FRAMING_BUTTON_CLASSES =
  'font-mono text-sm rounded border px-3 py-1.5 border-violet-700/60 dark:border-violet-400/60 bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-400 focus-visible:outline-2 focus-visible:outline-violet-700 dark:focus-visible:outline-violet-400 focus-visible:outline-offset-2 transition-opacity motion-reduce:transition-none';

const LABEL_CLASSES =
  'block font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1';

const BAR_COLUMNS_CLASS = 'sm:grid-cols-[7.5rem_minmax(0,1fr)_3rem]';

export default function WorldPickerDemo({ lang }: { lang: Lang }) {
  const strings = worldPickerStrings[lang];
  const [framing, setFraming] = useState<FramingId>('travel');
  const rows = WORLD_PICKER_DISTRIBUTIONS[framing];

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
              columnsClassName={BAR_COLUMNS_CLASS}
              label={
                <span className='min-w-0 overflow-hidden'>
                  <TokenChip token={token} />
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
