import * as React from 'react';

import { Layout, Nav } from 'iurii.net';

export const English = () => (
  <Layout lang='en'>
    <Nav lang='en'>
      <nav className='navlinks' aria-label='Sections'>
        <a href='#blog'>Blog</a>
        <a href='#services'>Services</a>
        <a href='#foss'>Open Source</a>
      </nav>
    </Nav>
    <main id='main-content' className='wrap'>
      <h1>Page content</h1>
      <p className='muted'>
        This is the page body rendered inside the site chrome.
      </p>
    </main>
  </Layout>
);

export const Ukrainian = () => (
  <Layout lang='uk'>
    <Nav lang='uk'>
      <nav className='navlinks' aria-label='Розділи'>
        <a href='#blog'>Блог</a>
        <a href='#services'>Послуги</a>
        <a href='#foss'>Відкритий код</a>
      </nav>
    </Nav>
    <main id='main-content' className='wrap'>
      <h1>Вміст сторінки</h1>
      <p className='muted'>
        Тіло сторінки, що рендериться всередині chrome сайту.
      </p>
    </main>
  </Layout>
);
