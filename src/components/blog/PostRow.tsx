import { PostSummary } from '@/lib/blog/summary';
import { formatMeta } from '@/lib/format';

import UnstyledLink from '@/components/links/UnstyledLink';

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
  const postLang = Languages.foreign(post.contentLang, lang);

  return (
    <UnstyledLink href={post.href} className={lead ? 'lead' : undefined}>
      <h3 lang={postLang}>
        {post.title}
        {postLang && (
          <span className='tag'>({Languages.data[postLang].tag})</span>
        )}
      </h3>
      <span className='meta'>
        {formatMeta(post.date, post.readingTime, lang)}
      </span>
      {lead && <p lang={postLang}>{post.excerpt}</p>}
    </UnstyledLink>
  );
}
