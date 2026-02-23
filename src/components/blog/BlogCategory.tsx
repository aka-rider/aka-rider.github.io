import { Category } from '@/lib/blog';
import { Blog } from '@/lib/blog/Blog';

import BlogPostPreview from '@/components/blog/BlogPostPreview';

import { Lang } from '@/i18n';

export default function BlogCategory({
  lang,
  category,
}: {
  lang: Lang;
  category: Category;
}) {
  const posts = category.getPosts();
  const showThumbnails = category.thumbnails ?? false;

  return (
    <div className='flex flex-col'>
      {/* Category Title */}
      <h2 className='text-3xl font-bold mb-4'>{category.title}</h2>

      {/* Tags */}
      {category.tags && Object.keys(category.tags).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.keys(category.tags).map(tag => (
            <span key={tag} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-600 dark:text-slate-400">#{tag} ({category.tags![tag]?.length})</span>
          ))}
        </div>
      )}

      {(posts.length > 0) && (
        <div className='flex flex-col gap-8'>
          <div
            className={
              showThumbnails
                ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
                : 'flex flex-col divide-y divide-gray-200 dark:divide-gray-800'
            }
          >
            {posts.map((post) => (
              <BlogPostPreview
                key={post.slug}
                lang={lang}
                post={post}
                href={Blog.getLink(lang, post)}
                thumbnail={showThumbnails}
                className={!showThumbnails ? 'py-6 first:pt-0 last:pb-0' : ''}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
