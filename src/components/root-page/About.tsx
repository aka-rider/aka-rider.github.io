import Image from 'next/image';

import Section from '@/components/Section';

interface AboutProps {
  title: string;
  content: string;
}

export default function About({ title, content }: AboutProps) {
  return (
    <Section id='about' title={title} >
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 items-center'>
        {/* Avatar - 1/3 width */}
        <div className='md:col-span-1 flex justify-center'>
          <div className='relative w-full max-w-xs aspect-[16/10]'>
            <Image
              src='/images/iurii-avatar.webp'
              alt='Profile photo'
              fill
              className='object-cover rounded-lg'
              sizes='(max-width: 768px) 320px, 320px'
              priority
            />
          </div>
        </div>
        {/* Content - 2/3 width */}
        <div className='md:col-span-2'>
          <p className='text-lg leading-relaxed'>{content}</p>
        </div>
      </div>
    </Section>
  );
}
