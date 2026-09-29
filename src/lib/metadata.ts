import { Metadata } from 'next';

import { getLocalImageDimensions } from '@/lib/images';

import { common, defaultLang, Lang, Languages } from '@/i18n';

import config from '../../config';

const DEFAULT_IMAGE_URL = `${config.SITE_URL}/images/iurii-avatar.webp`;
export const PERSON_ID = `${config.SITE_URL}/#person`;

export interface MetaImage {
  url: string;
  width?: number;
  height?: number;
  alt: string;
}

export interface PageMetadataInput {
  lang: Lang;
  path: string;
  canonicalPath?: string;
  locale?: Lang;
  title?: string;
  description?: string;
  type?: 'website' | 'article';
  image?: MetaImage;
  publishedTime?: string;
  languagePaths?: Partial<Record<Lang, string>>;
}

function withTrailingSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}

function absoluteUrl(path: string): string {
  return new URL(withTrailingSlash(path), config.SITE_URL).toString();
}

function absoluteAssetUrl(url: string): string {
  return new URL(url, config.SITE_URL).toString();
}

export async function buildMetadata({
  lang,
  path,
  canonicalPath,
  locale = lang,
  title,
  description,
  type = 'website',
  image,
  publishedTime,
  languagePaths,
}: PageMetadataInput): Promise<Metadata> {
  const pageTitle = title ?? common[lang].title;
  const pageDescription = description ?? common[lang].description;
  const url = absoluteUrl(path);
  const canonicalUrl = absoluteUrl(canonicalPath ?? path);
  const resolvedImage = image ?? {
    url: DEFAULT_IMAGE_URL,
    alt: common[lang].profilePhoto,
    ...(await getLocalImageDimensions(DEFAULT_IMAGE_URL)),
  };

  const languages: Record<string, string> = {};
  for (const key of Languages.keys()) {
    const langPath = languagePaths?.[key];
    if (langPath) {
      languages[key] = absoluteUrl(langPath);
    }
  }
  const defaultPath = languagePaths?.[defaultLang];
  if (defaultPath) {
    languages['x-default'] = absoluteUrl(defaultPath);
  }

  const ogImage = {
    url: absoluteAssetUrl(resolvedImage.url),
    ...(resolvedImage.width ? { width: resolvedImage.width } : {}),
    ...(resolvedImage.height ? { height: resolvedImage.height } : {}),
    alt: resolvedImage.alt,
  };

  const openGraph: NonNullable<Metadata['openGraph']> =
    type === 'article'
      ? {
          type: 'article',
          title: pageTitle,
          description: pageDescription,
          url,
          siteName: common[lang].title,
          locale,
          ...(publishedTime ? { publishedTime } : {}),
          images: [ogImage],
        }
      : {
          type: 'website',
          title: pageTitle,
          description: pageDescription,
          url,
          siteName: common[lang].title,
          locale,
          images: [ogImage],
        };

  return {
    metadataBase: new URL(config.SITE_URL),
    title: pageTitle,
    description: pageDescription,
    keywords: common[lang].keywords,
    alternates: {
      canonical: canonicalUrl,
      ...(Object.keys(languages).length ? { languages } : {}),
      types: {
        'application/atom+xml': [
          {
            url: absoluteAssetUrl(`/${lang}/feed.xml`),
            title: common[lang].rssFeed,
          },
        ],
      },
    },
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [ogImage.url],
    },
  };
}

export function homeLanguagePaths(): Partial<Record<Lang, string>> {
  return Object.fromEntries(
    Languages.keys().map((lang) => [lang, `/${lang}/`]),
  );
}

export function blogRootLanguagePaths(): Partial<Record<Lang, string>> {
  return Object.fromEntries(
    Languages.keys().map((lang) => [lang, `/${lang}/blog/`]),
  );
}
