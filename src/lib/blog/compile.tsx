import { compile, run } from '@mdx-js/mdx';
import type { Toc } from '@stefanprobst/rehype-extract-toc';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { isValidElement, ReactElement } from 'react';
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
import RssPrompt from '@/components/blog/RssPrompt';
import Spoiler from '@/components/blog/Spoiler';
import TLDR from '@/components/blog/TLDR';
import UnstyledLink from '@/components/links/UnstyledLink';

import { common, Lang } from '@/i18n';

import { rehypePlugins, sharedRemarkPlugins } from '/mdx-config';

const TemperatureDemo = dynamic(() => import('@/components/blog/llm/TemperatureDemo'));
const AttentionDemo = dynamic(() => import('@/components/blog/llm/AttentionDemo'));
const ToolCallDemo = dynamic(() => import('@/components/blog/llm/ToolCallDemo'));
const TokenizerDemo = dynamic(() => import('@/components/blog/llm/TokenizerDemo'));
const MatmulFigure = dynamic(() => import('@/components/blog/llm/MatmulFigure'));
const MoERoutingDemo = dynamic(() => import('@/components/blog/llm/MoERoutingDemo'));
const TrainingStepDemo = dynamic(() => import('@/components/blog/llm/TrainingStepDemo'));
const WorldPickerDemo = dynamic(() => import('@/components/blog/llm/WorldPickerDemo'));
const ChatTranscript = dynamic(() => import('@/components/blog/llm/ChatTranscript'));

const ERROR_SOURCE_PREVIEW_LENGTH = 500;

export interface TocItem {
  id: string;
  text: string;
  depth: 2 | 3;
}

function isToc(value: unknown): value is Toc {
  return Array.isArray(value);
}

function flattenToc(entries: Toc): TocItem[] {
  const items: TocItem[] = [];
  for (const entry of entries) {
    if (
      entry.id !== undefined &&
      entry.id !== 'footnote-label' &&
      (entry.depth === 2 || entry.depth === 3)
    ) {
      items.push({ id: entry.id, text: entry.value, depth: entry.depth });
    }
    if (entry.children) {
      items.push(...flattenToc(entry.children));
    }
  }
  return items;
}

function findPreLanguage(children: React.ReactNode): string | undefined {
  for (const child of React.Children.toArray(children)) {
    if (isValidElement<{ 'data-language'?: string }>(child)) {
      const language = child.props['data-language'];
      if (language) return language;
    }
  }
  return undefined;
}

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

function mdxComponents(lang: Lang) {
  return {
    a: (props: React.ComponentProps<'a'>) => {
      const { href, children, ...rest } = props;
      return (
        <UnstyledLink href={href} {...rest}>
          {children}
        </UnstyledLink>
      );
    },
    img: ({ src, alt, width, height }: React.ComponentProps<'img'>) => {
      if (typeof src !== 'string') return null;
      return (
        <Image
          src={src}
          alt={alt ?? common[lang].illustration}
          width={width ? Number(width) : 1920}
          height={height ? Number(height) : 1080}
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
        className='border-b border-rule text-left font-semibold px-3 py-2 align-top'
        {...props}
      />
    ),
    td: (props: React.ComponentProps<'td'>) => (
      <td className='border-b border-rule px-3 py-2 align-top' {...props} />
    ),
    figure: (props: React.ComponentProps<'figure'>) => {
      if (!('data-rehype-pretty-code-figure' in props)) {
        return <figure {...props} />;
      }
      const language = findPreLanguage(props.children);
      return (
        <CodeBlock lang={lang} language={language ?? ''}>
          {props.children}
        </CodeBlock>
      );
    },
    hr: () => (
      <div className='my-16 flex justify-center text-muted select-none' role='separator'>
        <span className='tracking-[0.5em] text-lg'>···</span>
      </div>
    ),
    section: (props: React.ComponentProps<'section'> & { 'data-footnotes'?: boolean }) => {
      if (!('data-footnotes' in props)) return <section {...props} />;
      return (
        <>
          <RssPrompt lang={lang} />
          <section {...props} />
        </>
      );
    },
    ...bindLang(lang),
  };
}

const footnoteDefinitionPattern = /^\[\^[^\]]+\]:/m;

function hasFootnoteDefinitions(source: string): boolean {
  return footnoteDefinitionPattern.test(source);
}

export async function compilePost(
  source: string,
  filePath: string,
  lang: Lang,
): Promise<{ content: ReactElement; toc: TocItem[]; hasFootnotes: boolean }> {
  const isDev = process.env.NODE_ENV === 'development';
  try {
    const compiled = await compile(source, {
      outputFormat: 'function-body',
      development: isDev,
      remarkPlugins: [...sharedRemarkPlugins, remarkReplaceLinks(lang), remarkImagePaths(filePath)],
      rehypePlugins,
      remarkRehypeOptions: {
        footnoteLabel: common[lang].footnotes,
        footnoteLabelProperties: {},
      },
    });

    const mdxModule = await run(compiled, {
      ...(isDev ? devRuntime : runtime),
      baseUrl: import.meta.url,
    });
    const { default: MDXContent, tableOfContents } = mdxModule;
    const toc = isToc(tableOfContents) ? flattenToc(tableOfContents) : [];

    return {
      content: <MDXContent components={mdxComponents(lang)} />,
      toc,
      hasFootnotes: hasFootnoteDefinitions(source),
    };
  } catch (error) {
    console.error('MDX compilation error:', error);
    return {
      content: (
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
      ),
      toc: [],
      hasFootnotes: false,
    };
  }
}
