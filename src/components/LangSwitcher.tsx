'use client';

import { usePathname, useRouter } from 'next/navigation';

import { Lang, languages } from '@/i18n';

interface LangSwitcherProps {
  currentLang: Lang;
}

export default function LangSwitcher({ currentLang }: LangSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLang: Lang) => {
    // Replace the language segment in the pathname
    const segments = pathname.split('/');
    if (segments[1] && segments[1] in languages) {
      segments[1] = newLang;
    } else {
      segments.splice(1, 0, newLang);
    }
    const newPath = segments.join('/');
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
        {Object.entries(languages).map(([langCode, langInfo]) => (
          <option
            key={langCode}
            value={langCode}
            className='bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
          >
            {langInfo.name.slice(0, 3).toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
