import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Blog } from '@/lib/blog/Blog';
import { toPostSummary } from '@/lib/blog/summary';
import {
  blogRootLanguagePaths,
  buildMetadata,
  PERSON_ID,
} from '@/lib/metadata';

import BlogFeed, { FeedCategory } from '@/components/blog/BlogFeed';
import BlogLoadFailure from '@/components/blog/BlogLoadFailure';
import JsonLd from '@/components/JsonLd';
import Main from '@/components/layout/Main';
import Nav from '@/components/layout/Nav';

import { common, Lang } from '@/i18n';

import config from '/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const root = new Blog().getRoot(lang);
  const title = root?.title ?? common[lang].title;

  return buildMetadata({
    lang,
    path: `/${lang}/blog/`,
    title: `${title} · ${common[lang].authorName}`,
    description: common[lang].description,
    languagePaths: blogRootLanguagePaths(),
  });
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
        <Main className='wrap'>
          <p className='muted'>{common[lang].noPosts}</p>
        </Main>
      </>
    );
  }

  if (root.type === 'LoadFailure') {
    return (
      <>
        <Nav lang={lang} />
        <Main className='wrap'>
          <BlogLoadFailure node={root} lang={lang} />
        </Main>
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
        <Main className='wrap'>
          <p className='muted'>{common[lang].noPosts}</p>
        </Main>
      </>
    );
  }

  const pageUrl = `${config.SITE_URL}/${lang}/blog/`;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: root.title,
          description: common[lang].description,
          url: pageUrl,
          inLanguage: lang,
          author: {
            '@type': 'Person',
            '@id': PERSON_ID,
            name: common[lang].authorName,
          },
          publisher: {
            '@type': 'Person',
            '@id': PERSON_ID,
            name: common[lang].authorName,
          },
        }}
      />
      <BlogFeed lang={lang} rootTitle={root.title} categories={categories} />
    </>
  );
}
