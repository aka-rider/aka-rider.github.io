import { common, Lang } from '@/i18n';

export async function defaultMetadata({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  return {
    title: common[lang].title,
    description: common[lang].description,
    keywords: common[lang].keywords,
  };
}
