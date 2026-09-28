export const mlpStrings = {
  en: {
    aria: 'The MLP at token " Tower", drawn left to right: its 768-dimension vector expands to 3,072 detectors, three of which light up for "Eiffel Tower"; GELU squashes the rest toward zero while letting the firing ones through; the result contracts back to 768 dimensions, gaining a new direction, and is added into the residual stream. The other six tokens go through the identical MLP independently, in parallel.',
    tokensAria:
      'Our seven tokens; " Tower" is highlighted because this figure follows only that one position',
    inputLabel: '768',
    expandLabel: '3,072',
    contractLabel: '768',
    geluLabel: 'GELU',
    shapes: '(7, 768) → (7, 3072) → (7, 768)',
    residualLabel: 'residual stream',
    legend: [
      'runs per token, independently — the same weights process each of the 7 positions on their own',
      '≈ 4.7M weights in this one block’s MLP, about ⅔ of everything the block learns',
      'GELU keeps the nonlinearity: without it, expand-then-contract would collapse into a single linear map',
    ],
    honesty:
      'toy view: 8 of 768 input/output dimensions and 16 of 3,072 detectors shown, colour intensity only — which detectors fire for "Eiffel Tower" is invented for the picture.',
    caption:
      'Following the Transformer Explainer’s Figure 4: one token expands into many detectors, a few fire, and GELU shapes what gets written back.',
  },
  uk: {
    aria: 'MLP на токені " Tower", намальовано зліва направо: його 768-вимірний вектор розширюється до 3072 детекторів, три з яких загоряються для «Eiffel Tower»; GELU затискає решту до нуля, пропускаючи ті, що спрацювали; результат стискається назад до 768 вимірів, набуваючи нового напрямку, і додається до залишкового потоку. Інші шість токенів проходять крізь той самий MLP незалежно, паралельно.',
    tokensAria:
      'Наші сім токенів; " Tower" підсвічено, бо ця фігура стежить лише за цією позицією',
    inputLabel: '768',
    expandLabel: '3072',
    contractLabel: '768',
    geluLabel: 'GELU',
    shapes: '(7, 768) → (7, 3072) → (7, 768)',
    residualLabel: 'залишковий потік',
    legend: [
      'виконується для кожного токена незалежно — ті самі ваги обробляють кожну з 7 позицій окремо',
      '≈ 4,7М ваг у MLP цього одного блоку, приблизно ⅔ від усього, що вивчає блок',
      'GELU зберігає нелінійність: без неї розширення-і-стиснення звелося б до одного лінійного відображення',
    ],
    honesty:
      'іграшковий вигляд: показано 8 із 768 вхідних/вихідних вимірів і 16 із 3072 детекторів, лише кольорова інтенсивність — які саме детектори спрацьовують для «Eiffel Tower» придумано для ілюстрації.',
    caption:
      'За зразком рисунка 4 Transformer Explainer: один токен розширюється у багато детекторів, кілька спрацьовують, і GELU формує те, що записується назад.',
  },
} as const;
