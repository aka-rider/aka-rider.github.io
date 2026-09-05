import { selectPreview } from '@/lib/blog/preview';
import { Category, Post } from '@/lib/blog/types';

function makePost(slug: string): Post {
  return {
    type: 'Post',
    slug,
    title: slug,
    filePath: `_posts/${slug}.en.mdx`,
    children: [],
    childrenBySlug: {},
    image: `/images/${slug}.png`,
    hideHero: false,
    excerpt: `Excerpt for ${slug}`,
    content: 'Content.',
    readingTime: 3,
  };
}

function makeCategory(posts: Post[], featured?: Post): Category {
  return {
    type: 'Category',
    slug: 'posts',
    title: 'Blog',
    filePath: '_posts',
    children: posts,
    childrenBySlug: {},
    featured,
    getPosts: () => posts,
    getCategories: () => [],
  };
}

describe('selectPreview', () => {
  it('returns the featured post as lead and the next newest posts excluding it', () => {
    const posts = ['newest', 'featured', 'third', 'fourth', 'fifth', 'sixth'].map(makePost);
    const [, featured] = posts;
    const category = makeCategory(posts, featured);

    const { lead, rest } = selectPreview(category);

    expect(lead).toBe(featured);
    expect(rest).toEqual([posts[0], posts[2], posts[3], posts[4]]);
    expect(rest).not.toContain(featured);
  });

  it('leads with the newest post when nothing is featured', () => {
    const posts = ['newest', 'second', 'third'].map(makePost);
    const category = makeCategory(posts, undefined);

    const { lead, rest } = selectPreview(category);

    expect(lead).toBeUndefined();
    expect(rest).toEqual(posts.slice(0, 4));
  });

  it('respects a custom limit', () => {
    const posts = ['a', 'b', 'c', 'd'].map(makePost);
    const category = makeCategory(posts, posts[0]);

    const { rest } = selectPreview(category, 2);

    expect(rest).toEqual([posts[1], posts[2]]);
  });
});
