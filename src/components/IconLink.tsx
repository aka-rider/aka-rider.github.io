import Link from 'next/link';
import { IconType } from 'react-icons';

interface IconLinkProps {
  href: string;
  icon: IconType;
  size?: number;
  isExternal?: boolean;
  className?: string;
}

export default function IconLink({
  href,
  icon: Icon,
  size = 24,
  isExternal = false,
  className = 'text-primary hover:opacity-75 transition-colors',
}: IconLinkProps) {
  if (isExternal) {
    return (
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        className={className}
      >
        <Icon size={size} />
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      <Icon size={size} />
    </Link>
  );
}
