import { toPostSummary } from '@/lib/blog/summary';
import { Post } from '@/lib/blog/types';

function makePost(filePath: string): Post {
  return {
    type: 'Post',
    slug: 'my-post',
    title: 'My Post',
    filePath,
    children: [],
    childrenBySlug: {},
    image: '/images/my-post.png',
    hideHero: false,
    excerpt: 'An excerpt.',
    content: 'Content.',
    readingTime: 3,
  };
}

describe('toPostSummary', () => {
  it('reports no content language for a bare index.mdx', () => {
    const post = makePost('_posts/my-post/index.mdx');

    expect(toPostSummary('en', post).contentLang).toBeNull();
  });

  it('reports the content language for a suffixed index.en.mdx', () => {
    const post = makePost('_posts/my-post/index.en.mdx');

    expect(toPostSummary('en', post).contentLang).toBe('en');
  });
});
