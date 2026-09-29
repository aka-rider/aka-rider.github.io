'use client';

import { useState } from 'react';

import {
  PRIMARY_BUTTON_CLASSES,
  RESET_BUTTON_CLASSES,
} from '@/components/blog/llm/buttons';
import { ChipStream, TokenChip } from '@/components/blog/llm/Chip';
import {
  EXAMPLE_TOKENS,
  NEXT_TOKEN_CANDIDATES,
} from '@/components/blog/llm/example';
import { fill, visibleSpaces } from '@/components/blog/llm/format';
import { softmax } from '@/components/blog/llm/math';
import { PANEL_CLASSES } from '@/components/blog/llm/panel';
import { ProbabilityBar } from '@/components/blog/llm/ProbabilityBar';
import { temperatureStrings } from '@/components/blog/llm/strings/temperature';

import type { Lang } from '@/i18n';

const PROMPT: readonly string[] = EXAMPLE_TOKENS;

const SLIDER_CLASSES =
  'flex-1 min-w-0 accent-violet-700 dark:accent-violet-400 focus-visible:outline-2 focus-visible:outline-violet-700 dark:focus-visible:outline-violet-400 focus-visible:outline-offset-2';

const OUTER_COLUMNS_CLASS = 'sm:grid-cols-[15rem_minmax(0,1fr)_3.4rem]';
const LABEL_COLUMNS_CLASS =
  'grid-cols-[4.6rem_2.1rem_2.6rem] sm:grid-cols-[4.6rem_2.1rem_4.5rem_2.6rem]';

export type CutReason = 'top-k' | 'top-p' | null;

export type CandidateDistributionRow = {
  token: string;
  logit: number;
  scaledLogit: number;
  cutReason: CutReason;
  probability: number;
};

function scaleLogits(logits: readonly number[], temperature: number): number[] {
  return logits.map((logit) => logit / temperature);
}

function topKKeep(logits: readonly number[], k: number): boolean[] {
  const ranked = logits
    .map((logit, index) => ({ logit, index }))
    .sort((a, b) => b.logit - a.logit);
  const kept = new Set(ranked.slice(0, Math.max(1, k)).map((r) => r.index));
  return logits.map((_, index) => kept.has(index));
}

function topPKeep(probs: readonly number[], p: number): boolean[] {
  const ranked = probs
    .map((prob, index) => ({ prob, index }))
    .sort((a, b) => b.prob - a.prob);
  const kept = new Set<number>();
  let cumulative = 0;
  for (const { prob, index } of ranked) {
    kept.add(index);
    cumulative += prob;
    if (cumulative >= p) break;
  }
  return probs.map((_, index) => kept.has(index));
}

function maskLogits(
  logits: readonly number[],
  keep: readonly boolean[],
): number[] {
  return logits.map((logit, index) => (keep[index] ? logit : -Infinity));
}

export function candidateDistribution(
  candidates: readonly { token: string; logit: number }[],
  {
    temperature,
    topK,
    topP,
  }: { temperature: number; topK: number; topP: number },
): CandidateDistributionRow[] {
  const logits = candidates.map((c) => c.logit);
  const scaled = scaleLogits(logits, temperature);
  const fullProbs = softmax(scaled, 1);
  const keepK = topKKeep(logits, topK);
  const keepP = topPKeep(fullProbs, topP);
  const keep = keepK.map((k, idx) => k && keepP[idx]!);
  const finalProbs = softmax(maskLogits(scaled, keep), 1);

  return candidates.map((c, idx) => ({
    token: c.token,
    logit: c.logit,
    scaledLogit: scaled[idx]!,
    cutReason: !keepK[idx] ? 'top-k' : !keepP[idx] ? 'top-p' : null,
    probability: finalProbs[idx]!,
  }));
}

