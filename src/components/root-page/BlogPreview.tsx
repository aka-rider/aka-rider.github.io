import { Category } from '@/lib/blog';
import { Blog } from '@/lib/blog/Blog';

import BlogCategory from '@/components/BlogCategory';
import UnstyledLink from '@/components/links/UnstyledLink';
import Section from '@/components/Section';

import { Lang } from '@/i18n';

interface BlogProps {
  title: string;
  lang: Lang;
}

export default function BlogPreview({ title, lang }: BlogProps) {
  const blog = Blog.getInstance();
  const rootCategory = blog.getRoot(lang) as Category;

  // Get the first category from the root
  const firstCategory = rootCategory?.getCategories()?.[0];

  if (!firstCategory) {
    return (
      <Section id='blog' title={title}>
        <div className='text-center py-8 text-neutral-500 dark:text-neutral-400'>
          No blog content available
        </div>
      </Section>
    );
  }

  return (
    <Section
      id='blog'
      title={<UnstyledLink href={`/${lang}/blog`}>{title}</UnstyledLink>}
    >
      <BlogCategory
        lang={lang}
        category={firstCategory}
        collapsed={true}
        depth={0}
      />
    </Section>
  );
}
