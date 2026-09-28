export const embeddingStrings = {
  en: {
    processAria:
      'Four-step diagram, one row per token of "The ␣E iff el ␣Tower ␣is ␣in". Step 1, tokenization: each token with its vocabulary id. Step 2, token embedding: the id looks up a row in a 50,257×768 table, drawn as a strip of colour intensity, 8 of 768 dimensions shown. Step 3, positional encoding: the position looks up a row in a learned 1,024×768 table, drawn the same way. Step 4, final embedding: the sum of the two strips, shape (7, 768).',
    step1: 'Tokenization',
    step2: 'Token embedding',
    step2Sub: '50,257×768 ≈ 39M params',
    step3: 'Positional encoding',
    step3Sub: '1,024×768, learned',
    step4: 'Final embedding',
    step4Sub: '(7, 768)',
    legend: [
      'each token id looks up its row in the 50,257×768 token embedding table',
      'each position 0…6 looks up its row in the learned 1,024×768 positional table — without it, a shuffled phrase would look identical to the model',
      'final embedding = token embedding + positional encoding, shape (7, 768)',
    ],
    honesty:
      'toy view: 8 of 768 dimensions shown as colour strips, intensity only — the real vectors are learned by training, these are invented for the picture.',
    processCaption:
      'Following the Transformer Explainer’s Figure 1: tokenization, token embedding, positional encoding, and their sum.',
    spaceAria:
      'Meaning space drawn as a ground plane receding into the distance. "Eiffel Tower", "Colosseum" and "landmark" cluster together toward the back left; "Paris", "Rome" and "France" cluster together toward the front right. Two parallel arrows on the plane show that Eiffel Tower-to-Paris points the same way as Colosseum-to-Rome.',
    spaceTitle: 'meaning space — 768 dims flattened to 2 (hand-drawn)',
    relationNote: 'landmark → its city',
    spaceCaption:
      'Points and arrows are hand-placed to illustrate two real properties: nearby means related, and directions carry meaning. Real learned geometry is only statistically this tidy.',
  },
  uk: {
    processAria:
      'Діаграма з чотирьох кроків, по одному рядку на токен фрази «The ␣E iff el ␣Tower ␣is ␣in». Крок 1, токенізація: кожен токен з його id у словнику. Крок 2, вкладення токена: id шукає свій рядок у таблиці 50 257×768, намальований як смуга кольорової інтенсивності, показано 8 із 768 вимірів. Крок 3, позиційне кодування: позиція шукає свій рядок у вивченій таблиці 1 024×768, намальований так само. Крок 4, підсумкове вкладення: сума цих двох смуг, форма (7, 768).',
    step1: 'Токенізація',
    step2: 'Вкладення токена',
    step2Sub: '50 257×768 ≈ 39М параметрів',
    step3: 'Позиційне кодування',
    step3Sub: '1 024×768, вивчене',
    step4: 'Підсумкове вкладення',
    step4Sub: '(7, 768)',
    legend: [
      'id кожного токена шукає свій рядок у таблиці вкладень токенів 50 257×768',
      'кожна позиція 0…6 шукає свій рядок у вивченій позиційній таблиці 1 024×768 — без неї переставлена фраза виглядала б для моделі так само',
      'підсумкове вкладення = вкладення токена + позиційне кодування, форма (7, 768)',
    ],
    honesty:
      'іграшковий вигляд: показано 8 із 768 вимірів як кольорові смуги, лише інтенсивність — справжні вектори вивчаються тренуванням, ці придумані для ілюстрації.',
    processCaption:
      'За зразком рисунка 1 Transformer Explainer: токенізація, вкладення токена, позиційне кодування та їхня сума.',
    spaceAria:
      'Простір значень намальовано як площину, що віддаляється вглиб. «Eiffel Tower», «Colosseum» і «landmark» купчаться разом далі ліворуч; «Paris», «Rome» і «France» — ближче праворуч. Дві паралельні стрілки на площині показують, що напрямок від Eiffel Tower до Paris збігається з напрямком від Colosseum до Rome.',
    spaceTitle:
      'простір значень — 768 вимірів сплющено до 2 (намальовано від руки)',
    relationNote: 'пам’ятка → її місто',
    spaceCaption:
      'Точки та стрілки розставлені вручну, щоб показати дві справжні властивості: близьке означає пов’язане, а напрямки означають відношення. Справжня вивчена геометрія лише статистично така охайна.',
  },
} as const;
