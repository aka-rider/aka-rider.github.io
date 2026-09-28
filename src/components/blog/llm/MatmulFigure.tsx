'use client';

import { useState } from 'react';

import { ATTENTION_HEADS } from '@/components/blog/llm/AttentionDemo';
import { EXAMPLE_TOKENS } from '@/components/blog/llm/example';
import { visibleSpaces } from '@/components/blog/llm/format';
import { gelu, softmax } from '@/components/blog/llm/math';
import { matmulStrings } from '@/components/blog/llm/strings/matmul';
import {
  AMBER_FILL,
  CYAN_FILL,
  EXAMPLE_TOKEN_ROWS,
  finalEmbedding,
  NEG_FILL,
  opacityFor,
  SKY_FILL,
  StripCells,
  TEAL_FILL,
  tokenRow,
} from '@/components/blog/llm/vectors';

import type { Lang } from '@/i18n';

type Variant = 'plain' | 'attention';

const GROUP_LEN = 6;
const GROUPS = 3;
const OUTPUT_LEN = GROUPS * GROUP_LEN;
const INPUT_LEN = 8;
const MATRIX_ROWS = INPUT_LEN;
const ROWS = EXAMPLE_TOKEN_ROWS.length;

function groupOf(col: number): number {
  return Math.floor(col / GROUP_LEN);
}

function groupedOffset(
  col: number,
  cell: number,
  gap: number,
  groupGap: number,
): number {
  const group = groupOf(col);
  const withinGroup = col % GROUP_LEN;
  return (
    group * (GROUP_LEN * (cell + gap) + groupGap) + withinGroup * (cell + gap)
  );
}

function groupBlockWidth(cell: number, gap: number): number {
  return GROUP_LEN * (cell + gap) - gap;
}

function weightAt(row: number, col: number): number {
  return Math.sin((row * 3 + col * 7) * 0.35);
}

function biasAt(col: number): number {
  return Math.cos(col * 0.5) * 0.4;
}

const WEIGHTS: number[][] = Array.from({ length: MATRIX_ROWS }, (_, r) =>
  Array.from({ length: OUTPUT_LEN }, (_, c) => weightAt(r, c)),
);

const BIAS: number[] = Array.from({ length: OUTPUT_LEN }, (_, c) => biasAt(c));

const INPUT_ROWS: number[][] = EXAMPLE_TOKEN_ROWS.map((row) =>
  finalEmbedding(row.id, row.index),
);

function dot(row: readonly number[], col: number): number {
  return row.reduce((sum, value, k) => sum + value * WEIGHTS[k]![col]!, 0);
}

const OUTPUT_ROWS: number[][] = INPUT_ROWS.map((row) =>
  Array.from(
    { length: OUTPUT_LEN },
    (_, c) => dot(row, c) / MATRIX_ROWS + BIAS[c]!,
  ),
);

const REP_ROW = tokenRow(' Tower').index;
const GELU_ROW: number[] = OUTPUT_ROWS[REP_ROW]!.map(gelu);

const GROUP_POS_CLASSES = [CYAN_FILL, TEAL_FILL, SKY_FILL] as const;

const GROUP_STROKE_CLASSES = [
  'stroke-cyan-700 dark:stroke-cyan-400',
  'stroke-teal-700 dark:stroke-teal-400',
  'stroke-sky-700 dark:stroke-sky-400',
] as const;

const INPUT_CLASS = 'fill-slate-700 dark:fill-slate-300';
const SVG_MUTED = 'fill-slate-500 dark:fill-slate-400';
const GRID_STROKE_CLASS = 'stroke-slate-300 dark:stroke-slate-600';
const MUTED_TEXT_CLASSES =
  'font-mono text-xs text-slate-500 dark:text-slate-400';
const CELL_BUTTON_CLASSES =
  'cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-700 dark:focus-visible:outline-cyan-400 focus-visible:outline-offset-2';

function groupedClass(col: number, value: number): string {
  if (value < 0) return NEG_FILL;
  return GROUP_POS_CLASSES[groupOf(col)]!;
}

function TokenLabel({
  x,
  y,
  token,
  id,
  fontSize = 9,
  idFontSize = 6.5,
}: {
  x: number;
  y: number;
  token: string;
  id: number;
  fontSize?: number;
  idFontSize?: number;
}) {
  return (
    <text x={x} y={y + 3} textAnchor='end' fontSize={fontSize}>
      <tspan className={AMBER_FILL}>{visibleSpaces(token)}</tspan>
      <tspan dx={3} fontSize={idFontSize} className={SVG_MUTED}>
        #{id}
      </tspan>
    </text>
  );
}

