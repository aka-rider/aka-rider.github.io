import { SiGithub, SiLinkedin } from 'react-icons/si';

import IconLink from '@/components/IconLink';

import config from '/config';

export default function Social() {
  return (
    <>
      <IconLink href={config.LINKED_IN} icon={SiLinkedin} isExternal />
      <IconLink href={config.GIT_HUB} icon={SiGithub} isExternal />
    </>
  );
}
