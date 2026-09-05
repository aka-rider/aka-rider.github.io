import Link from 'next/link';

import { common, Lang } from '@/i18n';

export default function RssPrompt({ lang }: { lang: Lang }) {
  const text = common[lang].rssPrompt;
  const match = text.match(/^(.*?)\[(.+?)\]\((.+?)\)(.*)$/);
  if (!match) {
    throw new Error(`common.${lang}.rssPrompt must contain a markdown link: ${text}`);
  }
  const [, before, linkText, href, after] = match;
  return (
    <p className='rss'>
      {before}
      <Link href={`/${lang}${href}`}>{linkText}</Link>
      {after}
    </p>
  );
}
