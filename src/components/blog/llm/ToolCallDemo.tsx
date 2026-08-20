'use client';

import { useRef, useState } from 'react';

import {
  PRIMARY_BUTTON_CLASSES,
  RESET_BUTTON_CLASSES,
} from '@/components/blog/llm/buttons';
import {
  type ChatMessage,
  TranscriptMessages,
} from '@/components/blog/llm/ChatTranscript';
import GuessGate from '@/components/blog/llm/GuessGate';
import { toolCallStrings } from '@/components/blog/llm/strings/toolCall';

import type { Lang } from '@/i18n';

type Actor = 'harness' | 'model' | 'tool';

type ToolCallStrings = (typeof toolCallStrings)[Lang];

type Transcript = ToolCallStrings['transcript'];

type StepMessage = {
  role: ChatMessage['role'];
  thinking?: boolean;
  content: (transcript: Transcript) => string;
};

type Step = {
  actor: Actor;
  message?: StepMessage;
  kind?: 'parse' | 'run';
};

const EMITTED = '<tool_call>calc("37*89")</tool_call>';
const CALL_PATTERN = /calc\("([0-9+\-*/().]+)"\)/;

function evaluateExpression(input: string): number {
  const expr = input.replace(/\s+/g, '');
  if (!/^[0-9.+\-*/()]+$/.test(expr)) throw new Error('invalid characters');
  let pos = 0;
  const peek = (): string | undefined => expr[pos];
  const parseNumber = (): number => {
    const start = pos;
    while (pos < expr.length && /[0-9.]/.test(expr[pos] ?? '')) pos++;
    if (pos === start) throw new Error('expected number');
    const slice = expr.slice(start, pos);
    if (!/^(\d+\.?\d*|\.\d+)$/.test(slice)) throw new Error('malformed number');
    return parseFloat(slice);
  };
  const parseFactor = (): number => {
    if (peek() === '(') {
      pos++;
      const v = parseExpr();
      if (peek() !== ')') throw new Error('expected )');
      pos++;
      return v;
    }
    if (peek() === '-') {
      pos++;
      return -parseFactor();
    }
    return parseNumber();
  };
  const parseTerm = (): number => {
    let v = parseFactor();
    while (peek() === '*' || peek() === '/') {
      const op = peek();
      pos++;
      v = op === '*' ? v * parseFactor() : v / parseFactor();
    }
    return v;
  };
  const parseExpr = (): number => {
    let v = parseTerm();
    while (peek() === '+' || peek() === '-') {
      const op = peek();
      pos++;
      v = op === '+' ? v + parseTerm() : v - parseTerm();
    }
    return v;
  };
  const result = parseExpr();
  if (pos !== expr.length) throw new Error('unexpected trailing input');
  if (!isFinite(result)) throw new Error('not a finite result');
  return result;
}

function parseEmittedCall(emitted: string): string {
  const expr = CALL_PATTERN.exec(emitted)?.[1];
  if (expr === undefined)
    throw new Error(`ToolCallDemo: no calc call found in ${emitted}`);
  return expr;
}

const PARSED_EXPRESSION = parseEmittedCall(EMITTED);

const PARSE_TEXT = `${CALL_PATTERN.toString()}\n  .exec('${EMITTED}')[1]\n=> "${PARSED_EXPRESSION}"`;

const EVALUATED_RESULT = evaluateExpression(PARSED_EXPRESSION);

const EVALUATE_TEXT = `evaluateExpression("${PARSED_EXPRESSION}") = ${EVALUATED_RESULT}`;

type PerStep<T> = readonly [T, T, T, T, T, T, T];

const STEPS: PerStep<Step> = [
  {
    actor: 'harness',
    message: { role: 'user', content: (t: Transcript) => t.userQuestion },
  },
  {
    actor: 'model',
    message: {
      role: 'assistant',
      thinking: true,
      content: (t: Transcript) => t.thinking,
    },
  },
  {
    actor: 'model',
    message: { role: 'assistant', content: () => EMITTED },
  },
  { actor: 'harness', kind: 'parse' },
  { actor: 'tool', kind: 'run' },
  {
    actor: 'harness',
    message: { role: 'tool', content: () => String(EVALUATED_RESULT) },
  },
  {
    actor: 'model',
    message: { role: 'assistant', content: (t: Transcript) => t.answer },
  },
];

