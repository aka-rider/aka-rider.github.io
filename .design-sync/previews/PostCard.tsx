import * as React from 'react';

import { PostCard } from 'iurii.net';
import type { PostSummary } from '@/lib/blog/summary';

function coverSvg(label: string): string {
  return (
    'data:image/svg+xml,' +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'>` +
        `<rect width='600' height='600' fill='#e0f2fe'/>` +
        `<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' ` +
        `font-family='sans-serif' font-size='28' fill='#0369a1'>${label}</text>` +
        `</svg>`,
    )
  );
}

const datedPost: PostSummary = {
  slug: 'distributed-tracing-from-scratch',
  href: '/en/blog/posts/the-lab/distributed-tracing-from-scratch',
  title: 'Distributed Tracing From Scratch',
  excerpt: '',
  image: coverSvg('Tracing'),
  date: new Date('2026-03-04'),
  readingTime: 9,
  contentLang: null,
};

const undatedPost: PostSummary = {
  slug: 'rust-ffi-for-python-hot-paths',
  href: '/en/blog/posts/the-lab/rust-ffi-for-python-hot-paths',
  title: 'Rust FFI for Python Hot Paths',
  excerpt:
    'Calling Rust from Python without paying the ctypes tax — a walkthrough of PyO3 and where it still hurts.',
  image: coverSvg('FFI'),
  readingTime: 6,
  contentLang: null,
};

export const DatedThumbnail = () => (
  <div className='grid max-w-sm'>
    <PostCard lang='en' post={datedPost} />
  </div>
);

export const UndatedThumbnailWithExcerpt = () => (
  <div className='grid max-w-sm'>
    <PostCard lang='en' post={undatedPost} />
  </div>
);
