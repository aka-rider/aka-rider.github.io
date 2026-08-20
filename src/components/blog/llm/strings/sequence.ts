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
      emitted2: 'call calc(37×89)',
      parse: 'parse',
      execute: 'execute',
      result: 'result 3293',
      resultTokens1: 'result tokens',
      resultTokens2: 'appended',
      continuation1: 'continuation:',
      continuation2: 'answer',
    },
    caption:
      'Everything violet is ordinary code you could write this afternoon.',
    aria: 'Sequence diagram: the user asks a question, the harness feeds context tokens to the model, the model emits a calc tool call as tokens, the harness parses and executes it, the result 3293 returns as tokens, and the model continues with the answer.',
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
      emitted2: 'виклик calc(37×89)',
      parse: 'розбір',
      execute: 'виконати',
      result: 'результат 3293',
      resultTokens1: 'токени результату',
      resultTokens2: 'додано',
      continuation1: 'продовження:',
      continuation2: 'відповідь',
    },
    caption:
      'Усе фіолетове — звичайний код, який ви могли б написати сьогодні по обіді.',
    aria: 'Діаграма послідовності: користувач ставить запитання, обв’язка подає токени контексту в модель, модель видає виклик інструмента calc токенами, обв’язка розбирає і виконує його, результат 3293 повертається токенами, і модель продовжує відповіддю.',
  },
} as const;
