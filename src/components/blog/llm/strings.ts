export type Lang = 'en' | 'uk';

export const temperatureStrings = {
  en: {
    promptLabel: 'Prompt fed to f:',
    promptStreamAria: 'Prompt token stream',
    tempLabel: 'Temperature T',
    sampleBtn: 'Sample one token',
    resetBtn: 'reset',
    sampledNote:
      'sampled continuation appended — the bars still score the original 5-token prefix; a real loop would re-run f on the longer prompt after every token.',
    formulaNote:
      'computed live as you move the slider.',
  },
  uk: {
    promptLabel: 'Промпт, поданий в f:',
    promptStreamAria: 'Стрічка токенів промпту',
    tempLabel: 'Температура T',
    sampleBtn: 'Витягнути один токен',
    resetBtn: 'скинути',
    sampledNote:
      'додано витягнуте продовження — стовпчики досі оцінюють початковий префікс із 5 токенів; справжній цикл після кожного токена запускав би f заново, вже на довшому промпті.',
    formulaNote:
      'обчислюється наживо, поки ви рухаєте повзунок.',
  },
} as const;

export const attentionStrings = {
  en: {
    instruction:
      'Hover or tap it, tired, street, or was. Earlier tokens light up in proportion to hardcoded illustrative attention weights.',
    readoutPlaceholder: 'Hover a dashed token to see its attention weights.',
    attendsMost: 'attends most to (top 3):',
    uniformNote:
      'attends almost uniformly to everything before it (0.125 each) — a filler word has nothing specific to look up.',
  },
  uk: {
    instruction:
      'Наведіть курсор або торкніться it, tired, street чи was. Попередні токени підсвічуються пропорційно до захардкоджених ілюстративних ваг уваги.',
    readoutPlaceholder:
      'Наведіть на пунктирний токен, щоб побачити його ваги уваги.',
    attendsMost: 'найбільше зважає на (топ-3):',
    uniformNote:
      'зважає майже рівномірно на все попереднє (по 0.125) — службове слово не має чого конкретного шукати.',
  },
} as const;

export const toolCallStrings = {
  en: {
    stepBtn: 'Step →',
    doneBtn: 'Done',
    resetBtn: 'reset',
    stepWord: 'step',
    contextLabel: 'Context (growing)',
    contextAria: 'Tool-call context token stream',
    happenedLabel: 'What just happened',
    pressStep: 'Press Step to begin.',
    honesty:
      'Honesty label: the model’s lines in this walkthrough are scripted. The parsing and the calculator are real and run live in your browser right now.',
    badges: { model: 'MODEL', harness: 'HARNESS', tool: 'TOOL' },
    steps: [
      'The harness serializes your question into the token stream and hands it to the model.',
      'Ordinary tokens. This looks like reasoning because it reads like reasoning — it is still next-token prediction.',
      'These are ORDINARY TOKENS. The model “asked” for nothing — it wrote text of a particular shape.',
      'The parser recognizes the shape, halts sampling, and extracts the expression. This regex ran live just now:',
      'The page really evaluates 37*89 with the safe arithmetic evaluator on this page — no eval, no Function. This ran on your machine just now.',
      'The harness appends the real result to the context, as ordinary tokens.',
      'The correct number is now sitting in its input, so it can “know” it. The model never saw a number it could trust until the harness handed it one.',
    ],
  },
  uk: {
    stepBtn: 'Крок →',
    doneBtn: 'Готово',
    resetBtn: 'скинути',
    stepWord: 'крок',
    contextLabel: 'Контекст (росте)',
    contextAria: 'Стрічка токенів контексту виклику інструмента',
    happenedLabel: 'Що щойно сталося',
    pressStep: 'Натисніть «Крок», щоб почати.',
    honesty:
      'Чесне зізнання: репліки моделі в цьому проході — заскриптовані. А от парсинг і калькулятор справжні й виконуються у вашому браузері просто зараз.',
    badges: { model: 'МОДЕЛЬ', harness: 'ОБВ’ЯЗКА', tool: 'ІНСТРУМЕНТ' },
    steps: [
      'Обв’язка серіалізує ваше запитання в стрічку токенів і передає моделі.',
      'Звичайні токени. Це виглядає як міркування, бо читається як міркування — але це досі передбачення наступного токена.',
      'Це ЗВИЧАЙНІ ТОКЕНИ. Модель нічого не «просила» — вона написала текст певної форми.',
      'Парсер упізнає форму, зупиняє семплінг і витягує вираз. Оцей regex щойно виконався наживо:',
      'Сторінка справді обчислює 37*89 безпечним арифметичним обчислювачем із цієї ж сторінки — без eval і без Function. Це щойно виконалося на вашій машині.',
      'Обв’язка додає справжній результат у контекст — звичайними токенами.',
      'Правильне число тепер лежить у вході моделі, тож вона може його «знати». Модель не бачила числа, якому могла б довіряти, доки обв’язка його не дала.',
    ],
  },
} as const;

