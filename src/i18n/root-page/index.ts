import { translateFoss } from './foss';
import { translateServices } from './services';

export const rootPage = {
  uk: {
    about: {
      name: 'Вітаю',
      content: `Юра. Я допомагаю людям за допомогою програмного забезпечення.
                Відкритий до співпраці.
               `,
    },
    blog: {
      name: 'Блог',
    },
    foss: {
      name: 'Опенсорс',
      items: translateFoss('uk'),
    },
    contact: {
      name: 'Контакти',
    },
    services: {
      name: 'Послуги',
      items: translateServices('uk'),
    },
    testimonials: {
      name: 'Відгуки',
    },
  },
  en: {
    about: {
      name: 'Welcome',
      content: `My name is Yura and I solve real-world problems with software engineering.
                Let’s build something great together.`,
    },
    blog: {
      name: 'Blog',
    },
    foss: {
      name: 'Open Source',
      items: translateFoss('en'),
    },
    contact: {
      name: 'Contact',
    },
    services: {
      name: 'Services',
      items: translateServices('en'),
    },
    testimonials: {
      name: 'Testimonials',
    },
  },
} as const;
