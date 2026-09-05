import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

import { fontClassName } from '@/lib/fonts';

import Analytics from '@/components/Analytics';
import Footer from '@/components/layout/Footer';

import { common, Lang } from '@/i18n';

export default function Layout({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <html lang={lang} className={fontClassName} suppressHydrationWarning>
      <body>
        <link rel='dns-prefetch' href='//scripts.simpleanalyticscdn.com' />
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <a href='#main-content' className='skip'>
            {common[lang].skipToContent}
          </a>
          {children}
          <Footer lang={lang} />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
