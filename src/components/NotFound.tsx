import Link from 'next/link';

import TypingText from '@/components/TypingText';

import { common, Lang } from '@/i18n';

export default function NotFound({ lang }: { lang: Lang }) {
  return (
    <div className='flex flex-col items-center justify-center h-screen space-y-4'>
      <pre>{`
  /\\_/\\   ?
 ( o.o )
  > ^ <
  `}</pre>
      <br />
      <h1>
        <TypingText text={'404 - ' + common[lang].notFound} />
      </h1>
      <nav>
        <Link className='btn' href='/'>
          {common[lang].returnHome}
        </Link>
      </nav>
    </div>
  );
}
