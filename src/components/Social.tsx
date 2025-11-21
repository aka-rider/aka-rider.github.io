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
      <IconLink href={config.LINKED_IN} icon={SiLinkedin} isExternal />
      <IconLink href={config.GIT_HUB} icon={SiGithub} isExternal />
      {lang && (
        <IconLink href={`/${lang}/feed.xml`} icon={SiRss} isExternal />
      )}
    </>
  );
}
