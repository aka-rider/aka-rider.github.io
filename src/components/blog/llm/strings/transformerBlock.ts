export const transformerBlockStrings = {
  en: {
    aria: 'One transformer block: a thick vertical residual stream carries token vectors from top to bottom; an attention station branches off, moves information between positions and merges back; then an MLP station transforms each position in place and merges back; the whole block repeats N times, roughly 30 to 100 layers, shown as a stack of ghost outlines receding into the distance with the stream running through every one',
    entry: 'token vectors in',
    exit: 'refined vectors out',
    stream: 'residual stream',
    attnLines: ['attention', 'moves information', 'BETWEEN positions'],
    mlpLines: [
      'MLP',
      'transforms it IN PLACE:',
      'columns of detectors',
      '(the matmul above)',
    ],
    layers: '×N layers (N ≈ 30–100)',
    caption:
      'attention = communication, MLP = computation; the residual stream is a shared workspace every layer reads and writes.',
  },
  uk: {
    aria: 'Один трансформерний блок: товстий вертикальний резидуальний потік несе вектори токенів згори донизу; станція уваги відгалужується, переносить інформацію між позиціями і вливається назад; далі станція MLP перетворює кожну позицію на місці і вливається назад; увесь блок повторюється N разів, приблизно 30–100 шарів, показаних як стос примарних контурів, що віддаляються вглиб, і потік проходить крізь кожен із них',
    entry: 'вектори токенів на вході',
    exit: 'уточнені вектори на виході',
    stream: 'резидуальний потік',
    attnLines: ['увага', 'переносить інформацію', 'МІЖ позиціями'],
    mlpLines: [
      'MLP',
      'перетворює НА МІСЦІ:',
      'стовпці детекторів',
      '(матричне множення вище)',
    ],
    layers: '×N шарів (N ≈ 30–100)',
    caption:
      'увага = комунікація, MLP = обчислення; резидуальний потік — спільна робоча зона, яку кожен шар читає і пише.',
  },
} as const;
