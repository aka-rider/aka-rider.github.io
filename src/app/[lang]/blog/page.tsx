import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Blog } from '@/lib/blog/Blog';
import { toPostSummary } from '@/lib/blog/summary';

import BlogFeed, { FeedCategory } from '@/components/blog/BlogFeed';
import BlogLoadFailure from '@/components/blog/BlogLoadFailure';
import Nav from '@/components/layout/Nav';

import { common, Lang } from '@/i18n';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const root = new Blog().getRoot(lang);
  const title = root?.title ?? common[lang].title;

  return {
    title: `${title} · ${common[lang].authorName}`,
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const root = new Blog().getRoot(lang);

  if (!root) {
    return (
      <>
        <Nav lang={lang} />
        <main id='main-content' className='wrap'>
          <p className='muted'>{common[lang].noPosts}</p>
        </main>
      </>
    );
  }

  if (root.type === 'LoadFailure') {
    return (
      <>
        <Nav lang={lang} />
        <main id='main-content' className='wrap'>
          <BlogLoadFailure node={root} lang={lang} />
        </main>
      </>
    );
  }

  if (root.type === 'Post') {
    notFound();
  }

  const categories: FeedCategory[] = root.getCategories().map((category) => ({
    slug: category.slug,
    title: category.title,
    thumbnails: category.thumbnails ?? false,
    posts: category.getPosts().map((post) => toPostSummary(lang, post)),
  }));

  if (categories.length === 0) {
    return (
      <>
        <Nav lang={lang} />
        <main id='main-content' className='wrap'>
          <p className='muted'>{common[lang].noPosts}</p>
        </main>
      </>
    );
  }

  return (
    <BlogFeed lang={lang} rootTitle={root.title} categories={categories} />
  );
}
