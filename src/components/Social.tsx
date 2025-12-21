import { SiGithub, SiLinkedin, SiRss } from 'react-icons/si';

import IconLink from '@/components/IconLink';

import { Lang } from '@/i18n';

import config from '/config';

interface SocialProps {
  lang?: Lang;
}

export default function Social({ lang }: SocialProps) {
  return (
    <>
      <IconLink
        href={config.LINKED_IN}
        icon={SiLinkedin}
        isExternal
        aria-label='LinkedIn profile'
      />
      <IconLink
        href={config.GIT_HUB}
        icon={SiGithub}
        isExternal
        aria-label='GitHub profile'
      />
      {lang && (
        <IconLink
          href={`/${lang}/feed.xml`}
          icon={SiRss}
          isExternal
          aria-label='RSS feed'
        />
      )}
    </>
  );
}
