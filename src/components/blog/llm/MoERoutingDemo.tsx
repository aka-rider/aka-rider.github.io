'use client';

import { useState } from 'react';

import {
  CHIP_INTERACTIVE_CLASSES,
  CHIP_SELECTED_CLASSES,
  chipClasses,
} from '@/components/blog/llm/Chip';
import { EXAMPLE_TOKENS } from '@/components/blog/llm/example';
import { fill, visibleSpaces } from '@/components/blog/llm/format';
import GuessGate from '@/components/blog/llm/GuessGate';
import { PANEL_CLASSES } from '@/components/blog/llm/panel';
import { moeStrings } from '@/components/blog/llm/strings/moe';

import type { Lang } from '@/i18n';

const TOKENS = EXAMPLE_TOKENS;
const EXPERT_COUNT = 8;

const ROUTER_SCORES: readonly (readonly number[])[] = [
  [0.88, 0.05, 0.04, 0.06, 0.03, 0.02, 0.35, 0.07],
  [0.06, 0.91, 0.08, 0.05, 0.04, 0.03, 0.1, 0.42],
  [0.05, 0.1, 0.9, 0.06, 0.04, 0.03, 0.08, 0.47],
  [0.07, 0.06, 0.09, 0.89, 0.05, 0.04, 0.12, 0.34],
  [0.08, 0.05, 0.06, 0.1, 0.87, 0.06, 0.33, 0.09],
  [0.8, 0.07, 0.05, 0.06, 0.04, 0.03, 0.28, 0.09],
  [0.83, 0.06, 0.05, 0.07, 0.31, 0.04, 0.09, 0.1],
];

if (ROUTER_SCORES.length !== TOKENS.length) {
  throw new Error('ROUTER_SCORES must have one row per token');
}
if (ROUTER_SCORES.some((row) => row.length !== EXPERT_COUNT)) {
  throw new Error(`ROUTER_SCORES rows must have ${EXPERT_COUNT} scores`);
}

function topTwo(scores: readonly number[]): [number, number] {
  const ranked = scores
    .map((score, index) => ({ score, index }))
    .sort((x, y) => y.score - x.score);
  return [ranked[0]!.index, ranked[1]!.index];
}

const TOKEN_BUTTON_BASE_CLASSES = chipClasses('tok', CHIP_INTERACTIVE_CLASSES);

const EXPERT_CARD_BASE_CLASSES =
  'rounded-lg border p-2 transition-all duration-[250ms] ease-out motion-reduce:transition-none';

const EXPERT_ACTIVE_CLASSES = 'border-cyan-700 dark:border-cyan-400';

const EXPERT_IDLE_CLASSES = 'border-slate-300 dark:border-slate-600 opacity-40';

const MUTED_TEXT_CLASSES = 'font-mono text-xs text-muted';

export default function MoERoutingDemo({ lang }: { lang: Lang }) {
  const strings = moeStrings[lang];
  const [selected, setSelected] = useState(0);

  const scores = ROUTER_SCORES[selected]!;
  const [first, second] = topTwo(scores);
  const active = new Set([first, second]);

  const expertName = (index: number) =>
    `E${index + 1} (${strings.expertHints[index]})`;
  const readout = fill(strings.readout, {
    token: visibleSpaces(TOKENS[selected]!),
    first: expertName(first),
    second: expertName(second),
  });

  return (
    <div className={PANEL_CLASSES}>
      <GuessGate
        lang={lang}
        guess={strings.guess}
        onReveal={() => setSelected(2)}
      >
        <div
          role='group'
          aria-label={strings.tokensAria}
          className='flex flex-wrap items-center gap-1.5'
        >
          <span className='font-mono text-sm text-muted mr-1'>
            {strings.pickLabel}
          </span>
          {TOKENS.map((token, i) => (
            <button
              key={token}
              type='button'
              aria-pressed={i === selected}
              onClick={() => setSelected(i)}
              className={`${TOKEN_BUTTON_BASE_CLASSES} ${
                i === selected ? CHIP_SELECTED_CLASSES : ''
              }`}
            >
              {visibleSpaces(token)}
            </button>
          ))}
        </div>

        <div
          role='group'
          aria-label={strings.expertsAria}
          className='grid grid-cols-2 sm:grid-cols-4 gap-2 my-4'
        >
          {strings.expertHints.map((hint, i) => {
            const isActive = active.has(i);
            const score = scores[i]!;
            return (
              <div
                key={`E${i + 1}`}
                className={`${EXPERT_CARD_BASE_CLASSES} ${
                  isActive ? EXPERT_ACTIVE_CLASSES : EXPERT_IDLE_CLASSES
                }`}
              >
                <div
                  className={`font-mono text-xs font-bold ${
                    isActive
                      ? 'text-cyan-700 dark:text-cyan-400'
                      : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
                  E{i + 1}
                </div>
                <div className='font-mono text-[10px] text-muted'>{hint}</div>
                <div className='mt-1.5 h-1.5 rounded bg-slate-200 dark:bg-slate-700'>
                  <div
                    style={{ width: `${score * 100}%` }}
                    className={`h-full rounded transition-[width] duration-[250ms] ease-out motion-reduce:transition-none ${
                      isActive
                        ? 'bg-cyan-700 dark:bg-cyan-400'
                        : 'bg-slate-400 dark:bg-slate-500'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div
          aria-live='polite'
          className='font-mono text-sm text-slate-600 dark:text-slate-300'
        >
          {readout}
        </div>

        <div
          className={`${MUTED_TEXT_CLASSES} border-t border-dashed border-slate-300 dark:border-slate-600 pt-2.5 mt-4`}
        >
          {strings.honesty}
        </div>
      </GuessGate>
    </div>
  );
}
