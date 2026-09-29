import { localizeSiteLink } from '@/lib/remark-i18n-links';

describe('localizeSiteLink', () => {
  it('turns a post link into the page URL of the current language', () => {
    expect(localizeSiteLink('/posts/essays/privacy', 'uk')).toBe(
      '/uk/blog/posts/essays/privacy/',
    );
  });

  it('turns a blog link into the page URL of the current language', () => {
    expect(localizeSiteLink('/blog/posts', 'en')).toBe('/en/blog/posts/');
  });

  it('uses the language of a linked source file', () => {
    expect(localizeSiteLink('/posts/essays/privacy/index.en.mdx', 'uk')).toBe(
      '/en/blog/posts/essays/privacy/',
    );
  });

  it('keeps the fragment after the trailing slash', () => {
    expect(localizeSiteLink('/posts/essays/privacy#intro', 'en')).toBe(
      '/en/blog/posts/essays/privacy/#intro',
    );
  });

  it('keeps a slug ending in a two-letter word that is not a language', () => {
    expect(localizeSiteLink('/posts/lab/rust-go.mdx', 'en')).toBe(
      '/en/blog/posts/lab/rust-go/',
    );
  });

  it('leaves other links untouched', () => {
    expect(localizeSiteLink('https://example.com/posts/x', 'en')).toBe(
      'https://example.com/posts/x',
    );
    expect(localizeSiteLink('#section', 'en')).toBe('#section');
  });
});
