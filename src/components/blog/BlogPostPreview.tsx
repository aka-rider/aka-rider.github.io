import * as React from 'react';

import { LoadFailure, Post } from '@/lib/blog/types';
import clsx from '@/lib/clsxm';

import BlogLoadFailure from '@/components/blog/BlogLoadFailure';
import { formatPostDate } from '@/components/blog/postDate';
import Card from '@/components/Card';
import UnstyledLink from '@/components/links/UnstyledLink';
import NextImage from '@/components/NextImage';

import { common, Lang } from '@/i18n';

type BlogPostPreviewProps = React.ComponentPropsWithoutRef<'div'> & {
  lang: Lang;
  post: Post | LoadFailure;
  href: string;
  featured?: boolean;
  thumbnail: boolean;
};

export default function BlogPostPreview({
  className,
  lang,
  post,
  href,
  thumbnail,
  featured,
}: BlogPostPreviewProps) {
  if (post.type === 'LoadFailure') {
    return <BlogLoadFailure node={post} lang={lang} />;
  }

  const showThumbnail = thumbnail;
  const isFeatured = thumbnail && Boolean(featured ?? post.featured);

  const dateStr = post.date
    ? formatPostDate(new Date(post.date), lang, 'short')
    : '';
  const isMinimal = !showThumbnail;

  const contentLangMatch = post.filePath.match(/\.(\w+)\.(mdx|md)$/);
  const contentLang = contentLangMatch ? contentLangMatch[1] : null;
  const showLangIndicator = contentLang !== null && contentLang !== lang;
  const langTag =
    contentLang === 'en'
      ? 'ENG'
      : contentLang === 'uk'
        ? 'УКР'
        : contentLang?.toUpperCase();

  if (isMinimal) {
    return (
      <UnstyledLink
        href={href}
        className={clsx('group block w-full', className)}
      >
        <div className='flex items-center justify-between gap-4 py-1'>
          <div className='flex flex-col gap-0.5'>
            <h3 className='font-bold text-base group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors'>
              {post.title}
              {showLangIndicator && (
                <span className='text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1.5'>
                  ({langTag})
                </span>
              )}
            </h3>
            <div className='flex items-center font-mono text-sm text-slate-600 dark:text-slate-400 gap-2'>
              {dateStr && <span>{dateStr}</span>}
              {dateStr && <span>·</span>}
              <span>
                {post.readingTime} {common[lang].readingTime}
              </span>
            </div>
          </div>
        </div>
      </UnstyledLink>
    );
  }

  const titleSize = isFeatured ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl';
  const excerptSize = isFeatured
    ? 'text-base md:text-lg'
    : 'text-sm md:text-base';

  return (
    <UnstyledLink href={href} className={clsx('group flex h-full', className)}>
      <Card className='relative w-full flex flex-col overflow-hidden h-full border-0 shadow-none bg-transparent hover:bg-transparent hover:border-0 hover:shadow-none hover:translate-y-0 p-0'>
        {showThumbnail && (
          <div className='relative w-full aspect-video overflow-hidden rounded-lg mb-4 bg-gray-100 dark:bg-gray-800'>
            <NextImage
              useSkeleton
              src={post.image}
              alt={post.title}
              fill
              className='w-full h-full'
              imgClassName='object-cover transition-transform duration-300 ease-out group-hover:scale-105'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          </div>
        )}

        <div className='flex flex-col grow'>
          <h3
            className={clsx(
              'font-bold mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors pt-0',
              titleSize,
            )}
          >
            {post.title}
            {showLangIndicator && (
              <span className='text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1.5'>
                ({langTag})
              </span>
            )}
          </h3>

          <div className='font-mono text-sm text-slate-600 dark:text-slate-400 mb-2 flex flex-wrap items-center gap-x-2 gap-y-1'>
            <span>
              {post.readingTime} {common[lang].readingTime}
            </span>
            {dateStr && (
              <>
                <span>•</span>
                <span>{dateStr}</span>
              </>
            )}
          </div>

          {isFeatured && (
            <p className={clsx('opacity-80 line-clamp-3', excerptSize)}>
              {post.excerpt}
            </p>
          )}
        </div>
      </Card>
    </UnstyledLink>
  );
}
