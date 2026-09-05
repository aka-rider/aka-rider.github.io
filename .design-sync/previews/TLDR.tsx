import * as React from 'react';

import { TLDR } from 'iurii.net';

export const IconOnly = () => (
  <div className='max-w-2xl'>
    <TLDR />
  </div>
);

export const TitleOnly = () => (
  <div className='max-w-2xl'>
    <TLDR title='Batch your migrations, don’t stream them' />
  </div>
);

export const FullSummary = () => (
  <div className='max-w-2xl'>
    <TLDR title='Zero-downtime Postgres migrations'>
      <p>
        Split every schema change into an additive step (deployed first) and a cleanup
        step (deployed after all readers are on the new code). Never drop or rename a
        column in the same release that stops writing to it.
      </p>
    </TLDR>
  </div>
);
