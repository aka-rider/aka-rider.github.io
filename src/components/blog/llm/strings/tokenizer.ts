export const tokenizerStrings = {
  en: {
    presetsAria: 'phrase presets',
    presetLabels: {
      main: 'the phrase',
      bare: 'bare "Tower"',
      ukrainian: 'the Ukrainian phrase',
    },
    startRoundLabel: 'raw bytes',
    mergeStepTemplate: 'round {round} of {total}',
    mergeExplanation: 'every word merges its best-ranked pair this round',
    prevRound: '‹ back',
    nextRound: 'next ›',
    roundsAria: 'merge-round stepper',
    finalRowLabel: 'final pieces',
    finalAria: 'final pieces with their vocabulary ids',
    legend:
      '␣ marks a piece that starts with a space — that is how GPT-2 carries whitespace inside its vocabulary.',
    countTemplate: '{chars} characters → {pieces} pieces',
    bareTowerLesson:
      'On its own, "Tower" splits into two pieces: {bare1} ({bareId1}) and {bare2} ({bareId2}). Add the leading space back and "{space}" is a single piece: {spaceId}. The vocabulary treats them as entirely different entries.',
    vocabTemplate:
      'The vocabulary is a fixed table of {vocab} entries. Splitting text into pieces is harness code that runs before the model — it is not part of the model itself.',
    guess: {
      question:
        'Before it runs — how many pieces will "The Eiffel Tower is in" split into?',
      options: ['5', '7', '9', '22'],
      correctIndex: 1,
      payoff:
        '7 — common words like "The", "is", and "in" keep their own piece, while the rare name "Eiffel" shatters into " E"+"iff"+"el".',
    },
  },
  uk: {
    presetsAria: 'приклади фраз',
    presetLabels: {
      main: 'фраза',
      bare: 'самотнє "Tower"',
      ukrainian: 'українська фраза',
    },
    startRoundLabel: 'сирі байти',
    mergeStepTemplate: 'раунд {round} з {total}',
    mergeExplanation: 'цього раунду кожне слово зливає свою найкращу пару',
    prevRound: '‹ назад',
    nextRound: 'далі ›',
    roundsAria: 'покроковий показ злиттів',
    finalRowLabel: 'кінцеві шматки',
    finalAria: 'кінцеві шматки з їхніми id зі словника',
    legend:
      '␣ позначає шматок, що починається з пробілу — саме так GPT-2 переносить пробіли всередині свого словника.',
    countTemplate: '{chars} символів → {pieces} шматків',
    bareTowerLesson:
      'Саме по собі "Tower" розпадається на два шматки: {bare1} ({bareId1}) і {bare2} ({bareId2}). Поверніть пробіл на початок — і "{space}" стає одним шматком: {spaceId}. Словник вважає їх зовсім різними записами.',
    vocabTemplate:
      'Словник — це незмінна таблиця з {vocab} записів. Розбиття тексту на шматки — це код обв’язки, що виконується перед моделлю, а не сама модель.',
    guess: {
      question:
        'Перш ніж запуститься — на скільки шматків розпадеться "The Eiffel Tower is in"?',
      options: ['5', '7', '9', '22'],
      correctIndex: 1,
      payoff:
        '7 — звичні слова на кшталт "The", "is" та "in" лишаються цілими шматками, а рідкісне ім’я "Eiffel" розсипається на " E"+"iff"+"el".',
    },
  },
} as const;
