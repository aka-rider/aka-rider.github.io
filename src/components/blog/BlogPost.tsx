import Image from 'next/image';

import { compilePost } from '@/lib/blog/compile';
import { contentLangOf } from '@/lib/blog/summary';
import { Post } from '@/lib/blog/types';
import { formatDate, formatReadingTime } from '@/lib/format';

import RssPrompt from '@/components/blog/RssPrompt';
import TableOfContents from '@/components/blog/TableOfContents';
import TocSidebar from '@/components/blog/TocSidebar';

import { common, Lang, Languages } from '@/i18n';

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
  const articleLang = Languages.foreign(contentLangOf(post.filePath), lang);

  return (
    <>
      <article className='post' lang={articleLang}>
        <h1>{post.title}</h1>
        <p className='meta' lang={articleLang && lang}>
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
              fetchPriority='high'
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
