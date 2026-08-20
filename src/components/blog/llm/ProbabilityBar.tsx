import type { ReactNode } from 'react';

const BAR_TRACK_CLASSES =
  'relative h-1.5 rounded bg-slate-200 dark:bg-slate-700';

const BAR_FILL_CLASSES =
  'absolute left-0 top-0 h-full rounded bg-cyan-700 dark:bg-cyan-400 transition-[width] duration-[250ms] ease-out motion-reduce:transition-none';

export function ProbabilityBar({
  label,
  percent,
  valueText,
  columns,
  title,
  trailing,
}: {
  label: ReactNode;
  percent: number;
  valueText: string;
  columns: string;
  title?: string;
  trailing?: ReactNode;
}) {
  return (
    <div
      title={title}
      style={{ gridTemplateColumns: columns }}
      className='grid items-center gap-2 py-1'
    >
      {label}
      <span className={BAR_TRACK_CLASSES}>
        <span className={BAR_FILL_CLASSES} style={{ width: `${percent}%` }} />
      </span>
      <span className='font-mono tabular-nums text-sm text-right'>
        {valueText}
      </span>
      {trailing}
    </div>
  );
}
