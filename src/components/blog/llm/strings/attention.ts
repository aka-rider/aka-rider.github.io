export const attentionStrings = {
  en: {
    headsLabel: 'Attention head:',
    headsGroupAria: 'choose an illustrative attention head',
    tokensLabel: 'Hover or focus a query token:',
    gridAria:
      'seven by seven grid of attention weights; rows are the querying token, columns are the tokens it can attend to; cells above the diagonal are hollow because a token cannot look ahead',
    readoutPlaceholder:
      'Hover or focus a token above to see its attention weights.',
    attendsMost: 'attends most to (top 3 earlier tokens):',
    weightWord: 'weight',
    selfOnlyNote:
      'is the first token, so it can only attend to itself (weight 1.0).',
    scaleNote:
      'GPT-2 small has 12 heads of 64 dimensions each, in every one of its 12 layers; we show 3 illustrative ones here.',
    heads: {
      nameBuilder: {
        label: 'name builder',
        description:
          "'el' looks back at '␣E' and 'iff' and reassembles the three pieces into the name 'Eiffel'.",
      },
      locate: {
        label: 'what are we locating',
        description:
          "'␣in' looks back at '␣Tower' — carrying forward, to the last position, the location the MLP already recalled there.",
      },
      previousToken: {
        label: 'previous token',
        description:
          'each token attends mostly to the one right before it — simple positional bookkeeping.',
      },
    },
    guess: {
      question:
        "In the 'what are we locating' head, which earlier token does '␣in' attend to most?",
      options: ['The', 'el', '␣Tower', '␣is'],
      correctIndex: 2,
      payoff:
        "'␣Tower' — this head carries the ‘Paris’ direction the MLP wrote there all the way to the last position, where the output layer reads it off.",
    },
  },
  uk: {
    headsLabel: 'Голова уваги:',
    headsGroupAria: 'виберіть ілюстративну голову уваги',
    tokensLabel: 'Наведіть курсор або сфокусуйте токен-запит:',
    gridAria:
      'сітка ваг уваги 7 на 7; рядки — токен-запит, стовпці — токени, на які він може зважати; комірки вище діагоналі порожні, бо токен не може дивитися вперед',
    readoutPlaceholder:
      'Наведіть курсор або сфокусуйте токен вище, щоб побачити його ваги уваги.',
    attendsMost: 'найбільше зважає на (топ-3 попередніх токени):',
    weightWord: 'вага',
    selfOnlyNote: 'перший токен, тож може зважати лише на себе (вага 1.0).',
    scaleNote:
      'GPT-2 small має 12 голів по 64 виміри в кожному зі своїх 12 шарів; тут показано 3 ілюстративні.',
    heads: {
      nameBuilder: {
        label: 'будівник імені',
        description:
          '«el» озирається на «␣E» і «iff» та збирає три частини назад у ім’я «Eiffel».',
      },
      locate: {
        label: 'що ми шукаємо',
        description:
          '«␣in» озирається на «␣Tower» — переносячи на останню позицію те місце, яке MLP вже пригадав там.',
      },
      previousToken: {
        label: 'попередній токен',
        description:
          'кожен токен зважає переважно на той, що прямо перед ним — проста позиційна бухгалтерія.',
      },
    },
    guess: {
      question:
        'У голові «що ми шукаємо» на який попередній токен найбільше зважає «␣in»?',
      options: ['The', 'el', '␣Tower', '␣is'],
      correctIndex: 2,
      payoff:
        '«␣Tower» — ця голова переносить напрямок «Paris», записаний там MLP, аж до останньої позиції, звідки його зчитує вихідний шар.',
    },
  },
} as const;
