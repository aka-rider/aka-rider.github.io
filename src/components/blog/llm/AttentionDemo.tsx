'use client';

import { type FocusEvent, useRef, useState } from 'react';

import { attentionStrings, type Lang } from '@/components/blog/llm/strings';

const SENTENCE: readonly string[] = [
  'The',
  'animal',
  "didn't",
  'cross',
  'the',
  'street',
  'because',
  'it',
  'was',
  'too',
  'tired',
];

const WEIGHTS: Record<number, Record<number, number>> = {
  7: { 0: 0.02, 1: 0.62, 2: 0.03, 3: 0.05, 4: 0.02, 5: 0.19, 6: 0.07 },
  10: {
    0: 0.01,
    1: 0.58,
    2: 0.02,
    3: 0.02,
    4: 0.02,
    5: 0.1,
    6: 0.02,
    7: 0.15,
    8: 0.05,
    9: 0.03,
  },
  5: { 0: 0.15, 1: 0.2, 2: 0.1, 3: 0.4, 4: 0.15 },
  8: {
    0: 0.125,
    1: 0.125,
    2: 0.125,
    3: 0.125,
    4: 0.125,
    5: 0.125,
    6: 0.125,
    7: 0.125,
  },
};

function softmax(logits: readonly number[], temperature = 1): number[] {
  const scaled = logits.map((l) => l / temperature);
  const max = Math.max(...scaled);
  const exps = scaled.map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

const TOKEN_BASE_CLASSES =
  'font-mono text-[0.85em] px-2 py-0.5 mx-0.5 my-0.5 rounded border whitespace-pre align-baseline inline-block transition-opacity duration-[250ms] ease-out motion-reduce:transition-none';

const TOKEN_PLAIN_CLASSES =
  'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100';

const TOKEN_HOVERABLE_CLASSES = `${TOKEN_BASE_CLASSES} ${TOKEN_PLAIN_CLASSES} border-dashed cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-700 dark:focus-visible:outline-cyan-400 focus-visible:outline-offset-2`;

const TOKEN_STATIC_CLASSES = `${TOKEN_BASE_CLASSES} ${TOKEN_PLAIN_CLASSES}`;

type AttentionStrings = (typeof attentionStrings)[Lang];

export default function AttentionDemo({ lang = 'en' }: { lang?: Lang }) {
  const strings = attentionStrings[lang];
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  function opacityFor(i: number): number {
    if (highlighted === null) return 1;
    if (i === highlighted) return 1;
    const weights = WEIGHTS[highlighted];
    const w = weights ? weights[i] : undefined;
    if (weights === undefined || w === undefined) return 0.25;
    const max = Math.max(...Object.values(weights));
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
      <div className='font-mono text-sm'>{strings.instruction}</div>

      <div
        ref={containerRef}
        onMouseLeave={reset}
        onBlur={handleBlur}
        className='flex flex-wrap gap-1 my-4'
      >
        {SENTENCE.map((word, i) => {
          const hoverable = i in WEIGHTS;
          const opacity = opacityFor(i);
          if (hoverable) {
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
            <span key={i} style={{ opacity }} className={TOKEN_STATIC_CLASSES}>
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
    </div>
  );
}

function Readout({ k, strings }: { k: number; strings: AttentionStrings }) {
  const weights = WEIGHTS[k];
  if (!weights) return null;

  const values = Object.values(weights);
  const uniform = Math.max(...values) / Math.min(...values) < 1.01;

  if (uniform) {
    return (
      <span>
        <span className='font-semibold'>{SENTENCE[k]}</span>{' '}
        {strings.uniformNote}
      </span>
    );
  }

  const entries = Object.keys(weights).map((key) => {
    const idx = Number(key);
    const w = weights[idx] ?? 0;
    return { idx, token: SENTENCE[idx] ?? '', score: Math.log(w) };
  });
  const recomputed = softmax(entries.map((e) => e.score));
  const withProb = entries.map((e, i) => ({ ...e, prob: recomputed[i] ?? 0 }));
  withProb.sort((a, b) => b.prob - a.prob);
  const top3 = withProb.slice(0, 3);

  return (
    <div>
      <span className='font-semibold'>{SENTENCE[k]}</span> {strings.attendsMost}
      <table className='mt-2 w-full'>
        <tbody>
          {top3.map((e) => (
            <tr key={e.idx}>
              <td className='pr-3'>{e.token}</td>
              <td className='pr-3'>q·k ≈ {e.score.toFixed(2)}</td>
              <td>softmax → {(e.prob * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
