'use client';

import { useState } from 'react';

import {
  PRIMARY_BUTTON_CLASSES,
  RESET_BUTTON_CLASSES,
} from '@/components/blog/llm/buttons';
import { Chip, ChipStream } from '@/components/blog/llm/Chip';
import {
  EXAMPLE_TOKENS,
  NEXT_TOKEN_CANDIDATES,
} from '@/components/blog/llm/example';
import { softmax } from '@/components/blog/llm/math';
import { ProbabilityBar } from '@/components/blog/llm/ProbabilityBar';
import { temperatureStrings } from '@/components/blog/llm/strings/temperature';

import type { Lang } from '@/i18n';

const CANDIDATES: ReadonlyArray<readonly [string, number]> =
  NEXT_TOKEN_CANDIDATES.map((c) => [c.token, c.logit] as const);

const PROMPT: readonly string[] = EXAMPLE_TOKENS;

const BAR_COLUMNS = '8rem 1fr 3.4rem';

export default function TemperatureDemo({ lang }: { lang: Lang }) {
  const strings = temperatureStrings[lang];
  const [temperature, setTemperature] = useState(1);
  const [sampled, setSampled] = useState<string[]>([]);

  const probs = softmax(
    CANDIDATES.map((c) => c[1]),
    temperature,
  );

  function handleSample() {
    const r = Math.random();
    let acc = 0;
    let chosen = CANDIDATES[CANDIDATES.length - 1]![0];
    for (let idx = 0; idx < probs.length; idx++) {
      acc += probs[idx]!;
      if (r <= acc) {
        chosen = CANDIDATES[idx]![0];
        break;
      }
    }
    setSampled((prev) => [...prev, chosen]);
  }

  function handleReset() {
    setSampled([]);
  }

  return (
    <div className='rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 my-6'>
      <span className='block font-mono text-xs text-slate-500 dark:text-slate-400 mb-1'>
        {strings.promptLabel}
      </span>
      <ChipStream ariaLabel={strings.promptStreamAria} live>
        {PROMPT.map((t, idx) => (
          <Chip key={`prompt-${idx}`} variant='tok'>
            {t}
          </Chip>
        ))}
        {sampled.map((t, idx) => (
          <Chip key={`sampled-${idx}`} variant='tok'>
            {t}
          </Chip>
        ))}
      </ChipStream>
      {sampled.length > 0 ? (
        <div className='font-mono text-xs text-slate-500 dark:text-slate-400'>
          {strings.sampledNote}
        </div>
      ) : null}

      <div className='flex flex-wrap items-center gap-3 my-3 font-mono text-sm'>
        <label htmlFor='temperature-demo-slider'>{strings.tempLabel}</label>
        <input
          id='temperature-demo-slider'
          type='range'
          min={0.05}
          max={2}
          step={0.01}
          value={temperature}
          onChange={(event) => setTemperature(parseFloat(event.target.value))}
          className='flex-1 accent-cyan-700 dark:accent-cyan-400 focus-visible:outline-2 focus-visible:outline-cyan-700 dark:focus-visible:outline-cyan-400 focus-visible:outline-offset-2'
        />
        <span className='font-mono tabular-nums'>{temperature.toFixed(2)}</span>
      </div>

      <div className='my-4'>
        {CANDIDATES.map((c, idx) => {
          const pct = probs[idx]! * 100;
          return (
            <ProbabilityBar
              key={c[0]}
              title={`${c[0].trim()}: ${pct.toFixed(3)}%`}
              columns={BAR_COLUMNS}
              label={<span className='font-mono text-sm'>{c[0]}</span>}
              percent={pct}
              valueText={`${pct.toFixed(1)}%`}
            />
          );
        })}
      </div>

      <div className='flex flex-wrap items-center gap-3 my-3'>
        <button
          type='button'
          onClick={handleSample}
          className={PRIMARY_BUTTON_CLASSES.cyan}
        >
          {strings.sampleBtn}
        </button>
        <button
          type='button'
          onClick={handleReset}
          className={RESET_BUTTON_CLASSES.cyan}
        >
          {strings.resetBtn}
        </button>
      </div>

      <div className='font-mono text-xs text-slate-500 dark:text-slate-400'>
        <span>p</span>
        <span className='align-sub text-[0.7em]'>i</span> = exp(l
        <span className='align-sub text-[0.7em]'>i</span> / T) / Σ exp(l
        <span className='align-sub text-[0.7em]'>j</span> / T) —{' '}
        {strings.formulaNote}
      </div>
    </div>
  );
}
