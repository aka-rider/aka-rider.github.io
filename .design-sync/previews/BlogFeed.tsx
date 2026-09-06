import * as React from 'react';

import { BlogFeed } from 'iurii.net';
import type { FeedCategory } from '@/components/blog/BlogFeed';
import type { PostSummary } from '@/lib/blog/summary';

function coverSvg(label: string): string {
  return (
    'data:image/svg+xml,' +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'>` +
        `<rect width='800' height='800' fill='#e0f2fe'/>` +
        `<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' ` +
        `font-family='sans-serif' font-size='30' fill='#0369a1'>${label}</text>` +
        `</svg>`,
    )
  );
}

function makeSummary(
  slug: string,
  title: string,
  excerpt: string,
  readingTime: number,
): PostSummary {
  return {
    slug,
    href: `/en/blog/posts/${slug}`,
    title,
    excerpt,
    image: coverSvg(title.split(' ').slice(0, 2).join(' ')),
    date: new Date('2026-02-10'),
    readingTime,
    contentLang: null,
  };
}

const essaysPosts: PostSummary[] = [
  makeSummary(
    'scaling-review-queues',
    'Scaling Code Review Without Slowing Down Merges',
    'As a team grows past a dozen engineers, the review queue stops being a formality and starts becoming the bottleneck.',
    7,
  ),
  makeSummary(
    'zero-downtime-schema-migrations',
    'Zero-Downtime Schema Migrations in Postgres',
    'A practical checklist for shipping backward-compatible column and index changes without a maintenance window.',
    5,
  ),
  makeSummary(
    'debugging-memory-leaks-in-node',
    'Debugging Memory Leaks in Long-Running Node Services',
    'Heap snapshots, retained closures, and the one Grafana panel that finally pointed at the culprit.',
    8,
  ),
];

const photoPosts: PostSummary[] = [
  {
    ...makeSummary(
      'distributed-tracing-from-scratch',
      'Distributed Tracing From Scratch',
      '',
      9,
    ),
    date: undefined,
  },
  {
    ...makeSummary(
      'rust-ffi-for-python-hot-paths',
      'Rust FFI for Python Hot Paths',
      '',
      6,
    ),
    date: undefined,
  },
  {
    ...makeSummary(
      'on-call-runbooks-that-work',
      'On-Call Runbooks That Actually Get Used',
      '',
      4,
    ),
    date: undefined,
  },
];

const categories: FeedCategory[] = [
  { slug: 'essays', title: 'Essays', thumbnails: false, posts: essaysPosts },
  {
    slug: 'field-notes',
    title: 'Field Notes',
    thumbnails: true,
    posts: photoPosts,
  },
];

export const ListModeActive = () => (
  <BlogFeed lang='en' rootTitle='Blog' categories={categories} />
);

export const VisualModeActive = () => (
  <BlogFeed
    lang='en'
    rootTitle='Blog'
    categories={[categories[1] as FeedCategory, categories[0] as FeedCategory]}
  />
);
