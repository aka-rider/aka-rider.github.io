export const foss = [
  {
    name: 'nanoQ aka nQ',
    description: {
      en: 'Brokerless golang Pub/Sub for streaming real-time data. IoT, sensors, VoIP, clicks, multimedia data for backend infra.',
      uk: 'Go бібліотека Pub/Sub для потокової передачі даних у реальному часі. IoT, сенсори, VoIP, клікі та мультимедійних поміж backend сервісами.',
    },
    role: {
      en: 'Author',
      uk: 'Автор',
    },
    website: 'https://medium.com/aigent/meet-nanoq-high-performance-brokerless-pub-sub-for-streaming-real-time-data-with-golang-6630d3067f4e',
    github: 'https://github.com/aka-rider/nq',
    image: '/images/gopher-hiking-by-egonelbre.svg',
  },
  {
    name: 'cachelot',
    description: {
      en: 'Lightning-fast embeddable Memcached. Low memory footprint.',
      uk: 'Блискавично швидкий вбудований Memcached. Мінімальний розхід пам\'яті.',
    },
    role: {
      en: 'Author',
      uk: 'Автор',
    },
    website: 'https://cachelot.io',
    github: 'https://github.com/cachelot/cachelot',
    image: '/images/cachelot.png',
  },
  {
    name: 'Boost C++ Libraries',
    description: {
      en: 'Ported Boost C++ Libraries to S60 Platform (old Nokia smartphones), now discontinued. Contributed to Boost.Coroutine and other libraries.',
      uk: 'Портував Boost C++ на платформу S60 (старі смартфони Nokia), вже неіснуючу. Працював над Boost.Coroutine та ін.',
    },
    role: {
      en: 'Contributor',
      uk: 'Контрибʼютор',
    },
    website: 'https://www.boost.org',
    github: 'https://github.com/boostorg/boost',
    image: '/images/boost-libraries.svg',
  },
] as const;

// Helper function to transform foss for a specific language
export function translateFoss<T extends 'en' | 'uk'>(lang: T) {
  return foss.map(project => ({
    name: project.name,
    description: project.description[lang],
    role: project.role[lang],
    website: project.website,
    github: project.github,
    image: project.image,
  }));
}

export type FossContent = ReturnType<typeof translateFoss<'en'>>[number];
