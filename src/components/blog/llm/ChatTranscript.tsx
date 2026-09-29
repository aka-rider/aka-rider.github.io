'use client';

import { useState } from 'react';

import { PANEL_CLASSES, WELL_CLASSES } from '@/components/blog/llm/panel';
import { chatTranscriptStrings } from '@/components/blog/llm/strings/chatTranscript';

import type { Lang } from '@/i18n';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  dim?: boolean;
  thinking?: boolean;
}

type Role = ChatMessage['role'];

const ROLE_TAG_CLASSES: Record<Role, string> = {
  system: 'text-violet-700 dark:text-violet-400',
  user: 'text-amber-700 dark:text-amber-400',
  assistant: 'text-cyan-700 dark:text-cyan-400',
  tool: 'text-muted',
};

const ROLE_BORDER_CLASSES: Record<Role, string> = {
  system: 'border-violet-700/60 dark:border-violet-400/60',
  user: 'border-amber-700/60 dark:border-amber-400/60',
  assistant: 'border-cyan-700/60 dark:border-cyan-400/60',
  tool: 'border-slate-400/70 dark:border-slate-500/70',
};

const TAG_BASE_CLASSES = 'font-mono text-[10px] uppercase tracking-widest';

const THINKING_TAG_CLASSES =
  'inline-block rounded border border-cyan-700/60 dark:border-cyan-400/60 px-1 py-px text-cyan-700 dark:text-cyan-400';

const DIM_BORDER_CLASSES = 'border-rule';

const RAW_MARKER_CLASSES =
  'font-mono text-[0.8em] text-violet-700 dark:text-violet-400';

const RAW_MARKER_DIM_CLASSES = 'font-mono text-[0.8em] text-muted';

const TOGGLE_BUTTON_CLASSES =
  'font-mono text-xs text-violet-700 dark:text-violet-400 underline focus-visible:outline-2 focus-visible:outline-violet-700 dark:focus-visible:outline-violet-400 focus-visible:outline-offset-2';

export function TranscriptMessages({
  lang,
  messages,
  ariaLabel,
  live = false,
}: {
  lang: Lang;
  messages: ChatMessage[];
  ariaLabel?: string;
  live?: boolean;
}) {
  const strings = chatTranscriptStrings[lang];
  return (
    <div
      role='group'
      aria-label={ariaLabel ?? strings.transcriptAria}
      aria-live={live ? 'polite' : undefined}
      className='space-y-5'
    >
      {messages.map((message, idx) => {
        const tagText = message.thinking
          ? strings.roles.thinking
          : strings.roles[message.role];
        return (
          <div
            key={idx}
            className={`border-l-2 pl-3 ${
              message.dim
                ? DIM_BORDER_CLASSES
                : ROLE_BORDER_CLASSES[message.role]
            }`}
          >
            <span className={`${TAG_BASE_CLASSES} block mb-1`}>
              <span
                className={
                  message.dim
                    ? 'text-muted'
                    : message.thinking
                      ? THINKING_TAG_CLASSES
                      : ROLE_TAG_CLASSES[message.role]
                }
              >
                {tagText}
              </span>
              {message.dim ? (
                <span className='ml-1.5 text-muted normal-case tracking-normal'>
                  {strings.resent}
                </span>
              ) : null}
            </span>
            <div
              className={`text-sm leading-relaxed whitespace-pre-wrap ${
                message.dim
                  ? 'text-muted'
                  : 'text-slate-900 dark:text-slate-100'
              } ${message.thinking ? 'italic' : ''}`}
            >
              {message.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RawTranscript({
  lang,
  messages,
}: {
  lang: Lang;
  messages: ChatMessage[];
}) {
  const strings = chatTranscriptStrings[lang];
  return (
    <div
      role='group'
      aria-label={strings.rawAria}
      className={`${WELL_CLASSES} leading-relaxed whitespace-pre-wrap break-words`}
    >
      {messages.map((message, idx) => (
        <span key={idx} className={message.dim ? 'text-muted' : undefined}>
          {idx === 0 || messages[idx - 1]?.role !== message.role ? (
            <span
              className={
                message.dim ? RAW_MARKER_DIM_CLASSES : RAW_MARKER_CLASSES
              }
            >{`<|${message.role}|>`}</span>
          ) : null}
          {message.thinking ? (
            <>
              <span
                className={
                  message.dim ? RAW_MARKER_DIM_CLASSES : RAW_MARKER_CLASSES
                }
              >
                {'<think>'}
              </span>
              {message.content}
              <span
                className={
                  message.dim ? RAW_MARKER_DIM_CLASSES : RAW_MARKER_CLASSES
                }
              >
                {'</think>'}
              </span>
            </>
          ) : (
            message.content
          )}
          {idx < messages.length - 1 ? '\n' : ''}
        </span>
      ))}
    </div>
  );
}

export default function ChatTranscript({
  lang,
  messages,
}: {
  lang: Lang;
  messages: ChatMessage[];
}) {
  const strings = chatTranscriptStrings[lang];
  const [showRaw, setShowRaw] = useState(false);

  return (
    <div className={PANEL_CLASSES}>
      {showRaw ? (
        <RawTranscript lang={lang} messages={messages} />
      ) : (
        <TranscriptMessages lang={lang} messages={messages} />
      )}
      <div className='mt-4'>
        <button
          type='button'
          aria-pressed={showRaw}
          onClick={() => setShowRaw((v) => !v)}
          className={TOGGLE_BUTTON_CLASSES}
        >
          {showRaw ? strings.showReadable : strings.showRaw}
        </button>
      </div>
    </div>
  );
}
