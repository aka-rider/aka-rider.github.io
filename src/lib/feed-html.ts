import { toHtml } from 'hast-util-to-html';
import type { Root } from 'mdast';
import { toHast } from 'mdast-util-to-hast';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { remove } from 'unist-util-remove';
import { visit } from 'unist-util-visit';

import remarkReplaceLinks from '@/lib/remark-i18n-links';
import remarkImagePaths from '@/lib/remark-image-paths';

import { Lang } from '@/i18n';

import config from '../../config';

const MDX_ESM_NODE_TYPES = [
  'mdxjsEsm',
  'mdxFlowExpression',
  'mdxTextExpression',
];
const MDX_JSX_NODE_TYPES = ['mdxJsxFlowElement', 'mdxJsxTextElement'];

function stripMdxJsx() {
  return (tree: Root) => {
    remove(tree, MDX_ESM_NODE_TYPES);
    visit(tree, (node, index, parent) => {
      if (
        !parent ||
        index === null ||
        index === undefined ||
        !MDX_JSX_NODE_TYPES.includes(node.type)
      ) {
        return;
      }
      const children = 'children' in node ? (node.children ?? []) : [];
      parent.children.splice(index, 1, ...children);
      return index;
    });
  };
}

function absolutizeSiteUrls() {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (
        (node.type === 'image' || node.type === 'link') &&
        'url' in node &&
        typeof node.url === 'string' &&
        node.url.startsWith('/')
      ) {
        node.url = new URL(node.url, config.SITE_URL).toString();
      }
    });
  };
}

export function mdxToFeedHtml(
  source: string,
  postFilePath: string,
  lang: Lang,
): string {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkGfm)
    .use(remarkImagePaths(postFilePath))
    .use(remarkReplaceLinks(lang))
    .use(stripMdxJsx)
    .use(absolutizeSiteUrls);

  const tree = processor.parse(source);
  const transformed = processor.runSync(tree) as Root;

  const hast = toHast(transformed, { allowDangerousHtml: true });
  return toHtml(hast, { allowDangerousHtml: true });
}
