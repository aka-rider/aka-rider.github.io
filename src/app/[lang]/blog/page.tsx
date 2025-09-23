import { Blog } from '@/lib/blog/Blog';

import BlogCategory from '@/components/BlogCategory';
import Breadcrumbs from '@/components/Breadcrumbs';
import Nav from '@/components/Nav';

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

  // Generate breadcrumb path from root to current node, including current node
  const getBreadcrumbPath = (node: any) => {
    const path = [];
    let current = node;
    while (current && current.parent) {
      path.unshift(current.parent);
      current = current.parent;
    }
    // Add the current node as the last breadcrumb
    path.push(node);
    return path;
  };

  return (
    <>
      <Nav lang={lang}>
        <Breadcrumbs
          lang={lang}
          breadcrumbs={getBreadcrumbPath(rootCategory)}
        />
      </Nav>
      <main>
        <BlogCategory
          lang={lang}
          category={rootCategory}
        />
      </main>
    </>
  );
}
