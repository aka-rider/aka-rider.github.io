import { Chip } from '@/components/blog/llm/Chip';
import { EXAMPLE_TOKENS } from '@/components/blog/llm/example';
import FigCaption from '@/components/blog/llm/FigCaption';
import { visibleSpaces } from '@/components/blog/llm/format';
import { gelu } from '@/components/blog/llm/math';
import { mlpStrings } from '@/components/blog/llm/strings/mlp';
import {
  AMBER_FILL,
  FINAL_EMBEDDING_MAX_ABS,
  finalEmbedding,
  NEG_FILL,
  opacityFor,
  signClass,
  StripCells,
  TEAL_FILL,
  tokenRow,
} from '@/components/blog/llm/vectors';

import type { Lang } from '@/i18n';

const MLP_TOKEN_INDEX = EXAMPLE_TOKENS.indexOf(' Tower');
if (MLP_TOKEN_INDEX === -1) {
  throw new Error("MLPFigure: ' Tower' is missing from EXAMPLE_TOKENS");
}
const MLP_TOKEN_ID = tokenRow(' Tower').id;

const INPUT_LEN = 8;
const EXPAND_LEN = 16;
const CONTRACT_LEN = 8;

const EXPAND_PRE = [
  -1.8, -0.6, 0.35, 3.1, -0.25, 0.15, -1.2, 0.4, 2.6, -0.9, 0.2, -0.4, 0.5, 2.8,
  -0.3, 0.1,
];
const HOT_DETECTOR_INDICES = [3, 8, 13];
const EXPAND_POST = EXPAND_PRE.map(gelu);

const WRITE_DIMS = [1, 4, 6];
const WRITE_WEIGHT = 0.25;
const NOISE_WEIGHT = 0.08;

function downProjectionWeight(detector: number, outputIndex: number): number {
  if (
    HOT_DETECTOR_INDICES.includes(detector) &&
    WRITE_DIMS.includes(outputIndex)
  ) {
    return WRITE_WEIGHT;
  }
  return Math.sin((detector * 5 + outputIndex * 11) * 0.31) * NOISE_WEIGHT;
}

const CONTRACT_DELTA: number[] = Array.from({ length: CONTRACT_LEN }, (_, c) =>
  EXPAND_POST.reduce(
    (sum, value, k) => sum + value * downProjectionWeight(k, c),
    0,
  ),
);

const INPUT_STRIP: number[] = finalEmbedding(MLP_TOKEN_ID, MLP_TOKEN_INDEX);
const OUTPUT_STRIP: number[] = INPUT_STRIP.map(
  (value, i) => value + CONTRACT_DELTA[i]!,
);

const PARIS_DIRECTION_INDICES: number[] = CONTRACT_DELTA.map(
  (value, index) => ({ value, index }),
)
  .sort((a, b) => b.value - a.value)
  .slice(0, WRITE_DIMS.length)
  .map((entry) => entry.index)
  .sort((a, b) => a - b);

const OUTPUT_MAX_ABS = Math.max(
  ...OUTPUT_STRIP.map((value) => Math.abs(value)),
);

const HOT_FILL = AMBER_FILL;
const COLD_FILL = 'fill-slate-300 dark:fill-slate-700';
const MUTED_TEXT_CLASSES = 'fill-slate-500 dark:fill-slate-400';
const AMBER_STROKE = 'stroke-amber-700 dark:stroke-amber-400';
const CYAN_STROKE = 'stroke-cyan-700 dark:stroke-cyan-400';
const SLATE_STROKE = 'stroke-slate-300 dark:stroke-slate-600';

const GELU_DOMAIN: readonly [number, number] = [-3, 3];
const GELU_RANGE: readonly [number, number] = [-0.5, 3];
const GELU_SAMPLE_COUNT = 40;

