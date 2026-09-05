import Link from 'next/link';

import { PostSummary } from '@/lib/blog/summary';
import { formatMeta } from '@/lib/format';

import { Lang, Languages } from '@/i18n';

export default function PostRow({
  lang,
  post,
  lead,
}: {
  lang: Lang;
  post: PostSummary;
  lead?: boolean;
}) {
  const { contentLang } = post;
  const tag = contentLang && contentLang !== lang ? Languages.data[contentLang].tag : null;

  return (
    <Link href={post.href} className={lead ? 'lead' : undefined}>
      <h3>
        {post.title}
        {tag && <span className='tag'>({tag})</span>}
      </h3>
      <span className='meta'>{formatMeta(post.date, post.readingTime, lang)}</span>
      {lead && <p>{post.excerpt}</p>}
    </Link>
  );
}
