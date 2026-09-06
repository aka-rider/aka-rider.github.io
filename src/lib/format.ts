import { common, Lang } from '@/i18n';

const INTL_LOCALE: Record<Lang, string> = {
  en: 'en-US',
  uk: 'uk-UA',
};

export function formatDate(
  date: Date,
  lang: Lang,
  style: 'short' | 'long',
): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[lang], {
    year: 'numeric',
    month: style,
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function formatReadingTime(minutes: number, lang: Lang): string {
  return `${minutes} ${common[lang].readingTime}`;
}

export function formatMeta(
  date: Date | undefined,
  minutes: number,
  lang: Lang,
): string {
  const reading = formatReadingTime(minutes, lang);
  return date ? `${formatDate(date, lang, 'short')} · ${reading}` : reading;
}
