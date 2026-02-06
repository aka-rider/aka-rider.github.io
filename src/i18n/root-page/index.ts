import { translateFoss } from './foss';
import { translateServices } from './services';

export const rootPage = {
  uk: {
    about: {
      name: 'Я будую високонавантажені системи',
      items: {
        subhead: [
          `
          Маю досвід створення бекендів на 80 мільйонів користувачів (з RDBMS) або real-time інфраструктура для 3000 одночасних speech-to-text потоків.
          Я не довіряю ні мануалам, ані best practices — тільки коду та метрикам. Проєктування високонавантажених системи починається з розуміння що саме відбувається під капотом у заліза, ядра і далі...
          `,
          `
          Я переношу свій підхід і в управління. Я вчу команди розуміти механіку систем, які вони будують. Я замінюю магію на розуміння.
          Я створюю інженерні команди, які мають повний контроль і несуть повну відповідальність за свої системи.
          `,
        ],
        proofs: [
          `Коли MySQL почав тормозити на 128-ядерних процесорах, я знайшов причину за допомогою perf та kprofile.`,
          `Коли застосунок на Go переставав відповідати під навантаженням, я зробив мінімальний кейс, і разом із кор-мейнтейнерами працював над патчем для планувальника горутин.`,
          `Я розробив Key-Value сховище, 3M OPS ~100ns latency.`,
          `Перш за все, я C++ розробник. Я читав код V8 та Node.js щоб вивчити JavaScript, я писав власний інтерпретатор Python і JVM.`
        ],
        cta: `Давайте співпрацювати!`,
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
          I have built backends for 80M users on an RDBMS, or real-time infrastructure for 3K concurrent speech-to-text streams.
          I trust neither manuals nor best practices — only source code and metrics.
          To architect high-scale systems is to understand exactly what happens under the hood, from the hardware and kernel up.
          `,
          `
          I bring this mindset to leadership.I mentor teams to understand the mechanics of the systems they build.I replace magic with understanding.
          I create engineering teams that own their solutions and take full responsibility.
          `,
        ],
        proofs: [
          `When a MySQL server degraded on 128 - core CPUs, I used perf and kprofile to find the root cause.`,
          `When a Go application became unresponsive under pressure, I worked with core maintainers on a reproducible case and the goroutine scheduler patch.`,
          `I engineered a KV store achieving 3M OPS at ~100ns latency.`,
          `As a C++ developer at heart. I read V8 and Node.js sources to learn JavaScript, I wrote my own Python interpreter and JVM.`,
        ],
        cta: `Let's build something great together.`,
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
