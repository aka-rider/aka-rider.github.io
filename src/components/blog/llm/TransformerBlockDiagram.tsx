import FigCaption from '@/components/blog/llm/FigCaption';
import { transformerBlockStrings } from '@/components/blog/llm/strings/transformerBlock';

import type { Lang } from '@/i18n';

const STREAM_X = 72;
const BOX_X = 150;
const BOX_WIDTH = 140;
const LINE_HEIGHT = 13;

const VANISHING_POINT = { x: 380, y: 20 };
const MAIN_BLOCK = { x: 24, y: 70, width: 280, height: 370 };
const GHOST_COUNT = 5;

function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

function projectGhost(k: number) {
  const t = k * 0.09;
  const left = lerp(MAIN_BLOCK.x, VANISHING_POINT.x, t);
  const top = lerp(MAIN_BLOCK.y, VANISHING_POINT.y, t);
  const right = lerp(MAIN_BLOCK.x + MAIN_BLOCK.width, VANISHING_POINT.x, t);
  const bottom = lerp(MAIN_BLOCK.y + MAIN_BLOCK.height, VANISHING_POINT.y, t);
  return {
    key: k,
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
    rx: 12 * (1 - t),
    outlineOpacity: lerp(0.28, 0.06, (k - 1) / (GHOST_COUNT - 1)),
    streamX: lerp(STREAM_X, VANISHING_POINT.x, t),
    streamWidth: lerp(6, 2, k / GHOST_COUNT),
    streamOpacity: lerp(0.85, 0.15, k / GHOST_COUNT),
  };
}

const GHOSTS = Array.from({ length: GHOST_COUNT }, (_, i) =>
  projectGhost(GHOST_COUNT - i),
);

const AMBER_STROKE = 'stroke-amber-700 dark:stroke-amber-400';
const AMBER_TEXT = 'fill-amber-700 dark:fill-amber-400';
const CYAN_STROKE = 'stroke-cyan-700 dark:stroke-cyan-400';
const CYAN_TEXT = 'fill-cyan-700 dark:fill-cyan-400';
const CYAN_BOX =
  'fill-cyan-50 dark:fill-cyan-950/60 stroke-cyan-700 dark:stroke-cyan-400';
const SLATE_STROKE = 'stroke-slate-300 dark:stroke-slate-600';
const NODE_FILL = 'fill-white dark:fill-slate-900';

function StationBox({ y, lines }: { y: number; lines: readonly string[] }) {
  const height = lines.length * LINE_HEIGHT + 18;
  const branchY = y + height / 2;
  const mergeY = y + height + 36;
  return (
    <g>
      <line
        x1={STREAM_X}
        y1={branchY}
        x2={BOX_X}
        y2={branchY}
        strokeWidth={1.5}
        className={CYAN_STROKE}
      />
      <rect
        x={BOX_X}
        y={y}
        width={BOX_WIDTH}
        height={height}
        rx={8}
        strokeWidth={1.5}
        className={CYAN_BOX}
      />
      {lines.map((line, i) => (
        <text
          key={line}
          x={BOX_X + BOX_WIDTH / 2}
          y={y + 15 + i * LINE_HEIGHT}
          textAnchor='middle'
          fontSize={9}
          fontWeight={i === 0 ? 700 : 400}
          className={CYAN_TEXT}
        >
          {line}
        </text>
      ))}
      <path
        d={`M${BOX_X + BOX_WIDTH / 2},${y + height} V${mergeY} H${STREAM_X + 11}`}
        fill='none'
        strokeWidth={1.5}
        className={CYAN_STROKE}
      />
      <circle
        cx={STREAM_X}
        cy={mergeY}
        r={10}
        strokeWidth={1.5}
        stroke='currentColor'
        className={NODE_FILL}
      />
      <text
        x={STREAM_X}
        y={mergeY + 4}
        textAnchor='middle'
        fontSize={12}
        fill='currentColor'
      >
        +
      </text>
    </g>
  );
}

export default function TransformerBlockDiagram({ lang }: { lang: Lang }) {
  const dict = transformerBlockStrings[lang];

  return (
    <figure className='my-8'>
      <svg
        viewBox='0 0 400 560'
        role='img'
        aria-label={dict.aria}
        className='w-full h-auto max-w-[420px] mx-auto block'
      >
        <g fontFamily='var(--font-mono)' fontSize={10}>
          {GHOSTS.map((ghost) => (
            <g key={ghost.key}>
              <rect
                x={ghost.x}
                y={ghost.y}
                width={ghost.width}
                height={ghost.height}
                rx={ghost.rx}
                fill='none'
                strokeWidth={1.5}
                opacity={ghost.outlineOpacity}
                className={SLATE_STROKE}
              />
              <line
                x1={ghost.streamX}
                y1={ghost.y}
                x2={ghost.streamX}
                y2={ghost.y + ghost.height}
                strokeWidth={ghost.streamWidth}
                opacity={ghost.streamOpacity}
                className={AMBER_STROKE}
              />
            </g>
          ))}
          <text x={STREAM_X} y={20} textAnchor='middle' className={AMBER_TEXT}>
            {dict.entry}
          </text>

          <line
            x1={STREAM_X}
            y1={30}
            x2={STREAM_X}
            y2={530}
            strokeWidth={6}
            opacity={0.85}
            className={AMBER_STROKE}
          />
          <text
            x={STREAM_X - 10}
            y={470}
            textAnchor='middle'
            transform={`rotate(-90 ${STREAM_X - 10} 470)`}
            className={AMBER_TEXT}
          >
            {dict.stream}
          </text>

          <rect
            x={24}
            y={50}
            width={280}
            height={12}
            rx={6}
            fill='none'
            strokeDasharray='4 4'
            opacity={0.35}
            className={SLATE_STROKE}
          />
          <rect
            x={MAIN_BLOCK.x}
            y={MAIN_BLOCK.y}
            width={MAIN_BLOCK.width}
            height={MAIN_BLOCK.height}
            rx={12}
            fill='none'
            strokeWidth={1.5}
            className={SLATE_STROKE}
          />
          <rect
            x={24}
            y={448}
            width={280}
            height={12}
            rx={6}
            fill='none'
            strokeDasharray='4 4'
            opacity={0.35}
            className={SLATE_STROKE}
          />

          <StationBox y={104} lines={dict.attnLines} />
          <StationBox y={272} lines={dict.mlpLines} />

          <path
            d='M352,70 h8 v370 h-8'
            fill='none'
            strokeWidth={1.5}
            className={SLATE_STROKE}
          />
          <text
            x={372}
            y={255}
            textAnchor='middle'
            transform='rotate(90 372 255)'
            fill='currentColor'
          >
            {dict.layers}
          </text>

          <text x={STREAM_X} y={550} textAnchor='middle' className={AMBER_TEXT}>
            {dict.exit}
          </text>
        </g>
      </svg>
      <FigCaption>{dict.caption}</FigCaption>
    </figure>
  );
}
