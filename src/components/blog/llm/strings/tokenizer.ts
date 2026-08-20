export const tokenizerStrings = {
  en: {
    presetsAria: 'example texts to tokenize',
    presetLabels: ['our question', 'a rare word', 'another alphabet'],
    inputLabel: 'Type any text:',
    inputHint: 'edit it — the merges rerun as you type',
    inputAria: 'Text to tokenize',
    startRowLabel: 'characters',
    mergeWord: 'merge',
    hiddenRoundsTemplate: '… {n} more merge rounds …',
    finalRowLabel: 'tokens',
    tokenStreamAria: 'Resulting tokens with their vocabulary ids',
    legend:
      '␣ = a space glued to the piece after it — that is how real tokenizers carry whitespace',
    countTemplate: '{chars} characters → {tokens} tokens',
    honesty:
      'The BPE merge loop is real and runs in your browser as you type. The vocabulary is a toy of ~32 hand-picked merges; a production tokenizer learns ~100,000 merges from data.',
    guess: {
      question:
        "Before it runs — how many pieces will 'unbelievably' shatter into?",
      options: ['1', '3', '6', '12'],
      correctIndex: 2,
      payoff:
        "actually 6 — rare words don't get their own vocabulary entry, so BPE stitches them from smaller learned pieces.",
    },
  },
  uk: {
    presetsAria: 'приклади текстів для токенізації',
    presetLabels: ['наше запитання', 'рідкісне слово', 'інший алфавіт'],
    inputLabel: 'Введіть будь-який текст:',
    inputHint: 'редагуйте — злиття перезапускаються, поки ви набираєте',
    inputAria: 'Текст для токенізації',
    startRowLabel: 'символи',
    mergeWord: 'злиття',
    hiddenRoundsTemplate: '… ще {n} раундів злиття …',
    finalRowLabel: 'токени',
    tokenStreamAria: 'Отримані токени з їхніми id зі словника',
    legend:
      '␣ = пробіл, приклеєний до шматка після нього — саме так справжні токенізатори переносять пробіли',
    countTemplate: '{chars} символів → {tokens} токенів',
    honesty:
      'Цикл злиттів BPE справжній і виконується у вашому браузері, поки ви набираєте. Словник — іграшковий, ~32 підібрані вручну злиття; продакшн-токенізатор вивчає з даних ~100 000 злиттів.',
    guess: {
      question:
        "перш ніж запуститься — на скільки шматків розлетиться 'unbelievably'?",
      options: ['1', '3', '6', '12'],
      correctIndex: 2,
      payoff:
        'насправді 6 — рідкісні слова не мають власного запису в словнику, тож BPE зшиває їх із менших вивчених шматків.',
    },
  },
} as const;
