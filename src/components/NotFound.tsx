import UnstyledLink from '@/components/links/UnstyledLink';
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
        <UnstyledLink className='btn' href={`/${lang}`}>
          {common[lang].returnHome}
        </UnstyledLink>
      </nav>
    </div>
  );
}