function ColumnHeader({
  x,
  y,
  label,
  fontSize = 7,
}: {
  x: number;
  y: number;
  label: string;
  fontSize?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor='middle'
      fontSize={fontSize}
      className={SVG_MUTED}
    >
      {label}
    </text>
  );
}

function GroupLabels({
  x,
  y,
  cell,
  gap,
  groupGap,
  labels,
  fontSize = 7,
}: {
  x: number;
  y: number;
  cell: number;
  gap: number;
  groupGap: number;
  labels: readonly string[];
  fontSize?: number;
}) {
  const blockWidth = groupBlockWidth(cell, gap);
  return (
    <>
      {GROUP_POS_CLASSES.map((cls, group) => (
        <text
          key={group}
          x={x + group * (blockWidth + groupGap) + blockWidth / 2}
          y={y}
          textAnchor='middle'
          fontSize={fontSize}
          fontWeight={700}
          className={cls}
        >
          {labels[group]!}
        </text>
      ))}
    </>
  );
}

function BiasColumn({
  x,
  y,
  cellWidth,
  cellHeight,
  gap,
}: {
  x: number;
  y: number;
  cellWidth: number;
  cellHeight: number;
  gap: number;
}) {
  return (
    <g aria-hidden='true'>
      {BIAS.map((value, c) => (
        <rect
          key={c}
          x={x}
          y={y + c * (cellHeight + gap)}
          width={cellWidth}
          height={cellHeight}
          fillOpacity={opacityFor(value)}
          className={groupedClass(c, value)}
        />
      ))}
    </g>
  );
}

function InputRows({
  tokenLabelRight,
  x,
  listTop,
  rowH,
  cell,
  gap,
  fontSize,
  idFontSize,
}: {
  tokenLabelRight: number;
  x: number;
  listTop: number;
  rowH: number;
  cell: number;
  gap: number;
  fontSize?: number;
  idFontSize?: number;
}) {
  return (
    <>
      {EXAMPLE_TOKEN_ROWS.map((row) => {
        const y = listTop + row.index * rowH + rowH / 2;
        return (
          <g key={row.index}>
            <TokenLabel
              x={tokenLabelRight}
              y={y}
              token={row.token}
              id={row.id}
              fontSize={fontSize}
              idFontSize={idFontSize}
            />
            <StripCells
              values={INPUT_ROWS[row.index]!}
              x={x}
              y={y}
              cellWidth={cell}
              cellHeight={rowH - 4}
              gap={gap}
              colorFor={() => INPUT_CLASS}
            />
          </g>
        );
      })}
    </>
  );
}

