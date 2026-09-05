import * as React from 'react';

import { Nav } from 'iurii.net';

export const Bare = () => (
  <div className='w-full max-w-3xl'>
    <Nav lang='en' />
  </div>
);

export const WithSectionLinks = () => (
  <div className='w-full max-w-3xl'>
    <Nav lang='en'>
      <nav className='navlinks' aria-label='Sections'>
        <a href='#blog'>Blog</a>
        <a href='#services'>Services</a>
        <a href='#foss'>Open Source</a>
      </nav>
    </Nav>
  </div>
);

export const WithBreadcrumbs = () => (
  <div className='w-full max-w-3xl'>
    <Nav lang='en'>
      <nav className='crumbs' aria-label='Breadcrumb'>
        <a href='/en/blog/'>Blog</a>
        <span className='sep'>/</span>
        <span className='cur' aria-current='page'>
          Engineering
        </span>
      </nav>
    </Nav>
  </div>
);
