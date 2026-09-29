import { FaLinkedin } from 'react-icons/fa';
import { SiGithub, SiMastodon, SiRss } from 'react-icons/si';

import UnstyledLink from '@/components/links/UnstyledLink';

import { common, Lang } from '@/i18n';

import config from '/config';

export default function Footer({ lang }: { lang: Lang }) {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className='wrap'>
        <span>© {year}</span>
        <div className='links'>
          <UnstyledLink
            href={config.LINKED_IN}
            aria-label={common[lang].linkedinProfile}
          >
            <FaLinkedin aria-hidden focusable='false' />
          </UnstyledLink>
          <UnstyledLink
            href={config.GIT_HUB}
            aria-label={common[lang].githubProfile}
          >
            <SiGithub aria-hidden focusable='false' />
          </UnstyledLink>
          <UnstyledLink
            href={config.MASTODON}
            rel='me noopener noreferrer'
            aria-label={common[lang].mastodonProfile}
          >
            <SiMastodon aria-hidden focusable='false' />
          </UnstyledLink>
          <UnstyledLink
            href={`/${lang}/feed.xml`}
            aria-label={common[lang].rssFeed}
          >
            <SiRss aria-hidden focusable='false' />
          </UnstyledLink>
        </div>
      </div>
    </footer>
  );
}
