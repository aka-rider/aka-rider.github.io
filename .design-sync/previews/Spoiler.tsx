import * as React from 'react';

import { Spoiler } from 'iurii.net';

export const Collapsed = () => (
  <div className='max-w-2xl'>
    <Spoiler title='Why not just use a bigger EC2 instance?'>
      <p>
        Vertical scaling buys time, but the queue depth we were seeing came from lock
        contention, not raw CPU. Throwing more cores at the box would have delayed the
        problem by a couple of weeks at best.
      </p>
    </Spoiler>
  </div>
);

export const WithCodeInside = () => (
  <div className='max-w-2xl'>
    <Spoiler title='Show the retry wrapper we ended up shipping'>
      <p>Nothing fancy — exponential backoff with jitter, capped at five attempts:</p>
      <pre>
        <code>{`async function withRetry<T>(fn: () => Promise<T>, attempts = 5): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === attempts - 1) throw err;
      await sleep(2 ** i * 100 + Math.random() * 100);
    }
  }
  throw new Error('unreachable');
}`}</code>
      </pre>
    </Spoiler>
  </div>
);
