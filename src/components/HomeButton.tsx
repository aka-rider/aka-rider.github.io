import { FaHome } from 'react-icons/fa';

import IconLink from '@/components/IconLink';

import { common, Lang } from '@/i18n';

export default function HomeButton({ lang }: { lang: Lang }) {
  return (
    <IconLink href={`/${lang}`} icon={FaHome} aria-label={common[lang].home} />
  );
}
