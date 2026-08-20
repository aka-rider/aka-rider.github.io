import {
  EXAMPLE_ANSWER_TOKENS,
  EXAMPLE_TOKENS,
  NEXT_TOKEN_CANDIDATES,
} from '@/components/blog/llm/example';
import FigCaption from '@/components/blog/llm/FigCaption';
import { autoregressiveStrings } from '@/components/blog/llm/strings/autoregressive';

import type { Lang } from '@/i18n';

const AMBER_STROKE = 'stroke-amber-700 dark:stroke-amber-400';
const AMBER_FILL = 'fill-amber-700 dark:fill-amber-400';
const AMBER_BG = 'fill-amber-50 dark:fill-amber-950/60';
const CYAN_STROKE = 'stroke-cyan-700 dark:stroke-cyan-400';
const CYAN_FILL = 'fill-cyan-700 dark:fill-cyan-400';
const CYAN_BG = 'fill-cyan-50 dark:fill-cyan-950/60';
const VIOLET_STROKE = 'stroke-violet-700 dark:stroke-violet-400';
const VIOLET_FILL = 'fill-violet-700 dark:fill-violet-400';
const VIOLET_BG = 'fill-violet-50 dark:fill-violet-950/60';

const TOKEN_ROW = (() => {
  let x = 50;
  return EXAMPLE_TOKENS.map((token) => {
    const label = token.trim();
    const w = label.length * 7 + 14;
    const box = { label, x, w };
    x += w + 4;
    return box;
  });
})();

const SLOT_X = 270;
const SLOT_W = 52;

const BAR_COUNT = 5;
const BAR_PROBS = (() => {
  const exps = NEXT_TOKEN_CANDIDATES.map((c) => Math.exp(c.logit));
  const sum = exps.reduce((a, b) => a + b, 0);
  return NEXT_TOKEN_CANDIDATES.slice(0, BAR_COUNT).map((c, i) => ({
    token: c.token,
    p: exps[i]! / sum,
  }));
})();

const BARS_TOP = 216;
const BAR_ROW_H = 22;

const ANSWER_TOP = 382;
const ANSWER_ROW_H = 25;
const ANSWER_LEFT = 20;
const ANSWER_RIGHT = 350;
const ANSWER_STOP_W = 42;

const ANSWER_LAYOUT = (() => {
  const boxes: { label: string; x: number; y: number; w: number }[] = [];
  let x = ANSWER_LEFT;
  let row = 0;
  const place = (w: number) => {
    if (x + w > ANSWER_RIGHT) {
      row += 1;
      x = ANSWER_LEFT;
    }
    const pos = { x, y: ANSWER_TOP + row * ANSWER_ROW_H };
    x += w + 4;
    return pos;
  };
  for (const token of EXAMPLE_ANSWER_TOKENS) {
    const label = token.trim();
    const w = label.length * 6 + 12;
    boxes.push({ label, w, ...place(w) });
  }
  const stop = { w: ANSWER_STOP_W, ...place(ANSWER_STOP_W) };
  const bottom = ANSWER_TOP + row * ANSWER_ROW_H + 20;
  return { boxes, stop, bottom };
})();

function TokenBox({ x, w, label }: { x: number; w: number; label: string }) {
  return (
    <>
      <rect
        x={x}
        y={42}
        width={w}
        height={26}
        rx={5}
        className={`${AMBER_BG} ${AMBER_STROKE}`}
      />
      <text
        x={x + w / 2}
        y={59}
        textAnchor='middle'
        fontSize={11}
        className={AMBER_FILL}
      >
        {label}
      </text>
    </>
  );
}

