'use client';

import { useState } from 'react';

import {
  Chip,
  CHIP_INTERACTIVE_CLASSES,
  CHIP_SELECTED_CLASSES,
  chipClasses,
  type ChipVariant,
} from '@/components/blog/llm/Chip';
import { fill, visibleSpaces } from '@/components/blog/llm/format';
import GuessGate from '@/components/blog/llm/GuessGate';
import { tokenizerStrings } from '@/components/blog/llm/strings/tokenizer';
import {
  BARE_TOWER_PRESET,
  MAIN_PRESET,
  SPACE_TOWER_PRESET,
  type TokenizerPreset,
  type TokenPiece,
  UKRAINIAN_PRESET,
  VOCAB_SIZE,
} from '@/components/blog/llm/tokenizerPresets';

import type { Lang } from '@/i18n';

type PresetKey = 'main' | 'bare' | 'ukrainian';

const PRESET_KEYS: readonly PresetKey[] = ['main', 'bare', 'ukrainian'];

const PRESETS: Record<PresetKey, TokenizerPreset> = {
  main: MAIN_PRESET,
  bare: BARE_TOWER_PRESET,
  ukrainian: UKRAINIAN_PRESET,
};

function pieceLabel(piece: TokenPiece): string {
  return piece.text === null ? piece.hex : visibleSpaces(piece.text);
}

function pieceVariant(piece: TokenPiece): ChipVariant {
  return piece.text === null ? 'plain' : 'tok';
}

function mergedIndices(
  rounds: readonly (readonly TokenPiece[])[],
  roundIndex: number,
): ReadonlySet<number> {
  if (roundIndex === 0) return new Set();
  const previous = rounds[roundIndex - 1]!;
  const current = rounds[roundIndex]!;
  const merged = new Set<number>();
  let p = 0;
  for (let c = 0; c < current.length; c++) {
    const currentPiece = current[c]!;
    const prevPiece = previous[p];
    if (prevPiece === undefined) {
      throw new Error(
        `mergedIndices: round ${roundIndex} ran past round ${roundIndex - 1}`,
      );
    }
    if (prevPiece.hex === currentPiece.hex) {
      p += 1;
      continue;
    }
    const nextPrevPiece = previous[p + 1];
    if (
      nextPrevPiece === undefined ||
      currentPiece.hex !== `${prevPiece.hex} ${nextPrevPiece.hex}`
    ) {
      throw new Error(
        `mergedIndices: piece ${c} in round ${roundIndex} does not align with round ${roundIndex - 1}`,
      );
    }
    merged.add(c);
    p += 2;
  }
  return merged;
}

function vocabLabel(lang: Lang): string {
  const grouped = VOCAB_SIZE.toLocaleString('en-US');
  return lang === 'uk' ? grouped.replaceAll(',', ' ') : grouped;
}

const PRESET_BUTTON_CLASSES = chipClasses('tok', CHIP_INTERACTIVE_CLASSES);

const STEP_BUTTON_CLASSES = chipClasses(
  'plain',
  CHIP_INTERACTIVE_CLASSES,
  'disabled:cursor-default disabled:opacity-40',
);

const ROW_LABEL_CLASSES =
  'font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap';

const MUTED_TEXT_CLASSES =
  'font-mono text-xs text-slate-500 dark:text-slate-400';

