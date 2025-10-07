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
        className='border border-neutral-300 dark:border-neutral-600 rounded px-2 py-1 text-sm
                   text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-800
                   cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors'
      >
        {Languages.map((lang, langInfo) => (
          <option
            key={lang}
            value={lang}
            className='bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
          >
            {langInfo.name.slice(0, 3).toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
