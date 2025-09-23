import Image from 'next/image';

import Card from '@/components/Card';
import FontIcon from '@/components/FontIcon';
import UnstyledLink from '@/components/links/UnstyledLink';
import Section from '@/components/Section';

import { FossContent } from '@/i18n/root-page/foss';

interface FossProps {
  title: string;
  foss: FossContent[];
}

export default function Foss({ title, foss }: FossProps) {
  return (
    <Section id='foss' title={title} className='flex flex-col gap-4'>

      {foss.map((project) => (
        <Card key={project.name}>
          <div className='flex gap-6'>
            {/* Project Image */}
            <div className='flex-shrink-0'>
              <Image
                src={project.image}
                alt={project.name}
                width={80}
                height={80}
                className='rounded-lg object-cover'
              />
            </div>

            {/* Project Content */}
            <div className='flex-grow'>
              <UnstyledLink href={project.website || '#'} >
                {/* Project Header */}
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-xl font-bold text-neutral-900 dark:text-neutral-100'>
                    {project.name}
                  </h3>
                  <span className='text-sm text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded'>
                    {project.role}
                  </span>
                </div>

                {/* Project Description */}
                <p className='text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed'>
                  {project.description}
                </p>
              </UnstyledLink>
              {/* Project Links */}
              {(project.github) && (
                <UnstyledLink
                  href={project.github}
                  className='inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300 transition-colors'
                >
                  <FontIcon iconName='SiGithub' size={16} />
                  GitHub
                </UnstyledLink>
              )}

            </div>
          </div>
        </Card>
      ))}
    </Section>
  );
}
