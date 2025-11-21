import * as React from 'react';

import { LoadFailure, Post } from '@/lib/blog';
import { Blog } from '@/lib/blog/Blog';
import clsx from '@/lib/clsxm';

import BlogLoadFailure from '@/components/BlogLoadFailure';
import Card from '@/components/Card';
import UnstyledLink from '@/components/links/UnstyledLink';

import { Lang } from '@/i18n';

type BlogPostPreviewProps = React.ComponentPropsWithoutRef<'div'> & {
  lang: Lang;
  post: Post | LoadFailure;
  featured?: boolean;
};

export default function BlogPostPreview({
  className,
  lang,
  post,
  featured,
}: BlogPostPreviewProps) {
  if (post.type === 'LoadFailure') {
    return BlogLoadFailure({ node: post });
  }

  const fontSize = featured ? 'text-sm md:text-md' : 'text-2xs md:text-xs';

  return (
    <UnstyledLink
      href={Blog.getLink(lang, post)}
      className={clsx(
        'group',
        className,
      )}
    >
      <Card className='relative w-full aspect-square flex flex-col overflow-hidden'>

        <div
          className='relative aspect-video w-full bg-cover bg-center bg-no-repeat'
          style={{
            backgroundImage: `url(${post.image})`,
            backgroundSize: '100% 100%',
          }}
        >
          {/* wrapper */}
          <div className='invisible relative left-0 top-0 h-full w-full overflow-hidden group-hover:visible'>
            {/* noise animated texture */}
            {/* <div className='animate-noise absolute left-[-50px] top-[-100px] min-h-[400%] min-w-[330%] bg-[url(/images/noise.webp)]'></div> */}
            {/* vignette gradient */}
            <div className='absolute left-0 top-0 min-h-full min-w-full bg-gradient-to-b from-transparent to-gray-400 opacity-20'></div>
            {/* vignette texture */}
            <div
              className='absolute left-0 top-0 min-h-full min-w-full bg-no-repeat opacity-50'
              style={{
                backgroundImage: `url('/images/vignette.webp')`,
                backgroundSize: '100% 100%',
              }}
            ></div>
          </div>
        </div>
        {/* post title, metadata, and excerpt */}
        <div className='relative bottom-0 left-0 right-0 z-10'>
          <h3 className={clsx(featured ? 'pt-10' : 'pt-2', fontSize)}>{post.title}</h3>
          <p className={fontSize}>{post.excerpt}</p>
        </div>

      </Card>
    </UnstyledLink>
  );
}
