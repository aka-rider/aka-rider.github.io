import FigCaption from '@/components/blog/llm/FigCaption';
import { visibleSpaces } from '@/components/blog/llm/format';
import { embeddingStrings } from '@/components/blog/llm/strings/embedding';
import {
  AMBER_FILL,
  CYAN_FILL,
  EXAMPLE_TOKEN_ROWS,
  FINAL_EMBEDDING_MAX_ABS,
  finalEmbedding,
  positionEncoding,
  signClass,
  StripCells,
  TEAL_FILL,
  tokenEmbedding,
} from '@/components/blog/llm/vectors';

import type { Lang } from '@/i18n';

const STRIP_CELLS = 8;
const CELL_W = 6;
const CELL_H = 16;
const CELL_GAP = 1;
const STRIP_WIDTH = STRIP_CELLS * (CELL_W + CELL_GAP) - CELL_GAP;

const ROW_H = 32;
const TOKEN_COL_RIGHT = 72;
const TOKEN_EMBED_X = TOKEN_COL_RIGHT + 22;
const TOKEN_EMBED_END = TOKEN_EMBED_X + STRIP_WIDTH;
const PLUS_X = TOKEN_EMBED_END + 16;
const POSITION_X = PLUS_X + 14;
const POSITION_END = POSITION_X + STRIP_WIDTH;
const EQUALS_X = POSITION_END + 16;
const FINAL_X = EQUALS_X + 14;
const FINAL_END = FINAL_X + STRIP_WIDTH;
const VIEW_WIDTH = FINAL_END + 22;

const MUTED_TEXT_CLASSES = 'fill-slate-500 dark:fill-slate-400';
const HEADER_TEXT_CLASSES = 'fill-slate-700 dark:fill-slate-300';
const AMBER_TEXT = AMBER_FILL;

const HEADER_LABEL_START_Y = 25;
const HEADER_LABEL_LINE_H = 8;
const HEADER_SUB_GAP = 5;
const HEADER_SUB_LINE_H = 7;
const HEADER_LABEL_MAX_CHARS = 11;
const HEADER_SUB_MAX_CHARS = 13;
const HEADER_ROWS_PADDING = 14;
const SPACE_TITLE_MAX_CHARS = 50;

