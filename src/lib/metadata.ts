import { Metadata } from 'next';

import { common, Lang } from '@/i18n';

import config from '../../config';

export async function defaultMetadata({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    metadataBase: new URL(config.SITE_URL),
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
