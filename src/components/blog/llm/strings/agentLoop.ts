export const agentLoopStrings = {
  en: {
    aria: 'The agent loop as a ring of four steps: the model emits text shaped like a tool call, the harness parses it and runs real code, the tool returns a result, and the harness appends that result to the context, which sends the loop back to the model. In the center, a context-window bar fills a little every lap; the segment near the top marks where compaction happens.',
    nodes: {
      model: { title: 'MODEL', sub: ['emits text shaped', 'like a call'] },
      harnessParse: { title: 'HARNESS', sub: ['parses,', 'runs real code'] },
      tool: { title: 'TOOL', sub: ['result'] },
      harnessAppend: {
        title: 'HARNESS',
        sub: ['appends result', 'to context'],
      },
    },
    barFills: ['context fills a', 'little every lap'],
    barCompaction: ['compaction', 'near the top'],
    caption:
      'An agent is this loop, iterated: nothing new was added — the model still only writes text.',
  },
  uk: {
    aria: 'Агентний цикл як кільце з чотирьох кроків: модель видає текст у формі виклику інструмента, обв’язка розбирає його і виконує справжній код, інструмент повертає результат, обв’язка додає цей результат у контекст — і цикл повертається до моделі. У центрі смужка контекстного вікна потроху заповнюється з кожним колом; сегмент біля верху позначає місце ущільнення контексту.',
    nodes: {
      model: { title: 'МОДЕЛЬ', sub: ['видає текст у', 'формі виклику'] },
      harnessParse: {
        title: 'ОБВ’ЯЗКА',
        sub: ['розбирає, виконує', 'справжній код'],
      },
      tool: { title: 'ІНСТРУМЕНТ', sub: ['результат'] },
      harnessAppend: {
        title: 'ОБВ’ЯЗКА',
        sub: ['додає результат', 'у контекст'],
      },
    },
    barFills: ['контекст потроху', 'росте з кожним колом'],
    barCompaction: ['ущільнення', 'біля верху'],
    caption:
      'Агент — це саме цей цикл, повторений багато разів: нічого нового не додалося — модель, як і раніше, тільки пише текст.',
  },
} as const;
