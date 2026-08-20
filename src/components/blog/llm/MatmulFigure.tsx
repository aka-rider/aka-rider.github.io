'use client';

import { useState } from 'react';

import { EXAMPLE_TOKENS } from '@/components/blog/llm/example';
import { matmulStrings } from '@/components/blog/llm/strings/matmul';

import type { Lang } from '@/i18n';

type Variant = 'plain' | 'attention';

type Matrix = readonly (readonly number[])[];

const X_ROW: Matrix = [[2.0, 0.0, 1.0, -1.0]];

const W_MATRIX: Matrix = [
  [0.5, 0.9, -0.3],
  [1.0, -0.2, 0.4],
  [-0.5, 0.1, 0.8],
  [0.0, 0.0, 0.6],
];

const Q_MATRIX: Matrix = [
  [0.8, 0.2, 0.0],
  [0.2, 0.4, 0.2],
  [0.0, 0.2, 0.4],
  [0.6, 0.8, 0.2],
  [0.4, 1.2, 0.6],
  [0.8, 0.6, 0.4],
];

const K_MATRIX: Matrix = [
  [1.0, 0.0, 0.5],
  [0.0, 0.5, 0.0],
  [0.0, 0.0, 0.5],
  [0.5, 1.5, 0.0],
  [0.5, 1.0, 0.5],
  [1.0, 0.0, 0.0],
];

function transpose(m: Matrix): number[][] {
  const first = m[0] ?? [];
  return first.map((_, j) => m.map((row) => row[j] ?? 0));
}

function matmul(a: Matrix, b: Matrix): number[][] {
  return a.map((row) =>
    (b[0] ?? []).map((_, j) =>
      row.reduce((sum, v, k) => sum + v * (b[k]?.[j] ?? 0), 0),
    ),
  );
}

function fmt(v: number): string {
  const rounded = Math.abs(v) < 0.05 ? 0 : v;
  return rounded < 0 ? `−${Math.abs(rounded).toFixed(1)}` : rounded.toFixed(1);
}

function factor(v: number): string {
  return v < 0 ? `(${fmt(v)})` : fmt(v);
}

const SUBSCRIPTS = ['₁', '₂', '₃', '₄', '₅', '₆'] as const;

const GRID_STROKE = 'stroke-slate-300 dark:stroke-slate-600';
const PLAIN_FILL = 'fill-white dark:fill-slate-900';
const AMBER_FILL = 'fill-amber-50 dark:fill-amber-950/60';
const AMBER_TEXT = 'fill-amber-700 dark:fill-amber-400';
const AMBER_STROKE = 'stroke-amber-700 dark:stroke-amber-400';
const CYAN_FILL = 'fill-cyan-50 dark:fill-cyan-950/60';
const CYAN_TEXT = 'fill-cyan-700 dark:fill-cyan-400';
const CYAN_STROKE = 'stroke-cyan-700 dark:stroke-cyan-400';
const MASK_FILL = 'fill-slate-100 dark:fill-slate-800';
const MASK_TEXT = 'fill-slate-400 dark:fill-slate-500';
const MUTED_TEXT_CLASSES =
  'font-mono text-xs text-slate-500 dark:text-slate-400';

const CELL_BUTTON_CLASSES =
  'cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-700 dark:focus-visible:outline-cyan-400 focus-visible:outline-offset-2';

type Layout = {
  cell: number;
  fontSize: number;
  aX: number;
  aY: number;
  bX: number;
  bY: number;
  viewBox: string;
  maxWidthClass: string;
};

const LAYOUTS: Record<Variant, Layout> = {
  plain: {
    cell: 34,
    fontSize: 10,
    aX: 8,
    aY: 188,
    bX: 156,
    bY: 40,
    viewBox: '0 0 268 306',
    maxWidthClass: 'max-w-[320px]',
  },
  attention: {
    cell: 26,
    fontSize: 8,
    aX: 48,
    aY: 128,
    bX: 138,
    bY: 26,
    viewBox: '0 0 302 308',
    maxWidthClass: 'max-w-[360px]',
  },
};

function MatrixCell({
  x,
  y,
  size,
  text,
  rectClass,
  textClass,
  strokeWidth = 1,
  fontSize,
}: {
  x: number;
  y: number;
  size: number;
  text: string;
  rectClass: string;
  textClass?: string;
  strokeWidth?: number;
  fontSize: number;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={size}
        height={size}
        strokeWidth={strokeWidth}
        className={rectClass}
      />
      <text
        x={x + size / 2}
        y={y + size / 2 + fontSize * 0.36}
        textAnchor='middle'
        fontSize={fontSize}
        fill={textClass ? undefined : 'currentColor'}
        className={textClass}
      >
        {text}
      </text>
    </g>
  );
}

