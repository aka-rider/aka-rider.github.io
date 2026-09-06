import Link from 'next/link';

import { Blog } from '@/lib/blog/Blog';
import { selectPreview } from '@/lib/blog/preview';
import { toPostSummary } from '@/lib/blog/summary';

import BlogLoadFailure from '@/components/blog/BlogLoadFailure';
import PostRow from '@/components/blog/PostRow';

import { common, Lang } from '@/i18n';

export default function BlogPreview({
  lang,
  title,
}: {
  lang: Lang;
  title: string;
}) {
  const archiveHref = `/${lang}/blog/`;
  const root = new Blog().getRoot(lang);

  const heading = (
    <h2>
      <Link href={archiveHref}>{title}</Link>
    </h2>
  );

  if (!root) {
    return (
      <section className='section' id='blog'>
        {heading}
        <p className='muted'>{common[lang].noPosts}</p>
      </section>
    );
  }

  if (root.type === 'LoadFailure') {
    return (
      <section className='section' id='blog'>
        {heading}
        <BlogLoadFailure node={root} lang={lang} />
      </section>
    );
  }

  const category =
    root.type === 'Category' ? root.getCategories()[0] : undefined;
  if (!category) {
    return (
      <section className='section' id='blog'>
        {heading}
        <p className='muted'>{common[lang].noPosts}</p>
      </section>
    );
  }

  const { lead, rest } = selectPreview(category, 4);

  return (
    <section className='section' id='blog'>
      {heading}
      <div className='list'>
        {lead && <PostRow lang={lang} post={toPostSummary(lang, lead)} lead />}
        {rest.map((post) => (
          <PostRow
            key={post.slug}
            lang={lang}
            post={toPostSummary(lang, post)}
          />
        ))}
      </div>
      <div className='more'>
        <Link href={archiveHref}>{common[lang].viewArchive}</Link>
      </div>
    </section>
  );
}
