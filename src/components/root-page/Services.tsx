import { ServicesContent } from '@/i18n/root-page/services';

import config from '/config';

export default function Services({
  title,
  items,
  foot,
}: {
  title: string;
  items: ServicesContent;
  foot: string;
}) {
  return (
    <section className='section' id='services'>
      <h2>{title}</h2>
      <div className='services'>
        {Object.values(items).map((service) => (
          <div key={service.title}>
            <h3>{service.title}</h3>
            <p>{service.proposition}</p>
          </div>
        ))}
      </div>
      <p className='foot'>
        <a href={config.LINKED_IN}>{foot}</a>
      </p>
    </section>
  );
}
