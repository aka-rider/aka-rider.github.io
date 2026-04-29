import { Lang } from '../index';

const services = {
  cto: {
    title: {
      en: 'CTO / Engineering Leadership',
      uk: 'CTO / технічний директор',
    },
    proposition: {
      en: 'I hire engineers, set up delivery processes, and mentor tech leads. Short engagements for teams under 35 — 6-12mo roadmaps, org design, MVPs. I leave when the department ships without me.',
      uk: 'Наймаю інженерів, створюю процеси, навчаю тімлідів. Обмежені за часом контракти з командами до 35 осіб — плани на 6-12 місяців, орг-дизайн, MVP. Результат — автономний відділ, який працює без мене.',
    },
  },
  principal: {
    title: {
      en: 'Principal Engineer',
      uk: 'Principal-інженер',
    },
    proposition: {
      en: 'System architecture for scale, cloud and bare-metal infrastructure, backend performance optimization, storage and data layer design.',
      uk: 'Архітектура  високонавантажених систем, хмарна інфраструктура та bare-metal, оптимізація бекендів, проєктування систем управління даними.',
    },
  },
} as const;

export function translateServices(lang: Lang) {
  return {
    cto: {
      title: services.cto.title[lang],
      proposition: services.cto.proposition[lang],
    },
    principal: {
      title: services.principal.title[lang],
      proposition: services.principal.proposition[lang],
    },
  };
}

export type ServicesContent = ReturnType<typeof translateServices>;
