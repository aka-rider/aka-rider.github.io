import UnstyledLink from '@/components/links/UnstyledLink';
import Section from '@/components/Section';
import ServiceCard from '@/components/ServiceCard';

import { ServicesContent } from '@/i18n/root-page/services';

import { LINKED_IN } from '/config';

interface ServicesProps {
  title: string;
  services: ServicesContent;
}

export default function Services({ title, services }: ServicesProps) {
  return (
    <Section id='services' title={title}>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {Object.entries(services.items).map(([key, service]) => (
          <ServiceCard
            key={key}
            title={service.title}
            proposition={service.proposition}
          />
        ))}
      </div>
      <div className='mt-8 text-center'>
        <UnstyledLink
          href={LINKED_IN}
          className='text-sm text-slate-600 dark:text-slate-400 underline underline-offset-4 hover:text-sky-600 dark:hover:text-sky-400'
        >
          {services.cta}
        </UnstyledLink>
      </div>
    </Section>
  );
}
