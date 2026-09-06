import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

import { Blog } from '@/lib/blog/Blog';
import { Post } from '@/lib/blog/types';
import { formatReadingTime } from '@/lib/format';

import UnstyledLink from '@/components/links/UnstyledLink';

import { common, Lang } from '@/i18n';

export default function PostNavigation({
  post,
  lang,
}: {
  post: Post;
  lang: Lang;
}) {
  const parent = post.parent;
  if (!parent || parent.type !== 'Category') return null;

  const posts = parent.getPosts();
  const currentIndex = posts.findIndex((p) => p.slug === post.slug);
  if (currentIndex === -1) return null;

  const newerPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const olderPost =
    currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  if (!newerPost && !olderPost) return null;

  return (
    <nav className='postnav' aria-label={common[lang].postNavigation}>
      {olderPost && (
        <UnstyledLink href={Blog.getLink(lang, olderPost)}>
          <span className='k'>
            <FiArrowLeft />
            {common[lang].older}
          </span>
          <span className='t'>
            {olderPost.title}
            <span className='meta'>
              {formatReadingTime(olderPost.readingTime, lang)}
            </span>
          </span>
        </UnstyledLink>
      )}
      {newerPost && (
        <UnstyledLink href={Blog.getLink(lang, newerPost)} className='right'>
          <span className='k'>
            {common[lang].newer}
            <FiArrowRight />
          </span>
          <span className='t'>
            {newerPost.title}
            <span className='meta'>
              {formatReadingTime(newerPost.readingTime, lang)}
            </span>
          </span>
        </UnstyledLink>
      )}
    </nav>
  );
}
