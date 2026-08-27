import {
  EXAMPLE_TOKEN_IDS,
  EXAMPLE_TOKENS,
} from '@/components/blog/llm/example';
import FigCaption from '@/components/blog/llm/FigCaption';
import { visibleSpaces } from '@/components/blog/llm/format';
import { embeddingStrings } from '@/components/blog/llm/strings/embedding';

import type { Lang } from '@/i18n';

const SUBJECT_TOKEN_INDEX = 3;
const SUBJECT_TOKEN = EXAMPLE_TOKENS[SUBJECT_TOKEN_INDEX];
const SUBJECT_TOKEN_ID = EXAMPLE_TOKEN_IDS[SUBJECT_TOKEN_INDEX];

const VECTOR = [0.8, -0.2, 0.4, -0.6, 0.1, 0.9, -0.4, 0.6] as const;

const TABLE_X = 80;
const TABLE_WIDTH = 200;
const TABLE_TOP = 70;
const ROW_HEIGHT = 16;
const ROW_GAP = 3;
const VISIBLE_ROW_IDS = [13178, 13179, 13180, 13181, 13182] as const;
const HIGHLIGHT_ROW_INDEX = VISIBLE_ROW_IDS.indexOf(SUBJECT_TOKEN_ID);

const VECTOR_Y = 210;
const VECTOR_CELL = 40;
const VECTOR_X = 20;

const OUR_POINTS = [
  { word: 'Why', u: 0.66, v: 0.86 },
  { word: ' is', u: 0.8, v: 0.74 },
  { word: ' the', u: 0.7, v: 0.66 },
  { word: '?', u: 0.85, v: 0.87 },
  { word: ' sky', u: 0.16, v: 0.66 },
  { word: ' blue', u: 0.32, v: 0.54 },
] as const;

const NEIGHBOR_POINTS = [
  { word: 'sun', u: 0.3, v: 0.78 },
  { word: 'cloud', u: 0.07, v: 0.5 },
  { word: 'grass', u: 0.14, v: 0.3 },
  { word: 'green', u: 0.3, v: 0.18 },
] as const;

const SKY_POINT = OUR_POINTS[4];
const BLUE_POINT = OUR_POINTS[5];
const GRASS_POINT = NEIGHBOR_POINTS[2];
const GREEN_POINT = NEIGHBOR_POINTS[3];

const Y_NEAR = 560;
const Y_FAR = 330;
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
  relationArrow(SKY_POINT, BLUE_POINT),
  relationArrow(GRASS_POINT, GREEN_POINT),
] as const;

const MUTED_TEXT_CLASSES = 'fill-slate-500 dark:fill-slate-400';
const AMBER_TEXT_CLASSES = 'fill-amber-700 dark:fill-amber-400';
const CYAN_TEXT_CLASSES = 'fill-cyan-700 dark:fill-cyan-400';
const AMBER_POINT_CLASSES = 'fill-amber-700 dark:fill-amber-400';
const CYAN_POINT_CLASSES = 'fill-cyan-700 dark:fill-cyan-400';
const ARROW_CLASSES = 'stroke-cyan-700 dark:stroke-cyan-400';

function formatValue(value: number): string {
  const abs = Math.abs(value).toFixed(1);
  return value < 0 ? `−${abs}` : abs;
}

function rowY(index: number): number {
  return TABLE_TOP + index * (ROW_HEIGHT + ROW_GAP);
}

function ScatterPoint({
  word,
  u,
  v,
  ours,
}: {
  word: string;
  u: number;
  v: number;
  ours: boolean;
}) {
  const { x, y } = proj(u, v);
  const r = pointRadius(v);
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={r}
        className={ours ? AMBER_POINT_CLASSES : CYAN_POINT_CLASSES}
      />
      <text
        x={x + r + 4}
        y={y + 3}
        fontSize={10}
        className={
          ours ? AMBER_TEXT_CLASSES : 'fill-slate-700 dark:fill-slate-300'
        }
      >
        {visibleSpaces(word)}
      </text>
    </g>
  );
}

