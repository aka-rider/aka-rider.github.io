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
    readingTime: 'min',
    viewArchive: 'View Archive →',
    tableOfContents: 'Table of Contents',
    authorName: 'Iurii Krasnoshchok',
    authorBio: 'Software architect. I build high-scale backends and mentor engineering teams.',
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
    readingTime: 'хв',
    viewArchive: 'Архів →',
    tableOfContents: 'Зміст',
    authorName: 'Юрій Краснощок',
    authorBio: 'Архітектор ПЗ. Будую високонавантажені бекенди та менторю інженерні команди.',
  },
} as const;
