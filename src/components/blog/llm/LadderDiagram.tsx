import FigCaption from '@/components/blog/llm/FigCaption';
import { ladderStrings } from '@/components/blog/llm/strings/ladder';

import type { Lang } from '@/i18n';

const RUNG_COUNT = 7;
const CENTER_X = 200;
const TOP_Y = 20;
const RUNG_GAP = 28;

function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

function rungWidth(i: number) {
  return lerp(200, 300, i / (RUNG_COUNT - 1));
}

function rungHeight(i: number) {
  return lerp(40, 52, i / (RUNG_COUNT - 1));
}

function rungY(i: number) {
  let y = TOP_Y;
  for (let k = 0; k < i; k += 1) {
    y += rungHeight(k) + RUNG_GAP;
  }
  return y;
}

function rungBottom(i: number) {
  return rungY(i) + rungHeight(i);
}

function rungFontSize(i: number) {
  return i < 2 ? 12 : 13;
}

function LadderRung({
  i,
  text,
  colored,
}: {
  i: number;
  text: string;
  colored?: boolean;
}) {
  const width = rungWidth(i);
  const height = rungHeight(i);
  const y = rungY(i);
  return (
    <>
      <rect
        x={CENTER_X - width / 2}
        y={y}
        width={width}
        height={height}
        rx={6}
        fill='none'
        stroke={colored ? undefined : 'currentColor'}
        className={colored ? 'stroke-cyan-700 dark:stroke-cyan-400' : undefined}
      />
      <text
        x={CENTER_X}
        y={y + height / 2 + 4.5}
        textAnchor='middle'
        fontSize={rungFontSize(i)}
        fill={colored ? undefined : 'currentColor'}
        className={colored ? 'fill-cyan-700 dark:fill-cyan-400' : undefined}
      >
        {text}
      </text>
    </>
  );
}

function LadderArrow({ gapAbove, text }: { gapAbove: number; text: string }) {
  const y1 = rungY(gapAbove + 1) - 5;
  const y2 = rungBottom(gapAbove);
  return (
    <>
      <line
        x1={CENTER_X}
        y1={y1}
        x2={CENTER_X}
        y2={y2}
        stroke='currentColor'
        markerEnd='url(#llmLadderArrow)'
      />
      <text x={345} y={y1 - 9} fontSize={11} fill='currentColor'>
        {text}
      </text>
    </>
  );
}

function SideRails() {
  const bottomIndex = RUNG_COUNT - 1;
  const bottomY = rungY(bottomIndex);
  const bottomHalf = rungWidth(bottomIndex) / 2;
  const topHalf = rungWidth(0) / 2;
  return (
    <g stroke='currentColor' strokeDasharray='4 6' opacity={0.25}>
      <line
        x1={CENTER_X - bottomHalf}
        y1={bottomY}
        x2={CENTER_X - topHalf}
        y2={TOP_Y}
      />
      <line
        x1={CENTER_X + bottomHalf}
        y1={bottomY}
        x2={CENTER_X + topHalf}
        y2={TOP_Y}
      />
    </g>
  );
}

export default function LadderDiagram({ lang }: { lang: Lang }) {
  const dict = ladderStrings[lang];
  const topRungMidY = TOP_Y + rungHeight(0) / 2;
  const annotationArrowX2 = CENTER_X + rungWidth(0) / 2 + 8;

  return (
    <figure className='my-8'>
      <svg
        viewBox='0 0 520 540'
        role='img'
        aria-label={dict.aria}
        className='w-full h-auto max-w-[520px] mx-auto block'
      >
        <defs>
          <marker
            id='llmLadderArrow'
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

        <g fontFamily='var(--font-mono)' fontSize={13}>
          <SideRails />

          <LadderRung i={0} text={dict.rungs.distribution} />
          <LadderArrow gapAbove={0} text={dict.arrows.softmax} />

          <LadderRung i={1} text={dict.rungs.logits} />
          <LadderArrow gapAbove={1} text={dict.arrows.projected} />

          <LadderRung i={2} text={dict.rungs.blocks} />
          <LadderArrow gapAbove={2} text={dict.arrows.repeated} />

          <LadderRung i={3} text={dict.rungs.block} colored />
          <LadderArrow gapAbove={3} text={dict.arrows.partOf} />

          <LadderRung i={4} text={dict.rungs.head} colored />
          <LadderArrow gapAbove={4} text={dict.arrows.computedBy} />

          <LadderRung i={5} text={dict.rungs.matmuls} />
          <LadderArrow gapAbove={5} text={dict.arrows.arrangedInto} />

          <LadderRung i={6} text={dict.rungs.floats} />

          <line
            x1={500}
            y1={topRungMidY}
            x2={annotationArrowX2}
            y2={topRungMidY}
            stroke='currentColor'
            markerEnd='url(#llmLadderArrow)'
          />
          <text
            x={500}
            y={topRungMidY + 21}
            fontSize={11.5}
            textAnchor='end'
            fill='currentColor'
          >
            {dict.annotation.map((line, i) => (
              <tspan key={i} x={500} dy={i === 0 ? 0 : 14}>
                {line}
              </tspan>
            ))}
          </text>
        </g>
      </svg>
      <FigCaption>{dict.caption}</FigCaption>
    </figure>
  );
}
