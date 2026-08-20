export const temperatureStrings = {
  en: {
    promptLabel: 'Prompt fed to f:',
    promptStreamAria: 'Prompt token stream',
    tempLabel: 'Temperature T',
    sampleBtn: 'Sample one token',
    resetBtn: 'reset',
    sampledNote:
      'sampled continuation appended — the bars still score the original 6-token prefix; a real loop would re-run f on the longer prompt after every token.',
    formulaNote: 'computed live as you move the slider.',
  },
  uk: {
    promptLabel: 'Промпт, поданий в f:',
    promptStreamAria: 'Стрічка токенів промпту',
    tempLabel: 'Температура T',
    sampleBtn: 'Витягнути один токен',
    resetBtn: 'скинути',
    sampledNote:
      'додано витягнуте продовження — стовпчики досі оцінюють початковий префікс із 6 токенів; справжній цикл після кожного токена запускав би f заново, вже на довшому промпті.',
    formulaNote: 'обчислюється наживо, поки ви рухаєте повзунок.',
  },
} as const;
