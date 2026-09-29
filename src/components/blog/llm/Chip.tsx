import type { ReactNode } from 'react';

import { visibleSpaces } from '@/components/blog/llm/format';

export type ChipVariant = 'tok' | 'model' | 'harness' | 'plain';

const CHIP_CORE_CLASSES =
  'font-mono text-[0.85em] px-2 py-0.5 rounded border whitespace-pre';

export const CHIP_INLINE_CLASSES = 'mx-0.5 my-0.5 align-baseline inline-block';

export const CHIP_INTERACTIVE_CLASSES =
  'inline-flex items-center justify-center min-h-6 min-w-6 cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-700 dark:focus-visible:outline-cyan-400 focus-visible:outline-offset-2';

export const CHIP_SELECTED_CLASSES = 'border-2 font-semibold';

const CHIP_VARIANT_CLASSES: Record<ChipVariant, string> = {
  tok: 'border-amber-700/60 dark:border-amber-400/60 text-amber-700 dark:text-amber-400',
  model:
    'border-cyan-700/60 dark:border-cyan-400/60 text-cyan-700 dark:text-cyan-400',
  harness:
    'border-violet-700/60 dark:border-violet-400/60 text-violet-700 dark:text-violet-400',
  plain:
    'border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100',
};

const CHIP_DIM_CLASSES = 'border-rule text-muted';

export function chipClasses(
  variant: ChipVariant,
  ...extra: readonly string[]
): string {
  return [CHIP_CORE_CLASSES, CHIP_VARIANT_CLASSES[variant], ...extra]
    .filter(Boolean)
    .join(' ');
}

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
    CHIP_CORE_CLASSES,
    dim ? CHIP_DIM_CLASSES : CHIP_VARIANT_CLASSES[variant],
    CHIP_INLINE_CLASSES,
    special ? CHIP_SELECTED_CLASSES : '',
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={classes}>{children}</span>;
}

export function TokenChip({
  token,
  variant = 'tok',
  special = false,
  dim = false,
}: {
  token: string;
  variant?: ChipVariant;
  special?: boolean;
  dim?: boolean;
}) {
  return (
    <Chip variant={variant} special={special} dim={dim}>
      {visibleSpaces(token)}
    </Chip>
  );
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
      role='group'
      aria-label={ariaLabel}
      aria-live={live ? 'polite' : undefined}
      className='flex flex-wrap rounded-lg border border-slate-300 dark:border-slate-600 px-2 py-2.5 my-3'
    >
      {children}
    </div>
  );
}
