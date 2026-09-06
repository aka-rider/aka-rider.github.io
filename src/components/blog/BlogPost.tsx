import Image from 'next/image';

import { compilePost } from '@/lib/blog/compile';
import { Post } from '@/lib/blog/types';
import { formatDate, formatReadingTime } from '@/lib/format';

import RssPrompt from '@/components/blog/RssPrompt';
import TableOfContents from '@/components/blog/TableOfContents';
import TocSidebar from '@/components/blog/TocSidebar';

import { common, Lang } from '@/i18n';

export default async function BlogPost({
  post,
  lang,
}: {
  post: Post;
  lang: Lang;
}) {
  const { content, toc, hasFootnotes } = await compilePost(
    post.content,
    post.filePath,
    lang,
  );

  return (
    <>
      <article className='post'>
        <h1>{post.title}</h1>
        <p className='meta'>
          {post.date && (
            <>
              <time dateTime={post.date.toISOString().split('T')[0]}>
                {formatDate(post.date, lang, 'long')}
              </time>
              {' · '}
            </>
          )}
          {formatReadingTime(post.readingTime, lang)}
        </p>
        {!post.hideHero && (
          <div className='hero-img'>
            <Image
              src={post.image}
              alt={post.title}
              width={1350}
              height={1080}
              priority
            />
          </div>
        )}
        {toc.length > 0 && (
          <TableOfContents items={toc} label={common[lang].tableOfContents} />
        )}
        <div className='prose'>{content}</div>
        {!hasFootnotes && <RssPrompt lang={lang} />}
      </article>
      {toc.length > 0 && (
        <TocSidebar items={toc} label={common[lang].tableOfContents} />
      )}
    </>
  );
}
