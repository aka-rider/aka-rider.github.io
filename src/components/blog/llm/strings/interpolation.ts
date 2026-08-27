export const interpolationStrings = {
  en: {
    thickLabel: ['thick data', 'many nudges pinned the curve'],
    thinLabel: ['thin data', 'the curve stretches over a gap'],
    answerLabel: ['the model answers here too,', 'just as confidently'],
    caption:
      'Amber dots are training scraps; the cyan curve is the learned geometry of 1.2. Where scraps are dense the curve is pinned. Where they are sparse the curve is a smooth guess between distant neighbors, and an answer read off the dashed stretch is confabulation.',
    aria: 'A curve fitted through data points: on the left many points pin the curve tightly, on the right the curve is dashed as it stretches over a wide gap between two lone points, with a marked answer point in the middle of the gap.',
  },
  uk: {
    thickLabel: ['щільні дані', 'багато поштовхів пришпилили криву'],
    thinLabel: ['рідкі дані', 'крива натягнута над прогалиною'],
    answerLabel: ['модель відповідає й тут,', 'так само впевнено'],
    caption:
      'Бурштинові точки — клаптики навчального тексту; блакитна крива — вивчена геометрія з 1.2. Де клаптиків багато, крива пришпилена. Де їх мало, крива — гладкий здогад між далекими сусідами, і відповідь, зчитана з пунктирної ділянки, є конфабуляцією.',
    aria: 'Крива, проведена через точки даних: ліворуч багато точок щільно пришпилюють криву, праворуч крива пунктирна, бо натягнута над широкою прогалиною між двома самотніми точками, з позначеною точкою відповіді посередині прогалини.',
  },
} as const;
