// @ts-check

import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

/**
 * Shared remark plugins configuration for MDX processing.
 * Used in both Next.js build-time and runtime compilation.
 */
export const sharedRemarkPlugins = [remarkGfm];

/**
 * Rehype plugins for code highlighting and accessibility.
 */
export const rehypePlugins = [
  rehypeSlug,
  [
    rehypePrettyCode,
    {
      theme: {
        dark: 'github-dark',
        light: 'github-light',
      },
    },
  ],
  rehypeAutolinkHeadings,
];
