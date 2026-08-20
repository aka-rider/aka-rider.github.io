export const moeStrings = {
  en: {
    pickLabel: 'pick a token:',
    tokensAria: 'token to route',
    expertsAria: 'eight experts with router scores for the selected token',
    expertHints: [
      'leans function words',
      'leans nature-ish tokens',
      'leans code-ish tokens',
      'leans punctuation',
      'leans color-ish tokens',
      'no clear theme',
      'no clear theme',
      'leans rare tokens',
    ],
    readout:
      'router sends "{token}" to {first} and {second} — 2 of 8 experts compute, 6 stay idle',
    honesty:
      'scores and expert labels are illustrative; real experts are not human-legible specialists — the routing is learned, and expert roles come out smeared, the same superposition effect as everywhere else in the network. only the mechanism is real: score every expert, keep the top-k, run only those.',
    guess: {
      question: "Which 2 of the 8 experts will ' sky' light up?",
      options: [
        'E1 + E3',
        'E2 + E5',
        'E5 + E8',
        'no way to tell from the labels',
      ],
      correctIndex: 1,
      payoff:
        "here it's E2 + E5 — but 'no way to tell' was the honest pick: real expert roles are learned, smeared, and not human-legible.",
    },
  },
  uk: {
    pickLabel: 'оберіть токен:',
    tokensAria: 'токен для маршрутизації',
    expertsAria:
      'вісім експертів з оцінками маршрутизатора для обраного токена',
    expertHints: [
      'тяжіє до службових слів',
      'тяжіє до природничих токенів',
      'тяжіє до кодових токенів',
      'тяжіє до пунктуації',
      'тяжіє до кольорових токенів',
      'без чіткої теми',
      'без чіткої теми',
      'тяжіє до рідкісних токенів',
    ],
    readout:
      'маршрутизатор надсилає «{token}» до {first} і {second} — 2 з 8 експертів рахують, 6 простоюють',
    honesty:
      'оцінки й підписи експертів — ілюстративні; справжні експерти не є зрозумілими людині спеціалістами — маршрутизація вивчається, і ролі експертів виходять розмазаними: той самий ефект суперпозиції, що й усюди в мережі. справжній тут лише механізм: оцінити кожного експерта, лишити top-k, запустити тільки їх.',
    guess: {
      question: "які 2 з 8 експертів засвітить ' sky'?",
      options: ['E1 + E3', 'E2 + E5', 'E5 + E8', 'за підписами не визначити'],
      correctIndex: 1,
      payoff:
        "тут це E2 + E5 — але 'за підписами не визначити' було чесним вибором: справжні ролі експертів вивчені, розмазані й не зрозумілі людині.",
    },
  },
} as const;
