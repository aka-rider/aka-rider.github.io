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

const VECTOR = [0.83, -0.2, 0.44, -0.61, 0.12, 0.95, -0.37, 0.58] as const;

const CLUSTER_SKY = [
  { word: 'sky', u: 0.22, v: 0.8 },
  { word: 'sun', u: 0.34, v: 0.88 },
  { word: 'cloud', u: 0.12, v: 0.68 },
  { word: 'blue', u: 0.38, v: 0.7 },
] as const;

const CLUSTER_CAR = [
  { word: 'car', u: 0.72, v: 0.25 },
  { word: 'road', u: 0.85, v: 0.12 },
  { word: 'engine', u: 0.64, v: 0.06 },
] as const;

const PAIR_GRASS = [
  { word: 'grass', u: 0.2, v: 0.45 },
  { word: 'green', u: 0.34, v: 0.33 },
] as const;

const Y_NEAR = 430;
const Y_FAR = 210;
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
  relationArrow(CLUSTER_SKY[0], CLUSTER_SKY[3]),
  relationArrow(PAIR_GRASS[0], PAIR_GRASS[1]),
] as const;

const MUTED_TEXT_CLASSES = 'fill-slate-500 dark:fill-slate-400';
const POINT_CLASSES = 'fill-cyan-700 dark:fill-cyan-400';
const POINT_LABEL_CLASSES = 'fill-slate-700 dark:fill-slate-300';
const ARROW_CLASSES = 'stroke-amber-700 dark:stroke-amber-400';
const AMBER_TEXT_CLASSES = 'fill-amber-700 dark:fill-amber-400';

function formatValue(value: number): string {
  const abs = Math.abs(value).toFixed(2);
  return value < 0 ? `−${abs}` : abs;
}

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

  return (
    <figure className='my-8'>
      <svg
        viewBox='0 0 360 460'
        role='img'
        aria-label={strings.svgAria}
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
            y2={56}
            strokeWidth={1.5}
            markerEnd='url(#llmEmbeddingArrowSlate)'
            className='stroke-slate-500 dark:stroke-slate-400'
          />

          {VECTOR.map((value, idx) => {
            const x = 20 + idx * 40;
            return (
              <g key={idx}>
                <rect
                  x={x}
                  y={64}
                  width={40}
                  height={30}
                  className={
                    value >= 0
                      ? 'fill-cyan-700 dark:fill-cyan-400 stroke-slate-300 dark:stroke-slate-600'
                      : 'fill-slate-500 dark:fill-slate-400 stroke-slate-300 dark:stroke-slate-600'
                  }
                  fillOpacity={Math.abs(value) * 0.85}
                />
                <text
                  x={x + 20}
                  y={110}
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
            y={132}
            textAnchor='middle'
            fontSize={9}
            className={MUTED_TEXT_CLASSES}
          >
            {strings.dimsShown}
          </text>

          <text
            x={180}
            y={195}
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

          {[...CLUSTER_SKY, ...PAIR_GRASS, ...CLUSTER_CAR].map((point) => (
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
            x={188}
            y={312}
            fontSize={9.5}
            fontStyle='italic'
            className={AMBER_TEXT_CLASSES}
          >
            {strings.relationNote}
          </text>
        </g>
      </svg>
      <FigCaption>{strings.caption}</FigCaption>
    </figure>
  );
}
