'use client';

import { type FocusEvent, useRef, useState } from 'react';

import {
  CHIP_INLINE_CLASSES,
  CHIP_INTERACTIVE_CLASSES,
  chipClasses,
} from '@/components/blog/llm/Chip';
import { EXAMPLE_TOKENS } from '@/components/blog/llm/example';
import { visibleSpaces } from '@/components/blog/llm/format';
import GuessGate from '@/components/blog/llm/GuessGate';
import { PANEL_CLASSES } from '@/components/blog/llm/panel';
import { attentionStrings } from '@/components/blog/llm/strings/attention';

import type { Lang } from '@/i18n';

export type AttentionHeadId = 'nameBuilder' | 'locate' | 'previousToken';

export const ATTENTION_HEAD_IDS: readonly AttentionHeadId[] = [
  'nameBuilder',
  'locate',
  'previousToken',
];

export const ATTENTION_HEADS: Record<
  AttentionHeadId,
  readonly (readonly number[])[]
> = {
  nameBuilder: [
    [1],
    [0.15, 0.85],
    [0.05, 0.7, 0.25],
    [0.03, 0.47, 0.47, 0.03],
    [0.1, 0.1, 0.1, 0.1, 0.6],
    [0.06, 0.06, 0.06, 0.06, 0.06, 0.7],
    [0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.7],
  ],
  locate: [
    [1],
    [0.5, 0.5],
    [0.34, 0.33, 0.33],
    [0.25, 0.25, 0.25, 0.25],
    [0.2, 0.2, 0.2, 0.2, 0.2],
    [0.1, 0.1, 0.1, 0.1, 0.5, 0.1],
    [0.05, 0.05, 0.05, 0.05, 0.6, 0.05, 0.15],
  ],
  previousToken: [
    [1],
    [0.9, 0.1],
    [0.05, 0.85, 0.1],
    [0.03, 0.05, 0.87, 0.05],
    [0.02, 0.03, 0.05, 0.85, 0.05],
    [0.02, 0.02, 0.03, 0.05, 0.83, 0.05],
    [0.02, 0.02, 0.02, 0.03, 0.05, 0.81, 0.05],
  ],
};

ATTENTION_HEAD_IDS.forEach((headId) => {
  const rows = ATTENTION_HEADS[headId];
  if (rows.length !== EXAMPLE_TOKENS.length) {
    throw new Error(
      `AttentionDemo: head ${headId} has ${rows.length} rows for ${EXAMPLE_TOKENS.length} tokens`,
    );
  }
  rows.forEach((row, query) => {
    const total = row.reduce((sum, weight) => sum + weight, 0);
    if (row.length !== query + 1 || Math.abs(total - 1) > 1e-9) {
      throw new Error(
        `AttentionDemo: head ${headId} row ${query} is not a causal distribution`,
      );
    }
  });
});

const CELL = 28;
const LABEL_W = 58;
const LABEL_H = 46;
const GRID_SIZE = EXAMPLE_TOKENS.length;
const GRID_WIDTH = LABEL_W + GRID_SIZE * CELL;
const GRID_HEIGHT = LABEL_H + GRID_SIZE * CELL;

const HEAD_BUTTON_CLASSES =
  'font-mono text-sm rounded border px-3 py-1.5 border-cyan-700/60 dark:border-cyan-400/60 text-cyan-700 dark:text-cyan-400 focus-visible:outline-2 focus-visible:outline-cyan-700 dark:focus-visible:outline-cyan-400 focus-visible:outline-offset-2 transition-opacity motion-reduce:transition-none';

const DEFAULT_ACTIVE_ROW: Record<AttentionHeadId, number> = {
  nameBuilder: 3,
  locate: 6,
  previousToken: 6,
};

const TOKEN_HOVERABLE_CLASSES = chipClasses(
  'plain',
  CHIP_INLINE_CLASSES,
  CHIP_INTERACTIVE_CLASSES,
  'border-dashed',
  'transition-opacity duration-[250ms] ease-out motion-reduce:transition-none',
);

const LABEL_CLASSES =
  'block font-mono text-xs uppercase tracking-wider text-muted mb-1';

type AttentionStrings = (typeof attentionStrings)[Lang];

