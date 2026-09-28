import {
  EXAMPLE_TOKEN_IDS,
  EXAMPLE_TOKENS,
} from '@/components/blog/llm/example';

const STRIP_DIM = 8;

export const EXAMPLE_TOKEN_ROWS = EXAMPLE_TOKENS.map((token, index) => {
  const id = EXAMPLE_TOKEN_IDS[index];
  if (id === undefined) {
    throw new Error(
      `vectors: EXAMPLE_TOKEN_IDS has no entry for token ${index}`,
    );
  }
  return { token, id, index };
});

export function tokenRow(token: string): (typeof EXAMPLE_TOKEN_ROWS)[number] {
  const row = EXAMPLE_TOKEN_ROWS.find((entry) => entry.token === token);
  if (!row) throw new Error(`vectors: no example token matches "${token}"`);
  return row;
}

export function tokenEmbedding(id: number): number[] {
  return Array.from({ length: STRIP_DIM }, (_, i) =>
    Math.sin((id * 0.037 + i * 1.7) * Math.PI),
  );
}

export function positionEncoding(position: number): number[] {
  return Array.from({ length: STRIP_DIM }, (_, i) =>
    Math.cos((position * 0.6 + i * 1.1) * Math.PI),
  );
}

export function finalEmbedding(id: number, position: number): number[] {
  const token = tokenEmbedding(id);
  const positional = positionEncoding(position);
  return token.map((value, i) => value + positional[i]!);
}

export const FINAL_EMBEDDING_MAX_ABS = 2;

export function opacityFor(value: number, maxAbs = 1): number {
  return Math.min(1, Math.abs(value) / maxAbs);
}

export const NEG_FILL = 'fill-slate-400 dark:fill-slate-500';
export const AMBER_FILL = 'fill-amber-700 dark:fill-amber-400';
export const CYAN_FILL = 'fill-cyan-700 dark:fill-cyan-400';
export const TEAL_FILL = 'fill-teal-700 dark:fill-teal-400';
export const SKY_FILL = 'fill-sky-700 dark:fill-sky-400';

export function signClass(value: number, positiveClass: string): string {
  return value >= 0 ? positiveClass : NEG_FILL;
}

export function StripCells({
  values,
  x,
  y,
  cellWidth,
  cellHeight,
  gap,
  colorFor,
  offsetFor,
  maxAbs = 1,
  opacityForCell,
}: {
  values: readonly number[];
  x: number;
  y: number;
  cellWidth: number;
  cellHeight: number;
  gap: number;
  colorFor: (index: number, value: number) => string;
  offsetFor?: (index: number) => number;
  maxAbs?: number;
  opacityForCell?: (index: number, value: number) => number;
}) {
  const offset = offsetFor ?? ((index: number) => index * (cellWidth + gap));
  const cellOpacity =
    opacityForCell ??
    ((_index: number, value: number) => opacityFor(value, maxAbs));
  return (
    <g aria-hidden='true'>
      {values.map((value, index) => (
        <rect
          key={index}
          x={x + offset(index)}
          y={y - cellHeight / 2}
          width={cellWidth}
          height={cellHeight}
          fillOpacity={cellOpacity(index, value)}
          className={colorFor(index, value)}
        />
      ))}
    </g>
  );
}
