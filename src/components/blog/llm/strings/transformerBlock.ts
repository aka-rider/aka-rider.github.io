export const transformerBlockStrings = {
  en: {
    aria: 'One transformer block: a thick vertical residual stream carries token vectors, shaped 7 by 768, from top to bottom; a LayerNorm feeds multi-head attention, which moves information between positions and merges back into the stream as a residual connection; a second LayerNorm feeds the MLP, which transforms each position in place and merges back as a second residual connection; GPT-2 small repeats this whole block 12 times, shown as a stack of ghost outlines receding into the distance with the stream running through every one; larger frontier models stack more, and wider, blocks',
    entry: 'token vectors in — (7, 768)',
    exit: 'refined vectors out — (7, 768)',
    stream: 'residual stream',
    attnLines: ['attention', 'moves information', 'BETWEEN positions'],
    mlpLines: [
      'MLP',
      'transforms it IN PLACE:',
      'columns of detectors',
      '(the matmul above)',
    ],
    layers: '×12 layers — GPT-2 small',
    frontierNote:
      'Frontier models often stack far more of these blocks, and wider ones.',
    caption:
      'LayerNorm, then attention or MLP, then a residual add: the stream is a shared workspace every layer reads and writes without ever fully overwriting it.',
  },
  uk: {
    aria: 'Один трансформерний блок: товстий вертикальний резидуальний потік несе вектори токенів форми 7 на 768 згори донизу; LayerNorm подає дані в багатоголову увагу, яка переносить інформацію між позиціями і вливається назад у потік як резидуальне з’єднання; другий LayerNorm подає дані в MLP, який перетворює кожну позицію на місці і теж вливається назад як друге резидуальне з’єднання; GPT-2 small повторює весь цей блок 12 разів, показаних як стос примарних контурів, що віддаляються вглиб, і потік проходить крізь кожен із них; більші передові моделі складають більше, і ширших, блоків',
    entry: 'вектори токенів на вході — (7, 768)',
    exit: 'уточнені вектори на виході — (7, 768)',
    stream: 'резидуальний потік',
    attnLines: ['увага', 'переносить інформацію', 'МІЖ позиціями'],
    mlpLines: [
      'MLP',
      'перетворює НА МІСЦІ:',
      'стовпці детекторів',
      '(матричне множення вище)',
    ],
    layers: '×12 шарів — GPT-2 small',
    frontierNote:
      'Передові моделі часто складають значно більше таких блоків, і ширших.',
    caption:
      'LayerNorm, потім увага або MLP, потім резидуальне додавання: потік — спільна робоча зона, яку кожен шар читає і пише, ніколи не перезаписуючи її повністю.',
  },
} as const;
