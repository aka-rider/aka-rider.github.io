import type { Lang } from './languages';
import { defaultLang, Languages } from './languages';

export type { Lang };
export { defaultLang, Languages };

const en = {
  title: 'Iurii (Yurii) Krasnoshchok',
  description: 'Software Engineering, IT, and hobbies',
  keywords:
    'Iurii Krasnoshchok, Yuriy Krasnoschok, software engineering, programming, IT, development, DevOps, DBA, CTO',
  notFound: 'Page not found',
  skipToContent: 'Skip to content',
  returnHome: 'Return home',
  showMore: 'Show more',
  showLess: 'Show less',
  readingTime: 'min',
  viewArchive: 'View Archive →',
  tableOfContents: 'Table of Contents',
  authorName: 'Iurii Krasnoshchok',
  authorBio:
    'Software architect. I build high-scale software and engineering teams.',
  rssPrompt: 'Liked this? Grab the [RSS feed](/feed.xml) to get notified.',
  home: 'Home',
  language: 'Language',
  close: 'Close',
  illustration: 'Illustration',
  profilePhoto: 'Profile photo',
  pageSections: 'Page sections',
  breadcrumb: 'Breadcrumb',
  blogCategories: 'Blog categories',
  postNavigation: 'Post navigation',
  olderPost: 'Older',
  newerPost: 'Newer',
  linkedinProfile: 'LinkedIn profile',
  githubProfile: 'GitHub profile',
  rssFeed: 'RSS feed',
  copyCode: 'Copy code',
  copyFailed: 'Copy failed',
  switchTheme: 'Switch theme',
  themeSystem: 'System',
  themeDark: 'Dark',
  themeLight: 'Light',
  noBlogContent: 'No blog content available',
  loadFailureHeading: 'Error loading content',
  loadFailureSubject: 'Failed to load:',
  loadFailureExplanation:
    'This content could not be loaded due to parsing errors.',
  loadFailureDetails: 'Show error details',
  unknownError: 'Unknown error',
  mdxCompilationError: 'MDX compilation error',
  mdxSourcePreview: 'Source content, first characters:',
  loadingComments: 'Loading comments...',
} as const;

type CommonStrings = Record<keyof typeof en, string>;

const uk = {
  title: 'Юрій Краснощок',
  description: 'розробка ПЗ, айті та хобі',
  keywords:
    'Юрій Краснощок, програмування, IT, айті, розробка ПЗ, DevOps, бази даних, DBA, архітектор рішень, IT директор, CTO',
  notFound: 'Сторінку не знайдено',
  skipToContent: 'До вмісту',
  returnHome: 'На головну',
  showMore: 'Показати більше',
  showLess: 'Показати менше',
  readingTime: 'хв',
  viewArchive: 'Архів →',
  tableOfContents: 'Зміст',
  authorName: 'Юрій Краснощок',
  authorBio:
    'Архітектор ПЗ. Будую високонавантажені системи та інженерні команди.',
  rssPrompt:
    'Сподобалось? Підпишись на [RSS](/feed.xml), щоб не проґавити наступне.',
  home: 'головна',
  language: 'мова',
  close: 'закрити',
  illustration: 'ілюстрація',
  profilePhoto: 'фото профілю',
  pageSections: 'розділи сторінки',
  breadcrumb: 'ланцюжок навігації',
  blogCategories: 'категорії блогу',
  postNavigation: 'навігація між статтями',
  olderPost: 'раніше',
  newerPost: 'новіше',
  linkedinProfile: 'профіль у LinkedIn',
  githubProfile: 'профіль на GitHub',
  rssFeed: 'стрічка RSS',
  copyCode: 'копіювати код',
  copyFailed: 'не вдалося скопіювати',
  switchTheme: 'змінити тему',
  themeSystem: 'системна',
  themeDark: 'темна',
  themeLight: 'світла',
  noBlogContent: 'Немає матеріалів у блозі',
  loadFailureHeading: 'Помилка завантаження вмісту',
  loadFailureSubject: 'Не вдалося завантажити:',
  loadFailureExplanation:
    'Цей вміст не вдалося завантажити через помилки розбору.',
  loadFailureDetails: 'Показати деталі помилки',
  unknownError: 'Невідома помилка',
  mdxCompilationError: 'Помилка компіляції MDX',
  mdxSourcePreview: 'Вихідний вміст, перші символи:',
  loadingComments: 'Завантаження коментарів...',
} as const satisfies CommonStrings;

export const common = { en, uk } satisfies Record<Lang, CommonStrings>;
