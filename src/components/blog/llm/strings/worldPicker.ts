import { EXAMPLE_QUERY } from '@/components/blog/llm/example';

export const worldPickerStrings = {
  en: {
    framingGroupAria: 'Pick a framing for the same continuation point',
    framings: {
      travel: { label: 'travel guide', text: '## Getting around Paris\n' },
      vegas: {
        label: 'Las Vegas hotel guide',
        text: 'PARIS LAS VEGAS RESORT — Guest Guide\n',
      },
      minecraft: {
        label: 'Minecraft build log',
        text: '[build log] session 47\n',
      },
    },
    continuationLabel: 'fixed continuation point',
    continuation: EXAMPLE_QUERY,
    barsLabel: 'p(next token)',
    barsAria: 'Probability bars over five candidate next tokens',
    readout:
      'same weights, same continuation point — the framing alone moved the distribution.',
    honesty:
      'Honesty label: these distributions are illustrative, not measured. The effect itself is real — reproduce it with any base model.',
    guess: {
      question:
        "Under the 'Las Vegas hotel guide' framing, what's the model's top pick after 'The Eiffel Tower is in'?",
      options: [' Las', ' Nevada', ' downtown', ' Paris'],
      correctIndex: 0,
      payoff:
        "actually ' Las' — the hotel guide is describing the Paris Las Vegas resort's own tower replica, and the framing alone moved the whole distribution.",
    },
  },
  uk: {
    framingGroupAria: 'Оберіть обрамлення для тієї самої точки продовження',
    framings: {
      travel: {
        label: 'путівник для мандрівників',
        text: '## Як дістатися Парижа\n',
      },
      vegas: {
        label: 'путівник готелю в Лас-Вегасі',
        text: 'PARIS LAS VEGAS RESORT — путівник гостя\n',
      },
      minecraft: {
        label: 'журнал будівництва в Minecraft',
        text: '[build log] сесія 47\n',
      },
    },
    continuationLabel: 'фіксована точка продовження',
    continuation: EXAMPLE_QUERY,
    barsLabel: 'p(наступний токен)',
    barsAria: 'Стовпчики ймовірностей для п’яти кандидатів на наступний токен',
    readout:
      'ті самі ваги, та сама точка продовження — розподіл зрушило саме лише обрамлення.',
    honesty:
      'Чесне зізнання: ці розподіли ілюстративні, не виміряні. Сам ефект справжній — відтворіть його з будь-якою базовою моделлю.',
    guess: {
      question:
        "під обрамленням 'путівник готелю в Лас-Вегасі' — який топ-вибір моделі після 'The Eiffel Tower is in'?",
      options: [' Las', ' Nevada', ' downtown', ' Paris'],
      correctIndex: 0,
      payoff:
        "насправді ' Las' — путівник описує власну репліку вежі готелю Paris Las Vegas, і саме лише обрамлення зрушило весь розподіл.",
    },
  },
} as const;
