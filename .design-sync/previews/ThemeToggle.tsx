import * as React from 'react';

import { ThemeToggle } from 'iurii.net';

export const English = () => <ThemeToggle lang='en' />;

export const Ukrainian = () => <ThemeToggle lang='uk' />;

export const InToolbar = () => (
  <div className='flex items-center gap-4 rounded-lg border border-rule p-2'>
    <span className='text-sm text-muted'>Appearance</span>
    <ThemeToggle lang='en' />
  </div>
);
