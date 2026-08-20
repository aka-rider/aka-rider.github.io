const en = {
  aria: 'Animated loop diagram: the context tokens "Why is the sky blue?" flow into the model f, f produces a probability distribution over next tokens, "Because" is sampled, and an arrow carries it back up into an empty slot at the end of the context — then the whole pass repeats. Below the loop, the finished 12-token answer is shown: "Because sunlight scatters off air molecules, and blue scatters most." followed by a STOP token that ends the loop.',
  contextLabel: 'context',
  modelLabelLines: ['the model —', 'one full pass'],
  distributionLabel: 'p(next token)',
  sampledLabel: 'sampled',
  appendLabel: 'append',
  repeatLabel: 'repeat — one full pass per token',
  afterLabel: 'after 12 laps:',
  stopLabel: 'STOP',
  stopNoteLines: [
    '…until the model emits a stop token —',
    "the loop's exit condition",
  ],
  caption:
    'Twelve laps of this loop produce the twelve-token answer above, then a stop token ends it — a long reply is hundreds of laps, each a fresh run of a stateless function seeing one token more.',
};

const uk = {
  aria: 'Анімована діаграма циклу: токени контексту "Why is the sky blue?" входять у модель f, f видає розподіл імовірностей наступних токенів, витягується "Because", і стрілка повертає його нагору в порожню комірку в кінці контексту — потім увесь прохід повторюється. Під циклом показано готову відповідь із 12 токенів: "Because sunlight scatters off air molecules, and blue scatters most." і токен STOP, який завершує цикл.',
  contextLabel: 'контекст',
  modelLabelLines: ['модель —', 'один повний прохід'],
  distributionLabel: 'p(наступний токен)',
  sampledLabel: 'витягнуто',
  appendLabel: 'додати',
  repeatLabel: 'повтор — один повний прохід на токен',
  afterLabel: 'після 12 кіл:',
  stopLabel: 'STOP',
  stopNoteLines: [
    '…доки модель не видасть стоп-токен —',
    'умову виходу з циклу',
  ],
  caption:
    'Дванадцять кіл цього циклу дають відповідь із дванадцяти токенів вище, потім стоп-токен завершує його — довга відповідь означає сотні кіл, кожне з яких — свіжий запуск функції без стану, що бачить на один токен більше.',
};

export const autoregressiveStrings = {
  en,
  uk,
} as const;