function geluChartGeometry(
  x: number,
  top: number,
  width: number,
  height: number,
) {
  const toX = (value: number) =>
    x + ((value - GELU_DOMAIN[0]) / (GELU_DOMAIN[1] - GELU_DOMAIN[0])) * width;
  const toY = (value: number) =>
    top +
    height -
    ((value - GELU_RANGE[0]) / (GELU_RANGE[1] - GELU_RANGE[0])) * height;
  const points = Array.from({ length: GELU_SAMPLE_COUNT }, (_, i) => {
    const value =
      GELU_DOMAIN[0] +
      (i / (GELU_SAMPLE_COUNT - 1)) * (GELU_DOMAIN[1] - GELU_DOMAIN[0]);
    return { value, image: gelu(value) };
  });
  const path = points
    .map(
      (point, i) =>
        `${i === 0 ? 'M' : 'L'}${toX(point.value).toFixed(1)},${toY(point.image).toFixed(1)}`,
    )
    .join(' ');
  return { path, toX, toY, zeroX: toX(0), zeroY: toY(0) };
}

function GeluChart({
  x,
  top,
  width,
  height,
  label,
  fontSize = 7,
}: {
  x: number;
  top: number;
  width: number;
  height: number;
  label: string;
  fontSize?: number;
}) {
  const geo = geluChartGeometry(x, top, width, height);
  return (
    <g>
      <rect
        x={x}
        y={top}
        width={width}
        height={height}
        fill='none'
        strokeWidth={1}
        opacity={0.4}
        className={SLATE_STROKE}
      />
      <line
        x1={x}
        y1={geo.zeroY}
        x2={x + width}
        y2={geo.zeroY}
        strokeWidth={0.75}
        opacity={0.5}
        className={SLATE_STROKE}
      />
      <line
        x1={geo.zeroX}
        y1={top}
        x2={geo.zeroX}
        y2={top + height}
        strokeWidth={0.75}
        opacity={0.5}
        className={SLATE_STROKE}
      />
      <path
        d={geo.path}
        fill='none'
        strokeWidth={1.5}
        className={CYAN_STROKE}
      />
      {EXPAND_PRE.map((value, i) => {
        const hot = HOT_DETECTOR_INDICES.includes(i);
        return (
          <circle
            key={i}
            cx={geo.toX(value)}
            cy={geo.toY(EXPAND_POST[i]!)}
            r={hot ? 2.5 : 1.2}
            className={hot ? HOT_FILL : COLD_FILL}
          />
        );
      })}
      <text
        x={x + width / 2}
        y={top - 6}
        textAnchor='middle'
        fontSize={fontSize}
        className={MUTED_TEXT_CLASSES}
      >
        {label}
      </text>
    </g>
  );
}

function InputStrip({
  x,
  y,
  cellWidth,
  cellHeight,
  gap,
}: {
  x: number;
  y: number;
  cellWidth: number;
  cellHeight: number;
  gap: number;
}) {
  return (
    <StripCells
      values={INPUT_STRIP}
      x={x}
      y={y}
      cellWidth={cellWidth}
      cellHeight={cellHeight}
      gap={gap}
      maxAbs={FINAL_EMBEDDING_MAX_ABS}
      colorFor={(_, value) => signClass(value, AMBER_FILL)}
    />
  );
}

function OutputStrip({
  x,
  y,
  cellWidth,
  cellHeight,
  gap,
}: {
  x: number;
  y: number;
  cellWidth: number;
  cellHeight: number;
  gap: number;
}) {
  return (
    <StripCells
      values={OUTPUT_STRIP}
      x={x}
      y={y}
      cellWidth={cellWidth}
      cellHeight={cellHeight}
      gap={gap}
      maxAbs={OUTPUT_MAX_ABS}
      colorFor={(index, value) => {
        if (value < 0) return NEG_FILL;
        return PARIS_DIRECTION_INDICES.includes(index) ? TEAL_FILL : AMBER_FILL;
      }}
    />
  );
}

function DetectorStrip({
  x,
  y,
  cellWidth,
  cellHeight,
  gap,
}: {
  x: number;
  y: number;
  cellWidth: number;
  cellHeight: number;
  gap: number;
}) {
  return (
    <StripCells
      values={EXPAND_POST}
      x={x}
      y={y}
      cellWidth={cellWidth}
      cellHeight={cellHeight}
      gap={gap}
      colorFor={(index) =>
        HOT_DETECTOR_INDICES.includes(index) ? HOT_FILL : COLD_FILL
      }
      opacityForCell={(index, value) =>
        HOT_DETECTOR_INDICES.includes(index) ? 0.9 : opacityFor(value) * 0.6
      }
    />
  );
}

function ShapeLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor='middle'
      fontSize={7}
      className={MUTED_TEXT_CLASSES}
    >
      {text}
    </text>
  );
}

const CELL = 6;
const GAP = 1;
const INPUT_WIDTH = INPUT_LEN * (CELL + GAP) - GAP;
const EXPAND_WIDTH = EXPAND_LEN * (CELL + GAP) - GAP;
const CONTRACT_WIDTH = CONTRACT_LEN * (CELL + GAP) - GAP;

const PIPE_Y = 60;
const INPUT_X = 16;
const INPUT_END = INPUT_X + INPUT_WIDTH;
const ARROW1_X = INPUT_END + 14;
const EXPAND_X = ARROW1_X + 12;
const EXPAND_END = EXPAND_X + EXPAND_WIDTH;
const ARROW2_X = EXPAND_END + 14;
const GELU_X = ARROW2_X + 12;
const GELU_W = 100;
const GELU_END = GELU_X + GELU_W;
const ARROW3_X = GELU_END + 14;
const CONTRACT_X = ARROW3_X + 12;
const CONTRACT_END = CONTRACT_X + CONTRACT_WIDTH;

const VIEW_WIDTH = CONTRACT_END + 20;

const RESIDUAL_Y = PIPE_Y + 100;
const RESIDUAL_X_START = 4;
const RESIDUAL_X_END = VIEW_WIDTH - 4;
const BRANCH_X = INPUT_X + INPUT_WIDTH / 2;
const MERGE_X = CONTRACT_X + CONTRACT_WIDTH / 2;

const VIEW_HEIGHT = RESIDUAL_Y + 36;

function ArrowGlyph({
  x,
  y,
  glyph = '→',
  fontSize = 10,
}: {
  x: number;
  y: number;
  glyph?: string;
  fontSize?: number;
}) {
  return (
    <text
      x={x}
      y={y + 3}
      textAnchor='middle'
      fontSize={fontSize}
      className={MUTED_TEXT_CLASSES}
    >
      {glyph}
    </text>
  );
}

function WideMLP({ strings }: { strings: (typeof mlpStrings)[Lang] }) {
  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      role='img'
      aria-label={strings.aria}
      className='hidden sm:block w-full h-auto max-w-[560px] mx-auto'
    >
      <g fontFamily='var(--font-mono)'>
        <line
          x1={RESIDUAL_X_START}
          y1={RESIDUAL_Y}
          x2={RESIDUAL_X_END}
          y2={RESIDUAL_Y}
          strokeWidth={5}
          opacity={0.85}
          className={AMBER_STROKE}
        />
        <text
          x={RESIDUAL_X_START}
          y={RESIDUAL_Y + 20}
          fontSize={8}
          className={MUTED_TEXT_CLASSES}
        >
          {strings.residualLabel}
        </text>

        <line
          x1={BRANCH_X}
          y1={RESIDUAL_Y}
          x2={BRANCH_X}
          y2={PIPE_Y + CELL + 4}
          strokeWidth={1.5}
          className={AMBER_STROKE}
        />
        <path
          d={`M${MERGE_X},${PIPE_Y + CELL + 4} V${RESIDUAL_Y - 9}`}
          fill='none'
          strokeWidth={1.5}
          className={AMBER_STROKE}
        />
        <circle
          cx={MERGE_X}
          cy={RESIDUAL_Y}
          r={9}
          strokeWidth={1.5}
          stroke='currentColor'
          className='fill-white dark:fill-slate-900'
        />
        <text
          x={MERGE_X}
          y={RESIDUAL_Y + 4}
          textAnchor='middle'
          fontSize={11}
          fill='currentColor'
        >
          +
        </text>

        <InputStrip
          x={INPUT_X}
          y={PIPE_Y}
          cellWidth={CELL}
          cellHeight={CELL * 2}
          gap={GAP}
        />
        <ShapeLabel
          x={INPUT_X + INPUT_WIDTH / 2}
          y={PIPE_Y - CELL - 6}
          text={strings.inputLabel}
        />
        <ArrowGlyph x={ARROW1_X} y={PIPE_Y} />

        <DetectorStrip
          x={EXPAND_X}
          y={PIPE_Y}
          cellWidth={CELL}
          cellHeight={CELL * 2}
          gap={GAP}
        />
        <ShapeLabel
          x={EXPAND_X + EXPAND_WIDTH / 2}
          y={PIPE_Y - CELL - 6}
          text={strings.expandLabel}
        />
        <ArrowGlyph x={ARROW2_X} y={PIPE_Y} />

        <GeluChart
          x={GELU_X}
          top={PIPE_Y - 25}
          width={GELU_W}
          height={50}
          label={strings.geluLabel}
        />
        <ArrowGlyph x={ARROW3_X} y={PIPE_Y} />

        <OutputStrip
          x={CONTRACT_X}
          y={PIPE_Y}
          cellWidth={CELL}
          cellHeight={CELL * 2}
          gap={GAP}
        />
        <ShapeLabel
          x={CONTRACT_X + CONTRACT_WIDTH / 2}
          y={PIPE_Y - CELL - 6}
          text={strings.contractLabel}
        />
      </g>
    </svg>
  );
}

