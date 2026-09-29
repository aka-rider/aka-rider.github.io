import Image from 'next/image';

import { PostSummary } from '@/lib/blog/summary';
import { formatDate } from '@/lib/format';

import UnstyledLink from '@/components/links/UnstyledLink';

import { Lang, Languages } from '@/i18n';

export default function PostCard({
  lang,
  post,
}: {
  lang: Lang;
  post: PostSummary;
}) {
  const postLang = Languages.foreign(post.contentLang, lang);

  return (
    <UnstyledLink href={post.href} className='card'>
      <div className='thumb'>
        <Image src={post.image} alt={post.title} width={600} height={600} />
      </div>
      <h3 lang={postLang}>
        {post.title}
        {postLang && (
          <span className='tag'>({Languages.data[postLang].tag})</span>
        )}
      </h3>
      {post.date ? (
        <p>{formatDate(post.date, lang, 'short')}</p>
      ) : (
        <p lang={postLang}>{post.excerpt}</p>
      )}
    </UnstyledLink>
  );
}
