// @ts-check

import withToc from '@stefanprobst/rehype-extract-toc';
import withTocExport from '@stefanprobst/rehype-extract-toc/mdx';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

/** @type {import('unified').PluggableList} */
export const sharedRemarkPlugins = [remarkGfm];

/** @type {import('unified').PluggableList} */
export const rehypePlugins = [
  rehypeSlug,
  withToc,
  withTocExport,
  [
    rehypePrettyCode,
    {
      theme: {
        dark: 'vitesse-dark',
        light: 'vitesse-light',
      },
      keepBackground: false,
    },
  ],
  rehypeAutolinkHeadings,
];
