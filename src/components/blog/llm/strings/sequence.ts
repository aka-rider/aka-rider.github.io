export const sequenceStrings = {
  en: {
    actors: {
      user: 'User',
      harness: 'Harness',
      model: 'Model f',
      tool: 'Tool',
    },
    arrows: {
      question: 'question',
      contextTokens: 'context tokens',
      emitted1: 'distribution → sampled tokens:',
      emitted2: 'call opening_hours("Eiffel Tower")',
      parse: 'parse',
      execute: 'execute',
      result: 'result: open, 09:30–23:45',
      resultTokens1: 'result tokens',
      resultTokens2: 'appended',
      continuation1: 'continuation:',
      continuation2: 'answer',
    },
    caption:
      'Everything violet is ordinary code you could write this afternoon.',
    aria: 'Sequence diagram: the user asks a question, the harness feeds context tokens to the model, the model emits an opening_hours tool call as tokens, the harness parses and executes it, the result — open, 09:30–23:45 — returns as tokens, and the model continues with the answer.',
  },
  uk: {
    actors: {
      user: 'Користувач',
      harness: 'Обв’язка',
      model: 'Модель f',
      tool: 'Інструмент',
    },
    arrows: {
      question: 'запитання',
      contextTokens: 'токени контексту',
      emitted1: 'розподіл → витягнуті токени:',
      emitted2: 'виклик opening_hours("Eiffel Tower")',
      parse: 'розбір',
      execute: 'виконати',
      result: 'результат: відкрито, 09:30–23:45',
      resultTokens1: 'токени результату',
      resultTokens2: 'додано',
      continuation1: 'продовження:',
      continuation2: 'відповідь',
    },
    caption:
      'Усе фіолетове — звичайний код, який ви могли б написати сьогодні по обіді.',
    aria: 'Діаграма послідовності: користувач ставить запитання, обв’язка подає токени контексту в модель, модель видає виклик інструмента opening_hours токенами, обв’язка розбирає і виконує його, результат — відкрито, 09:30–23:45 — повертається токенами, і модель продовжує відповіддю.',
  },
} as const;
