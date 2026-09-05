import Link from 'next/link';
import { Fragment } from 'react';

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
          <Link href={crumb.href}>{crumb.title}</Link>
          <span className='sep'>/</span>
        </Fragment>
      ))}
      <span className='cur' aria-current='page'>
        {current}
      </span>
    </nav>
  );
}
