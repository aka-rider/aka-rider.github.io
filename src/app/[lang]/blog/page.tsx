import { notFound } from 'next/navigation';

import { Blog } from '@/lib/blog/Blog';

import BlogFeed, { FeedCategory } from '@/components/blog/BlogFeed';

import { Lang } from '@/i18n';

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const blog = new Blog();

  const rootCategory = blog.getRoot(lang);

  if (!rootCategory || rootCategory.type !== 'Category') {
    notFound();
  }

  const feedCategories: FeedCategory[] = rootCategory
    .getCategories()
    .map((cat) => ({
      slug: cat.slug,
      title: cat.title,
      thumbnails: cat.thumbnails ?? false,
      posts: cat.getPosts().map((post) => ({
        ...post,
        href: Blog.getLink(lang, post),
        parent: undefined,
        children: [],
        childrenBySlug: {},
      })),
    }));

  return (
    <>
      <main>
        <BlogFeed lang={lang} categories={feedCategories} />
      </main>
    </>
  );
}
