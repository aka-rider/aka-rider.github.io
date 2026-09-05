'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Lang, Languages } from '@/i18n';

export default function LangSwitcher({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const [query, setQuery] = useState('');

  useEffect(() => {
    setQuery(window.location.search);
  }, []);

  const segments = pathname.split('/').filter(Boolean);
  const rest = segments
    .slice(1)
    .map((segment) => `${segment}/`)
    .join('');

  return (
    <div className='seg'>
      {Languages.map((code, info) => (
        <Link
          key={code}
          href={`/${code}/${rest}${query}`}
          hrefLang={code}
          aria-label={info.name}
          aria-current={code === lang ? 'page' : undefined}
          className={code === lang ? 'on' : undefined}
        >
          {code.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
