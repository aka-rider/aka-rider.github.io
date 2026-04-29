import * as React from 'react';
import { FiArrowRight } from 'react-icons/fi';

import { LoadFailure, Post } from '@/lib/blog/types';
import clsx from '@/lib/clsxm';

import BlogLoadFailure from '@/components/blog/BlogLoadFailure';
import Card from '@/components/Card';
import UnstyledLink from '@/components/links/UnstyledLink';
import NextImage from '@/components/NextImage';

import { common, Lang } from '@/i18n';

type BlogPostPreviewProps = React.ComponentPropsWithoutRef<'div'> & {
  lang: Lang;
  post: Post | LoadFailure;
  href?: string;
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
    return BlogLoadFailure({ node: post });
  }

  // Ensure href is provided for posts
  const link = href || '#';

  const isFeatured = (post.type === 'Post' && post.featured) || featured;
  const showThumbnail = isFeatured || thumbnail;

  // Formatters
  const dateObj = post.date ? new Date(post.date) : null;
  const dateFormatter = new Intl.DateTimeFormat(lang === 'uk' ? 'uk-UA' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const dateStr = dateObj ? dateFormatter.format(dateObj) : '';
  const isMinimal = !showThumbnail;

  // Detect if content language differs from route language
  const contentLangMatch = post.filePath.match(/\.(\w+)\.(mdx|md)$/);
  const contentLang = contentLangMatch ? contentLangMatch[1] : null;
  const showLangIndicator = contentLang !== null && contentLang !== lang;
  const langTag = contentLang === 'en' ? 'ENG' : contentLang === 'uk' ? 'УКР' : contentLang?.toUpperCase();

  // Minimal "Menu" Style (No Thumbnail, Not Featured)
  if (isMinimal) {
    return (
      <UnstyledLink
        href={link}
        className={clsx('group block w-full', className)}
      >
        <div className='flex items-center justify-between gap-4 py-1'>
          <div className='flex flex-col gap-0.5'>
            <h3 className='font-bold text-base group-hover:text-primary-500 transition-colors'>
              {post.title}
              {showLangIndicator && (
                <span className='text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1.5'>
                  ({langTag})
                </span>
              )}
            </h3>
            <div className='flex items-center text-xs font-mono text-slate-500 dark:text-slate-400 gap-2'>
              {dateStr && <span>{dateStr}</span>}
              {dateStr && <span>·</span>}
              <span>
                {post.readingTime} {common[lang].readingTime}
              </span>
            </div>
          </div>
          <FiArrowRight className='w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1 shrink-0' />
        </div>
      </UnstyledLink>
    );
  }

  // Standard/Featured Style
  const titleSize = isFeatured ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl';
  const excerptSize = isFeatured ? 'text-base md:text-lg' : 'text-sm md:text-base';
  const opacity = isFeatured ? 'opacity-80' : 'opacity-60';

  return (
    <UnstyledLink
      href={link}
      className={clsx('group flex h-full', className)}
    >
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
              'font-bold mb-2 group-hover:text-primary-500 transition-colors pt-0',
              titleSize
            )}
          >
            {post.title}
            {showLangIndicator && (
              <span className='text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1.5'>
                ({langTag})
              </span>
            )}
          </h3>

          <div
            className={clsx(
              'font-mono text-xs mb-2 flex flex-wrap items-center gap-x-2 gap-y-1',
              opacity
            )}
          >
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