export const ladderStrings = {
  en: {
    rungs: {
      distribution: 'distribution over vocab',
      logits: 'logits',
      blocks: 'stacked transformer blocks (×N)',
      block: 'one block: attention + MLP',
      head: 'attention head: Q·K → weights → V',
      matmuls: 'matrix multiplies',
      floats: 'floats',
    },
    arrows: {
      softmax: 'softmax',
      projected: 'projected to vocab',
      repeated: 'repeated ×N',
      partOf: 'is part of',
      computedBy: 'computed by',
      arrangedInto: 'arranged into',
    },
    annotation: ['you are usually', 'reading the page', 'at THIS rung ↑'],
    caption:
      'Each rung is boring given the rung below it. The interesting emergent fact is that stacking enough boring rungs, trained on enough text, yields the behavior at the top.',
    aria: 'Vertical ladder diagram from floats at the base up to a distribution over the vocabulary at the top; each rung is built from the rung below.',
  },
  uk: {
    rungs: {
      distribution: 'розподіл по словнику',
      logits: 'логіти',
      blocks: 'стос трансформерних блоків (×N)',
      block: 'один блок: увага + MLP',
      head: 'голова уваги: Q·K → ваги → V',
      matmuls: 'матричні множення',
      floats: 'числа з рухомою комою',
    },
    arrows: {
      softmax: 'softmax',
      projected: 'проєкція на словник',
      repeated: 'повторено ×N',
      partOf: 'частина',
      computedBy: 'обчислюється через',
      arrangedInto: 'зібрані в',
    },
    annotation: ['зазвичай ви читаєте', 'сторінку на', 'ЦЬОМУ щаблі ↑'],
    caption:
      'Кожен щабель нудний, якщо дивитися зі щабля під ним. Цікавий емерджентний факт: стос достатньої кількості нудних щаблів, навчений на достатній кількості тексту, дає поведінку нагорі.',
    aria: 'Вертикальна діаграма-драбина: від чисел з рухомою комою внизу до розподілу по словнику нагорі; кожен щабель побудований зі щабля під ним.',
  },
} as const;

export const sequenceStrings = {
  en: {
    actors: { user: 'User', harness: 'Harness', model: 'Model f', tool: 'Tool' },
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
    caption: 'Everything violet is ordinary code you could write this afternoon.',
    aria: 'Sequence diagram: the user asks a question, the harness feeds context tokens to the model, the model emits a calc tool call as tokens, the harness parses and executes it, the result 3293 returns as tokens, and the model continues with the answer.',
  },
  uk: {
    actors: { user: 'Користувач', harness: 'Обв’язка', model: 'Модель f', tool: 'Інструмент' },
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
    caption: 'Усе фіолетове — звичайний код, який ви могли б написати сьогодні по обіді.',
    aria: 'Діаграма послідовності: користувач ставить запитання, обв’язка подає токени контексту в модель, модель видає виклик інструмента calc токенами, обв’язка розбирає і виконує його, результат 3293 повертається токенами, і модель продовжує відповіддю.',
  },
} as const;
