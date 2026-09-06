import Image from 'next/image';
import { SiGithub } from 'react-icons/si';

import UnstyledLink from '@/components/links/UnstyledLink';

import { FossContent } from '@/i18n/root-page/foss';

export default function Foss({
  title,
  items,
}: {
  title: string;
  items: FossContent[];
}) {
  return (
    <section className='section' id='foss'>
      <h2>{title}</h2>
      <div className='foss'>
        {items.map((project) => (
          <div key={project.name}>
            <Image
              src={project.image}
              alt={project.name}
              width={64}
              height={64}
            />
            <div>
              <div className='head'>
                <UnstyledLink href={project.website}>
                  {project.name}
                </UnstyledLink>
                <span className='role'>{project.role}</span>
              </div>
              <p>{project.description}</p>
              <UnstyledLink className='gh' href={project.github}>
                <SiGithub />
                GitHub
              </UnstyledLink>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
