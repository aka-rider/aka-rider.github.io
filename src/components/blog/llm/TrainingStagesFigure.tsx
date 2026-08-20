import FigCaption from '@/components/blog/llm/FigCaption';
import { trainingStagesStrings } from '@/components/blog/llm/strings/trainingStages';

import type { Lang } from '@/i18n';

const AMBER_STROKE = 'stroke-amber-700 dark:stroke-amber-400';
const AMBER_FILL = 'fill-amber-700 dark:fill-amber-400';
const AMBER_BG = 'fill-amber-50 dark:fill-amber-950/60';
const CYAN_STROKE = 'stroke-cyan-700 dark:stroke-cyan-400';
const CYAN_FILL = 'fill-cyan-700 dark:fill-cyan-400';
const CYAN_BG = 'fill-cyan-50 dark:fill-cyan-950/60';

const CENTER_X = 170;

function Stage({
  top,
  dataLabel,
  dataFontSize,
  barWidth,
  modelLines,
  noteLines,
}: {
  top: number;
  dataLabel: string;
  dataFontSize: number;
  barWidth: number;
  modelLines: readonly string[];
  noteLines: readonly string[];
}) {
  return (
    <g>
      <text
        x={CENTER_X}
        y={top + 8}
        textAnchor='middle'
        fontSize={dataFontSize}
        className={AMBER_FILL}
      >
        {dataLabel}
      </text>
      <rect
        x={CENTER_X - barWidth / 2}
        y={top + 14}
        width={barWidth}
        height={7}
        rx={3}
        className={`${AMBER_BG} ${AMBER_STROKE}`}
      />
      <line
        x1={CENTER_X}
        y1={top + 26}
        x2={CENTER_X}
        y2={top + 44}
        stroke='currentColor'
        markerEnd='url(#llmStagesArrow)'
      />
      <rect
        x={28}
        y={top + 48}
        width={284}
        height={44}
        rx={7}
        className={`${CYAN_BG} ${CYAN_STROKE}`}
      />
      <text
        x={CENTER_X}
        y={modelLines.length === 1 ? top + 74 : top + 68}
        textAnchor='middle'
        fontSize={11}
        className={CYAN_FILL}
      >
        {modelLines.map((line, i) => (
          <tspan key={i} x={CENTER_X} dy={i === 0 ? 0 : 14}>
            {line}
          </tspan>
        ))}
      </text>
      <text
        x={CENTER_X}
        y={top + 108}
        textAnchor='middle'
        fontSize={9.5}
        fill='currentColor'
        opacity={0.75}
      >
        {noteLines.map((line, i) => (
          <tspan key={i} x={CENTER_X} dy={i === 0 ? 0 : 12}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

function Connector({ top, label }: { top: number; label: string }) {
  return (
    <g>
      <line
        x1={CENTER_X}
        y1={top + 128}
        x2={CENTER_X}
        y2={top + 178}
        stroke='currentColor'
        markerEnd='url(#llmStagesArrow)'
      />
      <text x={178} y={top + 156} fontSize={9} fill='currentColor'>
        {label}
      </text>
    </g>
  );
}

export default function TrainingStagesFigure({ lang }: { lang: Lang }) {
  const dict = trainingStagesStrings[lang];

  return (
    <figure className='my-8'>
      <svg
        viewBox='0 0 340 536'
        role='img'
        aria-label={dict.aria}
        className='w-full h-auto max-w-[380px] mx-auto block'
      >
        <defs>
          <marker
            id='llmStagesArrow'
            viewBox='0 0 10 10'
            refX={9}
            refY={5}
            markerWidth={6}
            markerHeight={6}
            orient='auto'
          >
            <path d='M0,0 L10,5 L0,10 z' fill='currentColor' />
          </marker>
        </defs>

        <g fontFamily='var(--font-mono)'>
          <Stage
            top={24}
            dataLabel={dict.stage1Data}
            dataFontSize={12}
            barWidth={300}
            modelLines={[dict.stage1Model]}
            noteLines={dict.stage1Note}
          />
          <Connector top={24} label={dict.sameWeights} />
          <Stage
            top={210}
            dataLabel={dict.stage2Data}
            dataFontSize={10.5}
            barWidth={110}
            modelLines={[dict.stage2Model]}
            noteLines={dict.stage2Note}
          />
          <Connector top={210} label={dict.sameWeights} />
          <Stage
            top={396}
            dataLabel={dict.stage3Data}
            dataFontSize={10}
            barWidth={56}
            modelLines={dict.stage3Model}
            noteLines={dict.stage3Note}
          />
        </g>
      </svg>
      <FigCaption>{dict.caption}</FigCaption>
    </figure>
  );
}
