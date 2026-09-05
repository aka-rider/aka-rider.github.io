import * as React from 'react';

import { Foss } from 'iurii.net';
import { translateFoss } from '@/i18n/root-page/foss';

export const English = () => (
  <div className='w-full max-w-2xl'>
    <Foss title='Open Source' items={translateFoss('en')} />
  </div>
);

export const Ukrainian = () => (
  <div className='w-full max-w-2xl'>
    <Foss title='Відкритий код' items={translateFoss('uk')} />
  </div>
);