const N_CELL = 9;
const N_GAP = 1;
const N_INPUT_WIDTH = INPUT_LEN * (N_CELL + N_GAP) - N_GAP;
const N_EXPAND_WIDTH = EXPAND_LEN * (N_CELL + N_GAP) - N_GAP;
const N_CONTRACT_WIDTH = CONTRACT_LEN * (N_CELL + N_GAP) - N_GAP;
const N_CELL_HEIGHT = N_CELL * 2;

const N_CENTER_X = N_EXPAND_WIDTH / 2 + 28;
const N_VIEW_WIDTH = N_CENTER_X + N_EXPAND_WIDTH / 2 + 28;

const N_INPUT_Y = 26;
const N_EXPAND_Y = 92;
const N_GELU_TOP = 134;
const N_GELU_HEIGHT = 70;
const N_GELU_WIDTH = 170;
const N_GELU_BOTTOM = N_GELU_TOP + N_GELU_HEIGHT;
const N_OUTPUT_Y = N_GELU_BOTTOM + 46;
const N_RESID_Y = N_OUTPUT_Y + 40;
const N_VIEW_HEIGHT = N_RESID_Y + 20;

const N_ARROW1_Y = (N_INPUT_Y + N_EXPAND_Y) / 2;
const N_ARROW2_Y = N_EXPAND_Y + (N_GELU_TOP - N_EXPAND_Y) / 2;
const N_ARROW3_Y = N_GELU_BOTTOM + (N_OUTPUT_Y - N_GELU_BOTTOM) / 2;

const N_RESID_MARGIN_X = 10;

