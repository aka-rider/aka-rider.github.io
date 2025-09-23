import { jetBrainsMono, manrope, orbitron } from '@/lib/fonts';

import LangSwitcher from '@/components/LangSwitcher';
import Footer from '@/components/layout/Footer';
import ThemeProvider from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';

import { Lang } from '@/i18n';

const defaultFonts = [jetBrainsMono, manrope, orbitron];

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'system';
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                const resolvedTheme = theme === 'system' ? systemTheme : theme;
                if (resolvedTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className='antialiased bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100'>
        <ThemeProvider>
          <div className='flex flex-col min-h-screen w-11/12 xl:max-w-5xl mx-auto'>
            <div className='w-full flex justify-end items-center gap-4 p-4'>
              <LangSwitcher currentLang={lang} />
              <ThemeToggle />
            </div>
            {children}
            <Footer lang={lang} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
