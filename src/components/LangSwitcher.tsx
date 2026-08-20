'use client';

import { usePathname, useRouter } from 'next/navigation';

import type { Lang } from '@/i18n';
import { common, Languages } from '@/i18n';

interface LangSwitcherProps {
  currentLang: Lang;
}

export default function LangSwitcher({ currentLang }: LangSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLang: Lang) => {
    const segments = pathname.split('/').filter(Boolean);

    while (segments.length > 0 && segments[0] && Languages.has(segments[0])) {
      segments.shift();
    }

    const newPath = `/${newLang}${segments.length > 0 ? '/' + segments.join('/') : ''}`;
    router.push(newPath);
  };

  return (
    <div className='relative'>
      <select
        value={currentLang}
        onChange={(e) => handleLanguageChange(e.target.value as Lang)}
        aria-label={common[currentLang].language}
        className='border rounded px-2 py-1 text-sm
                   text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800
                   cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors'
      >
        {Languages.map((lang) => (
          <option
            key={lang}
            value={lang}
            className='bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100'
          >
            {lang.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