export default function MatmulFigure({
  lang,
  variant = 'plain',
}: {
  lang: Lang;
  variant?: Variant;
}) {
  const strings = matmulStrings[lang][variant];
  const { scoreWord } = matmulStrings[lang].attention;
  const layout = LAYOUTS[variant];
  const { cell, fontSize, aX, aY, bX, bY } = layout;

  const isAttention = variant === 'attention';
  const a = isAttention ? Q_MATRIX : X_ROW;
  const b = isAttention ? transpose(K_MATRIX) : W_MATRIX;
  const c = matmul(a, b);
  const inner = a[0]?.length ?? 0;
  const cRows = c.length;

  const [sel, setSel] = useState(
    isAttention ? { row: 4, col: 3 } : { row: 0, col: 1 },
  );

  function isMasked(row: number, col: number): boolean {
    return isAttention && col > row;
  }

  function selectCell(row: number, col: number) {
    if (!isMasked(row, col)) setSel({ row, col });
  }

  const terms = Array.from(
    { length: inner },
    (_, k) => `${fmt(a[sel.row]?.[k] ?? 0)}×${factor(b[k]?.[sel.col] ?? 0)}`,
  ).join(' + ');
  const selValue = c[sel.row]?.[sel.col] ?? 0;
  const result = fmt(selValue);
  const reluSuffix = !isAttention && selValue < 0 ? ' → ReLU → 0.0' : '';
  const expansion = isAttention
    ? `${scoreWord}('${EXAMPLE_TOKENS[sel.row]}', '${EXAMPLE_TOKENS[sel.col]}') = ${terms} = ${result}`
    : `y${SUBSCRIPTS[sel.col]} = ${terms} = ${result}${reluSuffix}`;

  const reluY = aY + cell + 28;
  const arrowX = bX + 1.5 * cell;

  const amberLineY = aY + sel.row * cell + cell / 2;
  const cyanLineX = bX + sel.col * cell + cell / 2;

  return (
    <div className='rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 my-6'>
      <div className={`${MUTED_TEXT_CLASSES} mb-3`}>{strings.hint}</div>

      <svg
        viewBox={layout.viewBox}
        role='group'
        aria-label={strings.aria}
        className={`w-full h-auto ${layout.maxWidthClass} mx-auto block`}
      >
        <g fontFamily='var(--font-mono)'>
          <text
            x={aX}
            y={aY - 8}
            fontSize={fontSize + 1}
            className={AMBER_TEXT}
          >
            {strings.aLabel}
          </text>
          <text
            x={isAttention ? bX - 8 : bX}
            y={isAttention ? bY + (3 * cell) / 2 : bY - 8}
            textAnchor={isAttention ? 'end' : 'start'}
            fontSize={fontSize + 1}
            className={CYAN_TEXT}
          >
            {strings.bLabel}
          </text>
          <text
            x={bX}
            y={aY + cRows * cell + 14}
            fontSize={fontSize + 1}
            className={CYAN_TEXT}
          >
            {strings.cLabel}
          </text>

          {isAttention
            ? EXAMPLE_TOKENS.map((token, i) => (
                <g key={`axis-${token}`} fontSize={fontSize}>
                  <text
                    x={aX - 4}
                    y={aY + i * cell + cell / 2 + 3}
                    textAnchor='end'
                    className={AMBER_TEXT}
                  >
                    {token.trim()}
                  </text>
                  <text
                    x={bX + i * cell + cell / 2}
                    y={bY - 5}
                    textAnchor='start'
                    transform={`rotate(-45 ${bX + i * cell + cell / 2} ${bY - 5})`}
                    className={AMBER_TEXT}
                  >
                    {token.trim()}
                  </text>
                </g>
              ))
            : null}

          <line
            x1={aX + inner * cell}
            y1={amberLineY}
            x2={bX + sel.col * cell}
            y2={amberLineY}
            strokeWidth={1.5}
            opacity={0.7}
            className={AMBER_STROKE}
          />
          <line
            x1={cyanLineX}
            y1={bY + inner * cell}
            x2={cyanLineX}
            y2={aY + sel.row * cell}
            strokeWidth={1.5}
            opacity={0.7}
            className={CYAN_STROKE}
          />

          {a.map((row, r) =>
            row.map((value, k) => (
              <MatrixCell
                key={`a-${r}-${k}`}
                x={aX + k * cell}
                y={aY + r * cell}
                size={cell}
                text={fmt(value)}
                fontSize={fontSize}
                rectClass={`${GRID_STROKE} ${r === sel.row ? AMBER_FILL : PLAIN_FILL}`}
                textClass={r === sel.row ? AMBER_TEXT : undefined}
              />
            )),
          )}

          {b.map((row, k) =>
            row.map((value, j) => (
              <MatrixCell
                key={`b-${k}-${j}`}
                x={bX + j * cell}
                y={bY + k * cell}
                size={cell}
                text={fmt(value)}
                fontSize={fontSize}
                rectClass={`${GRID_STROKE} ${j === sel.col ? CYAN_FILL : PLAIN_FILL}`}
                textClass={j === sel.col ? CYAN_TEXT : undefined}
              />
            )),
          )}

          {c.map((row, r) =>
            row.map((value, j) => {
              if (isMasked(r, j)) {
                return (
                  <MatrixCell
                    key={`c-${r}-${j}`}
                    x={bX + j * cell}
                    y={aY + r * cell}
                    size={cell}
                    text='−∞'
                    fontSize={fontSize}
                    rectClass={`${GRID_STROKE} ${MASK_FILL}`}
                    textClass={MASK_TEXT}
                  />
                );
              }
              const selected = r === sel.row && j === sel.col;
              return (
                <g
                  key={`c-${r}-${j}`}
                  role='button'
                  tabIndex={0}
                  aria-pressed={selected}
                  aria-label={
                    isAttention
                      ? `${scoreWord} ${EXAMPLE_TOKENS[r]} × ${EXAMPLE_TOKENS[j]} = ${fmt(value)}`
                      : `y${SUBSCRIPTS[j]} = ${fmt(value)}`
                  }
                  onClick={() => selectCell(r, j)}
                  onFocus={() => selectCell(r, j)}
                  onKeyDown={(event) => {
                    if (event.key !== 'Enter' && event.key !== ' ') return;
                    event.preventDefault();
                    selectCell(r, j);
                  }}
                  className={CELL_BUTTON_CLASSES}
                >
                  <MatrixCell
                    x={bX + j * cell}
                    y={aY + r * cell}
                    size={cell}
                    text={fmt(value)}
                    fontSize={fontSize}
                    strokeWidth={selected ? 2 : 1}
                    rectClass={
                      selected
                        ? `${CYAN_STROKE} ${CYAN_FILL}`
                        : `${GRID_STROKE} ${PLAIN_FILL}`
                    }
                    textClass={selected ? CYAN_TEXT : undefined}
                  />
                </g>
              );
            }),
          )}

          {'reluLabel' in strings ? (
            <g>
              <line
                x1={arrowX}
                y1={aY + cell + 4}
                x2={arrowX}
                y2={reluY - 7}
                strokeWidth={1.5}
                className={CYAN_STROKE}
              />
              <polygon
                points={`${arrowX},${reluY - 2} ${arrowX - 3.5},${reluY - 8.5} ${arrowX + 3.5},${reluY - 8.5}`}
                className='fill-cyan-700 dark:fill-cyan-400'
              />
              {(c[0] ?? []).map((value, j) => {
                const clamped = value < 0;
                return (
                  <MatrixCell
                    key={`relu-${j}`}
                    x={bX + j * cell}
                    y={reluY}
                    size={cell}
                    text={fmt(Math.max(0, value))}
                    fontSize={fontSize}
                    rectClass={`${GRID_STROKE} ${clamped ? MASK_FILL : PLAIN_FILL}`}
                    textClass={clamped ? MASK_TEXT : undefined}
                  />
                );
              })}
              <text
                x={bX}
                y={reluY + cell + 14}
                fontSize={fontSize + 1}
                className={CYAN_TEXT}
              >
                {strings.reluLabel}
              </text>
            </g>
          ) : null}
        </g>
      </svg>

      {'reluNote' in strings ? (
        <div className={`${MUTED_TEXT_CLASSES} mt-2`}>{strings.reluNote}</div>
      ) : null}

      <div
        aria-live='polite'
        className={
          'font-mono text-xs sm:text-sm mt-4 overflow-x-auto whitespace-nowrap scrollbar-hide text-slate-900 dark:text-slate-100 [color-scheme:light] dark:[color-scheme:dark] ' +
          '[mask-image:linear-gradient(to_right,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_16px,rgba(0,0,0,1)_calc(100%-16px),rgba(0,0,0,0)_100%)] ' +
          'md:[mask-image:none]'
        }
      >
        {expansion}
      </div>
      <div className={`${MUTED_TEXT_CLASSES} mt-1`}>
        {strings.interpretation}
      </div>

      <div className={`${MUTED_TEXT_CLASSES} mt-3 space-y-0.5`}>
        {strings.legend.map((line) => (
          <div key={line}>{line}</div>
        ))}
        {'maskLegend' in strings ? <div>{strings.maskLegend}</div> : null}
        {'flowNote' in strings ? <div>{strings.flowNote}</div> : null}
      </div>

      <div
        className={`${MUTED_TEXT_CLASSES} border-t border-dashed border-slate-300 dark:border-slate-600 pt-2.5 mt-4`}
      >
        {strings.honesty}
      </div>
    </div>
  );
}
