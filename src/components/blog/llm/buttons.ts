export type ButtonAccent = 'cyan' | 'violet';

export const PRIMARY_BUTTON_CLASSES: Record<ButtonAccent, string> = {
  cyan: 'font-mono text-sm rounded border border-cyan-700 dark:border-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-cyan-700 dark:focus-visible:outline-cyan-400 focus-visible:outline-offset-2',
  violet:
    'font-mono text-sm rounded border border-violet-700 dark:border-violet-400 bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-400 px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-violet-700 dark:focus-visible:outline-violet-400 focus-visible:outline-offset-2',
};

export const RESET_BUTTON_CLASSES: Record<ButtonAccent, string> = {
  cyan: 'font-mono text-sm text-slate-500 dark:text-slate-400 underline focus-visible:outline-2 focus-visible:outline-cyan-700 dark:focus-visible:outline-cyan-400 focus-visible:outline-offset-2',
  violet:
    'font-mono text-sm text-slate-500 dark:text-slate-400 underline focus-visible:outline-2 focus-visible:outline-violet-700 dark:focus-visible:outline-violet-400 focus-visible:outline-offset-2',
};
