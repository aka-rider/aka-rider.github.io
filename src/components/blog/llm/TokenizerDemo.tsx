'use client';

import { useState } from 'react';

import { Chip, ChipStream } from '@/components/blog/llm/Chip';
import { EXAMPLE_QUERY } from '@/components/blog/llm/example';
import { fill, SPACE_MARK } from '@/components/blog/llm/format';
import GuessGate from '@/components/blog/llm/GuessGate';
import { tokenizerStrings } from '@/components/blog/llm/strings/tokenizer';

import type { Lang } from '@/i18n';

const RARE_WORD = 'unbelievably';

const PRESET_TEXTS = [EXAMPLE_QUERY, RARE_WORD, 'Чому небо синє?'] as const;

const MERGES: ReadonlyArray<readonly [string, string]> = [
  ['t', 'h'],
  ['h', 'e'],
  ['i', 'n'],
  ['e', 'r'],
  ['a', 'n'],
  ['r', 'e'],
  ['o', 'n'],
  ['a', 't'],
  ['e', 'n'],
  ['u', 'n'],
  ['i', 's'],
  ['a', 'b'],
  ['l', 'y'],
  ['b', 'e'],
  ['l', 'i'],
  ['e', 'v'],
  ['s', 'k'],
  ['b', 'l'],
  ['u', 'e'],
  ['W', 'h'],
  ['Wh', 'y'],
  ['th', 'e'],
  ['sk', 'y'],
  ['bl', 'ue'],
  [SPACE_MARK, 'is'],
  [SPACE_MARK, 'the'],
  [SPACE_MARK, 'sky'],
  [SPACE_MARK, 'blue'],
  [SPACE_MARK, 'a'],
  [SPACE_MARK, 'an'],
  [SPACE_MARK, 'in'],
  [SPACE_MARK, 'on'],
];

const VOCAB_IDS: Readonly<Record<string, number>> = {
  Why: 3923,
  [`${SPACE_MARK}is`]: 374,
  [`${SPACE_MARK}the`]: 279,
  [`${SPACE_MARK}sky`]: 13180,
  [`${SPACE_MARK}blue`]: 6437,
  '?': 30,
  th: 339,
  he: 383,
  in: 258,
  er: 261,
  an: 276,
  re: 265,
  on: 263,
  at: 266,
  en: 268,
  un: 359,
  is: 285,
  ab: 370,
  ly: 398,
  be: 1395,
  li: 747,
  ev: 5230,
  sk: 4991,
  bl: 2436,
  ue: 361,
  Wh: 1671,
  the: 1820,
  sky: 26577,
  blue: 12866,
  [`${SPACE_MARK}a`]: 264,
  [`${SPACE_MARK}an`]: 459,
  [`${SPACE_MARK}in`]: 304,
  [`${SPACE_MARK}on`]: 389,
};

function tokenId(piece: string): number {
  return VOCAB_IDS[piece] ?? piece.codePointAt(0) ?? 0;
}

type MergeRound = { pair: readonly [string, string]; pieces: string[] };

function runBpe(text: string): { initial: string[]; rounds: MergeRound[] } {
  const initial = Array.from(text.replaceAll(' ', SPACE_MARK));
  let pieces = initial;
  const rounds: MergeRound[] = [];
  for (;;) {
    let bestRank = MERGES.length;
    for (let i = 0; i < pieces.length - 1; i++) {
      const rank = MERGES.findIndex(
        ([a, b]) => a === pieces[i] && b === pieces[i + 1],
      );
      if (rank !== -1 && rank < bestRank) bestRank = rank;
    }
    if (bestRank === MERGES.length) break;
    const [a, b] = MERGES[bestRank]!;
    const next: string[] = [];
    for (let i = 0; i < pieces.length; i++) {
      if (pieces[i] === a && pieces[i + 1] === b) {
        next.push(a + b);
        i++;
      } else {
        next.push(pieces[i]!);
      }
    }
    pieces = next;
    rounds.push({ pair: [a, b], pieces });
  }
  return { initial, rounds };
}

const MAX_SHOWN_ROUNDS = 6;

function selectRoundRows(rounds: MergeRound[]): {
  head: MergeRound[];
  hidden: number;
  tail: MergeRound[];
} {
  if (rounds.length <= MAX_SHOWN_ROUNDS)
    return { head: rounds, hidden: 0, tail: [] };
  return {
    head: rounds.slice(0, 3),
    hidden: rounds.length - MAX_SHOWN_ROUNDS,
    tail: rounds.slice(rounds.length - 2),
  };
}

const PRESET_BUTTON_BASE_CLASSES =
  'font-mono text-xs px-2 py-0.5 rounded border whitespace-pre bg-amber-50 dark:bg-amber-950/60 border-amber-700/60 dark:border-amber-400/60 text-amber-700 dark:text-amber-400 cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-700 dark:focus-visible:outline-cyan-400 focus-visible:outline-offset-2';

