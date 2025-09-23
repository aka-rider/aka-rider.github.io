import { getTranslations, Lang } from '@/i18n';

export async function defaultMetadata({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const t = await getTranslations(lang);
  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  };
}
