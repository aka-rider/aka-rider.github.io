import Image from 'next/image';
import { SiLinkedin } from 'react-icons/si';

import UnstyledLink from '@/components/links/UnstyledLink';
import Section from '@/components/Section';

import { common, Lang } from '@/i18n';
import { AboutContent } from '@/i18n/root-page/about';

import { LINKED_IN } from '/config';

interface AboutProps {
  lang: Lang;
  title: string;
  items: AboutContent['items'];
}

export default function About({ lang, title, items }: AboutProps) {
  const { subhead, proofs, cta, linkedinCta } = items;

  return (
    <Section id='about' title={title}>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
        <div className='md:order-2 flex justify-center md:justify-end'>
          <div className='relative w-full aspect-[16/10] max-w-lg shadow-lg'>
            <Image
              src='/images/iurii-avatar.webp'
              alt={common[lang].profilePhoto}
              fill
              className='object-cover rounded-lg'
              sizes='(max-width: 768px) 100vw, 50vw'
              priority
              fetchPriority='high'
            />
          </div>
        </div>
        <div className='md:order-1 flex flex-col gap-6 text-left'>
          <div className='space-y-4 text-base md:text-lg text-gray-600 dark:text-gray-300'>
            {subhead.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-8 md:gap-16 mt-8 md:mt-16'>
        <ul className='list-disc list-inside space-y-3 text-base md:text-lg text-gray-700 dark:text-gray-300'>
          {proofs.map((proof, index) => (
            <li key={index}>{proof}</li>
          ))}
        </ul>
        <div className='flex flex-col items-center gap-6'>
          <UnstyledLink
            href={LINKED_IN}
            className='inline-flex items-center gap-2 px-5 py-2.5 bg-[#0077b5] text-white rounded-lg hover:bg-[#006097] transition-colors font-medium text-sm md:text-base w-fit'
          >
            <SiLinkedin className='w-5 h-5' />
            <span>{linkedinCta}</span>
          </UnstyledLink>

          <p className='text-lg md:text-2xl font-bold text-slate-700 dark:text-slate-300 text-center'>
            {cta}
          </p>
        </div>
      </div>
    </Section>
  );
}
