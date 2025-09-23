import Section from '@/components/Section';
import ServiceCard from '@/components/ServiceCard';

import { ServicesContent } from '@/i18n/root-page/services';

interface ServicesProps {
  title: string;
  services: ServicesContent;
}

export default function Services({ title, services }: ServicesProps) {
  return (
    <Section id='services' title={title}>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {Object.entries(services).map(([key, service]: [string, any]) => (
          <ServiceCard
            key={key}
            title={service.title}
            proposition={service.proposition}
            icons={service.icons}
          />
        ))}
      </div>
    </Section>
  );
}
