import Image from 'next/image';
import { FaLinkedin } from 'react-icons/fa';

import UnstyledLink from '@/components/links/UnstyledLink';

import { common, Lang } from '@/i18n';

import config from '/config';

export default function About({
  lang,
  name,
  subhead,
  proofs,
  cta,
  linkedinCta,
}: {
  lang: Lang;
  name: string;
  subhead: string[];
  proofs: string[];
  cta: string;
  linkedinCta: string;
}) {
  return (
    <section className='hero' id='about'>
      <div>
        <h1>{name}</h1>
        <div className='lede'>
          {subhead.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
      <div className='photo'>
        <Image
          src='/images/iurii-avatar.webp'
          alt={common[lang].profilePhoto}
          width={1200}
          height={900}
          priority
        />
      </div>
      <ul className='proofs'>
        {proofs.map((proof) => (
          <li key={proof}>{proof}</li>
        ))}
      </ul>
      <div className='cta'>
        <UnstyledLink className='btn' href={config.LINKED_IN}>
          <FaLinkedin />
          {linkedinCta}
        </UnstyledLink>
        <span className='tag-line'>{cta}</span>
      </div>
    </section>
  );
}