const ROW_LABEL_CLASSES =
  'font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap';

const PIECE_CLASSES =
  'font-mono text-xs px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 whitespace-pre';

const MERGED_PIECE_CLASSES =
  'font-mono text-xs px-1 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 whitespace-pre';

function PieceRow({
  label,
  pieces,
  highlight,
}: {
  label: string;
  pieces: readonly string[];
  highlight?: string;
}) {
  return (
    <div className='py-1.5'>
      <span className={ROW_LABEL_CLASSES}>{label}</span>
      <div className='flex flex-wrap gap-1 mt-1'>
        {pieces.map((piece, idx) => (
          <span
            key={`${idx}-${piece}`}
            className={
              piece === highlight ? MERGED_PIECE_CLASSES : PIECE_CLASSES
            }
          >
            {piece}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TokenizerDemo({ lang }: { lang: Lang }) {
  const strings = tokenizerStrings[lang];
  const [text, setText] = useState<string>(EXAMPLE_QUERY);

  const { initial, rounds } = runBpe(text);
  const finalPieces =
    rounds.length > 0 ? rounds[rounds.length - 1]!.pieces : initial;
  const { head, hidden, tail } = selectRoundRows(rounds);

  return (
    <div className='rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 my-6'>
      <GuessGate
        lang={lang}
        guess={strings.guess}
        onReveal={() => setText(RARE_WORD)}
      >
        <div
          role='group'
          aria-label={strings.presetsAria}
          className='flex flex-wrap items-center gap-1.5 mb-3'
        >
          {PRESET_TEXTS.map((presetText, i) => (
            <button
              key={presetText}
              type='button'
              aria-pressed={presetText === text}
              onClick={() => setText(presetText)}
              className={`${PRESET_BUTTON_BASE_CLASSES} ${
                presetText === text ? 'border-2 font-semibold' : ''
              }`}
            >
              {strings.presetLabels[i]}
            </button>
          ))}
        </div>
        <label
          htmlFor='tokenizer-demo-input'
          className='block font-mono text-xs text-slate-500 dark:text-slate-400 mb-1'
        >
          {strings.inputLabel}{' '}
          <span className='text-slate-400 dark:text-slate-500'>
            ({strings.inputHint})
          </span>
        </label>
        <input
          id='tokenizer-demo-input'
          type='text'
          value={text}
          maxLength={60}
          aria-label={strings.inputAria}
          onChange={(event) => setText(event.target.value)}
          className='w-full font-mono text-sm rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3 py-1.5 focus-visible:outline-2 focus-visible:outline-cyan-700 dark:focus-visible:outline-cyan-400 focus-visible:outline-offset-2'
        />

        <div className='my-3'>
          <PieceRow label={strings.startRowLabel} pieces={initial} />
          {head.map((round, idx) => (
            <PieceRow
              key={`head-${idx}`}
              label={`${strings.mergeWord} '${round.pair[0]}'+'${round.pair[1]}'`}
              pieces={round.pieces}
              highlight={round.pair[0] + round.pair[1]}
            />
          ))}
          {hidden > 0 ? (
            <div className='py-1.5 font-mono text-xs text-slate-500 dark:text-slate-400'>
              {fill(strings.hiddenRoundsTemplate, { n: String(hidden) })}
            </div>
          ) : null}
          {tail.map((round, idx) => (
            <PieceRow
              key={`tail-${idx}`}
              label={`${strings.mergeWord} '${round.pair[0]}'+'${round.pair[1]}'`}
              pieces={round.pieces}
              highlight={round.pair[0] + round.pair[1]}
            />
          ))}
        </div>

        <span className='block font-mono text-xs text-slate-500 dark:text-slate-400'>
          {strings.finalRowLabel}
        </span>
        <ChipStream ariaLabel={strings.tokenStreamAria} live>
          {finalPieces.map((piece, idx) => (
            <span
              key={`${idx}-${piece}`}
              className='inline-block text-center align-top'
            >
              <Chip variant='tok'>{piece}</Chip>
              <span className='block font-mono text-[0.65rem] text-slate-500 dark:text-slate-400'>
                {tokenId(piece)}
              </span>
            </span>
          ))}
        </ChipStream>

        <div className='font-mono text-xs text-slate-500 dark:text-slate-400 mt-2'>
          {strings.legend}
        </div>

        <div
          aria-live='polite'
          className='font-mono text-sm text-slate-700 dark:text-slate-300 my-3'
        >
          {fill(strings.countTemplate, {
            chars: String(Array.from(text).length),
            tokens: String(finalPieces.length),
          })}
        </div>

        <div className='font-mono text-xs text-slate-500 dark:text-slate-400 border-t border-dashed border-slate-300 dark:border-slate-600 pt-2.5 mt-4'>
          {strings.honesty}
        </div>
      </GuessGate>
    </div>
  );
}
