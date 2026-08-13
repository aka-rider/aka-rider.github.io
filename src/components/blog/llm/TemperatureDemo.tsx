'use client';

import { useState } from 'react';

import { Chip, ChipStream } from '@/components/blog/llm/Chip';
import { type Lang, temperatureStrings } from '@/components/blog/llm/strings';

const CANDIDATES: ReadonlyArray<readonly [string, number]> = [
  [' Paris', 9.1],
  [' the', 6.3],
  [' located', 5.4],
  [' a', 5.0],
  [' one', 4.2],
  [' France', 3.1],
  [' Lyon', 2.6],
  [' beautiful', 2.2],
];

const PROMPT: readonly string[] = ['The', ' capital', ' of', ' France', ' is'];

function softmax(logits: readonly number[], temperature: number): number[] {
  const scaled = logits.map((l) => l / temperature);
  const max = Math.max(...scaled);
  const exps = scaled.map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

const PRIMARY_BUTTON_CLASSES =
  'font-mono text-sm rounded border border-cyan-700 dark:border-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 px-3 py-1.5 focus-visible:outline-2 focus-visible:outline-cyan-700 dark:focus-visible:outline-cyan-400 focus-visible:outline-offset-2';

const RESET_BUTTON_CLASSES =
  'font-mono text-sm text-slate-500 dark:text-slate-400 underline focus-visible:outline-2 focus-visible:outline-cyan-700 dark:focus-visible:outline-cyan-400 focus-visible:outline-offset-2';

export default function TemperatureDemo({ lang = 'en' }: { lang?: Lang }) {
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
          <Chip key={`sampled-${idx}`} variant='model'>
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
            <div
              key={c[0]}
              title={`${c[0].trim()}: ${pct.toFixed(3)}%`}
              className='grid grid-cols-[8rem_1fr_3.4rem] items-center gap-2 py-1'
            >
              <span className='font-mono text-sm'>{c[0]}</span>
              <span className='relative h-1 rounded bg-slate-200 dark:bg-slate-700'>
                <span
                  className='absolute left-0 top-0 h-full rounded bg-cyan-700 dark:bg-cyan-400 transition-[width] duration-[250ms] ease-out motion-reduce:transition-none'
                  style={{ width: `${pct}%` }}
                />
              </span>
              <span className='font-mono tabular-nums text-sm text-right'>
                {pct.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>

      <div className='flex flex-wrap items-center gap-3 my-3'>
        <button
          type='button'
          onClick={handleSample}
          className={PRIMARY_BUTTON_CLASSES}
        >
          {strings.sampleBtn}
        </button>
        <button
          type='button'
          onClick={handleReset}
          className={RESET_BUTTON_CLASSES}
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
