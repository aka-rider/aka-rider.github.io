import { Metadata } from 'next';

import { common, Lang } from '@/i18n';

export async function defaultMetadata({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    // eslint-disable-next-line no-undef
    metadataBase: new URL('https://iurii.net'),
    title: common[lang].title,
    description: common[lang].description,
    keywords: common[lang].keywords,
    openGraph: {
      title: common[lang].title,
      description: common[lang].description,
      type: 'website',
      url: '/',
      siteName: common[lang].title,
      locale: lang,
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}