export default function AttentionDemo({ lang }: { lang: Lang }) {
  const strings = attentionStrings[lang];
  const [headId, setHeadId] = useState<AttentionHeadId>('nameBuilder');
  const [activeRow, setActiveRow] = useState<number | null>(
    DEFAULT_ACTIVE_ROW.nameBuilder,
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rows = ATTENTION_HEADS[headId];

  function reset() {
    setActiveRow(null);
  }

  function selectHead(id: AttentionHeadId) {
    setHeadId(id);
    setActiveRow(DEFAULT_ACTIVE_ROW[id]);
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget;
    if (next instanceof Node && containerRef.current?.contains(next)) return;
    reset();
  }

  return (
    <div className={PANEL_CLASSES}>
      <GuessGate lang={lang} guess={strings.guess}>
        <span className={LABEL_CLASSES}>{strings.headsLabel}</span>
        <div
          role='group'
          aria-label={strings.headsGroupAria}
          className='flex flex-wrap gap-2 mb-3'
        >
          {ATTENTION_HEAD_IDS.map((id) => {
            const selected = id === headId;
            return (
              <button
                key={id}
                type='button'
                aria-pressed={selected}
                onClick={() => selectHead(id)}
                className={`${HEAD_BUTTON_CLASSES} ${
                  selected
                    ? 'border-2 font-semibold'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                {strings.heads[id].label}
              </button>
            );
          })}
        </div>
        <div className='font-mono text-sm text-slate-600 dark:text-slate-300 mb-4'>
          {strings.heads[headId].description}
        </div>

        <span className={LABEL_CLASSES}>{strings.tokensLabel}</span>
        <div
          ref={containerRef}
          onMouseLeave={reset}
          onBlur={handleBlur}
          className='flex flex-wrap gap-1 mb-4'
        >
          {EXAMPLE_TOKENS.map((token, i) => (
            <button
              key={token}
              type='button'
              onMouseEnter={() => setActiveRow(i)}
              onFocus={() => setActiveRow(i)}
              onClick={() => setActiveRow(i)}
              className={TOKEN_HOVERABLE_CLASSES}
            >
              {visibleSpaces(token)}
            </button>
          ))}
        </div>

        <AttentionGrid
          rows={rows}
          activeRow={activeRow}
          aria={strings.gridAria}
        />

        <div
          aria-live='polite'
          className='font-mono text-sm text-slate-600 dark:text-slate-300 mt-4'
        >
          {activeRow === null ? (
            strings.readoutPlaceholder
          ) : (
            <Readout
              row={activeRow}
              weights={rows[activeRow]!}
              strings={strings}
            />
          )}
        </div>

        <div className='font-mono text-xs text-muted mt-3 border-t border-dashed border-slate-300 dark:border-slate-600 pt-2.5'>
          {strings.scaleNote}
        </div>
      </GuessGate>
    </div>
  );
}

function AttentionGrid({
  rows,
  activeRow,
  aria,
}: {
  rows: readonly (readonly number[])[];
  activeRow: number | null;
  aria: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${GRID_WIDTH} ${GRID_HEIGHT}`}
      role='img'
      aria-label={aria}
      className='w-full h-auto max-w-[280px] mx-auto block'
    >
      <g fontFamily='var(--font-mono)' fontSize={9}>
        {EXAMPLE_TOKENS.map((token, j) => {
          const x = LABEL_W + j * CELL + CELL / 2;
          const y = LABEL_H - 6;
          return (
            <text
              key={`col-${token}`}
              x={x}
              y={y}
              textAnchor='start'
              transform={`rotate(-45 ${x} ${y})`}
              className='fill-slate-500 dark:fill-slate-400'
            >
              {visibleSpaces(token)}
            </text>
          );
        })}
        {EXAMPLE_TOKENS.map((token, i) => (
          <text
            key={`row-${token}`}
            x={LABEL_W - 6}
            y={LABEL_H + i * CELL + CELL / 2 + 3}
            textAnchor='end'
            className={
              i === activeRow
                ? 'fill-cyan-700 dark:fill-cyan-400 font-semibold'
                : 'fill-slate-500 dark:fill-slate-400'
            }
          >
            {visibleSpaces(token)}
          </text>
        ))}
        {rows.map((weights, i) => {
          const dimmed = activeRow !== null && activeRow !== i;
          return (
            <g key={`row-cells-${i}`} opacity={dimmed ? 0.25 : 1}>
              {EXAMPLE_TOKENS.map((_, j) => {
                const cx = LABEL_W + j * CELL + CELL / 2;
                const cy = LABEL_H + i * CELL + CELL / 2;
                if (j > i) {
                  return (
                    <circle
                      key={j}
                      cx={cx}
                      cy={cy}
                      r={4}
                      strokeWidth={1}
                      className='fill-none stroke-slate-300 dark:stroke-slate-600'
                    />
                  );
                }
                const weight = weights[j]!;
                return (
                  <circle
                    key={j}
                    cx={cx}
                    cy={cy}
                    r={CELL / 2 - 3}
                    fillOpacity={0.15 + 0.85 * weight}
                    className='fill-cyan-700 dark:fill-cyan-400'
                  />
                );
              })}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function Readout({
  row,
  weights,
  strings,
}: {
  row: number;
  weights: readonly number[];
  strings: AttentionStrings;
}) {
  if (row === 0) {
    return (
      <span>
        <span className='font-semibold'>
          {visibleSpaces(EXAMPLE_TOKENS[0])}
        </span>{' '}
        {strings.selfOnlyNote}
      </span>
    );
  }

  const top3 = weights
    .map((weight, idx) => ({ idx, weight }))
    .filter((e) => e.idx !== row)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3);

  return (
    <div>
      <span className='font-semibold'>
        {visibleSpaces(EXAMPLE_TOKENS[row]!)}
      </span>{' '}
      {strings.attendsMost}
      <table className='mt-2 w-full'>
        <tbody>
          {top3.map((e) => (
            <tr key={e.idx}>
              <td className='pr-3'>{visibleSpaces(EXAMPLE_TOKENS[e.idx]!)}</td>
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
