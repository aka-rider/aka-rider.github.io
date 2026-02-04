import Social from '@/components/Social';

import { common, Lang } from '@/i18n';

export default function Footer({ lang }: { lang: Lang }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='mt-16 py-3 border-t border-slate-200 dark:border-slate-800 w-11/12 mx-auto'>
      <div className='grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-sm text-opacity-75'>
        <div className='hidden md:block' />
        <p className='m-0 text-center flex justify-center items-center'>
          © {currentYear} {common[lang].title}{' '}
        </p>
        <div className='flex justify-center md:justify-end'>
          <Social lang={lang} className='flex gap-4' />
        </div>
      </div>
    </footer>
  );
}
