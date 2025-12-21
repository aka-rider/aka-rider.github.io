import { IconType } from 'react-icons';

import UnstyledLink from '@/components/links/UnstyledLink';

interface IconLinkProps {
  href: string;
  icon: IconType;
  size?: number;
  className?: string;
  'aria-label'?: string;
}

export default function IconLink({
  href,
  icon: Icon,
  size = 24,
  className = 'text-primary hover:opacity-75 transition-colors',
  'aria-label': ariaLabel,
}: IconLinkProps) {
  return (
    <UnstyledLink href={href} className={className} aria-label={ariaLabel}>
      <Icon size={size} aria-hidden='true' />
    </UnstyledLink>
  );
}
