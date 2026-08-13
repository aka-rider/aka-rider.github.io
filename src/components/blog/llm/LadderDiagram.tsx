import { ladderStrings } from '@/components/blog/llm/strings';

interface LadderDiagramProps {
  lang?: 'en' | 'uk';
}

function LadderRung({
  y,
  text,
  colored,
}: {
  y: number;
  text: string;
  colored?: boolean;
}) {
  return (
    <>
      <rect
        x={60}
        y={y}
        width={280}
        height={50}
        rx={6}
        fill='none'
        stroke={colored ? undefined : 'currentColor'}
        className={colored ? 'stroke-cyan-700 dark:stroke-cyan-400' : undefined}
      />
      <text
        x={200}
        y={y + 30}
        textAnchor='middle'
        fill={colored ? undefined : 'currentColor'}
        className={colored ? 'fill-cyan-700 dark:fill-cyan-400' : undefined}
      >
        {text}
      </text>
    </>
  );
}

function LadderArrow({
  y1,
  y2,
  labelY,
  text,
}: {
  y1: number;
  y2: number;
  labelY: number;
  text: string;
}) {
  return (
    <>
      <line
        x1={200}
        y1={y1}
        x2={200}
        y2={y2}
        stroke='currentColor'
        markerEnd='url(#llmLadderArrow)'
      />
      <text x={345} y={labelY} fontSize={11} fill='currentColor'>
        {text}
      </text>
    </>
  );
}

export default function LadderDiagram({ lang = 'en' }: LadderDiagramProps) {
  const dict = ladderStrings[lang];

  return (
    <figure className='my-8'>
      <div className='overflow-x-auto'>
        <svg
          viewBox='0 0 520 610'
          role='img'
          aria-label={dict.aria}
          style={{ width: 520, minWidth: 520 }}
          className='h-auto block mx-auto'
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
            <LadderRung y={20} text={dict.rungs.distribution} />
            <LadderArrow
              y1={95}
              y2={70}
              labelY={86}
              text={dict.arrows.softmax}
            />

            <LadderRung y={100} text={dict.rungs.logits} />
            <LadderArrow
              y1={175}
              y2={150}
              labelY={166}
              text={dict.arrows.projected}
            />

            <LadderRung y={180} text={dict.rungs.blocks} />
            <LadderArrow
              y1={255}
              y2={230}
              labelY={246}
              text={dict.arrows.repeated}
            />

            <LadderRung y={260} text={dict.rungs.block} colored />
            <LadderArrow
              y1={335}
              y2={310}
              labelY={326}
              text={dict.arrows.partOf}
            />

            <LadderRung y={340} text={dict.rungs.head} colored />
            <LadderArrow
              y1={415}
              y2={390}
              labelY={406}
              text={dict.arrows.computedBy}
            />

            <LadderRung y={420} text={dict.rungs.matmuls} />
            <LadderArrow
              y1={495}
              y2={470}
              labelY={486}
              text={dict.arrows.arrangedInto}
            />

            <LadderRung y={500} text={dict.rungs.floats} />

            <line
              x1={500}
              y1={45}
              x2={360}
              y2={45}
              stroke='currentColor'
              markerEnd='url(#llmLadderArrow)'
            />
            <text
              x={500}
              y={66}
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
      </div>
      <figcaption className='font-mono text-xs text-slate-500 dark:text-slate-400 text-center mt-2'>
        {dict.caption}
      </figcaption>
    </figure>
  );
}
