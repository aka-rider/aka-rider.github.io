import Layout from '@/components/layout/Layout';
import TypingText from '@/components/TypingText';

import { common, defaultLang, Languages } from '@/i18n';

export default async function RootPage() {
  return (
    <Layout lang={defaultLang}>
      <main className='flex flex-col items-start h-screen space-y-4 pt-[20vh] px-3 sm:px-10'>
        <h1>
          {Languages.keys().map((lang, index) => (
            <span key={lang}>
              {index > 0 && ' / '}
              {common[lang].title}
            </span>
          ))}
        </h1>
        <h2>{common[defaultLang].description}</h2>

        <TypingText text='~> please select language' className='text-xl' />

        <nav className='flex flex-col md:flex-row items-start gap-2 w-full text-xl sm:text-2xl'>
          {Languages.entries().map(([lang, langInfo]) => (
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
