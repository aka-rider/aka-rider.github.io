export const matmulStrings = {
  en: {
    plain: {
      aria: 'Q/K/V projection as a matrix multiplication: seven token embeddings (7×768) times a weight matrix (768×2304) plus a bias give seven query/key/value vectors (7×2304), grouped into three coloured bands, Q, K and V; below, GELU shows what a nonlinearity would do to one of those rows',
      hint: 'hover or focus an output cell to see its column — one learned detector, applied to every token the same way',
      prevColumn: 'previous column',
      nextColumn: 'next column',
      inputLabel: 'embeddings (7, 768)',
      weightLabel: 'Q·K·V weights (768, 2304)',
      biasLabel: 'bias (2304)',
      outputLabel: 'Q·K·V (7, 2304)',
      groupLabels: ['Q', 'K', 'V'],
      gelu: {
        label: 'GELU(Q·K·V) — ␣Tower row',
        note: 'the nonlinearity: small or negative inputs are squashed toward zero, large positive inputs pass through almost unchanged',
      },
      legend: [
        'each column of the weight matrix is one detector, shared by every token',
        'colour intensity only — no numbers: darker means the detector fired more strongly',
        'Q/K/V itself has no nonlinearity; GELU is shown here because it is the one this model actually uses, in the MLP',
      ],
      honesty:
        'toy view: 8 of 768 input dims and 6 of 768 dims per Q/K/V group shown — but every cell is a real dot product computed on this page.',
    },
    attention: {
      aria: 'Attention scores for our seven tokens as three 7×7 grids: dot product, then scaled and causally masked, then softmax; colour intensity only, masked cells left empty',
      dotLabel: 'dot product',
      scaleLabel: 'scale · mask',
      softmaxLabel: 'softmax',
      scale: '÷√64',
      legend: [
        'row = the token asking the question, column = the token being looked at',
        'a token may only look at itself and earlier tokens — the causal mask leaves later columns empty',
        'softmax turns each row into weights that sum to 1',
      ],
      maskLegend:
        'causal mask: the future is blanked out before softmax, every row',
      honesty:
        'illustrative scores, not the model’s real attention — but the scaling, masking and softmax are the real operations, computed on this page.',
    },
  },
  uk: {
    plain: {
      aria: 'Проєкція Q/K/V як матричне множення: сім вкладень токенів (7×768), помножені на матрицю ваг (768×2304) плюс зсув, дають сім векторів запит/ключ/значення (7×2304), згруповані в три кольорові смуги, Q, K і V; нижче GELU показує, що нелінійність зробила б з одним із цих рядків',
      hint: 'наведіть курсор або сфокусуйтеся на вихідній комірці, щоб побачити її стовпець — один вивчений детектор, застосований однаково до кожного токена',
      prevColumn: 'попередній стовпець',
      nextColumn: 'наступний стовпець',
      inputLabel: 'вкладення (7, 768)',
      weightLabel: 'ваги Q·K·V (768, 2304)',
      biasLabel: 'зсув (2304)',
      outputLabel: 'Q·K·V (7, 2304)',
      groupLabels: ['Q', 'K', 'V'],
      gelu: {
        label: 'GELU(Q·K·V) — рядок ␣Tower',
        note: 'нелінійність: малі або від’ємні значення затискаються до нуля, великі додатні проходять майже без змін',
      },
      legend: [
        'кожен стовпець матриці ваг — один детектор, спільний для всіх токенів',
        'лише кольорова інтенсивність — без чисел: темніше означає, що детектор спрацював сильніше',
        'сама проєкція Q/K/V не має нелінійності; GELU показано тут, бо саме її ця модель насправді використовує — в MLP',
      ],
      honesty:
        'іграшковий вигляд: показано 8 із 768 вхідних вимірів і 6 із 768 вимірів на кожну групу Q/K/V — але кожна комірка є справжнім скалярним добутком, обчисленим на цій сторінці.',
    },
    attention: {
      aria: 'Оцінки уваги для наших семи токенів як три сітки 7×7: скалярний добуток, потім масштабування з каузальною маскою, потім softmax; лише кольорова інтенсивність, замасковані комірки залишені порожніми',
      dotLabel: 'скалярний добуток',
      scaleLabel: 'масштаб · маска',
      softmaxLabel: 'softmax',
      scale: '÷√64',
      legend: [
        'рядок — токен, що ставить запитання, стовпець — токен, на який дивляться',
        'токен може дивитися лише на себе і попередні токени — каузальна маска залишає пізніші стовпці порожніми',
        'softmax перетворює кожен рядок на ваги, що в сумі дають 1',
      ],
      maskLegend:
        'каузальна маска: майбутнє затирається перед softmax, у кожному рядку',
      honesty:
        'ілюстративні оцінки, не справжня увага моделі — але масштабування, маскування і softmax є справжніми операціями, обчисленими на цій сторінці.',
    },
  },
} as const;
