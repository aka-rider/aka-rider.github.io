import type { ReactNode } from 'react';

export type ChipVariant = 'tok' | 'model' | 'harness' | 'plain';

const CHIP_BASE_CLASSES =
  'font-mono text-[0.85em] px-2 py-0.5 mx-0.5 my-0.5 rounded border whitespace-pre align-baseline inline-block';

const CHIP_VARIANT_CLASSES: Record<ChipVariant, string> = {
  tok: 'bg-amber-50 dark:bg-amber-950/60 border-amber-700/60 dark:border-amber-400/60 text-amber-700 dark:text-amber-400',
  model:
    'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-700/60 dark:border-cyan-400/60 text-cyan-700 dark:text-cyan-400',
  harness:
    'bg-violet-50 dark:bg-violet-950/60 border-violet-700/60 dark:border-violet-400/60 text-violet-700 dark:text-violet-400',
  plain:
    'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100',
};

export function Chip({
  variant = 'plain',
  special = false,
  dim = false,
  children,
}: {
  variant?: ChipVariant;
  special?: boolean;
  dim?: boolean;
  children: ReactNode;
}) {
  const classes = [
    CHIP_BASE_CLASSES,
    CHIP_VARIANT_CLASSES[variant],
    special ? 'border-2 font-semibold' : '',
    dim ? 'opacity-45 dark:opacity-55' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={classes}>{children}</span>;
}

export function ChipStream({
  ariaLabel,
  live = false,
  children,
}: {
  ariaLabel: string;
  live?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      tabIndex={0}
      role='group'
      aria-label={ariaLabel}
      aria-live={live ? 'polite' : undefined}
      className='overflow-x-auto whitespace-nowrap rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2 py-2.5 my-3'
    >
      {children}
    </div>
  );
}