function WidePlainMatmul({
  lang,
  hoverCol,
  setHoverCol,
}: {
  lang: Lang;
  hoverCol: number;
  setHoverCol: (col: number) => void;
}) {
  const strings = matmulStrings[lang].plain;
  const hoverGroup = groupOf(hoverCol);
  const hoverStroke = GROUP_STROKE_CLASSES[hoverGroup]!;

  const CELL = 6;
  const GAP = 1;
  const GROUP_GAP = 6;
  const OUTPUT_WIDTH =
    groupedOffset(OUTPUT_LEN - 1, CELL, GAP, GROUP_GAP) + CELL;
  const INPUT_WIDTH = INPUT_LEN * (CELL + GAP) - GAP;

  const ROW_H = 16;
  const LIST_TOP = 34;
  const LIST_HEIGHT = ROWS * ROW_H;

  const TOKEN_LABEL_RIGHT = 64;
  const INPUT_X = TOKEN_LABEL_RIGHT + 8;
  const INPUT_END = INPUT_X + INPUT_WIDTH;

  const TIMES_X = INPUT_END + 12;
  const MATRIX_X = TIMES_X + 10;
  const MATRIX_HEIGHT = MATRIX_ROWS * (CELL + GAP) - GAP;
  const MATRIX_Y = LIST_TOP + (LIST_HEIGHT - MATRIX_HEIGHT) / 2;

  const PLUS_X = MATRIX_X + OUTPUT_WIDTH + 10;
  const BIAS_X = PLUS_X + 8;
  const BIAS_GAP = 0.6;
  const BIAS_CELL_H = (LIST_HEIGHT - (OUTPUT_LEN - 1) * BIAS_GAP) / OUTPUT_LEN;

  const EQUALS_X = BIAS_X + CELL + 10;
  const OUTPUT_X = EQUALS_X + 8;
  const OUTPUT_END = OUTPUT_X + OUTPUT_WIDTH;

  const GELU_Y = LIST_TOP + LIST_HEIGHT + 34;

  const VIEW_WIDTH = OUTPUT_END + 12;
  const VIEW_HEIGHT = GELU_Y + 14;

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      role='group'
      aria-label={strings.aria}
      className='hidden sm:block w-full h-auto max-w-[600px] mx-auto'
    >
      <defs>
        <marker
          id='llmMatmulArrow'
          viewBox='0 0 8 8'
          refX='7'
          refY='4'
          markerWidth='6'
          markerHeight='6'
          orient='auto-start-reverse'
        >
          <path
            d='M0 0L8 4L0 8Z'
            className='fill-slate-500 dark:fill-slate-400'
          />
        </marker>
      </defs>
      <g fontFamily='var(--font-mono)'>
        <ColumnHeader
          x={INPUT_X + INPUT_WIDTH / 2}
          y={10}
          label={strings.inputLabel}
        />
        <ColumnHeader
          x={MATRIX_X + OUTPUT_WIDTH / 2}
          y={10}
          label={strings.weightLabel}
        />
        <ColumnHeader x={BIAS_X + CELL / 2} y={10} label={strings.biasLabel} />
        <ColumnHeader
          x={OUTPUT_X + OUTPUT_WIDTH / 2}
          y={10}
          label={strings.outputLabel}
        />

        <GroupLabels
          x={MATRIX_X}
          y={MATRIX_Y - 5}
          cell={CELL}
          gap={GAP}
          groupGap={GROUP_GAP}
          labels={strings.groupLabels}
        />
        <GroupLabels
          x={OUTPUT_X}
          y={LIST_TOP - 5}
          cell={CELL}
          gap={GAP}
          groupGap={GROUP_GAP}
          labels={strings.groupLabels}
        />

        <InputRows
          tokenLabelRight={TOKEN_LABEL_RIGHT}
          x={INPUT_X}
          listTop={LIST_TOP}
          rowH={ROW_H}
          cell={CELL}
          gap={GAP}
        />

        {EXAMPLE_TOKEN_ROWS.map((row) => {
          const y = LIST_TOP + row.index * ROW_H + ROW_H / 2;
          const outputValues = OUTPUT_ROWS[row.index]!;
          if (row.index !== REP_ROW) {
            return (
              <StripCells
                key={row.index}
                values={outputValues}
                x={OUTPUT_X}
                y={y}
                cellWidth={CELL}
                cellHeight={ROW_H - 4}
                gap={GAP}
                offsetFor={(col) => groupedOffset(col, CELL, GAP, GROUP_GAP)}
                colorFor={groupedClass}
              />
            );
          }
          return (
            <g key={row.index}>
              {outputValues.map((value, col) => {
                const selected = col === hoverCol;
                const group = groupOf(col);
                return (
                  <g
                    key={col}
                    role='button'
                    tabIndex={0}
                    aria-pressed={selected}
                    aria-label={`${strings.groupLabels[group]!} ${(col % GROUP_LEN) + 1} — ${visibleSpaces(row.token)}`}
                    onMouseEnter={() => setHoverCol(col)}
                    onFocus={() => setHoverCol(col)}
                    onClick={() => setHoverCol(col)}
                    onKeyDown={(event) => {
                      if (event.key !== 'Enter' && event.key !== ' ') return;
                      event.preventDefault();
                      setHoverCol(col);
                    }}
                    className={CELL_BUTTON_CLASSES}
                  >
                    <rect
                      x={OUTPUT_X + groupedOffset(col, CELL, GAP, GROUP_GAP)}
                      y={y - (ROW_H - 4) / 2}
                      width={CELL}
                      height={ROW_H - 4}
                      fillOpacity={opacityFor(value)}
                      strokeWidth={selected ? 1.5 : 0}
                      className={`${groupedClass(col, value)} ${selected ? hoverStroke : ''}`}
                    />
                  </g>
                );
              })}
            </g>
          );
        })}

        {WEIGHTS.map((row, r) =>
          row.map((value, c) => (
            <rect
              key={`w-${r}-${c}`}
              x={MATRIX_X + groupedOffset(c, CELL, GAP, GROUP_GAP)}
              y={MATRIX_Y + r * (CELL + GAP)}
              width={CELL}
              height={CELL}
              fillOpacity={opacityFor(value)}
              className={groupedClass(c, value)}
            />
          )),
        )}

        <BiasColumn
          x={BIAS_X}
          y={LIST_TOP}
          cellWidth={CELL}
          cellHeight={BIAS_CELL_H}
          gap={BIAS_GAP}
        />

        <rect
          x={MATRIX_X + groupedOffset(hoverCol, CELL, GAP, GROUP_GAP) - 1.5}
          y={MATRIX_Y - 1.5}
          width={CELL + 3}
          height={MATRIX_HEIGHT + 3}
          fill='none'
          strokeWidth={1.5}
          className={hoverStroke}
        />
        <rect
          x={OUTPUT_X + groupedOffset(hoverCol, CELL, GAP, GROUP_GAP) - 1.5}
          y={LIST_TOP - 1.5}
          width={CELL + 3}
          height={LIST_HEIGHT + 3}
          fill='none'
          strokeWidth={1.5}
          className={hoverStroke}
        />

        <text
          x={TIMES_X}
          y={MATRIX_Y + MATRIX_HEIGHT / 2 + 3}
          textAnchor='middle'
          fontSize={11}
          className={SVG_MUTED}
        >
          ×
        </text>
        <text
          x={PLUS_X}
          y={MATRIX_Y + MATRIX_HEIGHT / 2 + 3}
          textAnchor='middle'
          fontSize={11}
          className={SVG_MUTED}
        >
          +
        </text>
        <text
          x={EQUALS_X}
          y={MATRIX_Y + MATRIX_HEIGHT / 2 + 3}
          textAnchor='middle'
          fontSize={11}
          className={SVG_MUTED}
        >
          =
        </text>

        <line
          x1={OUTPUT_X + OUTPUT_WIDTH / 2}
          y1={LIST_TOP + LIST_HEIGHT + 2}
          x2={OUTPUT_X + OUTPUT_WIDTH / 2}
          y2={GELU_Y - 12}
          strokeWidth={1.2}
          markerEnd='url(#llmMatmulArrow)'
          className='stroke-slate-500 dark:stroke-slate-400'
        />
        <text
          x={OUTPUT_X + OUTPUT_WIDTH / 2}
          y={GELU_Y - 16}
          textAnchor='middle'
          fontSize={7}
          className={SVG_MUTED}
        >
          {strings.gelu.label}
        </text>
        <StripCells
          values={GELU_ROW}
          x={OUTPUT_X}
          y={GELU_Y}
          cellWidth={CELL}
          cellHeight={CELL}
          gap={GAP}
          offsetFor={(col) => groupedOffset(col, CELL, GAP, GROUP_GAP)}
          colorFor={groupedClass}
        />
      </g>
    </svg>
  );
}

