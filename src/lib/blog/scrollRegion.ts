export const SCROLL_REGION_CLASSES =
  'focus-visible:outline-2 focus-visible:outline-cyan-700 dark:focus-visible:outline-cyan-400 focus-visible:outline-offset-2';

export function scrollRegionProps(label: string) {
  return {
    tabIndex: 0,
    role: 'region' as const,
    'aria-label': label,
  };
}
