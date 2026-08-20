import type { Link, Root } from 'mdast';
import { visit } from 'unist-util-visit';

import { Lang, Languages } from '@/i18n';

const linkLocale = (url: string, fallback: Lang): Lang => {
  const match = /.*[-.]([a-z]{2})\.mdx?$/.exec(url);
  const parsed = match?.[1];
  return parsed && Languages.has(parsed) ? parsed : fallback;
};

const remarkReplaceLinks = (lang: Lang) => {
  return () => (tree: Root) => {
    visit(tree, 'link', (node: Link) => {
      const isPostsLink = node.url.startsWith('/posts/');
      const isBlogLink = node.url.startsWith('/blog/');
      if (!isPostsLink && !isBlogLink) {
        return;
      }

      const locale = linkLocale(node.url, lang);
      const cleanUrl = node.url
        .replace(/^\/(posts|blog)\//, '')
        .replace(/\.mdx?$/, '')
        .replace(/\/index$/, '');

      if (!cleanUrl) {
        return;
      }

      node.url = isPostsLink
        ? `/${locale}/blog/posts/${cleanUrl}`
        : `/${locale}/blog/${cleanUrl}`;
    });
  };
};

export default remarkReplaceLinks;
