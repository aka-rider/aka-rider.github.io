import { render } from '@testing-library/react';

import { compilePost } from '@/lib/blog/compile';

const REFERENCED_FOOTNOTE = `# Title

A claim that needs a source.[^1]

[^1]: The source.
`;

const INDENTED_REFERENCED_FOOTNOTE = `# Title

A claim that needs a source.[^1]

   [^1]: The source.
`;

const UNREFERENCED_FOOTNOTE = `# Title

A claim with no source attached.

[^1]: Nobody points here.
`;

const HEADINGS = `## Alpha

### Beta

#### Gamma
`;

describe('compilePost', () => {
  it('detects a referenced footnote and renders one RSS prompt before the footnotes section', async () => {
    const { content, hasFootnotes } = await compilePost(
      REFERENCED_FOOTNOTE,
      'post.mdx',
      'en',
    );
    expect(hasFootnotes).toBe(true);

    const { container } = render(content);
    const rssPrompts = container.querySelectorAll('.rss');
    const footnotesSection = container.querySelector('[data-footnotes]');

    expect(rssPrompts).toHaveLength(1);
    expect(footnotesSection).not.toBeNull();
    expect(
      rssPrompts[0]!.compareDocumentPosition(footnotesSection!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('detects an indented referenced footnote definition', async () => {
    const { content, hasFootnotes } = await compilePost(
      INDENTED_REFERENCED_FOOTNOTE,
      'post.mdx',
      'en',
    );
    expect(hasFootnotes).toBe(true);

    const { container } = render(content);
    expect(container.querySelectorAll('.rss')).toHaveLength(1);
    expect(container.querySelector('[data-footnotes]')).not.toBeNull();
  });

  it('does not report footnotes for an unreferenced definition', async () => {
    const { content, hasFootnotes } = await compilePost(
      UNREFERENCED_FOOTNOTE,
      'post.mdx',
      'en',
    );
    expect(hasFootnotes).toBe(false);

    const { container } = render(content);
    expect(container.querySelectorAll('.rss')).toHaveLength(0);
    expect(container.querySelector('[data-footnotes]')).toBeNull();
  });

  it('lists h2/h3 headings with ids in the table of contents and skips h4', async () => {
    const { toc } = await compilePost(HEADINGS, 'post.mdx', 'en');

    expect(toc).toEqual([
      { id: 'alpha', text: 'Alpha', depth: 2 },
      { id: 'beta', text: 'Beta', depth: 3 },
    ]);
  });
});
