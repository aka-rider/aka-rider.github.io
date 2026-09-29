import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

import { fontClassName } from '@/lib/fonts';

import Analytics from '@/components/Analytics';
import Footer from '@/components/layout/Footer';
import SpeculationRules from '@/components/SpeculationRules';

import { common, Lang } from '@/i18n';

const fontPreloadsByLang: Record<Lang, string[]> = {
  en: ['/fonts/atkinson-hyperlegible-next-latin.woff2'],
  uk: [
    '/fonts/wix-madefor-text-cyrillic.woff2',
    '/fonts/wix-madefor-text-latin.woff2',
  ],
};

export default function Layout({
  lang,
  children,
}: {
  lang: Lang;
  children: ReactNode;
}) {
  return (
    <html lang={lang} className={fontClassName} suppressHydrationWarning>
      <body>
        {fontPreloadsByLang[lang].map((href) => (
          <link
            key={href}
            rel='preload'
            as='font'
            type='font/woff2'
            crossOrigin=''
            href={href}
          />
        ))}
        <link rel='dns-prefetch' href='//scripts.simpleanalyticscdn.com' />
        <link rel='dns-prefetch' href='//queue.simpleanalyticscdn.com' />
        <SpeculationRules />
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
