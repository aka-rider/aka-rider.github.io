import Image from 'next/image';
import Link from 'next/link';

import { PostSummary } from '@/lib/blog/summary';
import { formatDate } from '@/lib/format';

import { Lang, Languages } from '@/i18n';

export default function PostCard({ lang, post }: { lang: Lang; post: PostSummary }) {
  const { contentLang } = post;
  const tag = contentLang && contentLang !== lang ? Languages.data[contentLang].tag : null;

  return (
    <Link href={post.href} className='card'>
      <div className='thumb'>
        <Image src={post.image} alt={post.title} width={600} height={600} />
      </div>
      <h3>
        {post.title}
        {tag && <span className='tag'>({tag})</span>}
      </h3>
      <p>{post.date ? formatDate(post.date, lang, 'short') : post.excerpt}</p>
    </Link>
  );
}
