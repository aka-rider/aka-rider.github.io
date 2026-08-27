import FigCaption from '@/components/blog/llm/FigCaption';
import { interpolationStrings } from '@/components/blog/llm/strings/interpolation';

import type { Lang } from '@/i18n';

const PINNED_POINTS: ReadonlyArray<readonly [number, number]> = [
  [40, 197],
  [56, 184],
  [72, 171],
  [88, 163],
  [104, 161],
  [120, 170],
  [136, 178],
  [152, 184],
  [168, 188],
  [186, 189],
  [206, 185],
  [224, 178],
  [242, 171],
];

const GAP_EDGE_POINTS: ReadonlyArray<readonly [number, number]> = [
  [258, 167],
  [478, 189],
];

const ANSWER_POINT = [368, 147] as const;
const GAP_START_X = 258;

function MultilineLabel({
  x,
  y,
  lines,
  anchor = 'middle',
  fontSize = 13,
  className,
}: {
  x: number;
  y: number;
  lines: readonly string[];
  anchor?: 'start' | 'middle' | 'end';
  fontSize?: number;
  className?: string;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={fontSize}
      fill={className ? undefined : 'currentColor'}
      className={className}
    >
      {lines.map((line, i) => (
        <tspan key={line} x={x} dy={i === 0 ? 0 : 16}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

export default function InterpolationFigure({ lang }: { lang: Lang }) {
  const dict = interpolationStrings[lang];

  return (
    <figure className='my-8'>
      <svg
        viewBox='0 0 520 290'
        role='img'
        aria-label={dict.aria}
        className='w-full h-auto max-w-[520px] mx-auto block'
      >
        <defs>
          <marker
            id='llmInterpArrow'
            viewBox='0 0 10 10'
            refX={9}
            refY={5}
            markerWidth={7}
            markerHeight={7}
            orient='auto'
          >
            <path d='M0,0 L10,5 L0,10 z' fill='currentColor' />
          </marker>
        </defs>

        <g fontFamily='var(--font-mono)'>
          <line
            x1={GAP_START_X}
            y1={62}
            x2={GAP_START_X}
            y2={230}
            stroke='currentColor'
            strokeDasharray='2 6'
            opacity={0.25}
          />

          <path
            d='M30,200 C60,168 92,155 120,170 C150,186 180,192 214,183 C230,179 246,172 258,167'
            fill='none'
            strokeWidth={2}
            className='stroke-cyan-700 dark:stroke-cyan-400'
          />
          <path
            d='M258,167 C300,150 330,145 368,147 C412,150 450,165 478,189'
            fill='none'
            strokeWidth={2}
            strokeDasharray='6 6'
            className='stroke-cyan-700 dark:stroke-cyan-400'
          />

          {PINNED_POINTS.map(([x, y]) => (
            <circle
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              r={4}
              className='fill-amber-600 dark:fill-amber-400'
            />
          ))}
          {GAP_EDGE_POINTS.map(([x, y]) => (
            <circle
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              r={4}
              className='fill-amber-600 dark:fill-amber-400'
            />
          ))}

          <circle
            cx={ANSWER_POINT[0]}
            cy={ANSWER_POINT[1]}
            r={6}
            fill='none'
            strokeWidth={2}
            className='stroke-cyan-700 dark:stroke-cyan-400'
          />

          <MultilineLabel x={144} y={38} lines={dict.thickLabel} />
          <MultilineLabel x={388} y={38} lines={dict.thinLabel} />

          <line
            x1={ANSWER_POINT[0]}
            y1={252}
            x2={ANSWER_POINT[0]}
            y2={ANSWER_POINT[1] + 12}
            stroke='currentColor'
            markerEnd='url(#llmInterpArrow)'
          />
          <MultilineLabel
            x={ANSWER_POINT[0]}
            y={268}
            lines={dict.answerLabel}
            fontSize={11.5}
          />
        </g>
      </svg>
      <FigCaption>{dict.caption}</FigCaption>
    </figure>
  );
}
