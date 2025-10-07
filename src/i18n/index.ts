import type { Lang } from './languages';
import { defaultLang, Languages } from './languages';

export type { Lang };
export { defaultLang, Languages };

export const common = {
  en: {
    title: 'Iurii (Yurii) Krasnoshchok',
    description: 'Software Engineering, IT, and hobbies',
    keywords:
      'Iurii Krasnoshchok, Yuriy Krasnoschok, software engineering, programming, IT, development, DevOps, DBA, CTO',
    notFound: 'Page not found',
    returnHome: 'Return home',
    showMore: 'Show more',
    showLess: 'Show less',
  },

  uk: {
    title: 'Юрій Краснощок',
    description: 'розробка ПЗ, айті та хоббі',
    keywords:
      'Юрій Краснощок, програмування, IT, айті, розробка ПЗ, DevOps, бази даних, DBA, архітектор рішень, IT директор, CTO',
    notFound: 'Сторінку не знайдено',
    returnHome: 'На головну',
    showMore: 'Показати більше',
    showLess: 'Показати менше',
  },
} as const;