function NarrowPlainMatmul({
  lang,
  hoverCol,
  setHoverCol,
}: {
  lang: Lang;
  hoverCol: number;
  setHoverCol: (col: number) => void;
}) {
  const strings = matmulStrings[lang].plain;
  const hoverGroup = groupOf(hoverCol);
  const hoverStroke = GROUP_STROKE_CLASSES[hoverGroup]!;

  const CELL = 8;
  const GAP = 1;
  const GROUP_GAP = 8;
  const OUTPUT_WIDTH =
    groupedOffset(OUTPUT_LEN - 1, CELL, GAP, GROUP_GAP) + CELL;
  const INPUT_WIDTH = INPUT_LEN * (CELL + GAP) - GAP;
  const MATRIX_HEIGHT = MATRIX_ROWS * (CELL + GAP) - GAP;

  const ROW_H = 22;
  const LIST_HEIGHT = ROWS * ROW_H;

  const TOKEN_LABEL_RIGHT = 70;
  const CENTER_X = TOKEN_LABEL_RIGHT + 8 + OUTPUT_WIDTH / 2;
  const VIEW_WIDTH = CENTER_X + OUTPUT_WIDTH / 2 + 16;

  const INPUT_TOP = 30;
  const INPUT_BOTTOM = INPUT_TOP + LIST_HEIGHT;
  const TIMES_Y = INPUT_BOTTOM + 16;
  const MATRIX_TOP = TIMES_Y + 16;
  const MATRIX_BOTTOM = MATRIX_TOP + MATRIX_HEIGHT;
  const PLUS_Y = MATRIX_BOTTOM + 16;
  const BIAS_TOP = PLUS_Y + 16;
  const BIAS_HEIGHT = 90;
  const BIAS_GAP = 0.6;
  const BIAS_CELL_H = (BIAS_HEIGHT - (OUTPUT_LEN - 1) * BIAS_GAP) / OUTPUT_LEN;
  const BIAS_BOTTOM = BIAS_TOP + BIAS_HEIGHT;
  const EQUALS_Y = BIAS_BOTTOM + 16;
  const OUTPUT_TOP = EQUALS_Y + 16;
  const OUTPUT_BOTTOM = OUTPUT_TOP + LIST_HEIGHT;
  const GELU_ARROW_Y = OUTPUT_BOTTOM + 16;
  const GELU_Y = GELU_ARROW_Y + 20;

  const VIEW_HEIGHT = GELU_Y + 16;

  const MATRIX_X = CENTER_X - OUTPUT_WIDTH / 2;
  const BIAS_X = CENTER_X - CELL / 2;
  const INPUT_X = TOKEN_LABEL_RIGHT + 8;
  const OUTPUT_X = TOKEN_LABEL_RIGHT + 8;

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      role='group'
      aria-label={strings.aria}
      className='sm:hidden w-full h-auto max-w-[320px] mx-auto'
    >
      <g fontFamily='var(--font-mono)'>
        <ColumnHeader
          x={INPUT_X + INPUT_WIDTH / 2}
          y={12}
          label={strings.inputLabel}
          fontSize={8}
        />
        <InputRows
          tokenLabelRight={TOKEN_LABEL_RIGHT}
          x={INPUT_X}
          listTop={INPUT_TOP}
          rowH={ROW_H}
          cell={CELL}
          gap={GAP}
          fontSize={10}
          idFontSize={7}
        />

        <text
          x={CENTER_X}
          y={TIMES_Y + 4}
          textAnchor='middle'
          fontSize={13}
          className={SVG_MUTED}
        >
          ×
        </text>

        <ColumnHeader
          x={CENTER_X}
          y={MATRIX_TOP - 8}
          label={strings.weightLabel}
          fontSize={8}
        />
        <GroupLabels
          x={MATRIX_X}
          y={MATRIX_TOP - 18}
          cell={CELL}
          gap={GAP}
          groupGap={GROUP_GAP}
          labels={strings.groupLabels}
          fontSize={9}
        />
        {WEIGHTS.map((row, r) =>
          row.map((value, c) => (
            <rect
              key={`nw-${r}-${c}`}
              x={MATRIX_X + groupedOffset(c, CELL, GAP, GROUP_GAP)}
              y={MATRIX_TOP + r * (CELL + GAP)}
              width={CELL}
              height={CELL}
              fillOpacity={opacityFor(value)}
              className={groupedClass(c, value)}
            />
          )),
        )}
        <rect
          x={MATRIX_X + groupedOffset(hoverCol, CELL, GAP, GROUP_GAP) - 1.5}
          y={MATRIX_TOP - 1.5}
          width={CELL + 3}
          height={MATRIX_HEIGHT + 3}
          fill='none'
          strokeWidth={1.5}
          className={hoverStroke}
        />

        <text
          x={CENTER_X}
          y={PLUS_Y + 4}
          textAnchor='middle'
          fontSize={13}
          className={SVG_MUTED}
        >
          +
        </text>

        <ColumnHeader
          x={CENTER_X}
          y={BIAS_TOP - 8}
          label={strings.biasLabel}
          fontSize={8}
        />
        <BiasColumn
          x={BIAS_X}
          y={BIAS_TOP}
          cellWidth={CELL}
          cellHeight={BIAS_CELL_H}
          gap={BIAS_GAP}
        />

        <text
          x={CENTER_X}
          y={EQUALS_Y + 4}
          textAnchor='middle'
          fontSize={13}
          className={SVG_MUTED}
        >
          =
        </text>

        <ColumnHeader
          x={OUTPUT_X + OUTPUT_WIDTH / 2}
          y={OUTPUT_TOP - 8}
          label={strings.outputLabel}
          fontSize={8}
        />
        <GroupLabels
          x={OUTPUT_X}
          y={OUTPUT_TOP - 18}
          cell={CELL}
          gap={GAP}
          groupGap={GROUP_GAP}
          labels={strings.groupLabels}
          fontSize={9}
        />
        {EXAMPLE_TOKEN_ROWS.map((row) => {
          const y = OUTPUT_TOP + row.index * ROW_H + ROW_H / 2;
          const outputValues = OUTPUT_ROWS[row.index]!;
          return (
            <g key={row.index}>
              <TokenLabel
                x={TOKEN_LABEL_RIGHT}
                y={y}
                token={row.token}
                id={row.id}
                fontSize={10}
                idFontSize={7}
              />
              {row.index === REP_ROW ? (
                outputValues.map((value, col) => {
                  const selected = col === hoverCol;
                  return (
                    <rect
                      key={col}
                      role='button'
                      tabIndex={0}
                      aria-pressed={selected}
                      onClick={() => setHoverCol(col)}
                      x={OUTPUT_X + groupedOffset(col, CELL, GAP, GROUP_GAP)}
                      y={y - (ROW_H - 4) / 2}
                      width={CELL}
                      height={ROW_H - 4}
                      fillOpacity={opacityFor(value)}
                      strokeWidth={selected ? 1.5 : 0}
                      className={`${groupedClass(col, value)} ${selected ? hoverStroke : ''} ${CELL_BUTTON_CLASSES}`}
                    />
                  );
                })
              ) : (
                <StripCells
                  values={outputValues}
                  x={OUTPUT_X}
                  y={y}
                  cellWidth={CELL}
                  cellHeight={ROW_H - 4}
                  gap={GAP}
                  offsetFor={(col) => groupedOffset(col, CELL, GAP, GROUP_GAP)}
                  colorFor={groupedClass}
                />
              )}
            </g>
          );
        })}
        <rect
          x={OUTPUT_X + groupedOffset(hoverCol, CELL, GAP, GROUP_GAP) - 1.5}
          y={OUTPUT_TOP - 1.5}
          width={CELL + 3}
          height={LIST_HEIGHT + 3}
          fill='none'
          strokeWidth={1.5}
          className={hoverStroke}
        />

        <text
          x={CENTER_X}
          y={GELU_ARROW_Y + 4}
          textAnchor='middle'
          fontSize={10}
          className={SVG_MUTED}
        >
          ↓ {strings.gelu.label}
        </text>
        <StripCells
          values={GELU_ROW}
          x={OUTPUT_X}
          y={GELU_Y}
          cellWidth={CELL}
          cellHeight={CELL}
          gap={GAP}
          offsetFor={(col) => groupedOffset(col, CELL, GAP, GROUP_GAP)}
          colorFor={groupedClass}
        />
      </g>
    </svg>
  );
}

