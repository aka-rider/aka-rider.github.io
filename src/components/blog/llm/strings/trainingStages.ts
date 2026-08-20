const en = {
  aria: 'Vertical pipeline of three training stages sharing one set of weights. Stage 1: the internet, about 10 trillion tokens, feeds pretraining — the model learns to continue anything; it knows the world and speaks every style, but only continues text. Stage 2: curated dialogues, about 100 thousand, feed SFT — the model learns the assistant format and now answers instead of continuing. Stage 3: preference pairs and a reward model feed RLHF or RLAIF — the model learns taste, whole answers are scored, helpful beats merely plausible. The data shrinks dramatically from stage to stage while the same weights are nudged downward through each stage.',
  stage1Data: 'the internet, ~10 trillion tokens',
  stage1Model: 'pretraining: learn to continue anything',
  stage1Note: [
    'knows the world, speaks every style',
    '— but only continues text',
  ],
  stage2Data: 'curated dialogues, ~100k',
  stage2Model: 'SFT: learn the assistant format',
  stage2Note: ['now answers instead of continuing'],
  stage3Data: 'preference pairs / reward model',
  stage3Model: ['RL(HF/AIF): learn taste', '— whole answers scored'],
  stage3Note: ['helpful > merely plausible'],
  sameWeights: 'same weights, nudged',
  caption:
    'education → apprenticeship → performance review. Same weights throughout — each stage nudges, none replaces.',
};

const uk = {
  aria: 'Вертикальний конвеєр із трьох стадій навчання зі спільним набором ваг. Стадія 1: інтернет, близько 10 трильйонів токенів, іде на претренування — модель вчиться продовжувати будь-що; вона знає світ і володіє кожним стилем, але лише продовжує текст. Стадія 2: підібрані діалоги, близько 100 тисяч, ідуть на SFT — модель вчиться формату асистента й тепер відповідає, а не продовжує. Стадія 3: пари переваг і модель винагороди йдуть на RLHF або RLAIF — модель вчиться смаку, оцінюються цілі відповіді, корисне перемагає просто правдоподібне. Обсяг даних різко зменшується від стадії до стадії, а ті самі ваги підштовхуються далі крізь кожну стадію.',
  stage1Data: 'інтернет, ~10 трильйонів токенів',
  stage1Model: 'претренування: навчитися продовжувати будь-що',
  stage1Note: [
    'знає світ, володіє кожним стилем',
    '— але лише продовжує текст',
  ],
  stage2Data: 'підібрані діалоги, ~100 тис.',
  stage2Model: 'SFT: навчитися формату асистента',
  stage2Note: ['тепер відповідає, а не продовжує'],
  stage3Data: 'пари переваг / модель винагороди',
  stage3Model: ['RL(HF/AIF): навчитися смаку', '— оцінюються цілі відповіді'],
  stage3Note: ['корисне > просто правдоподібне'],
  sameWeights: 'ті самі ваги, з поправками',
  caption:
    'освіта → стажування → атестація. Ваги ті самі наскрізь — кожна стадія підштовхує, жодна не замінює.',
};

export const trainingStagesStrings = {
  en,
  uk,
} as const;
