import FigCaption from '@/components/blog/llm/FigCaption';
import { agentLoopStrings } from '@/components/blog/llm/strings/agentLoop';

import type { Lang } from '@/i18n';

type NodeColor = 'model' | 'harness' | 'tool';

const NODE_RECT_CLASSES: Record<NodeColor, string> = {
  model:
    'fill-cyan-50 dark:fill-cyan-950/60 stroke-cyan-700 dark:stroke-cyan-400',
  harness:
    'fill-violet-50 dark:fill-violet-950/60 stroke-violet-700 dark:stroke-violet-400',
  tool: 'fill-slate-100 dark:fill-slate-800 stroke-slate-400 dark:stroke-slate-500',
};

const NODE_TEXT_CLASSES: Record<NodeColor, string> = {
  model: 'fill-cyan-700 dark:fill-cyan-400',
  harness: 'fill-violet-700 dark:fill-violet-400',
  tool: '',
};

const ARROW_STROKE_CLASSES: Record<NodeColor, string> = {
  model: 'stroke-cyan-700 dark:stroke-cyan-400',
  harness: 'stroke-violet-700 dark:stroke-violet-400',
  tool: '',
};

function LoopNode({
  x,
  y,
  color,
  title,
  sub,
}: {
  x: number;
  y: number;
  color: NodeColor;
  title: string;
  sub: readonly string[];
}) {
  const textClass = NODE_TEXT_CLASSES[color];
  const textFill = color === 'tool' ? 'currentColor' : undefined;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={120}
        height={52}
        rx={8}
        strokeWidth={1.25}
        className={NODE_RECT_CLASSES[color]}
      />
      <text
        x={x + 60}
        y={y + 20}
        textAnchor='middle'
        fontSize={12}
        fontWeight='bold'
        fill={textFill}
        className={textClass}
      >
        {title}
      </text>
      {sub.map((line, idx) => (
        <text
          key={idx}
          x={x + 60}
          y={y + (sub.length === 1 ? 37 : 33 + idx * 10)}
          textAnchor='middle'
          fontSize={8}
          fill={textFill}
          className={textClass}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function LoopArrow({ d, color }: { d: string; color: NodeColor }) {
  return (
    <path
      d={d}
      fill='none'
      strokeWidth={1.5}
      markerEnd='url(#llmLoopArrow)'
      stroke={color === 'tool' ? 'currentColor' : undefined}
      className={ARROW_STROKE_CLASSES[color]}
    />
  );
}

function StepNumber({
  x,
  y,
  glyph,
  color,
}: {
  x: number;
  y: number;
  glyph: string;
  color: NodeColor;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor='middle'
      fontSize={15}
      fontWeight='bold'
      fill={color === 'tool' ? 'currentColor' : undefined}
      className={NODE_TEXT_CLASSES[color]}
    >
      {glyph}
    </text>
  );
}

export default function AgentLoopFigure({ lang }: { lang: Lang }) {
  const dict = agentLoopStrings[lang];

  return (
    <figure className='my-8'>
      <svg
        viewBox='0 0 360 420'
        role='img'
        aria-label={dict.aria}
        className='w-full h-auto max-w-[400px] mx-auto block llm-anim'
      >
        <defs>
          <marker
            id='llmLoopArrow'
            viewBox='0 0 10 10'
            refX={9}
            refY={5}
            markerWidth={6}
            markerHeight={6}
            orient='auto-start-reverse'
          >
            <path d='M0,0 L10,5 L0,10 z' fill='currentColor' />
          </marker>
        </defs>

        <g fontFamily='var(--font-mono)'>
          <g className='llm-phase llm-phase-1'>
            <LoopNode
              x={120}
              y={24}
              color='model'
              title={dict.nodes.model.title}
              sub={dict.nodes.model.sub}
            />
            <LoopArrow d='M 232 68 Q 300 100 296 176' color='model' />
            <StepNumber x={322} y={126} glyph='①' color='model' />
          </g>

          <g className='llm-phase llm-phase-2'>
            <LoopNode
              x={236}
              y={180}
              color='harness'
              title={dict.nodes.harnessParse.title}
              sub={dict.nodes.harnessParse.sub}
            />
            <LoopArrow d='M 296 236 Q 300 312 232 344' color='harness' />
            <StepNumber x={322} y={296} glyph='②' color='harness' />
          </g>

          <g className='llm-phase llm-phase-3'>
            <LoopNode
              x={120}
              y={336}
              color='tool'
              title={dict.nodes.tool.title}
              sub={dict.nodes.tool.sub}
            />
            <LoopArrow d='M 128 344 Q 60 312 64 236' color='tool' />
            <StepNumber x={38} y={296} glyph='③' color='tool' />
          </g>

          <g className='llm-phase llm-phase-4'>
            <LoopNode
              x={4}
              y={180}
              color='harness'
              title={dict.nodes.harnessAppend.title}
              sub={dict.nodes.harnessAppend.sub}
            />
            <LoopArrow d='M 64 176 Q 60 100 128 68' color='harness' />
            <StepNumber x={38} y={126} glyph='④' color='harness' />
          </g>

          <g>
            <rect
              x={168}
              y={120}
              width={24}
              height={180}
              rx={3}
              fill='none'
              stroke='currentColor'
              strokeWidth={1}
              opacity={0.5}
            />
            <rect
              x={168}
              y={210}
              width={24}
              height={90}
              rx={3}
              className='fill-amber-700/70 dark:fill-amber-400/70'
            />
            <rect
              x={168}
              y={120}
              width={24}
              height={28}
              rx={3}
              className='fill-red-600/40 dark:fill-red-500/40'
            />
            {[150, 180, 210, 240, 270].map((tickY) => (
              <line
                key={tickY}
                x1={168}
                y1={tickY}
                x2={192}
                y2={tickY}
                stroke='currentColor'
                strokeWidth={0.75}
                opacity={0.3}
              />
            ))}
            {dict.barCompaction.map((line, idx) => (
              <text
                key={idx}
                x={180}
                y={98 + idx * 10}
                textAnchor='middle'
                fontSize={8}
                className='fill-red-600 dark:fill-red-400'
              >
                {line}
              </text>
            ))}
            {dict.barFills.map((line, idx) => (
              <text
                key={idx}
                x={180}
                y={314 + idx * 10}
                textAnchor='middle'
                fontSize={8}
                className='fill-amber-700 dark:fill-amber-400'
              >
                {line}
              </text>
            ))}
          </g>
        </g>
      </svg>
      <FigCaption>{dict.caption}</FigCaption>
    </figure>
  );
}
