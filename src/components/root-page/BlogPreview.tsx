import { Category } from '@/lib/blog';
import { Blog } from '@/lib/blog/Blog';

import BlogCategoryPreview from '@/components/blog/BlogCategoryPreview';
import UnstyledLink from '@/components/links/UnstyledLink';
import Section from '@/components/Section';

import { Lang } from '@/i18n';

interface BlogProps {
  title: string;
  lang: Lang;
}

export default function BlogPreview({ title, lang }: BlogProps) {
  const blog = new Blog();
  const rootCategory = blog.getRoot(lang) as Category;

  // Get the first category from the root
  const firstCategory = rootCategory?.getCategories()?.[0];

  if (!firstCategory) {
    return (
      <Section id='blog' title={title}>
        <div className='text-center py-8 text-slate-500 dark:text-slate-400'>
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
      <BlogCategoryPreview
        lang={lang}
        category={firstCategory}
      />
    </Section>
  );
}
