import { LoadFailure } from '@/lib/blog/types';

export default function BlogLoadFailure({ node }: { node: LoadFailure }) {
  return (
    <section>
      <div className='mb-8'>
        <h2 className='text-2xl font-bold mb-4 text-red-600'>
          Error Loading Content
        </h2>
      </div>
      <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
        <h3 className='text-red-800 font-semibold mb-2'>
          Failed to load: {node.slug}
        </h3>
        <p className='text-red-700 mb-4'>
          This content could not be loaded due to parsing errors.
        </p>
        <details className='text-sm'>
          <summary className='text-red-600 cursor-pointer font-medium'>
            Show error details
          </summary>
          <pre className='mt-2 text-xs text-red-600 bg-red-100 p-2 rounded overflow-auto'>
            {typeof node.err === 'string'
              ? node.err
              : node.err?.toString() || 'Unknown error'}
          </pre>
        </details>
      </div>
    </section>
  );
}