export default function AutoregressiveLoop({ lang }: { lang: Lang }) {
  const dict = autoregressiveStrings[lang];
  const sampled = BAR_PROBS[0]!;

  return (
    <figure className='my-8'>
      <svg
        viewBox='0 0 360 466'
        role='img'
        aria-label={dict.aria}
        className='llm-anim w-full h-auto max-w-[400px] mx-auto block'
      >
        <defs>
          <marker
            id='llmAutoregArrow'
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
          <g className='llm-phase llm-phase-1'>
            <text x={50} y={30} fontSize={10} fill='currentColor'>
              ① {dict.contextLabel}
            </text>
            {TOKEN_ROW.map((box) => (
              <TokenBox key={box.label} x={box.x} w={box.w} label={box.label} />
            ))}
            <rect
              x={SLOT_X}
              y={42}
              width={SLOT_W}
              height={26}
              rx={5}
              fill='none'
              stroke='currentColor'
              strokeDasharray='4 3'
              opacity={0.6}
            />
          </g>

          <g className='llm-phase llm-phase-2'>
            <line
              x1={180}
              y1={72}
              x2={180}
              y2={116}
              stroke='currentColor'
              markerEnd='url(#llmAutoregArrow)'
            />
            <text
              x={130}
              y={150}
              textAnchor='end'
              fontSize={10}
              fill='currentColor'
            >
              ②
            </text>
            <rect
              x={142}
              y={120}
              width={76}
              height={48}
              rx={7}
              className={`${CYAN_BG} ${CYAN_STROKE}`}
            />
            <text
              x={180}
              y={151}
              textAnchor='middle'
              fontSize={20}
              fontStyle='italic'
              className={CYAN_FILL}
            >
              f
            </text>
            <text x={226} y={138} fontSize={9} fill='currentColor'>
              {dict.modelLabelLines.map((line, i) => (
                <tspan key={i} x={226} dy={i === 0 ? 0 : 12}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>

          <g className='llm-phase llm-phase-3'>
            <line
              x1={180}
              y1={172}
              x2={180}
              y2={204}
              stroke='currentColor'
              markerEnd='url(#llmAutoregArrow)'
            />
            <text x={192} y={194} fontSize={9.5} fill='currentColor'>
              ③ {dict.distributionLabel}
            </text>
            {BAR_PROBS.map((bar, i) => {
              const rowY = BARS_TOP + i * BAR_ROW_H;
              const w = bar.p * 170;
              return (
                <g key={bar.token}>
                  <text
                    x={118}
                    y={rowY + 11}
                    textAnchor='end'
                    fontSize={10}
                    className={AMBER_FILL}
                  >
                    {bar.token}
                  </text>
                  <rect
                    x={124}
                    y={rowY + 3}
                    width={w}
                    height={9}
                    rx={2}
                    className={CYAN_FILL}
                  />
                  <text
                    x={128 + w}
                    y={rowY + 11}
                    fontSize={9}
                    fill='currentColor'
                    opacity={0.7}
                  >
                    {(bar.p * 100).toFixed(0)}%
                  </text>
                </g>
              );
            })}
            <rect
              x={46}
              y={BARS_TOP - 3}
              width={256}
              height={20}
              rx={5}
              fill='none'
              className={CYAN_STROKE}
            />
            <text x={306} y={BARS_TOP + 11} fontSize={9} className={CYAN_FILL}>
              {dict.sampledLabel}
            </text>
          </g>

          <g className='llm-phase llm-phase-4'>
            <path
              d='M 312 240 C 350 216, 350 108, 300 74'
              fill='none'
              stroke='currentColor'
              markerEnd='url(#llmAutoregArrow)'
            />
            <rect
              x={300}
              y={144}
              width={56}
              height={18}
              rx={4}
              className={`${AMBER_BG} ${AMBER_STROKE}`}
            />
            <text
              x={328}
              y={156}
              textAnchor='middle'
              fontSize={9.5}
              className={AMBER_FILL}
            >
              {sampled.token}
            </text>
            <text
              x={352}
              y={110}
              textAnchor='end'
              fontSize={9}
              fill='currentColor'
            >
              ④ {dict.appendLabel}
            </text>
            <path
              d='M 118 332 H 38 V 78'
              fill='none'
              stroke='currentColor'
              markerEnd='url(#llmAutoregArrow)'
            />
            <text
              x={14}
              y={204}
              textAnchor='middle'
              fontSize={9.5}
              fill='currentColor'
              transform='rotate(-90 14 204)'
            >
              {dict.repeatLabel}
            </text>
          </g>

          <g>
            <line
              x1={20}
              y1={352}
              x2={340}
              y2={352}
              stroke='currentColor'
              strokeDasharray='2 4'
              opacity={0.4}
            />
            <text x={ANSWER_LEFT} y={372} fontSize={10} fill='currentColor'>
              {dict.afterLabel}
            </text>
            {ANSWER_LAYOUT.boxes.map((box, i) => (
              <g key={i}>
                <rect
                  x={box.x}
                  y={box.y}
                  width={box.w}
                  height={20}
                  rx={4}
                  className={`${AMBER_BG} ${AMBER_STROKE}`}
                />
                <text
                  x={box.x + box.w / 2}
                  y={box.y + 13.5}
                  textAnchor='middle'
                  fontSize={9.5}
                  className={AMBER_FILL}
                >
                  {box.label}
                </text>
              </g>
            ))}
            <rect
              x={ANSWER_LAYOUT.stop.x}
              y={ANSWER_LAYOUT.stop.y}
              width={ANSWER_LAYOUT.stop.w}
              height={20}
              rx={4}
              className={`${VIOLET_BG} ${VIOLET_STROKE}`}
            />
            <text
              x={ANSWER_LAYOUT.stop.x + ANSWER_LAYOUT.stop.w / 2}
              y={ANSWER_LAYOUT.stop.y + 13.5}
              textAnchor='middle'
              fontSize={9.5}
              className={VIOLET_FILL}
            >
              {dict.stopLabel}
            </text>
            <text
              x={ANSWER_LEFT}
              y={ANSWER_LAYOUT.bottom + 20}
              fontSize={9}
              className={VIOLET_FILL}
            >
              {dict.stopNoteLines.map((line, i) => (
                <tspan key={i} x={ANSWER_LEFT} dy={i === 0 ? 0 : 12}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        </g>
      </svg>
      <FigCaption>{dict.caption}</FigCaption>
    </figure>
  );
}
