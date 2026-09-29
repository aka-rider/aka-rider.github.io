import { ReactNode } from 'react';

import LangSwitcher from '@/components/LangSwitcher';
import ThemeToggle from '@/components/ThemeToggle';

import { common, Lang } from '@/i18n';

export default function Nav({
  lang,
  children,
}: {
  lang: Lang;
  children?: ReactNode;
}) {
  return (
    <header className='nav'>
      <div className='wrap'>
        <a className='brand' href={`/${lang}/`}>
          {common[lang].authorName}
        </a>
        {children}
        <div className='tools'>
          <LangSwitcher lang={lang} />
          <ThemeToggle lang={lang} />
        </div>
      </div>
    </header>
  );
}
