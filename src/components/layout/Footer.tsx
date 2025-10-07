import { common, Lang } from '@/i18n';

export default function Footer({ lang }: { lang: Lang }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='mt-16 py-3 border-t border-gray-200 dark:border-gray-800 w-11/12 mx-auto'>
      <div className='flex justify-center items-center gap-10 text-sm text-opacity-75 space-x-4'>
        <p className='m-0'>
          © {currentYear} {common[lang].title}{' '}
        </p>
      </div>
    </footer>
  );
}
