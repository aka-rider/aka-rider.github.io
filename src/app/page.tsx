import { Accent } from '@/components/Accent';
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

        <Accent>
          <TypingText text='~> please select language' className='text-xl text-sky-600 dark:text-sky-400 text-shadow-[0_0_20px_var(--tw-shadow-color)] text-shadow-sky-300/50 dark:text-shadow-sky-400' />
        </Accent>

        <nav className='flex flex-col md:flex-row items-start gap-2 w-full text-xl sm:text-2xl'>
          {Languages.entries().map(([lang, langInfo]) => (
            <a
              className='px-5 py-2 min-w-50 ml-8 text-center rounded-md border border-slate-100 dark:border-slate-900 grayscale hover:grayscale-0 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-200'
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
