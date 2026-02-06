import Image from 'next/image';

import Section from '@/components/Section';

interface AboutProps {
  title: string;
  items: {
    subhead: string[];
    proofs: string[];
    cta?: string;
  };
}

export default function About({ title, items }: AboutProps) {
  const { subhead, proofs, cta } = items;

  return (
    <Section id='about' title={title}>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
        {/* Image - Mobile First, Desktop Second (Right) */}
        <div className='md:order-2 flex justify-center md:justify-end'>
          <div className='relative w-full aspect-[16/10] max-w-lg shadow-lg'>
            <Image
              src='/images/iurii-avatar.webp'
              alt='Profile photo'
              fill
              className='object-cover rounded-lg'
              sizes='(max-width: 768px) 100vw, 50vw'
              priority
            />
          </div>
        </div>

        {/* Content - Mobile Second, Desktop First (Left) */}
        <div className='md:order-1 flex flex-col gap-6 text-left'>
          <div className='space-y-4 text-base md:text-lg text-gray-600 dark:text-gray-300'>
            {subhead.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Proofs - Flexible Row */}
      <div className='mt-5 md:mt-16 flex flex-col md:flex-row gap-8'>
        {proofs.map((proof, index) => (
          <div key={index} className='flex-1 p-4 border-l-2 border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20'>
            <p className='text-sm leading-relaxed text-gray-500 dark:text-gray-300 font-medium'>
              {proof}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      {cta && (
        <div className='mt-12 text-center'>
          <p className='text-lg md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-600 to-slate-400 dark:from-slate-400 dark:to-slate-200'>
            {cta}
          </p>
        </div>
      )}
    </Section>
  );
}


