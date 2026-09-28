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
      'Honesty label: the model’s lines in this walkthrough are scripted. The parsing runs live in your browser right now; the tool itself is a stub that always returns the same fixed hours, not a real opening-hours lookup.',
    badges: { model: 'MODEL', harness: 'HARNESS', tool: 'TOOL' },
    transcript: {
      userQuestion: 'Is the Eiffel Tower open right now?',
      thinking:
        "I don't know today's hours from memory. I have an opening_hours tool; use it instead of guessing.",
      answer: "Yes — it's open now, until 23:45.",
    },
    steps: [
      'The harness serializes your question into the token stream and hands it to the model.',
      'Ordinary tokens. This looks like reasoning because it reads like reasoning — it is still next-token prediction.',
      'These are ORDINARY TOKENS. The model “asked” for nothing — it wrote text of a particular shape.',
      'The parser recognizes the shape, halts sampling, and extracts the argument. This regex ran live just now:',
      'This tool is a stub: it ignores the argument and always returns the same fixed hours. A real harness would call a real opening-hours API here.',
      "The harness appends the stub's result to the context, as ordinary tokens.",
      'The answer is now sitting in its input, so it can “know” it. The model never saw a fact it could trust until the harness handed it one.',
    ],
    guess: {
      question:
        'You ask if the Eiffel Tower is open right now. What does the model do next?',
      options: [
        'answers from memory',
        'writes a tool call',
        'asks permission to check',
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
      'Чесне зізнання: репліки моделі в цьому проході — заскриптовані. Парсинг виконується у вашому браузері просто зараз; сам інструмент — заглушка, яка завжди повертає ті самі фіксовані години, а не справжній пошук режиму роботи.',
    badges: { model: 'МОДЕЛЬ', harness: 'ОБВ’ЯЗКА', tool: 'ІНСТРУМЕНТ' },
    transcript: {
      userQuestion: 'Ейфелева вежа зараз відкрита?',
      thinking:
        'Я не знаю сьогоднішній графік з пам’яті. У мене є інструмент opening_hours; використаю його замість здогадки.',
      answer: 'Так — зараз відкрита, до 23:45.',
    },
    steps: [
      'Обв’язка серіалізує ваше запитання в стрічку токенів і передає моделі.',
      'Звичайні токени. Це виглядає як міркування, бо читається як міркування — але це досі передбачення наступного токена.',
      'Це ЗВИЧАЙНІ ТОКЕНИ. Модель нічого не «просила» — вона написала текст певної форми.',
      'Парсер упізнає форму, зупиняє семплінг і витягує аргумент. Оцей regex щойно виконався наживо:',
      'Цей інструмент — заглушка: він ігнорує аргумент і завжди повертає ті самі фіксовані години. Справжня обв’язка викликала б тут справжній API розкладу роботи.',
      'Обв’язка додає результат заглушки у контекст — звичайними токенами.',
      'Відповідь тепер лежить у вході моделі, тож вона може її «знати». Модель не бачила факту, якому могла б довіряти, доки обв’язка його не дала.',
    ],
    guess: {
      question:
        'Ви питаєте, чи зараз відкрита Ейфелева вежа. Що модель робить далі?',
      options: [
        'відповідає з пам’яті',
        'пише виклик інструмента',
        'просить дозволу перевірити',
      ],
      correctIndex: 1,
      payoff:
        'вона пише текст у формі виклику — а решту робить обв’язка. Пройдіть по кроках.',
    },
  },
} as const;
