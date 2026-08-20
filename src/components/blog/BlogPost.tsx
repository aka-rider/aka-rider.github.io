import Image from 'next/image';
import React from 'react';

import { Post } from '@/lib/blog/types';

import { formatPostDate } from '@/components/blog/postDate';
import ServerMDX from '@/components/blog/ServerMDX';
import TableOfContents from '@/components/blog/TableOfContents';
import PrimaryLink from '@/components/links/PrimaryLink';

import { common, Lang } from '@/i18n';

const HERO_WIDTH = 1350;
const HERO_HEIGHT = 1080;

export default async function BlogPost({
  post,
  lang,
}: {
  post: Post;
  lang: Lang;
}) {
  const content = post.content || '';

  return (
    <div className='px-5 lg:px-10 pt-5 md:pt-10'>
      <div className='relative w-full max-w-[70ch] mx-auto min-w-0'>
        <article className='prose lg:prose-lg dark:prose-invert max-w-none w-full min-w-0'>
          <h1>{post.title}</h1>
          <p className='text-sm text-slate-600 dark:text-slate-400 !mt-0 !mb-0'>
            {post.date && (
              <>
                <time dateTime={post.date.toISOString().split('T')[0]}>
                  {formatPostDate(post.date, lang, 'long')}
                </time>
                {' · '}
              </>
            )}
            {post.readingTime} {common[lang].readingTime}
          </p>

          {!post.hideHero && (
            <Image
              src={post.image}
              alt={post.title}
              width={HERO_WIDTH}
              height={HERO_HEIGHT}
              priority
              className='w-full h-auto rounded-[20px] border border-neutral-200 dark:border-neutral-800 mt-6 mb-10'
            />
          )}

          <ServerMDX
            source={content}
            postFilePath={post.filePath}
            lang={lang}
          />

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
  if (!match) {
    throw new Error(
      `common.${lang}.rssPrompt must contain a markdown link: ${text}`,
    );
  }
  const [, before, linkText, href, after] = match;
  return (
    <p className='mt-12 text-sm text-slate-500 dark:text-slate-400'>
      {before}
      <PrimaryLink href={`/${lang}${href}`}>{linkText}</PrimaryLink>
      {after}
    </p>
  );
}
