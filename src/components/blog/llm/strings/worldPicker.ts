export const worldPickerStrings = {
  en: {
    framingGroupAria: 'Pick a framing for the same continuation point',
    framings: {
      review: { label: 'markdown code review', text: '## Code review\n' },
      casual: { label: 'casual chat', text: 'yo\n' },
      legal: { label: 'legal contract', text: 'SECTION 12. LIABILITY.\n' },
    },
    continuationLabel: 'fixed continuation point',
    continuation: 'The code ',
    barsLabel: 'p(next token)',
    barsAria: 'Probability bars over five candidate next tokens',
    readout:
      'same weights, same continuation point — the framing alone moved the distribution.',
    honesty:
      'Honesty label: these distributions are illustrative, not measured. The effect itself is real — reproduce it with any base model.',
    guess: {
      question:
        "Under the 'markdown code review' framing, what's the model's top pick after 'The code '?",
      options: ['fails', 'is', 'works', 'shall'],
      correctIndex: 0,
      payoff:
        "actually 'fails' — code reviews are where code goes to be criticized, and the framing alone moved the whole distribution.",
    },
  },
  uk: {
    framingGroupAria: 'Оберіть обрамлення для тієї самої точки продовження',
    framings: {
      review: { label: 'markdown-кодрев’ю', text: '## Code review\n' },
      casual: { label: 'невимушений чат', text: 'yo\n' },
      legal: { label: 'юридичний договір', text: 'SECTION 12. LIABILITY.\n' },
    },
    continuationLabel: 'фіксована точка продовження',
    continuation: 'The code ',
    barsLabel: 'p(наступний токен)',
    barsAria: 'Стовпчики ймовірностей для п’яти кандидатів на наступний токен',
    readout:
      'ті самі ваги, та сама точка продовження — розподіл зрушило саме лише обрамлення.',
    honesty:
      'Чесне зізнання: ці розподіли ілюстративні, не виміряні. Сам ефект справжній — відтворіть його з будь-якою базовою моделлю.',
    guess: {
      question:
        "під обрамленням 'markdown-кодрев’ю' — який топ-вибір моделі після 'The code '?",
      options: ['fails', 'is', 'works', 'shall'],
      correctIndex: 0,
      payoff:
        "насправді 'fails' — кодрев’ю — це місце, де код критикують, і саме лише обрамлення зрушило весь розподіл.",
    },
  },
} as const;
