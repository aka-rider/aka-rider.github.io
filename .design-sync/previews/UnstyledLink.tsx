import * as React from 'react';
import { SiGithub, SiLinkedin } from 'react-icons/si';

import { UnstyledLink } from 'iurii.net';

export const LocalAndExternal = () => (
  <div className='flex flex-wrap items-center gap-6 text-slate-700 dark:text-slate-300'>
    <UnstyledLink href='/en/about' className='underline decoration-dotted'>
      About
    </UnstyledLink>
    <UnstyledLink
      href='https://github.com/iurii-krasnoshchok'
      className='underline decoration-dotted'
    >
      github.com/iurii-krasnoshchok
    </UnstyledLink>
  </div>
);

export const AsIconLink = () => (
  <div className='flex flex-wrap items-center gap-4'>
    <UnstyledLink
      href='https://www.linkedin.com/in/iurii-krasnoshchok'
      aria-label='LinkedIn'
      className='inline-flex items-center gap-2 rounded-lg bg-[#0077b5] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#006097] md:text-base'
    >
      <SiLinkedin className='h-5 w-5' />
      <span>Connect on LinkedIn</span>
    </UnstyledLink>
    <UnstyledLink
      href='https://github.com/iurii-krasnoshchok'
      aria-label='GitHub'
      className='inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-300'
    >
      <SiGithub className='h-4 w-4' aria-hidden='true' />
      GitHub
    </UnstyledLink>
  </div>
);
