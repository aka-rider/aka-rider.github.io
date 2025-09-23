import Layout from '@/components/layout/Layout';
import TypingText from '@/components/TypingText';

import { defaultLang, getTranslations, languages } from '@/i18n';

export default async function RootPage() {
  const t = getTranslations(defaultLang);

  return (
    <Layout lang={defaultLang}>
      <main className='flex flex-col items-start h-screen space-y-4 pt-[20vh] px-3 sm:px-10'>
        <h1>
          {Object.keys(languages).map((lang, index) => {
            const t = getTranslations(lang);
            return (
              <span key={lang}>
                {index > 0 && ' / '}
                {t('title')}
              </span>
            );
          })}
        </h1>
        <h2>{t('description')}</h2>

        <TypingText text='~> please select language' className='text-xl' />

        <nav className='flex flex-col md:flex-row items-start gap-2 w-full text-xl sm:text-2xl'>
          {Object.entries(languages).map(([lang, langInfo]) => (
            <a
              className='px-5 py-2 min-w-50 ml-8 text-center rounded-md duration-75 border border-neutral-300 dark:border-neutral-600 grayscale hover:grayscale-0 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
              href={`/${lang}`}
              key={lang}
            >
              {langInfo.emoji} {langInfo.name}
            </a>
          ))}
        </nav>
      </main>
    </Layout>
  );
}
