import * as React from 'react';

import { Services } from 'iurii.net';
import { translateServices } from '@/i18n/root-page/services';

export const English = () => (
  <div className='w-full max-w-3xl'>
    <Services
      title='Services'
      items={translateServices('en')}
      foot='Open for engagements — message me on LinkedIn.'
    />
  </div>
);

export const Ukrainian = () => (
  <div className='w-full max-w-3xl'>
    <Services
      title='Послуги'
      items={translateServices('uk')}
      foot='Відкритий до співпраці — напишіть мені в LinkedIn.'
    />
  </div>
);
