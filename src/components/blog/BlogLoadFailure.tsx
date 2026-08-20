import { LoadFailure } from '@/lib/blog/types';

import { common, Lang } from '@/i18n';

export default function BlogLoadFailure({
  node,
  lang,
}: {
  node: LoadFailure;
  lang: Lang;
}) {
  const strings = common[lang];
  const details =
    typeof node.err === 'string'
      ? node.err
      : String(node.err ?? strings.unknownError);

  return (
    <section>
      <div className='mb-8'>
        <h2 className='text-2xl font-bold mb-4 text-red-600 dark:text-red-400'>
          {strings.loadFailureHeading}
        </h2>
      </div>
      <div className='bg-red-50 border border-red-200 rounded-lg p-6 dark:bg-red-950/40 dark:border-red-900'>
        <h3 className='text-red-800 font-semibold mb-2 dark:text-red-200'>
          {strings.loadFailureSubject} {node.filePath}
        </h3>
        <p className='text-red-700 mb-4 dark:text-red-300'>
          {strings.loadFailureExplanation}
        </p>
        <details className='text-sm'>
          <summary className='text-red-600 cursor-pointer font-medium dark:text-red-400'>
            {strings.loadFailureDetails}
          </summary>
          <pre className='mt-2 text-xs text-red-600 bg-red-100 p-2 rounded overflow-auto dark:text-red-300 dark:bg-red-900/40'>
            {details}
          </pre>
        </details>
      </div>
    </section>
  );
}
