import type { Link, Root } from 'mdast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

import { Lang } from '@/i18n';

// This plugin replaces all filesystem links to posts with the i18n version
// This allows to use filesystem links for .mdx — linters won't complain
// Note: Simplified version to avoid circular dependencies during MDX compilation
const remarkReplaceLinks: Plugin<[], Root> = () => {
  return (tree) => {
    // @ts-expect-error - Type mismatch between mdast Root and unist-util-visit Node types
    // This is a known issue with conflicting versions of @types/unist in the dependency tree
    visit(tree, 'link', (node: Link) => {
      if (!node.url.startsWith('/posts/') && !node.url.startsWith('/blog/')) {
        return;
      }

      // Extract locale from filename (e.g., index.en.md, post.uk.mdx)
      const match = /.*[-.]([a-z]{2})\.mdx?$/.exec(node.url);
      const localeStr = match ? match[1] : 'en';
      const locale =
        localeStr === 'en' || localeStr === 'uk' ? (localeStr as Lang) : 'en';

      try {
        // Convert /posts/ links to /blog/posts/ structure
        if (node.url.startsWith('/posts/')) {
          const cleanUrl = node.url
            .replace(/^\/posts\//, '')
            .replace(/\.mdx?$/, '')
            .replace(/\/index$/, '');

          if (cleanUrl) {
            node.url = `/${locale}/blog/posts/${cleanUrl}`;
          }
        } else if (node.url.startsWith('/blog/')) {
          // Handle /blog/ links - keep them as is but add locale
          const cleanUrl = node.url
            .replace(/^\/blog\//, '')
            .replace(/\.mdx?$/, '')
            .replace(/\/index$/, '');

          if (cleanUrl) {
            node.url = `/${locale}/blog/${cleanUrl}`;
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Failed to process link ${node.url}:`, error);
      }
    });
  };
};

export default remarkReplaceLinks;