function wrapLabel(text: string, maxChars: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function headerBlockBottom(labelLines: string[], subLines: string[]): number {
  const labelBottom =
    HEADER_LABEL_START_Y + (labelLines.length - 1) * HEADER_LABEL_LINE_H;
  if (subLines.length === 0) return labelBottom;
  const subStartY = labelBottom + HEADER_SUB_GAP + HEADER_SUB_LINE_H;
  return subStartY + (subLines.length - 1) * HEADER_SUB_LINE_H;
}

function Strip({
  values,
  x,
  y,
  positiveClass,
  maxAbs,
}: {
  values: readonly number[];
  x: number;
  y: number;
  positiveClass: string;
  maxAbs?: number;
}) {
  return (
    <g aria-hidden='true'>
      <StripCells
        values={values}
        x={x}
        y={y}
        cellWidth={CELL_W}
        cellHeight={CELL_H}
        gap={CELL_GAP}
        maxAbs={maxAbs}
        colorFor={(_, value) => signClass(value, positiveClass)}
      />
      <text
        x={x + STRIP_WIDTH + 3}
        y={y + 2.5}
        fontSize={7}
        className={MUTED_TEXT_CLASSES}
      >
        …
      </text>
    </g>
  );
}

function StepHeader({
  x,
  n,
  labelLines,
  subLines,
}: {
  x: number;
  n: number;
  labelLines: string[];
  subLines: string[];
}) {
  return (
    <g>
      <circle
        cx={x}
        cy={10}
        r={8}
        className='fill-slate-700 dark:fill-slate-300'
      />
      <text
        x={x}
        y={13}
        textAnchor='middle'
        fontSize={9}
        className='fill-white dark:fill-slate-900'
      >
        {n}
      </text>
      {labelLines.map((line, i) => (
        <text
          key={line}
          x={x}
          y={HEADER_LABEL_START_Y + i * HEADER_LABEL_LINE_H}
          textAnchor='middle'
          fontSize={7.5}
          className={HEADER_TEXT_CLASSES}
        >
          {line}
        </text>
      ))}
      {subLines.map((line, i) => {
        const labelBottom =
          HEADER_LABEL_START_Y + (labelLines.length - 1) * HEADER_LABEL_LINE_H;
        return (
          <text
            key={line}
            x={x}
            y={
              labelBottom +
              HEADER_SUB_GAP +
              HEADER_SUB_LINE_H +
              i * HEADER_SUB_LINE_H
            }
            textAnchor='middle'
            fontSize={6.5}
            className={MUTED_TEXT_CLASSES}
          >
            {line}
          </text>
        );
      })}
    </g>
  );
}

function TokenRow({
  y,
  token,
  id,
  tokenStrip,
  positionStrip,
  finalStrip,
}: {
  y: number;
  token: string;
  id: number;
  tokenStrip: readonly number[];
  positionStrip: readonly number[];
  finalStrip: readonly number[];
}) {
  return (
    <g>
      <text x={TOKEN_COL_RIGHT} y={y + 3} textAnchor='end' fontSize={10}>
        <tspan className={AMBER_TEXT}>{visibleSpaces(token)}</tspan>
        <tspan dx={4} fontSize={7} className={MUTED_TEXT_CLASSES}>
          #{id}
        </tspan>
      </text>
      <text
        x={(TOKEN_COL_RIGHT + TOKEN_EMBED_X) / 2}
        y={y + 3}
        textAnchor='middle'
        fontSize={8}
        className={MUTED_TEXT_CLASSES}
      >
        →
      </text>
      <Strip
        values={tokenStrip}
        x={TOKEN_EMBED_X}
        y={y}
        positiveClass={CYAN_FILL}
      />
      <text
        x={PLUS_X}
        y={y + 3}
        textAnchor='middle'
        fontSize={11}
        className={MUTED_TEXT_CLASSES}
      >
        +
      </text>
      <Strip
        values={positionStrip}
        x={POSITION_X}
        y={y}
        positiveClass={TEAL_FILL}
      />
      <text
        x={EQUALS_X}
        y={y + 3}
        textAnchor='middle'
        fontSize={11}
        className={MUTED_TEXT_CLASSES}
      >
        =
      </text>
      <Strip
        values={finalStrip}
        x={FINAL_X}
        y={y}
        positiveClass={AMBER_FILL}
        maxAbs={FINAL_EMBEDDING_MAX_ABS}
      />
    </g>
  );
}

const Y_NEAR = 300;
const Y_FAR = 100;
const W_NEAR = 330;
const W_FAR = 180;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function proj(u: number, v: number): { x: number; y: number } {
  return {
    x: 180 + (u - 0.5) * lerp(W_NEAR, W_FAR, v),
    y: lerp(Y_NEAR, Y_FAR, v),
  };
}

function pointRadius(v: number): number {
  return lerp(4, 3, v);
}

const CLUSTER_LANDMARK = [
  { word: 'Eiffel Tower', u: 0.26, v: 0.8 },
  { word: 'Colosseum', u: 0.4, v: 0.86 },
  { word: 'landmark', u: 0.33, v: 0.66 },
] as const;

const CLUSTER_CITY = [
  { word: 'Paris', u: 0.7, v: 0.26 },
  { word: 'Rome', u: 0.84, v: 0.18 },
  { word: 'France', u: 0.58, v: 0.1 },
] as const;

const PLANE_CORNERS = [proj(0, 0), proj(1, 0), proj(1, 1), proj(0, 1)] as const;

const GRID_STEPS = [0.2, 0.4, 0.6, 0.8] as const;

function relationArrow(
  from: { u: number; v: number },
  to: { u: number; v: number },
) {
  const start = proj(from.u, from.v);
  const end = proj(to.u, to.v);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy);
  const startGap = pointRadius(from.v) + 4;
  const endGap = pointRadius(to.v) + 4;
  return {
    x1: start.x + (dx / length) * startGap,
    y1: start.y + (dy / length) * startGap,
    x2: end.x - (dx / length) * endGap,
    y2: end.y - (dy / length) * endGap,
  };
}

const RELATION_ARROWS = [
  relationArrow(CLUSTER_LANDMARK[0], CLUSTER_CITY[0]),
  relationArrow(CLUSTER_LANDMARK[1], CLUSTER_CITY[1]),
] as const;

const SPACE_MUTED_TEXT_CLASSES = 'fill-slate-500 dark:fill-slate-400';
const POINT_CLASSES = CYAN_FILL;
const POINT_LABEL_CLASSES = 'fill-slate-700 dark:fill-slate-300';
const ARROW_CLASSES = 'stroke-amber-700 dark:stroke-amber-400';
const SPACE_AMBER_TEXT_CLASSES = AMBER_FILL;

function ScatterPoint({ word, u, v }: { word: string; u: number; v: number }) {
  const { x, y } = proj(u, v);
  const r = pointRadius(v);
  return (
    <g>
      <circle cx={x} cy={y} r={r} className={POINT_CLASSES} />
      <text
        x={x + r + 4}
        y={y + 3}
        fontSize={10}
        className={POINT_LABEL_CLASSES}
      >
        {word}
      </text>
    </g>
  );
}

