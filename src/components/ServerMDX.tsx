import { compile, run } from '@mdx-js/mdx';
import React from 'react';
import * as runtime from 'react/jsx-runtime';

import remarkReplaceLinks from '@/lib/remark-i18n-links';
import remarkImagePaths from '@/lib/remark-image-paths';

import PrimaryLink from '@/components/links/PrimaryLink';
import NextImage from '@/components/NextImage';
import TLDR from '@/components/TLDR';

import { rehypePlugins, sharedRemarkPlugins } from '/mdx-config';

const mdxComponents = {
  a: (props: React.ComponentProps<'a'>) => (
    <PrimaryLink {...props} openNewTab={true} />
  ),
  img: ({
    src,
    alt,
    width: htmlWidth,
    height: htmlHeight,
    className,
    ...props
  }: React.ComponentProps<'img'>) => {
    // Convert HTML img props to Next.js Image props
    const width = htmlWidth ? Number(htmlWidth) : 1920;
    const height = htmlHeight ? Number(htmlHeight) : 1080;

    // Ensure src is a string for Next.js Image component
    const imageSrc = typeof src === 'string' ? src : '/public/images/blog-generic.webp';

    return (
      <NextImage
        src={imageSrc}
        alt={alt || 'illustration'}
        width={width}
        height={height}
        useSkeleton={true}
        className={`w-full h-auto rounded-lg p-10 ${className || ''}`}
        {...props}
      />
    );
  },
  TLDR,
  hr: () => <hr className='mt-15 mb-10 opacity-30 justify-center' />,
};

interface ServerMDXProps {
  source: string;
  postFilePath: string;
}

export default async function ServerMDX({ source, postFilePath }: ServerMDXProps) {
  try {
    const compiled = await compile(source, {
      outputFormat: 'function-body',
      development: process.env.NODE_ENV === 'development',
      remarkPlugins: [
        ...sharedRemarkPlugins,
        remarkReplaceLinks,
        remarkImagePaths(postFilePath),
      ] as any,
      rehypePlugins: rehypePlugins as any,
    });

    const { default: MDXContent } = await run(compiled, {
      ...runtime,
      baseUrl: import.meta.url,
    });

    return <MDXContent components={mdxComponents} />;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('MDX compilation error:', error);
    return (
      <div className='text-red-500'>
        <h3>MDX Compilation Error</h3>
        <pre className='whitespace-pre-wrap text-sm'>{String(error)}</pre>
        <details className='mt-4'>
          <summary>Source content (first 500 chars)</summary>
          <pre className='text-xs mt-2 whitespace-pre-wrap'>
            {source.slice(0, 500)}...
          </pre>
        </details>
      </div>
    );
  }
}