type StepNotes = PerStep<string>;

const BADGE_BASE_CLASSES =
  'inline-block font-mono text-xs font-bold tracking-wide px-2 py-0.5 rounded mr-2';

const BADGE_VARIANT_CLASSES: Record<Actor, string> = {
  model: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400',
  harness:
    'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-400',
  tool: 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100',
};

const CODE_BLOCK_CLASSES =
  'block mt-2 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-pre font-mono';

const LABEL_CLASSES =
  'block font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1';

function StepAnnotation({
  step,
  note,
  strings,
}: {
  step: Step;
  note: string;
  strings: ToolCallStrings;
}) {
  return (
    <div>
      <span
        className={`${BADGE_BASE_CLASSES} ${BADGE_VARIANT_CLASSES[step.actor]}`}
      >
        {strings.badges[step.actor]}
      </span>
      <span>{note}</span>
      {step.kind === 'parse' ? (
        <div className={CODE_BLOCK_CLASSES}>{PARSE_TEXT}</div>
      ) : null}
      {step.kind === 'run' ? (
        <div className={CODE_BLOCK_CLASSES}>{EVALUATE_TEXT}</div>
      ) : null}
    </div>
  );
}

export default function ToolCallDemo({ lang }: { lang: Lang }) {
  const strings = toolCallStrings[lang];
  const notes: StepNotes = strings.steps;
  const [i, setI] = useState(-1);
  const stepBtnRef = useRef<HTMLButtonElement | null>(null);
  const resetBtnRef = useRef<HTMLButtonElement | null>(null);

  const visibleMessages: ChatMessage[] = STEPS.slice(0, i + 1).flatMap(
    (step) =>
      step.message
        ? [
            {
              role: step.message.role,
              thinking: step.message.thinking,
              content: step.message.content(strings.transcript),
            },
          ]
        : [],
  );

  const isDone = i === STEPS.length - 1;
  const current = i >= 0 ? { step: STEPS[i]!, note: notes[i]! } : undefined;

  function handleStep() {
    if (i >= STEPS.length - 1) return;
    const next = i + 1;
    setI(next);
    if (
      next === STEPS.length - 1 &&
      document.activeElement === stepBtnRef.current
    ) {
      resetBtnRef.current?.focus();
    }
  }

  function handleReset() {
    setI(-1);
  }

  return (
    <div className='rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 my-6'>
      <GuessGate lang={lang} guess={strings.guess}>
        <div className='flex flex-wrap items-center gap-3 my-3'>
          <button
            ref={stepBtnRef}
            type='button'
            disabled={isDone}
            onClick={handleStep}
            className={PRIMARY_BUTTON_CLASSES.cyan}
          >
            {isDone ? strings.doneBtn : strings.stepBtn}
          </button>
          <button
            ref={resetBtnRef}
            type='button'
            onClick={handleReset}
            className={RESET_BUTTON_CLASSES.cyan}
          >
            {strings.resetBtn}
          </button>
          <span className='font-mono text-sm text-slate-500 dark:text-slate-400'>
            {i >= 0 ? `${strings.stepWord} ${i + 1} / ${STEPS.length}` : ''}
          </span>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-[1.3fr_1fr] gap-4'>
          <div className='min-w-0'>
            <span className={LABEL_CLASSES}>{strings.contextLabel}</span>
            <div className='min-h-[6rem] rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-3.5'>
              <TranscriptMessages
                lang={lang}
                messages={visibleMessages}
                ariaLabel={strings.contextAria}
                live
              />
            </div>
          </div>

          <div className='min-w-0'>
            <span className={LABEL_CLASSES}>{strings.happenedLabel}</span>
            <div
              aria-live='polite'
              className='min-h-[6rem] rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-3.5 text-sm'
            >
              {current ? (
                <StepAnnotation
                  step={current.step}
                  note={current.note}
                  strings={strings}
                />
              ) : (
                strings.pressStep
              )}
            </div>
          </div>
        </div>

        <div className='font-mono text-xs text-slate-500 dark:text-slate-400 border-t border-dashed border-slate-300 dark:border-slate-600 pt-2.5 mt-4'>
          {strings.honesty}
        </div>
      </GuessGate>
    </div>
  );
}
