import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { Blog } from '@/lib/blog/Blog';
import { BlogNode } from '@/lib/blog/types';

import BlogCategory from '@/components/blog/BlogCategory';
import BlogLoadFailure from '@/components/blog/BlogLoadFailure';
import BlogPost from '@/components/blog/BlogPost';
import Breadcrumbs from '@/components/blog/Breadcrumbs';
import Giscus from '@/components/blog/Giscus';
import PostNavigation from '@/components/blog/PostNavigation';
import Nav from '@/components/layout/Nav';

import { Lang } from '@/i18n';

import config from '../../../../../config';

function findNode(lang: Lang, slug: string[]): BlogNode | null {
  const blog = new Blog();
  return slug.length === 0 ? blog.getRoot(lang) : blog.getBySlug(lang, slug);
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: Lang; slug?: string[] }>;
}) {
  const { lang, slug = [] } = await params;
  const node = findNode(lang, slug);

  if (!node) {
    notFound();
  }

  if (node.type === 'Category') {
    redirect(node.parent ? `/${lang}/blog#${node.slug}` : `/${lang}/blog`);
  }

  const breadcrumbs: BlogNode[] = [];
  for (let current = node.parent; current; current = current.parent) {
    breadcrumbs.unshift(current);
  }
  if (node.type !== 'Post') {
    breadcrumbs.push(node);
  }

  return (
    <>
      <Nav lang={lang}>
        <Breadcrumbs
          lang={lang}
          breadcrumbs={breadcrumbs}
          activeIndex={node.type === 'Post' ? -1 : undefined}
        />
      </Nav>
      <main>{renderNodeContent(node, lang)}</main>
    </>
  );
}

function renderNodeContent(node: BlogNode, lang: Lang) {
  switch (node.type) {
    case 'LoadFailure':
      return <BlogLoadFailure node={node} lang={lang} />;
    case 'Category':
      return <BlogCategory lang={lang} category={node} />;
    case 'Post':
      return (
        <>
          <BlogPost post={node} lang={lang} />
          <PostNavigation post={node} lang={lang} />
          <Giscus
            repo={config.GISCUS.repo}
            repoId={config.GISCUS.repoId}
            category={config.GISCUS.category}
            categoryId={config.GISCUS.categoryId}
            mapping='pathname'
            strict='0'
            reactionsEnabled='0'
            emitMetadata='0'
            inputPosition='bottom'
            lang={lang}
          />
        </>
      );
    default:
      return node satisfies never;
  }
}

export async function generateStaticParams() {
  const blog = new Blog();
  return blog.generateStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang; slug?: string[] }>;
}): Promise<Metadata> {
  const { lang, slug = [] } = await params;
  const node = findNode(lang, slug);

  if (!node || node.type !== 'Post') {
    return {
      title: node?.title,
    };
  }

  const url = `/${lang}/blog/${slug.join('/')}`;

  return {
    title: node.title,
    description: node.excerpt,
    openGraph: {
      title: node.title,
      description: node.excerpt,
      url,
      type: 'article',
      publishedTime: node.date?.toISOString(),
      images: [
        {
          url: node.image,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: node.title,
      description: node.excerpt,
      images: [node.image],
    },
  };
}
