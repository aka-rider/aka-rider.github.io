import { rootPage } from './root-page';

const i18n = {

  en: {
    name: 'English',
    emoji: '🇬🇧',
    title: 'Iurii (Yurii) Krasnoshchok',
    description: 'Software Engineering, IT, and hobbies',
    keywords:
      'Iurii Krasnoshchok, Yuriy Krasnoschok, software engineering, programming, IT, development, DevOps, DBA, CTO',
    notFound: 'Page not found',
    returnHome: 'Return home',
    showMore: 'Show more',
    showLess: 'Show less',
    professionalJourney: 'Professional Journey',
    rootPage: rootPage['en'],
  },

  uk: {
    name: 'Українська',
    emoji: '🇺🇦',
    title: 'Юрій Краснощок',
    description: 'розробка ПЗ, айті та хоббі',
    keywords:
      'Юрій Краснощок, програмування, IT, айті, розробка ПЗ, DevOps, бази даних, DBA, архітектор рішень, IT директор, CTO',
    notFound: 'Сторінку не знайдено',
    returnHome: 'На головну',
    showMore: 'Показати більше',
    showLess: 'Показати менше',
    professionalJourney: 'Професійний шлях',
    rootPage: rootPage['uk'],
  },

} as const;

export type Lang = keyof typeof i18n;

export const defaultLang = 'en' as Lang;

export const languages = Object.fromEntries(
  Object.keys(i18n).map((key) => [
    key,
    {
      name: i18n[key as Lang]['name'],
      emoji: i18n[key as Lang]['emoji'],
    },
  ]),
) as Record<Lang, { name: string; emoji: string }>;

type Path<T> = T extends object
  ? {
    [K in keyof T]: K extends string ? K | `${K}.${Path<T[K]>}` : never;
  }[keyof T]
  : never;

type I18nPath = Path<(typeof i18n)[Lang]>;

export const getTranslations =
  (lang: string) =>
    (path: I18nPath): string => {
      if (!(lang in i18n)) return String(path);

      const keys = path.split('.');
      let current: any = i18n[lang as Lang];

      for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
          current = current[key];
        } else {
          return String(path);
        }
      }

      return typeof current === 'object'
        ? JSON.stringify(current)
        : String(current);
    };
