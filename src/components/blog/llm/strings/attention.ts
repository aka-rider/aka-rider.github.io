export const attentionStrings = {
  en: {
    instruction:
      'Hover or tap it, tired, street, or was. Earlier tokens light up in proportion to hardcoded illustrative attention weights.',
    readoutPlaceholder: 'Hover a dashed token to see its attention weights.',
    attendsMost: 'attends most to (top 3):',
    weightWord: 'weight',
    uniformNote:
      'attends almost uniformly to everything before it (0.125 each) — a filler word has nothing specific to look up.',
    guess: {
      question: "Which single word settles what 'it' refers to?",
      options: ['animal', 'street', 'tired', 'because'],
      correctIndex: 2,
      payoff:
        "'tired' — streets don't get tired; hover 'it' below and watch attention concentrate on 'animal' because of that one word.",
    },
  },
  uk: {
    instruction:
      'Наведіть курсор або торкніться it, tired, street чи was. Попередні токени підсвічуються пропорційно до захардкоджених ілюстративних ваг уваги.',
    readoutPlaceholder:
      'Наведіть на пунктирний токен, щоб побачити його ваги уваги.',
    attendsMost: 'найбільше зважає на (топ-3):',
    weightWord: 'вага',
    uniformNote:
      'зважає майже рівномірно на все попереднє (по 0.125) — службове слово не має чого конкретного шукати.',
    guess: {
      question: 'Яке одне слово вирішує, на що вказує «it»?',
      options: ['animal', 'street', 'tired', 'because'],
      correctIndex: 2,
      payoff:
        '«tired» — вулиці не втомлюються; наведіть на «it» нижче й подивіться, як увага концентрується на «animal» через це одне слово.',
    },
  },
} as const;
