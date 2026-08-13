import { compile, run } from '@mdx-js/mdx';
import dynamic from 'next/dynamic';
import React from 'react';
import * as devRuntime from 'react/jsx-dev-runtime';
import * as runtime from 'react/jsx-runtime';

import remarkReplaceLinks from '@/lib/remark-i18n-links';
import remarkImagePaths from '@/lib/remark-image-paths';

import CodeBlock from '@/components/blog/CodeBlock';
import { Chip, ChipStream } from '@/components/blog/llm/Chip';
import LadderDiagram from '@/components/blog/llm/LadderDiagram';
import SequenceDiagram from '@/components/blog/llm/SequenceDiagram';
import Spoiler from '@/components/blog/Spoiler';
import TLDR from '@/components/blog/TLDR';
import PrimaryLink from '@/components/links/PrimaryLink';
import NextImage from '@/components/NextImage';

const TemperatureDemo = dynamic(
  () => import('@/components/blog/llm/TemperatureDemo')
);
const AttentionDemo = dynamic(
  () => import('@/components/blog/llm/AttentionDemo')
);
const ToolCallDemo = dynamic(
  () => import('@/components/blog/llm/ToolCallDemo')
);

import { rehypePlugins, sharedRemarkPlugins } from '/mdx-config';

const mdxComponents = {
  a: (props: React.ComponentProps<'a'>) => (
    <PrimaryLink {...props} />
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
        className={`block w-full h-auto rounded-[16px] overflow-hidden border border-neutral-200 dark:border-neutral-800 my-10 ${className || ''}`}
        imgClassName="w-full h-auto"
        {...props}
      />
    );
  },
  TLDR,
  Spoiler,
  Chip,
  ChipStream,
  TemperatureDemo,
  AttentionDemo,
  ToolCallDemo,
  LadderDiagram,
  SequenceDiagram,
  table: (props: React.ComponentProps<'table'>) => (
    <div className='overflow-x-auto my-6'>
      <table className='w-full border-collapse' {...props} />
    </div>
  ),
  th: (props: React.ComponentProps<'th'>) => (
    <th
      className='border-b border-slate-300 dark:border-slate-600 text-left font-semibold px-3 py-2 align-top'
      {...props}
    />
  ),
  td: (props: React.ComponentProps<'td'>) => (
    <td
      className='border-b border-slate-200 dark:border-slate-700 px-3 py-2 align-top'
      {...props}
    />
  ),
  figure: (props: Record<string, any>) => {
    if ('data-rehype-pretty-code-figure' in props) {
      return <CodeBlock {...props} />;
    }
    return <figure {...props} />;
  },
  hr: () => (
    <div className='my-16 flex justify-center text-slate-300 dark:text-slate-600 select-none' role='separator'>
      <span className='tracking-[0.5em] text-lg'>···</span>
    </div>
  ),
};

interface ServerMDXProps {
  source: string;
  postFilePath: string;
}

export default async function ServerMDX({ source, postFilePath }: ServerMDXProps) {
  const isDev = process.env.NODE_ENV === 'development';
  try {
    const compiled = await compile(source, {
      outputFormat: 'function-body',
      development: isDev,
      remarkPlugins: [
        ...sharedRemarkPlugins,
        remarkReplaceLinks,
        remarkImagePaths(postFilePath),
      ] as any,
      rehypePlugins: rehypePlugins as any,
    });

    const { default: MDXContent } = await run(compiled, {
      ...(isDev ? devRuntime : runtime),
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
