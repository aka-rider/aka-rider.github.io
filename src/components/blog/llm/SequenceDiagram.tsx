import FigCaption from '@/components/blog/llm/FigCaption';
import { sequenceStrings } from '@/components/blog/llm/strings/sequence';

import type { Lang } from '@/i18n';

type ActorColor = 'model' | 'harness';

function strokeClass(colored?: ActorColor) {
  if (colored === 'model') return 'stroke-cyan-700 dark:stroke-cyan-400';
  if (colored === 'harness') return 'stroke-violet-700 dark:stroke-violet-400';
  return undefined;
}

function fillClass(colored?: ActorColor) {
  if (colored === 'model') return 'fill-cyan-700 dark:fill-cyan-400';
  if (colored === 'harness') return 'fill-violet-700 dark:fill-violet-400';
  return undefined;
}

function ActorLabel({
  x,
  text,
  colored,
}: {
  x: number;
  text: string;
  colored?: ActorColor;
}) {
  return (
    <text
      x={x}
      y={24}
      textAnchor='middle'
      fill={colored ? undefined : 'currentColor'}
      className={fillClass(colored)}
    >
      {text}
    </text>
  );
}

function Lifeline({ x, colored }: { x: number; colored?: ActorColor }) {
  return (
    <line
      x1={x}
      y1={36}
      x2={x}
      y2={490}
      strokeWidth={0.75}
      opacity={0.4}
      stroke={colored ? undefined : 'currentColor'}
      className={strokeClass(colored)}
    />
  );
}

function SeqArrow({
  x1,
  y1,
  x2,
  y2,
  colored,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  colored?: ActorColor;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      markerEnd='url(#llmSeqArrow)'
      stroke={colored ? undefined : 'currentColor'}
      className={strokeClass(colored)}
    />
  );
}

function SeqLabel({
  x,
  y,
  text,
  colored,
  anchor = 'middle',
}: {
  x: number;
  y: number;
  text: string;
  colored?: ActorColor;
  anchor?: 'start' | 'middle' | 'end';
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={colored ? undefined : 'currentColor'}
      className={fillClass(colored)}
    >
      {text}
    </text>
  );
}

export default function SequenceDiagram({ lang }: { lang: Lang }) {
  const dict = sequenceStrings[lang];

  return (
    <figure className='my-8'>
      <div className='overflow-x-auto'>
        <svg
          viewBox='0 0 820 510'
          role='img'
          aria-label={dict.aria}
          className='w-full h-auto max-w-[820px] min-w-[560px] mx-auto block'
        >
          <defs>
            <marker
              id='llmSeqArrow'
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

          <g fontFamily='var(--font-mono)' fontSize={12}>
            <ActorLabel x={80} text={dict.actors.user} />
            <ActorLabel x={300} text={dict.actors.harness} colored='harness' />
            <ActorLabel x={540} text={dict.actors.model} colored='model' />
            <ActorLabel x={740} text={dict.actors.tool} />

            <Lifeline x={80} />
            <Lifeline x={300} colored='harness' />
            <Lifeline x={540} colored='model' />
            <Lifeline x={740} />

            <SeqArrow x1={80} y1={70} x2={296} y2={70} />
            <SeqLabel x={188} y={63} text={dict.arrows.question} />

            <SeqArrow x1={300} y1={120} x2={536} y2={120} colored='harness' />
            <SeqLabel
              x={418}
              y={113}
              text={dict.arrows.contextTokens}
              colored='harness'
            />

            <SeqArrow x1={540} y1={170} x2={304} y2={170} colored='model' />
            <SeqLabel
              x={420}
              y={157}
              text={dict.arrows.emitted1}
              colored='model'
            />
            <SeqLabel
              x={420}
              y={185}
              text={dict.arrows.emitted2}
              colored='model'
            />

            <path
              d='M300,220 C 370,220 370,255 300,255'
              fill='none'
              markerEnd='url(#llmSeqArrow)'
              className={strokeClass('harness')}
            />
            <SeqLabel
              x={380}
              y={242}
              text={dict.arrows.parse}
              colored='harness'
              anchor='start'
            />

            <SeqArrow x1={300} y1={300} x2={736} y2={300} colored='harness' />
            <SeqLabel
              x={518}
              y={293}
              text={dict.arrows.execute}
              colored='harness'
            />

            <SeqArrow x1={740} y1={345} x2={304} y2={345} />
            <SeqLabel x={500} y={338} text={dict.arrows.result} />

            <SeqArrow x1={300} y1={395} x2={536} y2={395} colored='harness' />
            <SeqLabel
              x={418}
              y={382}
              text={dict.arrows.resultTokens1}
              colored='harness'
            />
            <SeqLabel
              x={418}
              y={410}
              text={dict.arrows.resultTokens2}
              colored='harness'
            />

            <SeqArrow x1={540} y1={450} x2={304} y2={450} colored='model' />
            <SeqLabel
              x={418}
              y={437}
              text={dict.arrows.continuation1}
              colored='model'
            />
            <SeqLabel
              x={418}
              y={465}
              text={dict.arrows.continuation2}
              colored='model'
            />
          </g>
        </svg>
      </div>
      <FigCaption>{dict.caption}</FigCaption>
    </figure>
  );
}
