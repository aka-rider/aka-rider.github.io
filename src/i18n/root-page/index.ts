import { translateFoss } from './foss';
import { translateServices } from './services';

export const rootPage = {
  uk: {
    about: {
      name: 'Я будую високонавантажені системи',
      items: {
        subhead: [
          `
          Маю досвід створення бекендів на 30 мільйонів користувачів (з RDBMS) або real-time інфраструктура для 3000 одночасних speech-to-text потоків.
          Я читаю код частіше за документацію і вірю метрикам більше, ніж best practices.
          Проєктування високонавантажених системи починається з розуміння що саме відбувається під капотом у заліза, ядра і далі...
          `,
          `
          Я переношу свій підхід і в управління. Я вчу команди розуміти системи, які вони будують. Я замінюю магію на розуміння.
          Я створюю інженерні команди, здатні нести повну відповідальність за свої системи.
          `,
        ],
        proofs: [
          `Я розробив Key-Value сховище, 3M OPS ~300ns latency.`,
          `Я зробив рушій контейнерів для створення bootable Linux ISO (до появи Docker).`,
          `Коли MySQL почав гальмувати на 128-ядерних процесорах, я знайшов причину за допомогою perf та kprofile.`,
          `Коли застосунок на Go переставав відповідати під навантаженням, я зробив мінімальний кейс, і разом із кор-мейнтейнерами працював над патчем для планувальника горутин.`
        ],
        cta: `Давайте співпрацювати!`,
        linkedinCta: `Напишіть в LinkedIn`,
      },
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
      name: 'I build High-Scale Software',
      items: {
        subhead: [
          `
          I have built backends for 30M users on an RDBMS, or real-time streaming infrastructure for 3K concurrent speech-to-text streams.
          I verify manuals against source code and prefer metrics over best practices.
          To architect high-scale systems is to understand exactly what happens under the hood, from the hardware and kernel up.
          `,
          `
          I bring this mindset to leadership. I mentor teams to own the systems they build. I replace magic with understanding.
          I create engineering teams that are able to take full responsibility.
          `,
        ],
        proofs: [
          `I engineered a KV store achieving 3M OPS at ~300ns latency.`,
          `I built a custom container engine to generate bootable Linux ISOs (pre‑Docker era).`,
          `When a MySQL server degraded on 128 - core CPUs, I used perf and kprofile to find the root cause.`,
          `When a Go application became unresponsive under pressure, I worked with core maintainers on a reproducible case and the goroutine scheduler patch.`
        ],
        cta: `Let's build something great together.`,
        linkedinCta: `Message me on LinkedIn`,
      },
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
