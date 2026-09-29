import { mdxToFeedHtml } from '@/lib/feed-html';

describe('mdxToFeedHtml', () => {
  it('renders markdown bold as <strong>', () => {
    const html = mdxToFeedHtml(
      'This is **bold**.',
      '_posts/cat/post/index.en.mdx',
      'en',
    );
    expect(html).toContain('<strong>bold</strong>');
  });

  it('drops MDX component tags but keeps their text', () => {
    const html = mdxToFeedHtml(
      '<TLDR>Summary text</TLDR>\n\nBody text.',
      '_posts/cat/post/index.en.mdx',
      'en',
    );
    expect(html).not.toContain('<TLDR');
    expect(html).not.toContain('</TLDR>');
    expect(html).toContain('Summary text');
    expect(html).toContain('Body text.');
  });

  it('makes a relative image URL absolute', () => {
    const html = mdxToFeedHtml(
      '![alt text](hero.png)',
      '_posts/cat/post/index.en.mdx',
      'en',
    );
    expect(html).toContain(
      '<img src="https://iurii.net/_posts/cat/post/hero.png"',
    );
  });

  it('makes a site-relative link absolute', () => {
    const html = mdxToFeedHtml(
      '[home](/en/)',
      '_posts/cat/post/index.en.mdx',
      'en',
    );
    expect(html).toContain('<a href="https://iurii.net/en/">home</a>');
  });
});
