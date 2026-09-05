import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Blog } from '@/lib/blog/Blog';
import { BlogNode } from '@/lib/blog/types';

import BlogLoadFailure from '@/components/blog/BlogLoadFailure';
import BlogPost from '@/components/blog/BlogPost';
import Breadcrumbs, { Crumb } from '@/components/blog/Breadcrumbs';
import Giscus from '@/components/blog/Giscus';
import PostNavigation from '@/components/blog/PostNavigation';
import Nav from '@/components/layout/Nav';

import { Lang } from '@/i18n';

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
            <Link href={target}>{node.title}</Link>
          </p>
        </>
      );
    }
    case 'Post':
      return (
        <>
          <Nav lang={lang}>
            <Breadcrumbs trail={buildTrail(lang, node)} current={node.title} />
          </Nav>
          <main id='main-content' className='wrap'>
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
          </main>
        </>
      );
    case 'LoadFailure':
      return (
        <>
          <Nav lang={lang}>
            <Breadcrumbs trail={buildTrail(lang, node)} current={node.title} />
          </Nav>
          <main id='main-content' className='wrap'>
            <BlogLoadFailure node={node} lang={lang} />
          </main>
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
