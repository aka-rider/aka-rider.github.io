import type { Toc, TocEntry } from '@stefanprobst/rehype-extract-toc';
import React from 'react';

import clsxm from '@/lib/clsxm';

import UnstyledLink from '@/components/links/UnstyledLink';

// recursively render the table of contents
const renderToc = (nesting: number, toc: Toc): React.ReactElement[] => {
  return toc.map((item) => {
    return (
      <li key={item.id} className='my-2 pl-2'>
        <UnstyledLink href={`#${item.id}`}>{item.value}</UnstyledLink>
        {renderTocChildren(nesting, item)}
      </li>
    );
  });
};

const renderTocChildren = (
  nesting: number,
  item: TocEntry,
): React.ReactElement | null => {
  const className = 'py-0 my-2 pl-5';
  if (item.children && item.children.length > 0) {
    return nesting === 1 ? (
      <ol className={className} type='a'>
        {renderToc(nesting + 1, item.children)}
      </ol>
    ) : (
      <ul className={clsxm(className, 'list-none')}>
        {renderToc(nesting + 1, item.children)}
      </ul>
    );
  }
  return null;
};

export default function TableOfContents({ toc }: { toc: Toc }) {
  return (
    <div>
      <ol className='pl-5' type='1'>
        {toc?.length > 0 && renderToc(1, toc)}
      </ol>
    </div>
  );
}