export default function EmbeddingFigure({ lang }: { lang: Lang }) {
  const strings = embeddingStrings[lang];
  const highlightTop = rowY(HIGHLIGHT_ROW_INDEX);
  const highlightBottom = highlightTop + ROW_HEIGHT;
  const tableBottom = rowY(VISIBLE_ROW_IDS.length - 1) + ROW_HEIGHT;

  return (
    <figure className='my-8'>
      <svg
        viewBox='0 0 360 600'
        role='img'
        aria-label={strings.svgAria}
        className='w-full h-auto max-w-[400px] mx-auto block'
      >
        <defs>
          <marker
            id='llmEmbeddingArrowCyan'
            viewBox='0 0 8 8'
            refX='7'
            refY='4'
            markerWidth='7'
            markerHeight='7'
            orient='auto-start-reverse'
          >
            <path
              d='M0 0L8 4L0 8Z'
              className='fill-cyan-700 dark:fill-cyan-400'
            />
          </marker>
          <marker
            id='llmEmbeddingArrowSlate'
            viewBox='0 0 8 8'
            refX='7'
            refY='4'
            markerWidth='7'
            markerHeight='7'
            orient='auto-start-reverse'
          >
            <path
              d='M0 0L8 4L0 8Z'
              className='fill-slate-500 dark:fill-slate-400'
            />
          </marker>
        </defs>

        <g fontFamily='var(--font-mono)'>
          <rect
            x={122}
            y={6}
            width={116}
            height={26}
            rx={5}
            className='fill-amber-50 dark:fill-amber-950/60 stroke-amber-700/60 dark:stroke-amber-400/60'
          />
          <text x={180} y={23} textAnchor='middle' fontSize={12}>
            <tspan className={AMBER_TEXT_CLASSES}>
              {visibleSpaces(SUBJECT_TOKEN)}
            </tspan>
            <tspan dx={7} fontSize={10} className={MUTED_TEXT_CLASSES}>
              #{SUBJECT_TOKEN_ID}
            </tspan>
          </text>

          <line
            x1={180}
            y1={36}
            x2={180}
            y2={TABLE_TOP - 16}
            strokeWidth={1.5}
            markerEnd='url(#llmEmbeddingArrowSlate)'
            className='stroke-slate-500 dark:stroke-slate-400'
          />

          <text
            x={180}
            y={TABLE_TOP - 4}
            textAnchor='middle'
            fontSize={9}
            className={MUTED_TEXT_CLASSES}
          >
            ⋮
          </text>
          {VISIBLE_ROW_IDS.map((id, index) => {
            const highlighted = index === HIGHLIGHT_ROW_INDEX;
            return (
              <g key={id}>
                <text
                  x={TABLE_X - 6}
                  y={rowY(index) + ROW_HEIGHT / 2 + 3}
                  textAnchor='end'
                  fontSize={8}
                  className={
                    highlighted ? AMBER_TEXT_CLASSES : MUTED_TEXT_CLASSES
                  }
                >
                  {id}
                </text>
                <rect
                  x={TABLE_X}
                  y={rowY(index)}
                  width={TABLE_WIDTH}
                  height={ROW_HEIGHT}
                  className={
                    highlighted
                      ? 'fill-amber-50 dark:fill-amber-950/60 stroke-amber-700 dark:stroke-amber-400'
                      : 'fill-white dark:fill-slate-900 stroke-slate-300 dark:stroke-slate-600'
                  }
                />
                {Array.from({ length: 7 }, (_, k) => (
                  <line
                    key={k}
                    x1={TABLE_X + (k + 1) * 25}
                    y1={rowY(index) + 2}
                    x2={TABLE_X + (k + 1) * 25}
                    y2={rowY(index) + ROW_HEIGHT - 2}
                    strokeWidth={1}
                    opacity={0.35}
                    className='stroke-slate-300 dark:stroke-slate-600'
                  />
                ))}
              </g>
            );
          })}
          <text
            x={180}
            y={tableBottom + 10}
            textAnchor='middle'
            fontSize={9}
            className={MUTED_TEXT_CLASSES}
          >
            ⋮
          </text>
          <text
            x={180}
            y={tableBottom + 26}
            textAnchor='middle'
            fontSize={9}
            className={MUTED_TEXT_CLASSES}
          >
            {strings.tableLabel}
          </text>

          <g
            strokeWidth={1}
            strokeDasharray='3 3'
            opacity={0.55}
            className='stroke-slate-500 dark:stroke-slate-400'
          >
            <line
              x1={TABLE_X}
              y1={highlightBottom}
              x2={VECTOR_X}
              y2={VECTOR_Y}
            />
            <line
              x1={TABLE_X + TABLE_WIDTH}
              y1={highlightBottom}
              x2={VECTOR_X + VECTOR.length * VECTOR_CELL}
              y2={VECTOR_Y}
            />
          </g>

          {VECTOR.map((value, idx) => {
            const x = VECTOR_X + idx * VECTOR_CELL;
            return (
              <g key={idx}>
                <rect
                  x={x}
                  y={VECTOR_Y}
                  width={VECTOR_CELL}
                  height={30}
                  className={
                    value >= 0
                      ? 'fill-cyan-700 dark:fill-cyan-400 stroke-slate-300 dark:stroke-slate-600'
                      : 'fill-slate-500 dark:fill-slate-400 stroke-slate-300 dark:stroke-slate-600'
                  }
                  fillOpacity={Math.abs(value) * 0.85}
                />
                <text
                  x={x + VECTOR_CELL / 2}
                  y={VECTOR_Y + 46}
                  textAnchor='middle'
                  fontSize={8.5}
                  className={MUTED_TEXT_CLASSES}
                >
                  {formatValue(value)}
                </text>
              </g>
            );
          })}
          <text
            x={180}
            y={VECTOR_Y + 64}
            textAnchor='middle'
            fontSize={9}
            className={MUTED_TEXT_CLASSES}
          >
            {strings.vectorNote}
          </text>

          <text
            x={180}
            y={312}
            textAnchor='middle'
            fontSize={10}
            className={MUTED_TEXT_CLASSES}
          >
            {strings.spaceTitle}
          </text>

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

          {RELATION_ARROWS.map((arrow, idx) => (
            <line
              key={idx}
              {...arrow}
              strokeWidth={1.8}
              markerEnd='url(#llmEmbeddingArrowCyan)'
              className={ARROW_CLASSES}
            />
          ))}

          {NEIGHBOR_POINTS.map((point) => (
            <ScatterPoint key={point.word} {...point} ours={false} />
          ))}
          {OUR_POINTS.map((point) => (
            <ScatterPoint key={point.word} {...point} ours />
          ))}

          <text
            x={104}
            y={464}
            fontSize={9.5}
            fontStyle='italic'
            className={CYAN_TEXT_CLASSES}
          >
            {strings.relationNote}
          </text>
          <text
            x={240}
            y={430}
            textAnchor='middle'
            fontSize={9.5}
            fontStyle='italic'
            className={MUTED_TEXT_CLASSES}
          >
            {strings.grammarNote}
          </text>
        </g>
      </svg>
      <FigCaption>{strings.caption}</FigCaption>
    </figure>
  );
}