export default function EmbeddingFigure({ lang }: { lang: Lang }) {
  const strings = embeddingStrings[lang];

  const headers = [
    { n: 1, x: (8 + TOKEN_COL_RIGHT) / 2, label: strings.step1, sub: '' },
    {
      n: 2,
      x: TOKEN_EMBED_X + STRIP_WIDTH / 2,
      label: strings.step2,
      sub: strings.step2Sub,
    },
    {
      n: 3,
      x: POSITION_X + STRIP_WIDTH / 2,
      label: strings.step3,
      sub: strings.step3Sub,
    },
    {
      n: 4,
      x: FINAL_X + STRIP_WIDTH / 2,
      label: strings.step4,
      sub: strings.step4Sub,
    },
  ].map((header) => {
    const labelLines = wrapLabel(header.label, HEADER_LABEL_MAX_CHARS);
    const subLines = header.sub
      ? wrapLabel(header.sub, HEADER_SUB_MAX_CHARS)
      : [];
    return { ...header, labelLines, subLines };
  });

  const listTop =
    Math.max(
      ...headers.map((header) =>
        headerBlockBottom(header.labelLines, header.subLines),
      ),
    ) + HEADER_ROWS_PADDING;

  const viewHeight = listTop + EXAMPLE_TOKEN_ROWS.length * ROW_H + 4;

  return (
    <div className='my-8 space-y-8'>
      <figure>
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${viewHeight}`}
          role='img'
          aria-label={strings.processAria}
          className='w-full h-auto max-w-[460px] mx-auto block'
        >
          <g fontFamily='var(--font-mono)'>
            {headers.map((header) => (
              <StepHeader
                key={header.n}
                x={header.x}
                n={header.n}
                labelLines={header.labelLines}
                subLines={header.subLines}
              />
            ))}

            {EXAMPLE_TOKEN_ROWS.map((row) => (
              <TokenRow
                key={row.index}
                y={listTop + row.index * ROW_H + ROW_H / 2}
                token={row.token}
                id={row.id}
                tokenStrip={tokenEmbedding(row.id)}
                positionStrip={positionEncoding(row.index)}
                finalStrip={finalEmbedding(row.id, row.index)}
              />
            ))}
          </g>
        </svg>
        <div className='font-mono text-xs text-muted mt-3 space-y-0.5 max-w-[460px] mx-auto'>
          {strings.legend.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
        <div className='font-mono text-xs text-muted border-t border-dashed border-slate-300 dark:border-slate-600 pt-2.5 mt-3 max-w-[460px] mx-auto'>
          {strings.honesty}
        </div>
        <FigCaption>{strings.processCaption}</FigCaption>
      </figure>

      <figure>
        <svg
          viewBox='0 0 360 330'
          role='img'
          aria-label={strings.spaceAria}
          className='w-full h-auto max-w-[400px] mx-auto block'
        >
          <defs>
            <marker
              id='llmEmbeddingArrowAmber'
              viewBox='0 0 8 8'
              refX='7'
              refY='4'
              markerWidth='7'
              markerHeight='7'
              orient='auto-start-reverse'
            >
              <path
                d='M0 0L8 4L0 8Z'
                className='fill-amber-700 dark:fill-amber-400'
              />
            </marker>
          </defs>

          <g fontFamily='var(--font-mono)'>
            {wrapLabel(strings.spaceTitle, SPACE_TITLE_MAX_CHARS).map(
              (line, i, lines) => (
                <text
                  key={line}
                  x={180}
                  y={45 - ((lines.length - 1) * 12) / 2 + i * 12}
                  textAnchor='middle'
                  fontSize={10}
                  className={SPACE_MUTED_TEXT_CLASSES}
                >
                  {line}
                </text>
              ),
            )}

            <g
              strokeWidth={1}
              opacity={0.3}
              className='stroke-slate-500 dark:stroke-slate-400'
            >
              <polygon
                points={PLANE_CORNERS.map(({ x, y }) => `${x},${y}`).join(' ')}
                fill='none'
              />
              {GRID_STEPS.map((v) => {
                const left = proj(0, v);
                const right = proj(1, v);
                return (
                  <line
                    key={`v${v}`}
                    x1={left.x}
                    y1={left.y}
                    x2={right.x}
                    y2={right.y}
                  />
                );
              })}
              {GRID_STEPS.map((u) => {
                const near = proj(u, 0);
                const far = proj(u, 1);
                return (
                  <line
                    key={`u${u}`}
                    x1={near.x}
                    y1={near.y}
                    x2={far.x}
                    y2={far.y}
                  />
                );
              })}
            </g>

            {[...CLUSTER_LANDMARK, ...CLUSTER_CITY].map((point) => (
              <ScatterPoint key={point.word} {...point} />
            ))}

            {RELATION_ARROWS.map((arrow, idx) => (
              <line
                key={idx}
                {...arrow}
                strokeWidth={1.8}
                markerEnd='url(#llmEmbeddingArrowAmber)'
                className={ARROW_CLASSES}
              />
            ))}
            <text
              x={185}
              y={200}
              fontSize={9.5}
              fontStyle='italic'
              className={SPACE_AMBER_TEXT_CLASSES}
            >
              {strings.relationNote}
            </text>
          </g>
        </svg>
        <FigCaption>{strings.spaceCaption}</FigCaption>
      </figure>
    </div>
  );
}