export default function TemperatureDemo({ lang }: { lang: Lang }) {
  const strings = temperatureStrings[lang];
  const [temperature, setTemperature] = useState(1);
  const [topK, setTopK] = useState<number>(NEXT_TOKEN_CANDIDATES.length);
  const [topP, setTopP] = useState(1);
  const [sampled, setSampled] = useState<string[]>([]);

  const distribution = candidateDistribution(NEXT_TOKEN_CANDIDATES, {
    temperature,
    topK,
    topP,
  });
  const leading = distribution.reduce((best, row) =>
    row.probability > best.probability ? row : best,
  );
  const leadingReadout = fill(strings.leadingReadout, {
    token: visibleSpaces(leading.token),
    pct: (leading.probability * 100).toFixed(1),
  });

  function handleSample() {
    const r = Math.random();
    let acc = 0;
    let chosen = distribution[distribution.length - 1]!.token;
    for (const row of distribution) {
      acc += row.probability;
      if (r <= acc) {
        chosen = row.token;
        break;
      }
    }
    setSampled((prev) => [...prev, chosen]);
  }

  function handleReset() {
    setSampled([]);
  }

  return (
    <div className={PANEL_CLASSES}>
      <span className='block font-mono text-xs text-muted mb-1'>
        {strings.promptLabel}
      </span>
      <ChipStream ariaLabel={strings.promptStreamAria} live>
        {PROMPT.map((t, idx) => (
          <TokenChip key={`prompt-${idx}`} token={t} />
        ))}
        {sampled.map((t, idx) => (
          <TokenChip key={`sampled-${idx}`} token={t} />
        ))}
      </ChipStream>
      {sampled.length > 0 ? (
        <div className='font-mono text-xs text-muted'>
          {strings.sampledNote}
        </div>
      ) : null}

      <div className='font-mono text-xs text-muted my-3'>
        {strings.projectionNote}
      </div>

      <div className='flex items-center gap-3 my-3 font-mono text-sm'>
        <label htmlFor='temperature-demo-temp' className='w-24 shrink-0'>
          {strings.tempLabel}
        </label>
        <input
          id='temperature-demo-temp'
          type='range'
          min={0.05}
          max={2}
          step={0.01}
          value={temperature}
          onChange={(event) => setTemperature(parseFloat(event.target.value))}
          className={SLIDER_CLASSES}
        />
        <span className='font-mono tabular-nums w-10 text-right'>
          {temperature.toFixed(2)}
        </span>
      </div>

      <div className='flex items-center gap-3 my-3 font-mono text-sm'>
        <label htmlFor='temperature-demo-topk' className='w-24 shrink-0'>
          {strings.topKLabel}
        </label>
        <input
          id='temperature-demo-topk'
          type='range'
          min={1}
          max={NEXT_TOKEN_CANDIDATES.length}
          step={1}
          value={topK}
          onChange={(event) => setTopK(parseInt(event.target.value, 10))}
          className={SLIDER_CLASSES}
        />
        <span className='font-mono tabular-nums w-10 text-right'>{topK}</span>
      </div>
      {topK === 1 ? (
        <div className='font-mono text-xs text-muted -mt-2 mb-2'>
          {strings.greedyNote}
        </div>
      ) : null}

      <div className='flex items-center gap-3 my-3 font-mono text-sm'>
        <label htmlFor='temperature-demo-topp' className='w-24 shrink-0'>
          {strings.topPLabel}
        </label>
        <input
          id='temperature-demo-topp'
          type='range'
          min={0}
          max={1}
          step={0.01}
          value={topP}
          onChange={(event) => setTopP(parseFloat(event.target.value))}
          className={SLIDER_CLASSES}
        />
        <span className='font-mono tabular-nums w-10 text-right'>
          {topP.toFixed(2)}
        </span>
      </div>

      <div
        className={`sm:grid sm:items-center sm:gap-2 ${OUTER_COLUMNS_CLASS} font-mono text-xs text-muted mt-4 mb-1`}
      >
        <span className={`grid ${LABEL_COLUMNS_CLASS} gap-1`}>
          <span>{strings.columns.token}</span>
          <span className='text-right'>{strings.columns.logit}</span>
          <span className='hidden sm:block text-right'>
            {strings.columns.scaled}
          </span>
          <span>{strings.columns.cut}</span>
        </span>
        <span className='hidden sm:block'>{strings.columns.softmax}</span>
        <span className='hidden sm:block' />
      </div>

      <div>
        {distribution.map((row) => {
          const alive = row.cutReason === null;
          const reason =
            row.cutReason === 'top-k'
              ? strings.cutTopK
              : row.cutReason === 'top-p'
                ? strings.cutTopP
                : strings.kept;
          const pct = row.probability * 100;
          return (
            <div key={row.token} className={alive ? '' : 'opacity-40'}>
              <ProbabilityBar
                title={`${row.token.trim()}: ${pct.toFixed(3)}%`}
                columnsClassName={OUTER_COLUMNS_CLASS}
                label={
                  <span
                    className={`grid ${LABEL_COLUMNS_CLASS} gap-1 items-center font-mono text-sm`}
                  >
                    <span className={alive ? '' : 'line-through'}>
                      {visibleSpaces(row.token)}
                    </span>
                    <span className='text-right tabular-nums text-xs'>
                      {row.logit.toFixed(1)}
                    </span>
                    <span className='hidden sm:block text-right tabular-nums text-xs'>
                      {row.scaledLogit.toFixed(1)}
                    </span>
                    <span className='text-[0.7rem] text-muted'>{reason}</span>
                  </span>
                }
                percent={pct}
                valueText={`${pct.toFixed(1)}%`}
              />
            </div>
          );
        })}
      </div>

      <div aria-live='polite' className='font-mono text-xs text-muted my-2'>
        {leadingReadout}
      </div>

      <div className='flex flex-wrap items-center gap-3 my-3'>
        <button
          type='button'
          onClick={handleSample}
          className={PRIMARY_BUTTON_CLASSES.violet}
        >
          {strings.sampleBtn}
        </button>
        <button
          type='button'
          onClick={handleReset}
          className={RESET_BUTTON_CLASSES.violet}
        >
          {strings.resetBtn}
        </button>
      </div>

      <div className='font-mono text-xs text-muted'>
        <span>p</span>
        <span className='align-sub text-[0.7em]'>i</span> = exp(l
        <span className='align-sub text-[0.7em]'>i</span> / T) / Σ exp(l
        <span className='align-sub text-[0.7em]'>j</span> / T) —{' '}
        {strings.formulaNote}
      </div>
      <div className='font-mono text-xs text-muted mt-1'>
        {strings.cuttingNote}
      </div>
    </div>
  );
}
