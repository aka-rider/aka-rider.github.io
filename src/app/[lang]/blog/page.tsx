import { Blog } from '@/lib/blog/Blog';

import BlogFeed, { FeedCategory } from '@/components/blog/BlogFeed';
import Nav from '@/components/layout/Nav';

import { Lang } from '@/i18n';

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const blog = Blog.getInstance();

  const rootCategory = blog.getRoot(lang);

  if (!rootCategory || rootCategory.type !== 'Category') {
    return <div>Blog not found for language: {lang}</div>;
  }

  // Get top-level categories for navigation
  const categories = rootCategory.getCategories();

  // Transform to serializable format for Client Component
  const feedCategories: FeedCategory[] = categories.map((cat) => ({
    slug: cat.slug,
    title: cat.title,
    thumbnails: cat.thumbnails ?? false,
    posts: cat.getPosts().map((post) => ({
      ...post,
      href: Blog.getLink(lang, post),
      // key properties for display
      date: post.date,
      readingTime: post.readingTime,
      title: post.title,
      image: post.image,
      excerpt: post.excerpt,
      featured: post.featured,
      type: post.type,
      // Strip circular/complex fields
      parent: undefined,
      children: [],
      childrenBySlug: {},
    })),
  }));

  return (
    <>
      <main>
        {/* New State-Based Blog Feed */}
        <BlogFeed lang={lang} categories={feedCategories} />
      </main>
    </>
  );
}
