import * as React from 'react';

import { TocSidebar } from 'iurii.net';
import type { TocItem } from '@/lib/blog/compile';

const items: TocItem[] = [
  { id: 'the-problem', text: 'The problem', depth: 2 },
  { id: 'lock-modes', text: 'Lock modes', depth: 3 },
  { id: 'the-checklist', text: 'The checklist', depth: 2 },
];

export const NoHeroAlwaysShown = () => (
  <div className='relative min-h-[200px] max-w-xs'>
    <TocSidebar items={items} label='Contents' />
  </div>
);

export const Ukrainian = () => (
  <div className='relative min-h-[200px] max-w-xs'>
    <TocSidebar items={items} label='Зміст' />
  </div>
);
