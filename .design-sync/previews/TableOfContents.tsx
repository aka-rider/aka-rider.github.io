import * as React from 'react';

import { TableOfContents } from 'iurii.net';
import type { TocItem } from '@/lib/blog/compile';

const items: TocItem[] = [
  { id: 'the-problem', text: 'The problem', depth: 2 },
  { id: 'lock-modes', text: 'Lock modes', depth: 3 },
  { id: 'the-checklist', text: 'The checklist', depth: 2 },
];

export const English = () => (
  <div className='max-w-2xl'>
    <TableOfContents items={items} label='Contents' />
  </div>
);

export const Ukrainian = () => (
  <div className='max-w-2xl'>
    <TableOfContents items={items} label='Зміст' />
  </div>
);
