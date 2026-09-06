import * as React from 'react';

import { PostRow } from 'iurii.net';
import type { PostSummary } from '@/lib/blog/summary';

function makeSummary(
  overrides: Partial<PostSummary> & Pick<PostSummary, 'slug' | 'title'>,
): PostSummary {
  return {
    href: `/en/blog/posts/${overrides.slug}`,
    excerpt: '',
    image: '',
    readingTime: 6,
    contentLang: null,
    ...overrides,
  };
}

const dated = makeSummary({
  slug: 'zero-downtime-schema-migrations',
  title: 'Zero-Downtime Schema Migrations in Postgres',
  excerpt:
    'A practical checklist for shipping backward-compatible column and index changes without a maintenance window.',
  date: new Date('2026-02-10'),
  readingTime: 5,
});

const englishOnlyOnUkRoute = makeSummary({
  slug: 'debugging-memory-leaks-in-node',
  title: 'Debugging Memory Leaks in Long-Running Node Services',
  date: new Date('2026-01-18'),
  readingTime: 8,
  contentLang: 'en',
});

export const LeadEntry = () => (
  <div className='max-w-2xl'>
    <div className='list'>
      <PostRow lang='en' post={dated} lead />
    </div>
  </div>
);

export const ListEntry = () => (
  <div className='max-w-2xl'>
    <div className='list'>
      <PostRow lang='en' post={dated} />
    </div>
  </div>
);

export const ContentLanguageTag = () => (
  <div className='max-w-2xl'>
    <div className='list'>
      <PostRow lang='uk' post={englishOnlyOnUkRoute} />
    </div>
  </div>
);
