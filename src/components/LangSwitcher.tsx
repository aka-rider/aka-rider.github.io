'use client';

import { usePathname, useRouter } from 'next/navigation';

import type { Lang } from '@/i18n';
import { Languages } from '@/i18n';
interface LangSwitcherProps {
  currentLang: Lang;
}

export default function LangSwitcher({ currentLang }: LangSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLang: Lang) => {
    // Extract the path without any language prefix
    const segments = pathname.split('/').filter(Boolean);

    // Remove any existing language segments from the beginning
    while (segments.length > 0 && segments[0] && segments[0] in Languages.data) {
      segments.shift();
    }

    // Construct new path with the selected language
    const newPath = `/${newLang}${segments.length > 0 ? '/' + segments.join('/') : ''}`;
    router.push(newPath);
  };

  return (
    <div className='relative'>
      <select
        value={currentLang}
        onChange={(e) => handleLanguageChange(e.target.value as Lang)}
        className='border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-sm
                   text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800
                   cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors'
      >
        {Languages.map((lang, langInfo) => (
          <option
            key={lang}
            value={lang}
            className='bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100'
          >
            {langInfo.name.slice(0, 3).toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
