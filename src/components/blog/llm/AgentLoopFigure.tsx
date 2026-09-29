'use client';

import { useState } from 'react';

import { AnimToggle } from '@/components/blog/llm/AnimToggle';
import FigCaption from '@/components/blog/llm/FigCaption';
import { agentLoopStrings } from '@/components/blog/llm/strings/agentLoop';

import type { Lang } from '@/i18n';

type NodeColor = 'model' | 'harness' | 'tool';

const NODE_RECT_CLASSES: Record<NodeColor, string> = {
  model: 'fill-none stroke-cyan-700 dark:stroke-cyan-400',
  harness: 'fill-none stroke-violet-700 dark:stroke-violet-400',
  tool: 'fill-none stroke-slate-400 dark:stroke-slate-500',
};

const NODE_TEXT_CLASSES: Record<NodeColor, string> = {
  model: 'fill-cyan-700 dark:fill-cyan-400',
  harness: 'fill-violet-700 dark:fill-violet-400',
  tool: '',
};

const NODE_WIDTH = 120;
const NODE_HEIGHT = 52;
const ARROW_GAP = 4;

type Point = { x: number; y: number };

const NODES = {
  model: { x: 120, y: 24 },
  harnessParse: { x: 236, y: 180 },
  tool: { x: 120, y: 336 },
  harnessAppend: { x: 4, y: 180 },
} as const satisfies Record<string, Point>;

function topOf(node: Point): Point {
  return { x: node.x + NODE_WIDTH / 2, y: node.y - ARROW_GAP };
}

function bottomOf(node: Point): Point {
  return { x: node.x + NODE_WIDTH / 2, y: node.y + NODE_HEIGHT + ARROW_GAP };
}

function leftOf(node: Point): Point {
  return { x: node.x - ARROW_GAP, y: node.y + NODE_HEIGHT / 2 };
}

function rightOf(node: Point): Point {
  return { x: node.x + NODE_WIDTH + ARROW_GAP, y: node.y + NODE_HEIGHT / 2 };
}

function horizontalThenVertical(from: Point, to: Point) {
  return `M ${from.x} ${from.y} Q ${to.x} ${from.y} ${to.x} ${to.y}`;
}

function verticalThenHorizontal(from: Point, to: Point) {
  return `M ${from.x} ${from.y} Q ${from.x} ${to.y} ${to.x} ${to.y}`;
}

function arrowMarkerId(color: NodeColor) {
  return `llmLoopArrow-${color}`;
}

const ARROW_STROKE_CLASSES: Record<NodeColor, string> = {
  model: 'stroke-cyan-700 dark:stroke-cyan-400',
  harness: 'stroke-violet-700 dark:stroke-violet-400',
  tool: '',
};

function LoopNode({
  node: { x, y },
  color,
  title,
  sub,
}: {
  node: Point;
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
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
        rx={8}
        strokeWidth={1.25}
        className={NODE_RECT_CLASSES[color]}
      />
      <text
        x={x + NODE_WIDTH / 2}
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
          x={x + NODE_WIDTH / 2}
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
      markerEnd={`url(#${arrowMarkerId(color)})`}
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
  const [paused, setPaused] = useState(false);

  return (
    <figure className='my-8'>
      <svg
        viewBox='0 0 360 420'
        role='img'
        aria-label={dict.aria}
        data-paused={paused || undefined}
        className='w-full h-auto max-w-[400px] mx-auto block llm-anim'
      >
        <defs>
          {(Object.keys(NODE_TEXT_CLASSES) as NodeColor[]).map((color) => (
            <marker
              key={color}
              id={arrowMarkerId(color)}
              viewBox='0 0 10 10'
              refX={9}
              refY={5}
              markerWidth={6}
              markerHeight={6}
              orient='auto'
            >
              <path
                d='M0,0 L10,5 L0,10 z'
                fill={color === 'tool' ? 'currentColor' : undefined}
                className={NODE_TEXT_CLASSES[color]}
              />
            </marker>
          ))}
        </defs>

        <g fontFamily='var(--font-mono)'>
          <g className='llm-phase llm-phase-1'>
            <LoopNode
              node={NODES.model}
              color='model'
              title={dict.nodes.model.title}
              sub={dict.nodes.model.sub}
            />
            <LoopArrow
              d={horizontalThenVertical(
                rightOf(NODES.model),
                topOf(NODES.harnessParse),
              )}
              color='model'
            />
            <StepNumber x={322} y={126} glyph='①' color='model' />
          </g>

          <g className='llm-phase llm-phase-2'>
            <LoopNode
              node={NODES.harnessParse}
              color='harness'
              title={dict.nodes.harnessParse.title}
              sub={dict.nodes.harnessParse.sub}
            />
            <LoopArrow
              d={verticalThenHorizontal(
                bottomOf(NODES.harnessParse),
                rightOf(NODES.tool),
              )}
              color='harness'
            />
            <StepNumber x={322} y={296} glyph='②' color='harness' />
          </g>

          <g className='llm-phase llm-phase-3'>
            <LoopNode
              node={NODES.tool}
              color='tool'
              title={dict.nodes.tool.title}
              sub={dict.nodes.tool.sub}
            />
            <LoopArrow
              d={horizontalThenVertical(
                leftOf(NODES.tool),
                bottomOf(NODES.harnessAppend),
              )}
              color='tool'
            />
            <StepNumber x={38} y={296} glyph='③' color='tool' />
          </g>

          <g className='llm-phase llm-phase-4'>
            <LoopNode
              node={NODES.harnessAppend}
              color='harness'
              title={dict.nodes.harnessAppend.title}
              sub={dict.nodes.harnessAppend.sub}
            />
            <LoopArrow
              d={verticalThenHorizontal(
                topOf(NODES.harnessAppend),
                leftOf(NODES.model),
              )}
              color='harness'
            />
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
      <AnimToggle
        lang={lang}
        paused={paused}
        onToggle={() => setPaused((p) => !p)}
      />
      <FigCaption>{dict.caption}</FigCaption>
    </figure>
  );
}
