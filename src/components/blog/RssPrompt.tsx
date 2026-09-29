import UnstyledLink from '@/components/links/UnstyledLink';

import { common, Lang } from '@/i18n';

export default function RssPrompt({ lang }: { lang: Lang }) {
  const text = common[lang].rssPrompt;
  const match = text.match(/^(.*?)\[(.+?)\]\((.+?)\)(.*)$/);
  if (!match) {
    throw new Error(
      `common.${lang}.rssPrompt must contain a markdown link: ${text}`,
    );
  }
  const [, before, linkText, href, after] = match;
  return (
    <p className='rss'>
      {before}
      <UnstyledLink href={`/${lang}${href}`}>{linkText}</UnstyledLink>
      {after}
    </p>
  );
}
