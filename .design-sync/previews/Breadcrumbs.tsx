import * as React from 'react';

import { Breadcrumbs } from 'iurii.net';

export const CategoryOnly = () => (
  <div className='max-w-2xl'>
    <Breadcrumbs
      trail={[{ href: '/en/blog/', title: 'Blog' }]}
      current='Engineering'
    />
  </div>
);

export const PostUnderCategory = () => (
  <div className='max-w-2xl'>
    <Breadcrumbs
      trail={[
        { href: '/en/blog/', title: 'Blog' },
        { href: '/en/blog/?category=engineering', title: 'Engineering' },
      ]}
      current='Zero-Downtime Schema Migrations in Postgres'
    />
  </div>
);
