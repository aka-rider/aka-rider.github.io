import { IconType } from 'react-icons';

import UnstyledLink from '@/components/links/UnstyledLink';

interface IconLinkProps {
  href: string;
  icon: IconType;
  className?: string;
  iconClassName?: string;
  'aria-label'?: string;
}

export default function IconLink({
  href,
  icon: Icon,
  className = 'text-primary hover:opacity-75 transition-colors',
  iconClassName = 'w-6 h-6',
  'aria-label': ariaLabel,
}: IconLinkProps) {
  return (
    <UnstyledLink href={href} className={className} aria-label={ariaLabel}>
      <Icon className={iconClassName} aria-hidden='true' />
    </UnstyledLink>
  );
}
