import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Blog } from '@/lib/blog/Blog';
import { contentLangOf } from '@/lib/blog/summary';
import { BlogNode } from '@/lib/blog/types';
import { getLocalImageDimensions } from '@/lib/images';
import { buildMetadata, PERSON_ID } from '@/lib/metadata';

import BlogLoadFailure from '@/components/blog/BlogLoadFailure';
import BlogPost from '@/components/blog/BlogPost';
import Breadcrumbs, { Crumb } from '@/components/blog/Breadcrumbs';
import Giscus from '@/components/blog/Giscus';
import PostNavigation from '@/components/blog/PostNavigation';
import JsonLd from '@/components/JsonLd';
import Main from '@/components/layout/Main';
import Nav from '@/components/layout/Nav';
import UnstyledLink from '@/components/links/UnstyledLink';

import { common, Lang, Languages } from '@/i18n';

import config from '/config';

function findNode(lang: Lang, slug: string[]): BlogNode | null {
  return new Blog().getBySlug(lang, slug);
}

function buildTrail(lang: Lang, node: BlogNode): Crumb[] {
  const trail: Crumb[] = [];
  for (let n = node.parent; n; n = n.parent) {
    trail.unshift({ href: Blog.getLink(lang, n), title: n.title });
  }
  return trail;
}

function hasGenuineTranslation(node: BlogNode, lang: Lang): boolean {
  return node.type === 'Post' && contentLangOf(node.filePath) === lang;
}

function postLanguagePaths(slug: string[]): Partial<Record<Lang, string>> {
  const blog = new Blog();
  const languagePaths: Partial<Record<Lang, string>> = {};
  for (const otherLang of Languages.keys()) {
    const otherNode = blog.getBySlug(otherLang, slug);
    if (otherNode && hasGenuineTranslation(otherNode, otherLang)) {
      languagePaths[otherLang] = `/${otherLang}/blog/${slug.join('/')}`;
    }
  }
  return languagePaths;
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: Lang; slug: string[] }>;
}) {
  const { lang, slug } = await params;
  const node = findNode(lang, slug);

  if (!node) {
    notFound();
  }

  switch (node.type) {
    case 'Category': {
      const target = Blog.getLink(lang, node);
      return (
        <>
          <meta httpEquiv='refresh' content={`0;url=${target}`} />
          <p>
            <UnstyledLink href={target}>{node.title}</UnstyledLink>
          </p>
        </>
      );
    }
    case 'Post': {
      const pageUrl = `${config.SITE_URL}/${lang}/blog/${slug.join('/')}/`;
      const contentLang = contentLangOf(node.filePath) ?? lang;
      return (
        <>
          <JsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: node.title,
              description: node.excerpt,
              image: node.image,
              inLanguage: contentLang,
              ...(node.date ? { datePublished: node.date.toISOString() } : {}),
              author: {
                '@type': 'Person',
                '@id': PERSON_ID,
                name: common[lang].authorName,
              },
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': pageUrl,
              },
            }}
          />
          <Nav lang={lang}>
            <Breadcrumbs trail={buildTrail(lang, node)} current={node.title} />
          </Nav>
          <Main className='wrap'>
            <BlogPost post={node} lang={lang} />
            <PostNavigation post={node} lang={lang} />
            <div className='post'>
              <Giscus
                repo={config.GISCUS.repo}
                repoId={config.GISCUS.repoId}
                category={config.GISCUS.category}
                categoryId={config.GISCUS.categoryId}
                mapping='pathname'
                strict='0'
                reactionsEnabled='1'
                emitMetadata='0'
                inputPosition='bottom'
                lang={lang}
              />
            </div>
          </Main>
        </>
      );
    }
    case 'LoadFailure':
      return (
        <>
          <Nav lang={lang}>
            <Breadcrumbs trail={buildTrail(lang, node)} current={node.title} />
          </Nav>
          <Main className='wrap'>
            <BlogLoadFailure node={node} lang={lang} />
          </Main>
        </>
      );
  }
}

export async function generateStaticParams() {
  const blog = new Blog();
  return blog.generateStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang; slug: string[] }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const node = findNode(lang, slug);

  if (!node || node.type !== 'Post') {
    return buildMetadata({
      lang,
      path: `/${lang}/blog/${slug.join('/')}`,
      title: node?.title,
    });
  }

  const dimensions = await getLocalImageDimensions(node.image);
  const contentLang = contentLangOf(node.filePath);
  const isFallback = contentLang !== null && contentLang !== lang;

  return buildMetadata({
    lang,
    path: `/${lang}/blog/${slug.join('/')}`,
    canonicalPath: isFallback
      ? `/${contentLang}/blog/${slug.join('/')}`
      : undefined,
    locale: contentLang ?? lang,
    title: node.title,
    description: node.excerpt,
    type: 'article',
    publishedTime: node.date?.toISOString(),
    languagePaths: postLanguagePaths(slug),
    image: {
      url: node.image,
      alt: node.title,
      ...dimensions,
    },
  });
}
