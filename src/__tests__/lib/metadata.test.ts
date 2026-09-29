import { buildMetadata } from '@/lib/metadata';

const image = {
  url: 'https://iurii.net/images/my-post.png',
  alt: 'My post',
  width: 100,
  height: 100,
};

describe('buildMetadata', () => {
  it('defaults canonical and locale to the page path and lang', async () => {
    const metadata = await buildMetadata({
      lang: 'en',
      path: '/en/blog/posts/my-post',
      image,
    });

    expect(metadata.alternates?.canonical).toBe(
      'https://iurii.net/en/blog/posts/my-post/',
    );
    expect(metadata.openGraph?.locale).toBe('en');
  });

  it('points canonical at the content language for a fallback page', async () => {
    const metadata = await buildMetadata({
      lang: 'uk',
      path: '/uk/blog/posts/my-post',
      canonicalPath: '/en/blog/posts/my-post',
      locale: 'en',
      image,
    });

    expect(metadata.alternates?.canonical).toBe(
      'https://iurii.net/en/blog/posts/my-post/',
    );
    expect(metadata.openGraph?.locale).toBe('en');
  });
});
