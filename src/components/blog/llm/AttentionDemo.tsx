'use client';

import { type FocusEvent, useRef, useState } from 'react';

import {
  CHIP_INLINE_CLASSES,
  CHIP_INTERACTIVE_CLASSES,
  chipClasses,
} from '@/components/blog/llm/Chip';
import GuessGate from '@/components/blog/llm/GuessGate';
import { attentionStrings } from '@/components/blog/llm/strings/attention';

import type { Lang } from '@/i18n';

type SentenceWord = {
  readonly word: string;
  readonly attention?: readonly number[];
  readonly uniform?: boolean;
};

const SENTENCE: readonly SentenceWord[] = [
  { word: 'The' },
  { word: 'animal' },
  { word: "didn't" },
  { word: 'cross' },
  { word: 'the' },
  { word: 'street', attention: [0.15, 0.2, 0.1, 0.4, 0.15] },
  { word: 'because' },
  { word: 'it', attention: [0.02, 0.62, 0.03, 0.05, 0.02, 0.19, 0.07] },
  {
    word: 'was',
    attention: [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125],
    uniform: true,
  },
  { word: 'too' },
  {
    word: 'tired',
    attention: [0.01, 0.58, 0.02, 0.02, 0.02, 0.1, 0.02, 0.15, 0.05, 0.03],
  },
];

SENTENCE.forEach(({ word, attention }, index) => {
  if (attention && attention.length !== index)
    throw new Error(
      `AttentionDemo: '${word}' declares ${attention.length} weights but has ${index} preceding words`,
    );
});

const TRANSITION_CLASSES =
  'transition-opacity duration-[250ms] ease-out motion-reduce:transition-none';

const TOKEN_HOVERABLE_CLASSES = chipClasses(
  'plain',
  CHIP_INLINE_CLASSES,
  TRANSITION_CLASSES,
  CHIP_INTERACTIVE_CLASSES,
  'border-dashed',
);

const TOKEN_STATIC_CLASSES = chipClasses(
  'plain',
  CHIP_INLINE_CLASSES,
  TRANSITION_CLASSES,
);

type AttentionStrings = (typeof attentionStrings)[Lang];

export default function AttentionDemo({ lang }: { lang: Lang }) {
  const strings = attentionStrings[lang];
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  function opacityFor(i: number): number {
    if (highlighted === null || i === highlighted) return 1;
    const weights = SENTENCE[highlighted]?.attention;
    const w = weights?.[i];
    if (weights === undefined || w === undefined) return 0.25;
    const max = Math.max(...weights);
    return 0.3 + (0.7 * w) / max;
  }

  function reset() {
    setHighlighted(null);
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget;
    if (next instanceof Node && containerRef.current?.contains(next)) return;
    reset();
  }

  return (
    <div className='rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 my-6'>
      <GuessGate lang={lang} guess={strings.guess}>
        <div className='font-mono text-sm'>{strings.instruction}</div>

        <div
          ref={containerRef}
          onMouseLeave={reset}
          onBlur={handleBlur}
          className='flex flex-wrap gap-1 my-4'
        >
          {SENTENCE.map(({ word, attention }, i) => {
            const opacity = opacityFor(i);
            if (attention) {
              return (
                <button
                  key={i}
                  type='button'
                  onMouseEnter={() => setHighlighted(i)}
                  onFocus={() => setHighlighted(i)}
                  onClick={() => setHighlighted(i)}
                  style={{ opacity }}
                  className={TOKEN_HOVERABLE_CLASSES}
                >
                  {word}
                </button>
              );
            }
            return (
              <span
                key={i}
                style={{ opacity }}
                className={TOKEN_STATIC_CLASSES}
              >
                {word}
              </span>
            );
          })}
        </div>

        <div
          aria-live='polite'
          className='font-mono text-sm text-slate-600 dark:text-slate-300'
        >
          {highlighted === null ? (
            strings.readoutPlaceholder
          ) : (
            <Readout k={highlighted} strings={strings} />
          )}
        </div>
      </GuessGate>
    </div>
  );
}

function Readout({ k, strings }: { k: number; strings: AttentionStrings }) {
  const entry = SENTENCE[k];
  if (!entry?.attention) return null;

  if (entry.uniform) {
    return (
      <span>
        <span className='font-semibold'>{entry.word}</span>{' '}
        {strings.uniformNote}
      </span>
    );
  }

  const top3 = entry.attention
    .map((weight, idx) => ({ idx, weight, token: SENTENCE[idx]?.word ?? '' }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3);

  return (
    <div>
      <span className='font-semibold'>{entry.word}</span> {strings.attendsMost}
      <table className='mt-2 w-full'>
        <tbody>
          {top3.map((e) => (
            <tr key={e.idx}>
              <td className='pr-3'>{e.token}</td>
              <td>
                {strings.weightWord} {(e.weight * 100).toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
