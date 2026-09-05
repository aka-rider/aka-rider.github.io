import * as React from 'react';

import { About } from 'iurii.net';

export const English = () => (
  <div className='w-full max-w-4xl'>
    <About
      lang='en'
      name='Iurii Krasnoshchok'
      subhead={[
        'I am a software architect and engineering leader with 15+ years building high-scale backend systems and the teams that run them.',
        'Recently: CTO roles at two Series B startups, a principal engineering stint tuning a payments platform down to single-digit millisecond p99s, and a handful of open-source libraries used in production well beyond the projects I wrote them for.',
      ]}
      proofs={[
        'Grew engineering orgs from 4 to 35 without a drop in delivery cadence',
        'Migrated a monolith to event-driven services with zero customer-visible downtime',
        'Speaker at three regional systems-engineering conferences',
      ]}
      cta='Available for short CTO and principal engineering engagements.'
      linkedinCta='Connect on LinkedIn'
    />
  </div>
);

export const Ukrainian = () => (
  <div className='w-full max-w-4xl'>
    <About
      lang='uk'
      name='Юрій Краснощок'
      subhead={[
        'Я архітектор ПЗ та керівник розробки з 15+ роками досвіду побудови високонавантажених бекендів і команд, що їх підтримують.',
      ]}
      proofs={[
        'Виріс команду з 4 до 35 інженерів без падіння темпу постачання',
        'Мігрував моноліт на event-driven сервіси без простою для клієнтів',
      ]}
      cta='Відкритий до коротких CTO та principal-engineering контрактів.'
      linkedinCta="Зв'язатися в LinkedIn"
    />
  </div>
);
