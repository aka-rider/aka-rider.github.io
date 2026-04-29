import Image from 'next/image';
import { SiGithub } from 'react-icons/si';

import Card from '@/components/Card';
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
        <Card key={project.name} className='hover:border-transparent hover:bg-transparent hover:shadow-none hover:translate-y-0'>
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
                  <h3 className='text-xl font-bold text-slate-900 dark:text-slate-100'>
                    {project.name}
                  </h3>
                  <span className='text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded'>
                    {project.role}
                  </span>
                </div>

                {/* Project Description */}
                <p className='text-slate-700 dark:text-slate-300 mb-4 leading-relaxed'>
                  {project.description}
                </p>
              </UnstyledLink>
              {/* Project Links */}
              {(project.github) && (
                <UnstyledLink
                  href={project.github}
                  className='inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-300 transition-colors'
                >
                  <SiGithub className='w-4 h-4' aria-hidden='true' />
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
