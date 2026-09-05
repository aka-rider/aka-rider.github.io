import * as React from 'react';

import { BlogLoadFailure } from 'iurii.net';
import type { LoadFailure } from '@/lib/blog/types';

const yamlFailure: LoadFailure = {
  type: 'LoadFailure',
  slug: 'unparsable-frontmatter',
  title: 'unparsable-frontmatter',
  filePath: 'content/blog/unparsable-frontmatter.en.mdx',
  children: [],
  childrenBySlug: {},
  err: new Error('YAMLException: bad indentation of a mapping entry at line 3, column 1'),
};

const mdxFailure: LoadFailure = {
  type: 'LoadFailure',
  slug: 'broken-mdx-syntax',
  title: 'broken-mdx-syntax',
  filePath: 'content/blog/broken-mdx-syntax.en.mdx',
  children: [],
  childrenBySlug: {},
  err: new Error(
    'Unexpected character `/` (U+002F) before name, expected a character that can start a name, such as a letter, `$`, or `_`\n    at ./content/blog/broken-mdx-syntax.en.mdx:14:3',
  ),
};

export const YamlParseError = () => (
  <div className='max-w-2xl'>
    <BlogLoadFailure node={yamlFailure} />
  </div>
);

export const MdxCompileError = () => (
  <div className='max-w-2xl'>
    <BlogLoadFailure node={mdxFailure} />
  </div>
);
