import { Fragment } from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';

export interface Crumb {
  href: string;
  title: string;
}

export default function Breadcrumbs({
  trail,
  current,
}: {
  trail: Crumb[];
  current: string;
}) {
  return (
    <nav className='crumbs' aria-label='Breadcrumb'>
      {trail.map((crumb) => (
        <Fragment key={crumb.href}>
          <UnstyledLink href={crumb.href}>{crumb.title}</UnstyledLink>
          <span className='sep'>/</span>
        </Fragment>
      ))}
      <span className='cur' aria-current='page'>
        {current}
      </span>
    </nav>
  );
}
