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
          className='relative aspect-video w-full bg-cover bg-center bg-no-repeat transition-transform duration-300 ease-out group-hover:scale-105'
          style={{
            backgroundImage: `url(${post.image})`,
            backgroundSize: '100% 100%',
          }}
        >
          {/* Subtle overlay on hover */}
          <div className='absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10' />
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
