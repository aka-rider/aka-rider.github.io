export const toolCallStrings = {
  en: {
    stepBtn: 'Step →',
    doneBtn: 'Done',
    resetBtn: 'reset',
    stepWord: 'step',
    contextLabel: 'Context (growing)',
    contextAria: 'Tool-call transcript, growing as steps run',
    happenedLabel: 'What just happened',
    pressStep: 'Press Step to begin.',
    honesty:
      'Honesty label: the model’s lines in this walkthrough are scripted. The parsing and the calculator are real and run live in your browser right now.',
    badges: { model: 'MODEL', harness: 'HARNESS', tool: 'TOOL' },
    transcript: {
      userQuestion: 'What is 37 × 89?',
      thinking:
        'Arithmetic. I have a calculator tool; use it instead of guessing.',
      answer: '37 × 89 = 3,293.',
    },
    steps: [
      'The harness serializes your question into the token stream and hands it to the model.',
      'Ordinary tokens. This looks like reasoning because it reads like reasoning — it is still next-token prediction.',
      'These are ORDINARY TOKENS. The model “asked” for nothing — it wrote text of a particular shape.',
      'The parser recognizes the shape, halts sampling, and extracts the expression. This regex ran live just now:',
      'The page really evaluates 37*89 with the safe arithmetic evaluator on this page — no eval, no Function. This ran on your machine just now.',
      'The harness appends the real result to the context, as ordinary tokens.',
      'The correct number is now sitting in its input, so it can “know” it. The model never saw a number it could trust until the harness handed it one.',
    ],
    guess: {
      question: 'You ask 37 × 89. What does the model do next?',
      options: [
        'answers from memory',
        'writes a tool call',
        'asks permission to compute',
      ],
      correctIndex: 1,
      payoff:
        'it writes text shaped like a call — and the harness does the rest. Step through it.',
    },
  },
  uk: {
    stepBtn: 'Крок →',
    doneBtn: 'Готово',
    resetBtn: 'скинути',
    stepWord: 'крок',
    contextLabel: 'Контекст (росте)',
    contextAria: 'Стенограма виклику інструмента, росте з кожним кроком',
    happenedLabel: 'Що щойно сталося',
    pressStep: 'Натисніть «Крок», щоб почати.',
    honesty:
      'Чесне зізнання: репліки моделі в цьому проході — заскриптовані. А от парсинг і калькулятор справжні й виконуються у вашому браузері просто зараз.',
    badges: { model: 'МОДЕЛЬ', harness: 'ОБВ’ЯЗКА', tool: 'ІНСТРУМЕНТ' },
    transcript: {
      userQuestion: 'What is 37 × 89?',
      thinking:
        'Arithmetic. I have a calculator tool; use it instead of guessing.',
      answer: '37 × 89 = 3,293.',
    },
    steps: [
      'Обв’язка серіалізує ваше запитання в стрічку токенів і передає моделі.',
      'Звичайні токени. Це виглядає як міркування, бо читається як міркування — але це досі передбачення наступного токена.',
      'Це ЗВИЧАЙНІ ТОКЕНИ. Модель нічого не «просила» — вона написала текст певної форми.',
      'Парсер упізнає форму, зупиняє семплінг і витягує вираз. Оцей regex щойно виконався наживо:',
      'Сторінка справді обчислює 37*89 власним безпечним арифметичним обчислювачем — без eval і без Function. Це щойно виконалося на вашій машині.',
      'Обв’язка додає справжній результат у контекст — звичайними токенами.',
      'Правильне число тепер лежить у вході моделі, тож вона може його «знати». Модель не бачила числа, якому могла б довіряти, доки обв’язка його не дала.',
    ],
    guess: {
      question: 'Ви питаєте 37 × 89. Що модель робить далі?',
      options: [
        'відповідає з пам’яті',
        'пише виклик інструмента',
        'просить дозволу порахувати',
      ],
      correctIndex: 1,
      payoff:
        'вона пише текст у формі виклику — а решту робить обв’язка. Пройдіть по кроках.',
    },
  },
} as const;
