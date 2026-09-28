import type { ReactNode } from 'react';

const BAR_TRACK_CLASSES =
  'relative h-1.5 rounded bg-slate-200 dark:bg-slate-700';

const BAR_FILL_CLASSES =
  'absolute left-0 top-0 h-full rounded bg-cyan-700 dark:bg-cyan-400 transition-[width] duration-[250ms] ease-out motion-reduce:transition-none';

const ROW_CLASSES =
  'grid grid-cols-[minmax(0,1fr)_auto_auto] grid-rows-[auto_auto] items-center gap-x-2 gap-y-1 py-1 sm:grid-rows-1 sm:gap-2';

const CELL_AUTO_PLACE_CLASSES = 'sm:[grid-column:auto] sm:[grid-row:auto]';

export function ProbabilityBar({
  label,
  percent,
  valueText,
  columnsClassName,
  title,
  trailing,
}: {
  label: ReactNode;
  percent: number;
  valueText: string;
  columnsClassName: string;
  title?: string;
  trailing?: ReactNode;
}) {
  return (
    <div title={title} className={`${ROW_CLASSES} ${columnsClassName}`}>
      <span
        className={`min-w-0 [grid-column:1] [grid-row:1] ${CELL_AUTO_PLACE_CLASSES}`}
      >
        {label}
      </span>
      <span
        className={`${BAR_TRACK_CLASSES} [grid-column:1/-1] [grid-row:2] ${CELL_AUTO_PLACE_CLASSES}`}
      >
        <span className={BAR_FILL_CLASSES} style={{ width: `${percent}%` }} />
      </span>
      <span
        className={`font-mono tabular-nums text-sm text-right [grid-column:2] [grid-row:1] ${CELL_AUTO_PLACE_CLASSES}`}
      >
        {valueText}
      </span>
      {trailing ? (
        <span
          className={`[grid-column:3] [grid-row:1] ${CELL_AUTO_PLACE_CLASSES}`}
        >
          {trailing}
        </span>
      ) : null}
    </div>
  );
}
