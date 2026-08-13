'use client';

import { useRef, useState } from 'react';

import { Chip, ChipStream, type ChipVariant } from '@/components/blog/llm/Chip';
import { type Lang, toolCallStrings } from '@/components/blog/llm/strings';

type Actor = 'harness' | 'model' | 'tool';

type StepToken = {
  text: string;
  variant: ChipVariant;
  special?: boolean;
  dynamic?: boolean;
};

type Step = {
  actor: Actor;
  tokens: StepToken[];
  kind?: 'parse' | 'run';
};

const STEPS: readonly Step[] = [
  {
    actor: 'harness',
    tokens: [
      { text: '<|user|>', variant: 'harness', special: true },
      { text: 'What is 37 × 89?', variant: 'tok' },
      { text: '<|assistant|>', variant: 'harness', special: true },
    ],
  },
  {
    actor: 'model',
    tokens: [
      { text: '<think>', variant: 'model', special: true },
      {
        text: 'Arithmetic. I have a calculator tool; use it instead of guessing.',
        variant: 'model',
      },
      { text: '</think>', variant: 'model', special: true },
    ],
  },
  {
    actor: 'model',
    tokens: [
      { text: '<tool_call>', variant: 'model', special: true },
      { text: 'calc("37*89")', variant: 'model' },
      { text: '</tool_call>', variant: 'model', special: true },
    ],
  },
  { actor: 'harness', tokens: [], kind: 'parse' },
  { actor: 'tool', tokens: [], kind: 'run' },
  {
    actor: 'harness',
    tokens: [
      { text: '<tool_result>', variant: 'harness', special: true },
      { text: '', variant: 'harness', dynamic: true },
      { text: '</tool_result>', variant: 'harness', special: true },
    ],
  },
  {
    actor: 'model',
    tokens: [
      { text: '37 × 89 = 3,293.', variant: 'model' },
      { text: '<|end|>', variant: 'model', special: true },
    ],
  },
];

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

type Outcome<T> = T | { error: string };

function messageOf(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

function runParse(): Outcome<{ text: string; expr: string }> {
  try {
    const match = CALL_PATTERN.exec(EMITTED);
    if (!match || match[1] === undefined)
      throw new Error('pattern did not match');
    const expr = match[1];
    const text = `${CALL_PATTERN.toString()}\n  .exec('${EMITTED}')[1]\n=> "${expr}"`;
    return { text, expr };
  } catch (err) {
    return { error: messageOf(err) };
  }
}

function runEvaluate(
  expr: string | undefined,
): Outcome<{ text: string; result: number }> {
  try {
    if (expr === undefined) throw new Error('missing parsed expression');
    const result = evaluateExpression(expr);
    return { text: `evaluateExpression("${expr}") = ${result}`, result };
  } catch (err) {
    return { error: messageOf(err) };
  }
}

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

const PRIMARY_BUTTON_CLASSES =
  'font-mono text-sm rounded border border-cyan-700 dark:border-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-cyan-700 dark:focus-visible:outline-cyan-400 focus-visible:outline-offset-2';

const RESET_BUTTON_CLASSES =
  'font-mono text-sm text-slate-500 dark:text-slate-400 underline focus-visible:outline-2 focus-visible:outline-cyan-700 dark:focus-visible:outline-cyan-400 focus-visible:outline-offset-2';

type ToolCallStrings = (typeof toolCallStrings)[Lang];

function StepAnnotation({
  step,
  note,
  strings,
  parseOutcome,
  evalOutcome,
}: {
  step: Step;
  note: string;
  strings: ToolCallStrings;
  parseOutcome: Outcome<{ text: string; expr: string }>;
  evalOutcome: Outcome<{ text: string; result: number }>;
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
        <div className={CODE_BLOCK_CLASSES}>
          {'error' in parseOutcome
            ? `error: ${parseOutcome.error}`
            : parseOutcome.text}
        </div>
      ) : null}
      {step.kind === 'run' ? (
        <div className={CODE_BLOCK_CLASSES}>
          {'error' in evalOutcome
            ? `error: ${evalOutcome.error}`
            : evalOutcome.text}
        </div>
      ) : null}
    </div>
  );
}

export default function ToolCallDemo({ lang = 'en' }: { lang?: Lang }) {
  const strings = toolCallStrings[lang];
  const [i, setI] = useState(-1);
  const stepBtnRef = useRef<HTMLButtonElement | null>(null);
  const resetBtnRef = useRef<HTMLButtonElement | null>(null);

  const parseOutcome = runParse();
  const evalOutcome = runEvaluate(
    'expr' in parseOutcome ? parseOutcome.expr : undefined,
  );
  const dynamicResultText =
    'result' in evalOutcome
      ? String(evalOutcome.result)
      : `error: ${evalOutcome.error}`;

  const isDone = i === STEPS.length - 1;
  const currentStep = i >= 0 ? STEPS[i] : undefined;

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
      <div className='flex flex-wrap items-center gap-3 my-3'>
        <button
          ref={stepBtnRef}
          type='button'
          disabled={isDone}
          onClick={handleStep}
          className={PRIMARY_BUTTON_CLASSES}
        >
          {isDone ? strings.doneBtn : strings.stepBtn}
        </button>
        <button
          ref={resetBtnRef}
          type='button'
          onClick={handleReset}
          className={RESET_BUTTON_CLASSES}
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
          <ChipStream ariaLabel={strings.contextAria}>
            {STEPS.slice(0, i + 1).flatMap((step, stepIndex) =>
              step.tokens.map((token, tokenIndex) => (
                <Chip
                  key={`${stepIndex}-${tokenIndex}`}
                  variant={token.variant}
                  special={token.special}
                >
                  {token.dynamic ? dynamicResultText : token.text}
                </Chip>
              )),
            )}
          </ChipStream>
        </div>

        <div className='min-w-0'>
          <span className={LABEL_CLASSES}>{strings.happenedLabel}</span>
          <div
            aria-live='polite'
            className='min-h-[6rem] rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-3.5 text-sm'
          >
            {currentStep ? (
              <StepAnnotation
                step={currentStep}
                note={strings.steps[i] ?? ''}
                strings={strings}
                parseOutcome={parseOutcome}
                evalOutcome={evalOutcome}
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
    </div>
  );
}
