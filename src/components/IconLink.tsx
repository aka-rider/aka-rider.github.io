import Link from 'next/link';
import { IconType } from 'react-icons';

interface IconLinkProps {
  href: string;
  icon: IconType;
  size?: number;
  isExternal?: boolean;
  className?: string;
  'aria-label'?: string;
}

export default function IconLink({
  href,
  icon: Icon,
  size = 24,
  isExternal = false,
  className = 'text-primary hover:opacity-75 transition-colors',
  'aria-label': ariaLabel,
}: IconLinkProps) {
  if (isExternal) {
    return (
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        className={className}
        aria-label={ariaLabel}
      >
        <Icon size={size} aria-hidden='true' />
      </a>
    );
  }

  return (
    <Link href={href} className={className} aria-label={ariaLabel}>
      <Icon size={size} aria-hidden='true' />
    </Link>
  );
}