export default function TokenizerDemo({ lang }: { lang: Lang }) {
  const strings = tokenizerStrings[lang];
  const [presetKey, setPresetKey] = useState<PresetKey>('main');
  const [roundIndex, setRoundIndex] = useState(0);

  const preset = PRESETS[presetKey];
  const roundsCount = preset.rounds.length;
  const currentRound = preset.rounds[roundIndex]!;
  const merged = mergedIndices(preset.rounds, roundIndex);

  const selectPreset = (key: PresetKey) => {
    setPresetKey(key);
    setRoundIndex(0);
  };

  const roundLabel =
    roundIndex === 0
      ? strings.startRoundLabel
      : fill(strings.mergeStepTemplate, {
          round: String(roundIndex),
          total: String(roundsCount - 1),
        });

  return (
    <div className='rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 my-6'>
      <GuessGate lang={lang} guess={strings.guess}>
        <div
          role='group'
          aria-label={strings.presetsAria}
          className='flex flex-wrap items-center gap-1.5 mb-3'
        >
          {PRESET_KEYS.map((key) => (
            <button
              key={key}
              type='button'
              aria-pressed={key === presetKey}
              onClick={() => selectPreset(key)}
              className={`${PRESET_BUTTON_CLASSES} ${
                key === presetKey ? CHIP_SELECTED_CLASSES : ''
              }`}
            >
              {strings.presetLabels[key]}
            </button>
          ))}
        </div>

        <div className='font-mono text-sm text-slate-700 dark:text-slate-300 mb-3'>
          {visibleSpaces(preset.text)}
        </div>

        <div className='my-3'>
          <div className='flex items-center gap-2 mb-1.5'>
            <button
              type='button'
              disabled={roundIndex === 0}
              onClick={() => setRoundIndex((i) => i - 1)}
              className={STEP_BUTTON_CLASSES}
            >
              {strings.prevRound}
            </button>
            <span className={ROW_LABEL_CLASSES}>{roundLabel}</span>
            <button
              type='button'
              disabled={roundIndex === roundsCount - 1}
              onClick={() => setRoundIndex((i) => i + 1)}
              className={STEP_BUTTON_CLASSES}
            >
              {strings.nextRound}
            </button>
          </div>
          <div
            role='group'
            aria-label={strings.roundsAria}
            aria-live='polite'
            className='flex flex-wrap gap-1'
          >
            {currentRound.map((piece, i) => (
              <Chip
                key={`${i}-${piece.id}`}
                variant={pieceVariant(piece)}
                special={merged.has(i)}
              >
                {pieceLabel(piece)}
              </Chip>
            ))}
          </div>
          {roundIndex > 0 ? (
            <div className={`${MUTED_TEXT_CLASSES} mt-1.5`}>
              {strings.mergeExplanation}
            </div>
          ) : null}
        </div>

        <span className={`block ${ROW_LABEL_CLASSES}`}>
          {strings.finalRowLabel}
        </span>
        <div
          role='group'
          aria-label={strings.finalAria}
          aria-live='polite'
          className='flex flex-wrap gap-1.5 my-2'
        >
          {preset.pieces.map((piece, i) => (
            <span
              key={`${i}-${piece.id}`}
              className='inline-flex flex-col items-center gap-0.5'
            >
              <Chip variant={pieceVariant(piece)}>{pieceLabel(piece)}</Chip>
              <span className='font-mono text-[0.65rem] text-slate-500 dark:text-slate-400'>
                {piece.id}
              </span>
            </span>
          ))}
        </div>

        {presetKey === 'bare' ? (
          <div className='font-mono text-xs text-slate-600 dark:text-slate-300 my-3'>
            {fill(strings.bareTowerLesson, {
              bare1: pieceLabel(BARE_TOWER_PRESET.pieces[0]!),
              bareId1: String(BARE_TOWER_PRESET.pieces[0]!.id),
              bare2: pieceLabel(BARE_TOWER_PRESET.pieces[1]!),
              bareId2: String(BARE_TOWER_PRESET.pieces[1]!.id),
              space: pieceLabel(SPACE_TOWER_PRESET.pieces[0]!),
              spaceId: String(SPACE_TOWER_PRESET.pieces[0]!.id),
            })}
          </div>
        ) : null}

        <div className={MUTED_TEXT_CLASSES}>{strings.legend}</div>

        <div
          aria-live='polite'
          className='font-mono text-sm text-slate-700 dark:text-slate-300 my-3'
        >
          {fill(strings.countTemplate, {
            chars: String(Array.from(preset.text).length),
            pieces: String(preset.pieces.length),
          })}
        </div>

        <div
          className={`${MUTED_TEXT_CLASSES} border-t border-dashed border-slate-300 dark:border-slate-600 pt-2.5 mt-4`}
        >
          {fill(strings.vocabTemplate, { vocab: vocabLabel(lang) })}
        </div>
      </GuessGate>
    </div>
  );
}
