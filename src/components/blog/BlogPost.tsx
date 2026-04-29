import Image from 'next/image';
import React from 'react';

import { Post } from '@/lib/blog/types';

import ServerMDX from '@/components/blog/ServerMDX';
import TableOfContents from '@/components/blog/TableOfContents';
import PrimaryLink from '@/components/links/PrimaryLink';

import { common, Lang } from '@/i18n';

function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export default async function BlogPost({ post, lang }: { post: Post; lang: Lang }) {
  // Add null checks for post data
  if (!post) {
    return <div>Post not found</div>;
  }

  const content = post.content || '';

  return (
    <div className='px-5 lg:px-10 pt-5 md:pt-10'>
      <div className='relative w-full max-w-[70ch] mx-auto min-w-0'>
        <article className='blog-prose prose lg:prose-xl dark:prose-invert max-w-none w-full min-w-0'>
          <h1>{post.title}</h1>
          <p className='text-sm text-slate-500 dark:text-slate-400 !mt-0 !mb-0'>
            {post.date && (
              <>
                <time dateTime={post.date.toISOString().split('T')[0]}>
                  {formatDate(post.date, lang)}
                </time>
                {' · '}
              </>
            )}
            {post.readingTime} {common[lang].readingTime}
          </p>

          <Image
            src={post.image}
            alt={post.title}
            width={1350}
            height={1080}
            className='w-full h-auto rounded-[20px] border border-neutral-200 dark:border-neutral-800 mt-6 mb-10'
          />

          <ServerMDX source={content} postFilePath={post.filePath} />

          <RssPrompt lang={lang} />
        </article>
        <TableOfContents lang={lang} />
      </div>
    </div>
  );
}

function RssPrompt({ lang }: { lang: Lang }) {
  const text = common[lang].rssPrompt;
  const match = text.match(/^(.*?)\[(.+?)\]\((.+?)\)(.*)$/);
  if (!match) return <p className='mt-12 text-sm text-slate-500 dark:text-slate-400'>{text}</p>;
  const [, before, linkText, href, after] = match;
  return (
    <p className='mt-12 text-sm text-slate-500 dark:text-slate-400'>
      {before}
      <PrimaryLink href={`/${lang}${href}`}>{linkText}</PrimaryLink>
      {after}
    </p>
  );
}
