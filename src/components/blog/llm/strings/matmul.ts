export const matmulStrings = {
  en: {
    plain: {
      aria: 'Matrix multiplication: the vector of the token " sky" times the weight matrix W gives the output vector y; each column of W is labeled with the pattern it detects — nature, colour, code; the highlighted row and column produce the highlighted cell of y; below, ReLU clamps the negative code reading to zero',
      hint: 'tap any cell of y to see where its value comes from',
      aLabel: 'x = ␣sky (1×4)',
      bLabel: 'W (4×3)',
      cLabel: 'y (1×3)',
      detectorLabels: ['nature?', 'colour?', 'code?'],
      reluLabel: 'ReLU(y) (1×3)',
      reluNote:
        'the nonlinearity: negative = pattern contradicted → clamped to 0 — filtered out',
      legend: [
        'x — ␣sky’s vector: the first 4 of its 12,288 coordinates (1.2)',
        'W — weights (4×3): each column is one learned direction = one detector',
        'y — how far ␣sky leans along each direction',
      ],
      interpretation:
        'positive = the pattern is present; negative = evidence against it',
      honesty:
        'toy sizes: 4 of 12,288 dims and 3 detectors instead of tens of thousands, and real columns carry no clean labels like "nature" (superposition, below) — but the arithmetic is real and computed on this page.',
    },
    attention: {
      aria: 'Attention scores as a matrix multiplication: queries Q times transposed keys Kᵀ give a 6 by 6 score matrix; the strictly upper triangle is masked out because a token may not look at future tokens',
      hint: 'tap any unmasked score cell to see its dot product',
      aLabel: 'Q (6×3)',
      bLabel: 'Kᵀ (3×6)',
      cLabel: 'scores = Q·Kᵀ (6×6)',
      scoreWord: 'score',
      legend: [
        'Q — each row: what this token is looking for',
        'Kᵀ — each column: what that token offers',
        'score — how relevant one token is to another',
      ],
      maskLegend:
        'causal mask: a token may only look at tokens before it — the future is blanked out before softmax',
      flowNote:
        'scores → softmax → weights → weighted sum of value vectors: that sum is what moves between positions',
      interpretation:
        'high score = the row token finds the column token relevant; softmax then turns each row into attention weights',
      honesty:
        'toy sizes: 6 tokens with d = 3 instead of thousands — but every score is a real dot product computed on this page.',
    },
  },
  uk: {
    plain: {
      aria: 'Матричне множення: вектор токена " sky", помножений на матрицю ваг W, дає вихідний вектор y; кожен стовпець W підписано патерном, який він виявляє — природа, колір, код; підсвічені рядок і стовпець дають підсвічену комірку y; нижче ReLU затискає від’ємну оцінку коду в нуль',
      hint: 'торкніться будь-якої комірки y, щоб побачити, звідки береться її значення',
      aLabel: 'x = ␣sky (1×4)',
      bLabel: 'W (4×3)',
      cLabel: 'y (1×3)',
      detectorLabels: ['природа?', 'колір?', 'код?'],
      reluLabel: 'ReLU(y) (1×3)',
      reluNote:
        'нелінійність: від’ємне = патерн спростовано → затиснуто в 0 — відфільтровано',
      legend: [
        'x — вектор ␣sky: перші 4 з його 12 288 координат (1.2)',
        'W — ваги (4×3): кожен стовпець — один вивчений напрямок = один детектор',
        'y — наскільки ␣sky нахилений уздовж кожного напрямку',
      ],
      interpretation:
        'додатне = патерн присутній; від’ємне = свідчення проти нього',
      honesty:
        'іграшкові розміри: 4 із 12 288 вимірів і 3 детектори замість десятків тисяч, а справжні стовпці не мають чистих підписів на кшталт "природа" (суперпозиція, нижче) — але арифметика справжня й обчислюється на цій сторінці.',
    },
    attention: {
      aria: 'Оцінки уваги як матричне множення: запити Q, помножені на транспоновані ключі Kᵀ, дають матрицю оцінок 6 на 6; строго верхній трикутник замасковано, бо токен не може дивитися на майбутні токени',
      hint: 'торкніться будь-якої незамаскованої комірки оцінки, щоб побачити її скалярний добуток',
      aLabel: 'Q (6×3)',
      bLabel: 'Kᵀ (3×6)',
      cLabel: 'оцінки = Q·Kᵀ (6×6)',
      scoreWord: 'оцінка',
      legend: [
        'Q — кожен рядок: що цей токен шукає',
        'Kᵀ — кожен стовпець: що той токен пропонує',
        'оцінка — наскільки один токен доречний для іншого',
      ],
      maskLegend:
        'каузальна маска: токен може дивитися лише на токени перед собою — майбутнє затирається перед softmax',
      flowNote:
        'оцінки → softmax → ваги → зважена сума векторів значень: саме ця сума рухається між позиціями',
      interpretation:
        'висока оцінка = токен-рядок вважає токен-стовпець доречним; softmax потім перетворює кожен рядок на ваги уваги',
      honesty:
        'іграшкові розміри: 6 токенів із d = 3 замість тисяч — але кожна оцінка є справжнім скалярним добутком, обчисленим на цій сторінці.',
    },
  },
} as const;
