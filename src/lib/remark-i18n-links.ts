import type { Link, Root } from 'mdast';
import { visit } from 'unist-util-visit';

import { Lang, Languages } from '@/i18n';

const SOURCE_SUFFIX = /(?:\/index)?(?:[-.]([a-z]{2}))?\.mdx?$/;

const splitFragment = (url: string): [string, string] => {
  const index = url.search(/[?#]/);
  return index === -1 ? [url, ''] : [url.slice(0, index), url.slice(index)];
};

export const localizeSiteLink = (url: string, lang: Lang): string => {
  const section = /^\/(posts|blog)\//.exec(url)?.[1];
  if (!section) {
    return url;
  }

  const [path, fragment] = splitFragment(url);
  const suffix = SOURCE_SUFFIX.exec(path)?.[1];
  const suffixLang = suffix && Languages.has(suffix) ? suffix : undefined;
  const locale = suffixLang ?? lang;
  const slug = path
    .replace(/^\/(posts|blog)\//, '')
    .replace(suffixLang ? SOURCE_SUFFIX : /\.mdx?$/, '')
    .replace(/\/index$/, '')
    .replace(/\/$/, '');

  if (!slug) {
    return url;
  }

  const prefix =
    section === 'posts' ? `/${locale}/blog/posts` : `/${locale}/blog`;
  return `${prefix}/${slug}/${fragment}`;
};

const remarkReplaceLinks = (lang: Lang) => {
  return () => (tree: Root) => {
    visit(tree, 'link', (node: Link) => {
      node.url = localizeSiteLink(node.url, lang);
    });
  };
};

export default remarkReplaceLinks;
