import { Lang } from '@/i18n';

const LOCALE_BY_LANG: Record<Lang, string> = {
  en: 'en-US',
  uk: 'uk-UA',
};

const OPTIONS_BY_STYLE = {
  long: { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' },
  short: { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' },
} as const satisfies Record<string, Intl.DateTimeFormatOptions>;

export type PostDateStyle = keyof typeof OPTIONS_BY_STYLE;

export function formatPostDate(
  date: Date,
  lang: Lang,
  style: PostDateStyle,
): string {
  return new Intl.DateTimeFormat(
    LOCALE_BY_LANG[lang],
    OPTIONS_BY_STYLE[style],
  ).format(date);
}