function NarrowMLP({ strings }: { strings: (typeof mlpStrings)[Lang] }) {
  return (
    <svg
      viewBox={`0 0 ${N_VIEW_WIDTH} ${N_VIEW_HEIGHT}`}
      role='img'
      aria-label={strings.aria}
      className='sm:hidden w-full h-auto max-w-[320px] mx-auto'
    >
      <g fontFamily='var(--font-mono)'>
        <line
          x1={6}
          y1={N_RESID_Y}
          x2={N_VIEW_WIDTH - 6}
          y2={N_RESID_Y}
          strokeWidth={5}
          opacity={0.85}
          className={AMBER_STROKE}
        />
        <text
          x={6}
          y={N_RESID_Y + 18}
          fontSize={8}
          className={MUTED_TEXT_CLASSES}
        >
          {strings.residualLabel}
        </text>

        <line
          x1={N_RESID_MARGIN_X}
          y1={N_INPUT_Y}
          x2={N_CENTER_X - N_INPUT_WIDTH / 2}
          y2={N_INPUT_Y}
          strokeWidth={1.5}
          className={AMBER_STROKE}
        />
        <line
          x1={N_RESID_MARGIN_X}
          y1={N_INPUT_Y}
          x2={N_RESID_MARGIN_X}
          y2={N_RESID_Y}
          strokeWidth={1.5}
          className={AMBER_STROKE}
        />
        <path
          d={`M${N_CENTER_X},${N_OUTPUT_Y + N_CELL_HEIGHT / 2 + 4} V${N_RESID_Y - 9}`}
          fill='none'
          strokeWidth={1.5}
          className={AMBER_STROKE}
        />
        <circle
          cx={N_CENTER_X}
          cy={N_RESID_Y}
          r={9}
          strokeWidth={1.5}
          stroke='currentColor'
          className='fill-white dark:fill-slate-900'
        />
        <text
          x={N_CENTER_X}
          y={N_RESID_Y + 4}
          textAnchor='middle'
          fontSize={11}
          fill='currentColor'
        >
          +
        </text>

        <ShapeLabel
          x={N_CENTER_X}
          y={N_INPUT_Y - N_CELL_HEIGHT / 2 - 8}
          text={strings.inputLabel}
        />
        <InputStrip
          x={N_CENTER_X - N_INPUT_WIDTH / 2}
          y={N_INPUT_Y}
          cellWidth={N_CELL}
          cellHeight={N_CELL_HEIGHT}
          gap={N_GAP}
        />
        <ArrowGlyph x={N_CENTER_X} y={N_ARROW1_Y} glyph='↓' fontSize={11} />

        <ShapeLabel
          x={N_CENTER_X}
          y={N_EXPAND_Y - N_CELL_HEIGHT / 2 - 8}
          text={strings.expandLabel}
        />
        <DetectorStrip
          x={N_CENTER_X - N_EXPAND_WIDTH / 2}
          y={N_EXPAND_Y}
          cellWidth={N_CELL}
          cellHeight={N_CELL_HEIGHT}
          gap={N_GAP}
        />
        <ArrowGlyph x={N_CENTER_X} y={N_ARROW2_Y} glyph='↓' fontSize={11} />

        <GeluChart
          x={N_CENTER_X - N_GELU_WIDTH / 2}
          top={N_GELU_TOP}
          width={N_GELU_WIDTH}
          height={N_GELU_HEIGHT}
          label={strings.geluLabel}
          fontSize={9}
        />
        <ArrowGlyph x={N_CENTER_X} y={N_ARROW3_Y} glyph='↓' fontSize={11} />

        <ShapeLabel
          x={N_CENTER_X}
          y={N_OUTPUT_Y - N_CELL_HEIGHT / 2 - 8}
          text={strings.contractLabel}
        />
        <OutputStrip
          x={N_CENTER_X - N_CONTRACT_WIDTH / 2}
          y={N_OUTPUT_Y}
          cellWidth={N_CELL}
          cellHeight={N_CELL_HEIGHT}
          gap={N_GAP}
        />
      </g>
    </svg>
  );
}

export default function MLPFigure({ lang }: { lang: Lang }) {
  const strings = mlpStrings[lang];

  return (
    <figure className='my-8'>
      <div
        role='group'
        aria-label={strings.tokensAria}
        className='flex flex-wrap justify-center gap-1 mb-4'
      >
        {EXAMPLE_TOKENS.map((token, i) => (
          <Chip key={`${i}-${token}`} variant='tok' dim={i !== MLP_TOKEN_INDEX}>
            {visibleSpaces(token)}
          </Chip>
        ))}
      </div>

      <WideMLP strings={strings} />
      <NarrowMLP strings={strings} />

      <div className='font-mono text-xs text-slate-500 dark:text-slate-400 mt-3 text-center'>
        {strings.shapes}
      </div>
      <div className='font-mono text-xs text-slate-500 dark:text-slate-400 mt-3 space-y-0.5 max-w-[560px] mx-auto'>
        {strings.legend.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
      <div className='font-mono text-xs text-slate-500 dark:text-slate-400 border-t border-dashed border-slate-300 dark:border-slate-600 pt-2.5 mt-3 max-w-[560px] mx-auto'>
        {strings.honesty}
      </div>
      <FigCaption>{strings.caption}</FigCaption>
    </figure>
  );
}
