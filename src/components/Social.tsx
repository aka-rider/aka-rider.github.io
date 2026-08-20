import { SiGithub, SiLinkedin, SiRss } from 'react-icons/si';

import IconLink from '@/components/IconLink';

import { common, Lang } from '@/i18n';

import config from '/config';

interface SocialProps {
  lang: Lang;
  className?: string;
}

export default function Social({ lang, className }: SocialProps) {
  return (
    <div className={className}>
      <IconLink
        href={config.LINKED_IN}
        icon={SiLinkedin}
        aria-label={common[lang].linkedinProfile}
      />
      <IconLink
        href={config.GIT_HUB}
        icon={SiGithub}
        aria-label={common[lang].githubProfile}
      />
      <IconLink
        href={`/${lang}/feed.xml`}
        icon={SiRss}
        aria-label={common[lang].rssFeed}
      />
    </div>
  );
}
