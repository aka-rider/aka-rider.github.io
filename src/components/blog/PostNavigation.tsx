import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

import { Blog } from '@/lib/blog/Blog';
import { Post } from '@/lib/blog/types';

import UnstyledLink from '@/components/links/UnstyledLink';

import { common, Lang } from '@/i18n';

interface PostNavigationProps {
  post: Post;
  lang: Lang;
}

export default function PostNavigation({ post, lang }: PostNavigationProps) {
  const parent = post.parent;
  if (!parent || parent.type !== 'Category') return null;

  const posts = parent.getPosts();
  const currentIndex = posts.findIndex((p) => p.slug === post.slug);
  if (currentIndex === -1) return null;

  // Posts are sorted newest first: index 0 = newest
  const newerPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const olderPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  if (!newerPost && !olderPost) return null;

  return (
    <nav
      aria-label={lang === 'uk' ? 'Навігація між статтями' : 'Post navigation'}
      className='mx-auto mt-24 mb-12 max-w-[70ch] px-5 lg:px-10'
    >
      <div className='grid grid-cols-2 gap-8'>
        <div>
          {olderPost && (
            <UnstyledLink
              href={Blog.getLink(lang, olderPost)}
              className='group flex flex-col gap-2'
            >
              <span className='flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500'>
                <FiArrowLeft className='h-3.5 w-3.5 transition-transform group-hover:-translate-x-1' />
                {lang === 'uk' ? 'Раніше' : 'Older'}
              </span>
              <span className='text-sm font-medium leading-snug text-slate-700 transition-colors group-hover:text-primary-500 dark:text-slate-300'>
                {olderPost.title}
              </span>
              <span className='text-xs text-slate-400 dark:text-slate-500'>
                {olderPost.readingTime} {common[lang].readingTime}
              </span>
            </UnstyledLink>
          )}
        </div>

        <div className='text-right'>
          {newerPost && (
            <UnstyledLink
              href={Blog.getLink(lang, newerPost)}
              className='group inline-flex flex-col items-end gap-2'
            >
              <span className='flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500'>
                {lang === 'uk' ? 'Новіше' : 'Newer'}
                <FiArrowRight className='h-3.5 w-3.5 transition-transform group-hover:translate-x-1' />
              </span>
              <span className='text-sm font-medium leading-snug text-slate-700 transition-colors group-hover:text-primary-500 dark:text-slate-300'>
                {newerPost.title}
              </span>
              <span className='text-xs text-slate-400 dark:text-slate-500'>
                {newerPost.readingTime} {common[lang].readingTime}
              </span>
            </UnstyledLink>
          )}
        </div>
      </div>
    </nav>
  );
}
