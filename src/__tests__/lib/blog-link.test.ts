import { Blog } from '@/lib/blog/Blog';
import { Category, Post } from '@/lib/blog/types';

function makeRootCategory(): Category {
  return {
    type: 'Category',
    slug: 'posts',
    title: 'Blog',
    filePath: '_posts',
    children: [],
    childrenBySlug: {},
    getPosts: () => [],
    getCategories: () => [],
  };
}

function makeSubCategory(parent: Category): Category {
  return {
    type: 'Category',
    slug: 'the-lab',
    title: 'The Lab',
    filePath: '_posts/the-lab',
    children: [],
    childrenBySlug: {},
    parent,
    getPosts: () => [],
    getCategories: () => [],
  };
}

function makePost(parent: Category): Post {
  return {
    type: 'Post',
    slug: 'my-post',
    title: 'My Post',
    filePath: '_posts/the-lab/my-post.en.mdx',
    children: [],
    childrenBySlug: {},
    parent,
    image: '/images/my-post.png',
    hideHero: false,
    excerpt: 'An excerpt.',
    content: 'Content.',
    readingTime: 3,
  };
}

describe('Blog.getLink', () => {
  it('links the root category to the blog index', () => {
    const root = makeRootCategory();

    expect(Blog.getLink('en', root)).toBe('/en/blog/');
  });

  it('links a subcategory to its category query', () => {
    const root = makeRootCategory();
    const category = makeSubCategory(root);

    expect(Blog.getLink('en', category)).toBe('/en/blog/?category=the-lab');
  });

  it('links a nested post through its parent chain', () => {
    const root = makeRootCategory();
    const category = makeSubCategory(root);
    const post = makePost(category);

    expect(Blog.getLink('en', post)).toBe('/en/blog/posts/the-lab/my-post');
  });

  it('links the blog index when no node is given', () => {
    expect(Blog.getLink('en')).toBe('/en/blog/');
  });
});
