const en = {
  sampleLabel: 'training sample',
  targetNote: 'truth from the training text',
  predictionLabel: "model's current prediction",
  targetMarker: '← target',
  lossLabel: 'loss = −log p( blue) =',
  lossAria: 'Current cross-entropy loss',
  barsAria: 'Predicted probability for each candidate next token',
  nudgeBtn: 'take one training step',
  resetBtn: 'reset',
  stepWord: 'step',
  scaleNote: 'now repeat 10¹³ times, once per token of the internet.',
  mechanismNote:
    'Here you nudge the 5 output scores directly; in the real model the nudge lands on the weights upstream — billions of dials — and propagates through the whole stack to move these same bars.',
  honesty:
    'The math of the step — softmax, cross-entropy, gradient — runs on this page as you click; the thing being nudged is simplified from weights to output scores.',
};

const uk = {
  sampleLabel: 'тренувальний приклад',
  targetNote: 'правда з тренувального тексту',
  predictionLabel: 'поточне передбачення моделі',
  targetMarker: '← ціль',
  lossLabel: 'втрата = −log p( blue) =',
  lossAria: 'Поточна крос-ентропійна втрата',
  barsAria: 'Передбачена ймовірність для кожного кандидата на наступний токен',
  nudgeBtn: 'зробити один крок навчання',
  resetBtn: 'скинути',
  stepWord: 'крок',
  scaleNote: 'тепер повторіть 10¹³ разів — по разу на кожен токен інтернету.',
  mechanismNote:
    'Тут ви підштовхуєте 5 вихідних оцінок напряму; у справжній моделі поправка лягає на ваги вище за течією — мільярди ручок — і поширюється крізь увесь стос, щоб зрушити ці самі стовпчики.',
  honesty:
    'Математика кроку — softmax, крос-ентропія, градієнт — виконується на цій сторінці, коли ви клацаєте; спрощено лише те, що підштовхується: вихідні оцінки замість ваг.',
};

export const trainingStepStrings = {
  en,
  uk,
} as const;
