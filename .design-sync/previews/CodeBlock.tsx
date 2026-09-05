import * as React from 'react';

import { CodeBlock } from 'iurii.net';

const tsLines: Array<Array<{ text: string; color?: string }>> = [
  [
    { text: 'async', color: '#4d9375' },
    { text: ' function ', color: '#4d9375' },
    { text: 'withRetry', color: '#a0ada0' },
    { text: '<T>(fn: ', color: '#393a34' },
    { text: '() => Promise<T>', color: '#e4b978' },
    { text: ', attempts = ', color: '#393a34' },
    { text: '5', color: '#2f798a' },
    { text: '): Promise<T> {', color: '#393a34' },
  ],
  [
    { text: '  for ', color: '#4d9375' },
    { text: '(let i = ', color: '#393a34' },
    { text: '0', color: '#2f798a' },
    { text: '; i < attempts; i++) {', color: '#393a34' },
  ],
  [{ text: '    try {', color: '#393a34' }],
  [
    { text: '      return ', color: '#4d9375' },
    { text: 'await fn();', color: '#393a34' },
  ],
  [
    { text: '    } catch ', color: '#4d9375' },
    { text: '(err) {', color: '#393a34' },
  ],
  [
    { text: '      if ', color: '#4d9375' },
    { text: '(i === attempts - ', color: '#393a34' },
    { text: '1', color: '#2f798a' },
    { text: ') throw err;', color: '#393a34' },
  ],
  [
    { text: '      await sleep(', color: '#393a34' },
    { text: '2', color: '#2f798a' },
    { text: ' ** i * ', color: '#393a34' },
    { text: '100', color: '#2f798a' },
    { text: ' + Math.random() * ', color: '#393a34' },
    { text: '100', color: '#2f798a' },
    { text: ');', color: '#393a34' },
  ],
  [{ text: '    }' }],
  [{ text: '  }' }],
  [
    { text: '  throw ', color: '#4d9375' },
    { text: 'new Error(', color: '#393a34' },
    { text: "'unreachable'", color: '#c98a7d' },
    { text: ');', color: '#393a34' },
  ],
  [{ text: '}' }],
];

const pyLines: Array<Array<{ text: string; color?: string }>> = [
  [
    { text: 'def ', color: '#4d9375' },
    { text: 'chunk', color: '#a0ada0' },
    { text: '(items: list[T], size: ', color: '#393a34' },
    { text: 'int', color: '#2f798a' },
    { text: ') -> Iterator[list[T]]:', color: '#393a34' },
  ],
  [
    { text: '    for i in ', color: '#4d9375' },
    { text: 'range(', color: '#393a34' },
    { text: '0', color: '#2f798a' },
    { text: ', len(items), size):', color: '#393a34' },
  ],
  [
    { text: '        yield ', color: '#4d9375' },
    { text: 'items[i : i + size]', color: '#393a34' },
  ],
];

const renderLines = (lines: Array<Array<{ text: string; color?: string }>>) =>
  lines.map((tokens, i) => (
    <span data-line='' key={i} style={{ display: 'block', minHeight: '1.4em' }}>
      {tokens.map((t, j) => (
        <span key={j} style={{ color: t.color ?? '#393a34' }}>
          {t.text}
        </span>
      ))}
    </span>
  ));

export const TypeScript = () => (
  <div className='max-w-2xl not-prose'>
    <CodeBlock lang='en' language='typescript'>
      <pre
        data-language='typescript'
        style={{ backgroundColor: '#ffffff', color: '#393a34', padding: '1rem', borderRadius: '0.5rem' }}
      >
        <code data-language='typescript'>{renderLines(tsLines)}</code>
      </pre>
    </CodeBlock>
  </div>
);

export const Python = () => (
  <div className='max-w-2xl not-prose'>
    <CodeBlock lang='uk' language='python'>
      <pre
        data-language='python'
        style={{ backgroundColor: '#ffffff', color: '#393a34', padding: '1rem', borderRadius: '0.5rem' }}
      >
        <code data-language='python'>{renderLines(pyLines)}</code>
      </pre>
    </CodeBlock>
  </div>
);
