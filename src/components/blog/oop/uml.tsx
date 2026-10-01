export const FONT_SIZE = 13;
export const LINE_HEIGHT = 20;
export const TEXT_BASELINE_OFFSET = 4.5;

export const SVG_CLASSES = 'w-full h-auto mx-auto block';
export const BOX_CLASSES = 'fill-bg';

export type UmlMarker = 'open' | 'filled' | 'hollowTriangle' | 'diamond';

export function markerUrl(prefix: string, marker: UmlMarker) {
  return `url(#${prefix}-${marker})`;
}

export function UmlMarkers({ prefix }: { prefix: string }) {
  return (
    <defs>
      <marker
        id={`${prefix}-open`}
        viewBox='0 0 10 10'
        refX={10}
        refY={5}
        markerWidth={9}
        markerHeight={9}
        markerUnits='userSpaceOnUse'
        orient='auto'
      >
        <path
          d='M0,0 L10,5 L0,10'
          fill='none'
          stroke='currentColor'
          strokeWidth={1.25}
        />
      </marker>
      <marker
        id={`${prefix}-filled`}
        viewBox='0 0 10 10'
        refX={10}
        refY={5}
        markerWidth={10}
        markerHeight={10}
        markerUnits='userSpaceOnUse'
        orient='auto'
      >
        <path d='M0,0 L10,5 L0,10 z' fill='currentColor' />
      </marker>
      <marker
        id={`${prefix}-hollowTriangle`}
        viewBox='0 0 12 12'
        refX={12}
        refY={6}
        markerWidth={14}
        markerHeight={14}
        markerUnits='userSpaceOnUse'
        orient='auto'
      >
        <path
          d='M0,0 L12,6 L0,12 z'
          className={BOX_CLASSES}
          stroke='currentColor'
          strokeWidth={1}
        />
      </marker>
      <marker
        id={`${prefix}-diamond`}
        viewBox='0 0 16 10'
        refX={0}
        refY={5}
        markerWidth={16}
        markerHeight={10}
        markerUnits='userSpaceOnUse'
        orient='auto'
      >
        <path d='M0,5 L8,0 L16,5 L8,10 z' fill='currentColor' />
      </marker>
    </defs>
  );
}

const NOTE_FOLD = 10;

export function UmlNote({
  x,
  y,
  width,
  height,
  text,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
}) {
  return (
    <g>
      <path
        d={`M${x},${y} H${x + width - NOTE_FOLD} L${x + width},${y + NOTE_FOLD} V${y + height} H${x} Z`}
        className={BOX_CLASSES}
        stroke='currentColor'
      />
      <path
        d={`M${x + width - NOTE_FOLD},${y} V${y + NOTE_FOLD} H${x + width}`}
        fill='none'
        stroke='currentColor'
      />
      <text
        x={x + 10}
        y={y + height / 2 + TEXT_BASELINE_OFFSET}
        fontStyle='italic'
        fill='currentColor'
      >
        {text}
      </text>
    </g>
  );
}
