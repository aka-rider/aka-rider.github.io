import { plainExcerpt } from '@/lib/blog/excerpt';

describe('plainExcerpt', () => {
  it('strips import and export lines', () => {
    const content =
      "import Foo from './foo'\nexport const bar = 1\n\nThe real paragraph text.";

    expect(plainExcerpt(content)).toBe('The real paragraph text.');
  });

  it('skips headings and starts at the first body paragraph', () => {
    const content = '## What?\n\nThis explains what the post is about.';

    expect(plainExcerpt(content)).toBe('This explains what the post is about.');
  });

  it('skips a heading that follows import lines before reaching the body', () => {
    const content =
      "import Foo from './foo'\n\n# 1001 reasons to start\n\nThe body paragraph starts here.";

    expect(plainExcerpt(content)).toBe('The body paragraph starts here.');
  });

  it('strips code fences entirely', () => {
    const content = '```js\nconst x = 1;\n```\n\nA paragraph after the code.';

    expect(plainExcerpt(content)).toBe('A paragraph after the code.');
  });

  it('strips emphasis markers but keeps the emphasized text', () => {
    const content = 'This is **very** important and *also* this.';

    expect(plainExcerpt(content)).toBe('This is very important and also this.');
  });

  it('strips link syntax but keeps the link text', () => {
    const content = 'Read the [docs](https://example.com/docs) for details.';

    expect(plainExcerpt(content)).toBe('Read the docs for details.');
  });

  it('strips JSX tags', () => {
    const content = 'Some text with <TLDR>a callout</TLDR> inside it.';

    expect(plainExcerpt(content)).toBe('Some text with a callout inside it.');
  });

  it('skips a JSX-only line and starts at the first body paragraph', () => {
    const content =
      '<Spoiler>\n\nThe real body paragraph follows the JSX line.';

    expect(plainExcerpt(content)).toBe(
      'The real body paragraph follows the JSX line.',
    );
  });

  it('takes only the first paragraph', () => {
    const content =
      'First paragraph here.\n\nSecond paragraph should be ignored.';

    expect(plainExcerpt(content)).toBe('First paragraph here.');
  });

  it('cuts at a word boundary within the limit and appends an ellipsis', () => {
    const word = 'lorem ';
    const longParagraph = word.repeat(50).trim();

    const result = plainExcerpt(longParagraph);

    expect(result.length).toBeLessThanOrEqual(201);
    expect(result.endsWith('…')).toBe(true);
    expect(result).not.toMatch(/\s…$/);
  });

  it('does not append an ellipsis when the text fits within the limit', () => {
    const content = 'A short paragraph that easily fits.';

    const result = plainExcerpt(content);

    expect(result).toBe(content);
    expect(result.endsWith('…')).toBe(false);
  });

  it('returns a result free of frontmatter fences', () => {
    const content = 'A plain paragraph with no frontmatter markers at all.';

    const result = plainExcerpt(content);

    expect(result).not.toMatch(/^---/);
    expect(result).not.toContain('---');
  });
});
