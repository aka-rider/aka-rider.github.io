import Link from 'next/link';
import { ReactNode } from 'react';

import LangSwitcher from '@/components/LangSwitcher';
import ThemeToggle from '@/components/ThemeToggle';

import { common, Lang } from '@/i18n';

export default function Nav({ lang, children }: { lang: Lang; children?: ReactNode }) {
  return (
    <div className='nav'>
      <div className='wrap'>
        <Link className='brand' href={`/${lang}/`}>
          {common[lang].authorName}
        </Link>
        {children}
        <div className='tools'>
          <LangSwitcher lang={lang} />
          <ThemeToggle lang={lang} />
        </div>
      </div>
    </div>
  );
}