function PlainMatmul({ lang }: { lang: Lang }) {
  const strings = matmulStrings[lang].plain;
  const [hoverCol, setHoverCol] = useState(2);

  return (
    <div className='rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 my-6'>
      <div className={`${MUTED_TEXT_CLASSES} mb-3`}>{strings.hint}</div>

      <WidePlainMatmul
        lang={lang}
        hoverCol={hoverCol}
        setHoverCol={setHoverCol}
      />
      <NarrowPlainMatmul
        lang={lang}
        hoverCol={hoverCol}
        setHoverCol={setHoverCol}
      />

      <div className={`${MUTED_TEXT_CLASSES} mt-2`}>{strings.gelu.note}</div>

      <div className={`${MUTED_TEXT_CLASSES} mt-3 space-y-0.5`}>
        {strings.legend.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>

      <div
        className={`${MUTED_TEXT_CLASSES} border-t border-dashed border-slate-300 dark:border-slate-600 pt-2.5 mt-4`}
      >
        {strings.honesty}
      </div>
    </div>
  );
}

const LOCATE_WEIGHTS = ATTENTION_HEADS.locate;
const ATTENTION_SCALE = Math.sqrt(64);

function maskedRawScore(row: number, col: number): number {
  const syntheticWeight = 0.3 + 0.25 * Math.cos(row * 2.3 + col * 3.7);
  return ATTENTION_SCALE * Math.log(syntheticWeight);
}

function rawScoreAt(row: number, col: number): number {
  if (col > row) return maskedRawScore(row, col);
  const weight = LOCATE_WEIGHTS[row]?.[col];
  if (weight === undefined) {
    throw new Error(`MatmulFigure: no locate weight at [${row}][${col}]`);
  }
  return ATTENTION_SCALE * Math.log(weight);
}

const RAW_SCORES: number[][] = Array.from({ length: ROWS }, (_, r) =>
  Array.from({ length: ROWS }, (_, c) => rawScoreAt(r, c)),
);

const ALL_RAW_SCORES = RAW_SCORES.flat();
const RAW_MIN = Math.min(...ALL_RAW_SCORES);
const RAW_MAX = Math.max(...ALL_RAW_SCORES);

function normalizedScore(row: number, col: number): number {
  const value = RAW_SCORES[row]![col]!;
  return (value - RAW_MIN) / (RAW_MAX - RAW_MIN || 1);
}

function isCausallyMasked(row: number, col: number): boolean {
  return col > row;
}

const SOFTMAX_ROWS: number[][] = RAW_SCORES.map((row, r) => {
  const scaled = row.map((value) => value / ATTENTION_SCALE);
  const weights = softmax(scaled.slice(0, r + 1), 1);
  return scaled.map((_, c) => (c <= r ? weights[c]! : 0));
});

function AttentionGrid({
  x,
  y,
  cell,
  masked,
  opacityForCell,
}: {
  x: number;
  y: number;
  cell: number;
  masked: (row: number, col: number) => boolean;
  opacityForCell: (row: number, col: number) => number;
}) {
  return (
    <g aria-hidden='true'>
      {Array.from({ length: ROWS }, (_, r) =>
        Array.from({ length: ROWS }, (_, c) => (
          <rect
            key={`${r}-${c}`}
            x={x + c * (cell + 1)}
            y={y + r * (cell + 1)}
            width={cell}
            height={cell}
            strokeWidth={0.5}
            fillOpacity={masked(r, c) ? 0 : opacityForCell(r, c)}
            className={`${GRID_STROKE_CLASS} ${CYAN_FILL}`}
          />
        )),
      )}
    </g>
  );
}

function GridTokenLabels({
  x,
  y,
  cell,
  fontSize = 8,
}: {
  x: number;
  y: number;
  cell: number;
  fontSize?: number;
}) {
  return (
    <>
      {EXAMPLE_TOKENS.map((token, r) => (
        <text
          key={`row-${r}`}
          x={x - 4}
          y={y + r * (cell + 1) + cell / 2 + 3}
          textAnchor='end'
          fontSize={fontSize}
          className={AMBER_FILL}
        >
          {visibleSpaces(token)}
        </text>
      ))}
      {EXAMPLE_TOKENS.map((token, c) => {
        const cx = x + c * (cell + 1) + cell / 2;
        const cy = y - 6;
        return (
          <text
            key={`col-${c}`}
            x={cx}
            y={cy}
            textAnchor='start'
            fontSize={fontSize}
            transform={`rotate(-45 ${cx} ${cy})`}
            className={AMBER_FILL}
          >
            {visibleSpaces(token)}
          </text>
        );
      })}
    </>
  );
}

function WideAttentionMatmul({ lang }: { lang: Lang }) {
  const strings = matmulStrings[lang].attention;
  const CELL_A = 13;
  const GRID_SIZE = ROWS * (CELL_A + 1) - 1;
  const GRID_GAP = 22;
  const LABEL_COL = 40;
  const GRID_TOP = 44;
  const GRID1_X = LABEL_COL;
  const GRID2_X = GRID1_X + GRID_SIZE + GRID_GAP;
  const GRID3_X = GRID2_X + GRID_SIZE + GRID_GAP;
  const VIEW_WIDTH = GRID3_X + GRID_SIZE + 12;
  const VIEW_HEIGHT = GRID_TOP + GRID_SIZE + 34;

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      role='img'
      aria-label={strings.aria}
      className='hidden sm:block w-full h-auto max-w-[440px] mx-auto'
    >
      <g fontFamily='var(--font-mono)'>
        <GridTokenLabels x={GRID1_X} y={GRID_TOP} cell={CELL_A} />
        <AttentionGrid
          x={GRID1_X}
          y={GRID_TOP}
          cell={CELL_A}
          masked={() => false}
          opacityForCell={normalizedScore}
        />
        <AttentionGrid
          x={GRID2_X}
          y={GRID_TOP}
          cell={CELL_A}
          masked={isCausallyMasked}
          opacityForCell={normalizedScore}
        />
        <AttentionGrid
          x={GRID3_X}
          y={GRID_TOP}
          cell={CELL_A}
          masked={isCausallyMasked}
          opacityForCell={(r, c) => SOFTMAX_ROWS[r]![c]!}
        />

        <text
          x={GRID1_X + GRID_SIZE / 2}
          y={GRID_TOP + GRID_SIZE + 14}
          textAnchor='middle'
          fontSize={8}
          className={SVG_MUTED}
        >
          {strings.dotLabel}
        </text>
        <text
          x={GRID2_X + GRID_SIZE / 2}
          y={GRID_TOP + GRID_SIZE + 14}
          textAnchor='middle'
          fontSize={8}
          className={SVG_MUTED}
        >
          {strings.scaleLabel}
        </text>
        <text
          x={GRID2_X + GRID_SIZE / 2}
          y={GRID_TOP + GRID_SIZE + 24}
          textAnchor='middle'
          fontSize={7}
          className={SVG_MUTED}
        >
          {strings.scale}
        </text>
        <text
          x={GRID3_X + GRID_SIZE / 2}
          y={GRID_TOP + GRID_SIZE + 14}
          textAnchor='middle'
          fontSize={8}
          className={SVG_MUTED}
        >
          {strings.softmaxLabel}
        </text>
      </g>
    </svg>
  );
}

