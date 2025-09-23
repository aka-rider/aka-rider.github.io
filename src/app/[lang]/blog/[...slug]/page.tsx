import { notFound } from 'next/navigation';

import { Blog } from '@/lib/blog/Blog';
import { BlogNode } from '@/lib/blog/types';

import BlogCategory from '@/components/BlogCategory';
import BlogLoadFailure from '@/components/BlogLoadFailure';
import BlogPost from '@/components/BlogPost';
import Breadcrumbs from '@/components/Breadcrumbs';
import Giscus from '@/components/Giscus';
import Nav from '@/components/Nav';

import { Lang } from '@/i18n';

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: Lang; slug?: string[] }>;
}) {
  const { lang, slug = [] } = await params;
  const blog = Blog.getInstance();

  let node: BlogNode | null;

  if (slug.length === 0) {
    // Root blog page - get the root category
    node = blog.getRoot(lang);
  } else {
    // Get specific node by slug path
    node = blog.getBySlug(lang, slug);
  }

  if (!node) {
    notFound();
  }

  // Generate breadcrumbs by traversing up the parent chain, then add current node
  const breadcrumbs: BlogNode[] = [];
  let current: BlogNode | undefined = node;
  while (current?.parent) {
    breadcrumbs.unshift(current.parent);
    current = current.parent;
  }
  // Add the current node as the last breadcrumb
  breadcrumbs.push(node);

  return (
    <>
      <Nav lang={lang}>
        <Breadcrumbs lang={lang} breadcrumbs={breadcrumbs} />
      </Nav>
      <main>{renderNodeContent(node, lang)}</main>
    </>
  );
}

function renderNodeContent(node: BlogNode, lang: Lang) {
  if (node.type === 'LoadFailure') {
    return <BlogLoadFailure node={node} />;
  }

  if (node.type === 'Category') {
    return (
      <BlogCategory
        lang={lang}
        category={node}
        collapsed={false}
      />
    );
  }

  if (node.type === 'Post') {
    return (
      <>
        <BlogPost post={node} />
        <Giscus
          repo="aka-rider/aka-rider.github.io"
          repoId="MDEwOlJlcG9zaXRvcnkyNjc3MDM0MTc="
          category="General"
          categoryId="DIC_kwDOD_TUec4CO4sM"
          mapping="pathname"
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="bottom"
          lang={lang}
        />
      </>
    );
  }

  return <div>Unknown node type: {(node as any).type}</div>;
}

export async function generateStaticParams() {
  const blog = Blog.getInstance();
  return blog.generateStaticParams();
}
