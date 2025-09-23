import { FaHome } from 'react-icons/fa';

import IconLink from '@/components/IconLink';

import { Lang } from '@/i18n';

export default function HomeButton({ lang }: { lang: Lang }) {
  return <IconLink href={`/${lang}`} icon={FaHome} />;
}
