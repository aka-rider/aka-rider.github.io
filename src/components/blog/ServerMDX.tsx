import { compile, run } from '@mdx-js/mdx';
import dynamic from 'next/dynamic';
import React from 'react';
import * as devRuntime from 'react/jsx-dev-runtime';
import * as runtime from 'react/jsx-runtime';

import remarkReplaceLinks from '@/lib/remark-i18n-links';
import remarkImagePaths from '@/lib/remark-image-paths';

import ActTransition from '@/components/blog/ActTransition';
import CodeBlock from '@/components/blog/CodeBlock';
import AgentLoopFigure from '@/components/blog/llm/AgentLoopFigure';
import AutoregressiveLoop from '@/components/blog/llm/AutoregressiveLoop';
import { Chip, ChipStream } from '@/components/blog/llm/Chip';
import EmbeddingFigure from '@/components/blog/llm/EmbeddingFigure';
import LadderDiagram from '@/components/blog/llm/LadderDiagram';
import SequenceDiagram from '@/components/blog/llm/SequenceDiagram';
import TrainingStagesFigure from '@/components/blog/llm/TrainingStagesFigure';
import TransformerBlockDiagram from '@/components/blog/llm/TransformerBlockDiagram';
import Spoiler from '@/components/blog/Spoiler';
import TLDR from '@/components/blog/TLDR';
import PrimaryLink from '@/components/links/PrimaryLink';
import NextImage from '@/components/NextImage';

import { common, Lang } from '@/i18n';

import config from '../../../config';

const TemperatureDemo = dynamic(
  () => import('@/components/blog/llm/TemperatureDemo'),
);
const AttentionDemo = dynamic(
  () => import('@/components/blog/llm/AttentionDemo'),
);
const ToolCallDemo = dynamic(
  () => import('@/components/blog/llm/ToolCallDemo'),
);
const TokenizerDemo = dynamic(
  () => import('@/components/blog/llm/TokenizerDemo'),
);
const MatmulFigure = dynamic(
  () => import('@/components/blog/llm/MatmulFigure'),
);
const MoERoutingDemo = dynamic(
  () => import('@/components/blog/llm/MoERoutingDemo'),
);
const TrainingStepDemo = dynamic(
  () => import('@/components/blog/llm/TrainingStepDemo'),
);
const WorldPickerDemo = dynamic(
  () => import('@/components/blog/llm/WorldPickerDemo'),
);
const ChatTranscript = dynamic(
  () => import('@/components/blog/llm/ChatTranscript'),
);

import { rehypePlugins, sharedRemarkPlugins } from '/mdx-config';

const DEFAULT_IMAGE_WIDTH = 1920;
const DEFAULT_IMAGE_HEIGHT = 1080;
const ERROR_SOURCE_PREVIEW_LENGTH = 500;

const llmComponents = {
  TemperatureDemo,
  AttentionDemo,
  ToolCallDemo,
  TokenizerDemo,
  MatmulFigure,
  MoERoutingDemo,
  WorldPickerDemo,
  ChatTranscript,
  TrainingStepDemo,
  LadderDiagram,
  SequenceDiagram,
  AgentLoopFigure,
  AutoregressiveLoop,
  EmbeddingFigure,
  TrainingStagesFigure,
  TransformerBlockDiagram,
};

function bindLang(lang: Lang) {
  return Object.fromEntries(
    Object.entries(llmComponents).map(([name, Component]) => [
      name,
      function LangBound(props: Record<string, unknown>) {
        const Bound = Component as React.ComponentType<Record<string, unknown>>;
        return <Bound lang={lang} {...props} />;
      },
    ]),
  );
}

const mdxComponents = (lang: Lang) => ({
  a: (props: React.ComponentProps<'a'>) => <PrimaryLink {...props} />,
  img: ({
    src,
    alt,
    width: htmlWidth,
    height: htmlHeight,
    className,
    ...props
  }: React.ComponentProps<'img'>) => {
    const width = htmlWidth ? Number(htmlWidth) : DEFAULT_IMAGE_WIDTH;
    const height = htmlHeight ? Number(htmlHeight) : DEFAULT_IMAGE_HEIGHT;
    const imageSrc = typeof src === 'string' ? src : config.DEFAULT_POST_IMAGE;

    return (
      <NextImage
        src={imageSrc}
        alt={alt || common[lang].illustration}
        width={width}
        height={height}
        useSkeleton={true}
        className={`block w-full h-auto rounded-[16px] overflow-hidden border border-neutral-200 dark:border-neutral-800 my-10 ${className || ''}`}
        imgClassName='w-full h-auto'
        {...props}
      />
    );
  },
  TLDR,
  Spoiler,
  ActTransition,
  Chip,
  ChipStream,
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
  figure: (props: React.ComponentProps<'figure'>) => {
    if ('data-rehype-pretty-code-figure' in props) {
      return <CodeBlock {...props} lang={lang} />;
    }
    return <figure {...props} />;
  },
  hr: () => (
    <div
      className='my-16 flex justify-center text-slate-300 dark:text-slate-600 select-none'
      role='separator'
    >
      <span className='tracking-[0.5em] text-lg'>···</span>
    </div>
  ),
});

interface ServerMDXProps {
  source: string;
  postFilePath: string;
  lang: Lang;
}

export default async function ServerMDX({
  source,
  postFilePath,
  lang,
}: ServerMDXProps) {
  const isDev = process.env.NODE_ENV === 'development';
  try {
    const compiled = await compile(source, {
      outputFormat: 'function-body',
      development: isDev,
      remarkPlugins: [
        ...sharedRemarkPlugins,
        remarkReplaceLinks(lang),
        remarkImagePaths(postFilePath),
      ] as any,
      rehypePlugins: rehypePlugins as any,
    });

    const { default: MDXContent } = await run(compiled, {
      ...(isDev ? devRuntime : runtime),
      baseUrl: import.meta.url,
    });

    return (
      <MDXContent components={{ ...mdxComponents(lang), ...bindLang(lang) }} />
    );
  } catch (error) {
    console.error('MDX compilation error:', error);
    return (
      <div className='text-red-500'>
        <h3>{common[lang].mdxCompilationError}</h3>
        <pre className='whitespace-pre-wrap text-sm'>{String(error)}</pre>
        <details className='mt-4'>
          <summary>
            {common[lang].mdxSourcePreview} {ERROR_SOURCE_PREVIEW_LENGTH}
          </summary>
          <pre className='text-xs mt-2 whitespace-pre-wrap'>
            {source.slice(0, ERROR_SOURCE_PREVIEW_LENGTH)}...
          </pre>
        </details>
      </div>
    );
  }
}
