import * as React from 'react';

import { PostNavigation } from 'iurii.net';
import type { Category, Post } from '@/lib/blog/types';

function makePost(slug: string, title: string, readingTime: number): Post {
  return {
    type: 'Post',
    slug,
    title,
    filePath: `content/blog/${slug}.en.mdx`,
    children: [],
    childrenBySlug: {},
    image: '/images/blog/placeholder.jpg',
    excerpt: '',
    content: '',
    date: new Date('2026-01-01'),
    readingTime,
  };
}

function makeCategory(posts: Post[]): Category {
  const category: Category = {
    type: 'Category',
    slug: 'posts',
    title: 'Posts',
    filePath: 'content/blog',
    children: posts,
    childrenBySlug: Object.fromEntries(posts.map((p) => [p.slug, p])),
    getPosts: () => posts,
    getCategories: () => [],
  };
  posts.forEach((p) => {
    p.parent = category;
  });
  return category;
}

const olderPost = makePost(
  'debugging-memory-leaks-in-node',
  'Debugging Memory Leaks in Long-Running Node Services',
  8,
);
const currentPost = makePost(
  'scaling-review-queues',
  'Scaling Code Review Without Slowing Down Merges',
  7,
);
const newerPost = makePost(
  'zero-downtime-schema-migrations',
  'Zero-Downtime Schema Migrations in Postgres',
  5,
);

makeCategory([newerPost, currentPost, olderPost]);

export const BetweenTwoPosts = () => (
  <div className='max-w-2xl'>
    <PostNavigation post={currentPost} lang='en' />
  </div>
);

export const OldestPost = () => (
  <div className='max-w-2xl'>
    <PostNavigation post={olderPost} lang='en' />
  </div>
);

export const Ukrainian = () => (
  <div className='max-w-2xl'>
    <PostNavigation post={currentPost} lang='uk' />
  </div>
);
