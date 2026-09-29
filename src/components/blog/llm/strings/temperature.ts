export const temperatureStrings = {
  en: {
    promptLabel: 'Prompt fed to f:',
    promptStreamAria: 'Prompt token stream',
    projectionNote:
      'the final LayerNorm, then a tied 768→50,257 projection, gives one logit per vocabulary entry; 8 shown.',
    tempLabel: 'Temperature T',
    topKLabel: 'Top-k',
    topPLabel: 'Top-p',
    greedyNote: 'k=1: greedy decoding — always the single highest logit.',
    sampleBtn: 'Sample one token',
    resetBtn: 'reset',
    sampledNote:
      'sampled continuation appended — the table still scores the original 7-token prompt; a real loop would re-run the model on the longer prompt after every new token.',
    formulaNote: 'computed live as you move the sliders.',
    cuttingNote:
      'tokens cut by top-k or top-p get probability 0 and the rest renormalize among the survivors.',
    columns: {
      token: 'token',
      logit: 'logit',
      scaled: 'logit ÷ T',
      cut: 'cut',
      softmax: 'softmax',
    },
    cutTopK: 'top-k',
    cutTopP: 'top-p',
    kept: '—',
    leadingReadout: 'leading: {token} at {pct}%',
  },
  uk: {
    promptLabel: 'Промпт, поданий в f:',
    promptStreamAria: 'Стрічка токенів промпту',
    projectionNote:
      'фінальний LayerNorm, а тоді зв’язана проєкція 768→50 257 дає по одному логіту на кожен запис словника; показано 8.',
    tempLabel: 'Температура T',
    topKLabel: 'Top-k',
    topPLabel: 'Top-p',
    greedyNote: 'k=1: жадібне декодування — завжди єдиний найвищий логіт.',
    sampleBtn: 'Витягнути один токен',
    resetBtn: 'скинути',
    sampledNote:
      'додано витягнуте продовження — таблиця досі оцінює початковий промпт із 7 токенів; справжній цикл після кожного нового токена запускав би модель заново, вже на довшому промпті.',
    formulaNote: 'обчислюється наживо, поки ви рухаєте повзунки.',
    cuttingNote:
      'токени, відрізані top-k або top-p, отримують імовірність 0, а решта перенормовується серед тих, що залишились.',
    columns: {
      token: 'токен',
      logit: 'логіт',
      scaled: 'логіт ÷ T',
      cut: 'відсіч',
      softmax: 'softmax',
    },
    cutTopK: 'top-k',
    cutTopP: 'top-p',
    kept: '—',
    leadingReadout: 'лідирує: {token} з {pct}%',
  },
} as const;
