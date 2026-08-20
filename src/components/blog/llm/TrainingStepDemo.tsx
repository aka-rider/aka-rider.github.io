'use client';

import { useState } from 'react';

import {
  PRIMARY_BUTTON_CLASSES,
  RESET_BUTTON_CLASSES,
} from '@/components/blog/llm/buttons';
import { Chip, ChipStream } from '@/components/blog/llm/Chip';
import { EXAMPLE_TOKENS } from '@/components/blog/llm/example';
import { softmax } from '@/components/blog/llm/math';
import { ProbabilityBar } from '@/components/blog/llm/ProbabilityBar';
import { trainingStepStrings } from '@/components/blog/llm/strings/trainingStep';

import type { Lang } from '@/i18n';

const CANDIDATES = [' blue', ' green', ' falling', ' red', ' big'] as const;
const INITIAL_LOGITS = [1.2, 2.1, 1.8, 0.9, 0.4] as const;
const TARGET_INDEX = 0;
const LEARNING_RATE = 1.5;
const SCALE_NOTE_AFTER_STEPS = 6;

const CONTEXT_TOKENS = EXAMPLE_TOKENS.slice(0, 4);

const TRAINING_TEMPERATURE = 1;

const LABEL_CLASSES =
  'block font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1';

const BAR_COLUMNS = '5.5rem 1fr 3.4rem 4.5rem';

export default function TrainingStepDemo({ lang }: { lang: Lang }) {
  const strings = trainingStepStrings[lang];
  const [logits, setLogits] = useState<readonly number[]>(INITIAL_LOGITS);
  const [steps, setSteps] = useState(0);

  const probs = softmax(logits, TRAINING_TEMPERATURE);
  const loss = -Math.log(probs[TARGET_INDEX]!);

  function handleNudge() {
    const p = softmax(logits, TRAINING_TEMPERATURE);
    setLogits(
      logits.map(
        (l, i) => l - LEARNING_RATE * (p[i]! - (i === TARGET_INDEX ? 1 : 0)),
      ),
    );
    setSteps((s) => s + 1);
  }

  function handleReset() {
    setLogits(INITIAL_LOGITS);
    setSteps(0);
  }

  return (
    <div className='rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 my-6'>
      <span className={LABEL_CLASSES}>{strings.sampleLabel}</span>
      <ChipStream ariaLabel={strings.sampleLabel}>
        {CONTEXT_TOKENS.map((t, idx) => (
          <Chip key={idx} variant='tok'>
            {t}
          </Chip>
        ))}
        <Chip variant='tok' special>
          {CANDIDATES[TARGET_INDEX]}
        </Chip>
      </ChipStream>
      <div className='font-mono text-xs text-slate-500 dark:text-slate-400 text-right'>
        ↑ {strings.targetNote}
      </div>

      <div className='my-4'>
        <span className={LABEL_CLASSES}>{strings.predictionLabel}</span>
        <div role='group' aria-label={strings.barsAria}>
          {CANDIDATES.map((token, idx) => {
            const pct = probs[idx]! * 100;
            return (
              <ProbabilityBar
                key={token}
                columns={BAR_COLUMNS}
                label={<span className='font-mono text-sm'>{token}</span>}
                percent={pct}
                valueText={`${pct.toFixed(1)}%`}
                trailing={
                  <span className='font-mono text-xs text-amber-700 dark:text-amber-400'>
                    {idx === TARGET_INDEX ? strings.targetMarker : ''}
                  </span>
                }
              />
            );
          })}
        </div>
      </div>

      <div
        aria-live='polite'
        aria-label={strings.lossAria}
        className='font-mono my-4'
      >
        <span className='text-sm text-slate-500 dark:text-slate-400'>
          {strings.lossLabel}{' '}
        </span>
        <span className='text-3xl tabular-nums text-cyan-700 dark:text-cyan-400'>
          {loss.toFixed(2)}
        </span>
      </div>

      <div className='flex flex-wrap items-center gap-3 my-3'>
        <button
          type='button'
          onClick={handleNudge}
          className={PRIMARY_BUTTON_CLASSES.violet}
        >
          {strings.nudgeBtn}
        </button>
        <button
          type='button'
          onClick={handleReset}
          className={RESET_BUTTON_CLASSES.violet}
        >
          {strings.resetBtn}
        </button>
        <span className='font-mono text-sm text-slate-500 dark:text-slate-400'>
          {steps > 0 ? `${strings.stepWord} ${steps}` : ''}
        </span>
      </div>

      {steps >= SCALE_NOTE_AFTER_STEPS ? (
        <div className='font-mono text-sm text-amber-700 dark:text-amber-400 my-3'>
          {strings.scaleNote}
        </div>
      ) : null}

      <div className='font-mono text-xs text-slate-600 dark:text-slate-300 mt-4'>
        {strings.mechanismNote}
      </div>

      <div className='font-mono text-xs text-slate-500 dark:text-slate-400 border-t border-dashed border-slate-300 dark:border-slate-600 pt-2.5 mt-3'>
        {strings.honesty}
      </div>
    </div>
  );
}
