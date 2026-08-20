import { translateAbout } from './about';
import { translateFoss } from './foss';
import { translateServices } from './services';
import { Lang } from '../index';

const sectionNames = {
  blog: { en: 'Blog', uk: 'Блог' },
  foss: { en: 'Open Source', uk: 'Опенсорс' },
  services: { en: 'Services', uk: 'Послуги' },
};

function translateRootPage(lang: Lang) {
  return {
    about: translateAbout(lang),
    blog: {
      name: sectionNames.blog[lang],
    },
    foss: {
      name: sectionNames.foss[lang],
      items: translateFoss(lang),
    },
    services: {
      name: sectionNames.services[lang],
      items: translateServices(lang),
    },
  };
}

export const rootPage = {
  en: translateRootPage('en'),
  uk: translateRootPage('uk'),
};