function NarrowAttentionMatmul({ lang }: { lang: Lang }) {
  const strings = matmulStrings[lang].attention;
  const CELL_A = 15;
  const GRID_SIZE = ROWS * (CELL_A + 1) - 1;
  const LABEL_COL = 40;
  const GRID_TOP = 50;
  const BLOCK_H = GRID_TOP + GRID_SIZE + 30;
  const VIEW_WIDTH = LABEL_COL + GRID_SIZE + 12;
  const VIEW_HEIGHT = BLOCK_H * 3;

  const sections = [
    {
      label: strings.dotLabel,
      masked: () => false,
      opacity: normalizedScore,
      sub: undefined,
    },
    {
      label: strings.scaleLabel,
      masked: isCausallyMasked,
      opacity: normalizedScore,
      sub: strings.scale,
    },
    {
      label: strings.softmaxLabel,
      masked: isCausallyMasked,
      opacity: (r: number, c: number) => SOFTMAX_ROWS[r]![c]!,
      sub: undefined,
    },
  ];

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      role='img'
      aria-label={strings.aria}
      className='sm:hidden w-full h-auto max-w-[280px] mx-auto'
    >
      <g fontFamily='var(--font-mono)'>
        {sections.map((section, i) => {
          const top = i * BLOCK_H + GRID_TOP;
          return (
            <g key={section.label}>
              <GridTokenLabels
                x={LABEL_COL}
                y={top}
                cell={CELL_A}
                fontSize={9}
              />
              <AttentionGrid
                x={LABEL_COL}
                y={top}
                cell={CELL_A}
                masked={section.masked}
                opacityForCell={section.opacity}
              />
              <text
                x={LABEL_COL + GRID_SIZE / 2}
                y={top + GRID_SIZE + 16}
                textAnchor='middle'
                fontSize={9}
                className={SVG_MUTED}
              >
                {section.label}
              </text>
              {section.sub ? (
                <text
                  x={LABEL_COL + GRID_SIZE / 2}
                  y={top + GRID_SIZE + 27}
                  textAnchor='middle'
                  fontSize={8}
                  className={SVG_MUTED}
                >
                  {section.sub}
                </text>
              ) : null}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function AttentionMatmul({ lang }: { lang: Lang }) {
  const strings = matmulStrings[lang].attention;

  return (
    <div className='rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 my-6'>
      <WideAttentionMatmul lang={lang} />
      <NarrowAttentionMatmul lang={lang} />

      <div className={`${MUTED_TEXT_CLASSES} mt-3 space-y-0.5`}>
        {strings.legend.map((line) => (
          <div key={line}>{line}</div>
        ))}
        <div>{strings.maskLegend}</div>
      </div>

      <div
        className={`${MUTED_TEXT_CLASSES} border-t border-dashed border-slate-300 dark:border-slate-600 pt-2.5 mt-4`}
      >
        {strings.honesty}
      </div>
    </div>
  );
}

export default function MatmulFigure({
  lang,
  variant = 'plain',
}: {
  lang: Lang;
  variant?: Variant;
}) {
  return variant === 'attention' ? (
    <AttentionMatmul lang={lang} />
  ) : (
    <PlainMatmul lang={lang} />
  );
}
