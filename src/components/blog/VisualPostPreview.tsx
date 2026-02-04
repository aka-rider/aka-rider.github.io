import * as React from 'react';

import { Post } from '@/lib/blog/types';
import clsx from '@/lib/clsxm';

import UnstyledLink from '@/components/links/UnstyledLink';
import NextImage from '@/components/NextImage';


type VisualPostPreviewProps = React.ComponentPropsWithoutRef<'div'> & {
  post: Post;
  href: string;
};

export default function VisualPostPreview({
  className,
  post,
  href,
}: VisualPostPreviewProps) {
  return (
    <UnstyledLink
      href={href}
      className={clsx('group block h-full', className)}
    >
      <div className='relative w-full aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 mb-3'>
        <NextImage
          useSkeleton
          src={post.image}
          alt={post.title}
          fill
          className='w-full h-full'
          imgClassName='object-cover transition-transform duration-500 group-hover:scale-110'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
        {/* Optional Overlay Gradient for depth */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-black/0 group-hover:from-black/10 transition-colors duration-300' />
      </div>

      <div className='flex flex-col'>
        <h3 className='font-bold text-lg leading-tight group-hover:text-primary-500 transition-colors'>
          {post.title}
        </h3>
        <p className='text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2'>
          {post.date ? new Date(post.date).getFullYear() : ''}
        </p>
      </div>
    </UnstyledLink>
  );
}
