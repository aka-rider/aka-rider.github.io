import { ThemeProvider } from 'next-themes';

import { fontBody, fontHeader, fontMono } from '@/lib/fonts';

import Analytics from '@/components/Analytics';
import LangSwitcher from '@/components/LangSwitcher';
import Footer from '@/components/layout/Footer';
import ThemeToggle from '@/components/ThemeToggle';

import { Lang } from '@/i18n';

const defaultFonts = [fontMono, fontBody, fontHeader];

export default function Layout({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  const fontClasses = defaultFonts.map((f) => f.variable).join(' ');
  return (
    <html lang={lang} className={fontClasses} suppressHydrationWarning>
      <body className='antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50'>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <a
            href='#main-content'
            className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2'
          >
          </a>
          <div className='flex flex-col min-h-screen w-11/12 xl:max-w-5xl mx-auto'>
            <div className='w-full flex justify-end items-center gap-4 p-4'>
              <LangSwitcher currentLang={lang} />
              <ThemeToggle />
            </div>
            <main id='main-content'>{children}</main>
            <Footer lang={lang} />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
