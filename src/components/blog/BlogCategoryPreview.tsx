import { Category } from '@/lib/blog';
import { Blog } from '@/lib/blog/Blog';
import clsxm from '@/lib/clsxm';

import BlogPostPreview from '@/components/blog/BlogPostPreview';
import UnstyledLink from '@/components/links/UnstyledLink';

import { common, Lang } from '@/i18n';

export default function BlogCategoryPreview({
  lang,
  category,
}: {
  lang: Lang;
  category: Category;
}) {
  const showThumbnails = category.thumbnails ?? false;
  // If thumbnails enabled: Show Featured + 1 Next Post (50/50)
  // If thumbnails disabled: Show Featured + 4 List Posts (60/40)
  const listLimit = showThumbnails ? 1 : 4;

  let posts = category.getPosts();
  if (category.featured) {
    posts = posts.filter((p) => p.slug !== category.featured!.slug);
  }
  posts = posts.slice(0, listLimit);

  if (category.getPosts().length === 0 && !category.featured) {
    return null;
  }

  return (
    <div className='flex flex-col'>
      <div className='flex w-full flex-col md:flex-row gap-8'>
        {/* Featured post preview (Left Column) */}
        {category.featured && (
          <div className={clsxm(showThumbnails ? 'md:w-1/2' : 'md:w-[60%]', 'w-full')}>
            <BlogPostPreview
              lang={lang}
              post={category.featured}
              href={Blog.getLink(lang, category.featured)}
              featured={true}
              thumbnail={true}
            />
          </div>
        )}

        {/* Other posts preview (Right Column) */}
        <div className={clsxm(
          category.featured
            ? (showThumbnails ? 'md:w-1/2' : 'md:w-[40%]')
            : 'w-full',
          'w-full flex flex-col gap-6'
        )}>
          {posts.map((post) => (
            <div
              key={post.slug}
              className={clsxm(showThumbnails ? 'h-full' : 'h-auto')}
            >
              <BlogPostPreview
                lang={lang}
                post={post}
                href={Blog.getLink(lang, post)}
                featured={showThumbnails}
                thumbnail={showThumbnails}
              />
            </div>
          ))}

          {/* Archive Link */}
          <div className='flex justify-end mt-2'>
            <UnstyledLink
              href={Blog.getLink(lang, category)}
              className='text-sm font-medium hover:text-primary-500 transition-colors'
            >
              {common[lang].viewArchive}
            </UnstyledLink>
          </div>
        </div>
      </div>
    </div>
  );
}
