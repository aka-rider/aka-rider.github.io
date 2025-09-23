import Link, { LinkProps } from 'next/link';
import * as React from 'react';

import { SITE_URL } from '/config';

export type UnstyledLinkProps = {
  href?: string;
  children?: React.ReactNode;
  openNewTab?: boolean;
  className?: string;
  nextLinkProps?: Omit<LinkProps, 'href'>;
} & React.ComponentPropsWithRef<'a'>;

const UnstyledLink = React.forwardRef<HTMLAnchorElement, UnstyledLinkProps>(
  ({ children, href, openNewTab, className, nextLinkProps, ...rest }, ref) => {
    const isLocal =
      !href ||
      href.startsWith('/') ||
      href.startsWith('#') ||
      href.startsWith(SITE_URL);
    const isNewTab = openNewTab !== undefined ? openNewTab : !isLocal;

    if (!isNewTab) {
      return (
        <Link
          href={href || '#'}
          ref={ref}
          className={className}
          {...rest}
          {...nextLinkProps}
        >
          {children}
        </Link>
      );
    }

    return (
      <a
        ref={ref}
        target='_blank'
        rel='noopener noreferrer'
        href={href}
        {...rest}
        className={className}
      >
        {children}
      </a>
    );
  },
);

export default UnstyledLink;
