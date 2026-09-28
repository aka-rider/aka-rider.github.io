export const moeStrings = {
  en: {
    pickLabel: 'pick a token:',
    tokensAria: 'token to route',
    expertsAria: 'eight experts with router scores for the selected token',
    expertHints: [
      'leans function words',
      'leans capitalized fragments',
      'leans rare mid-word pieces',
      'leans common word endings',
      'leans concrete nouns',
      'leans punctuation',
      'no clear theme',
      'leans rare tokens',
    ],
    readout:
      'router sends "{token}" to {first} and {second} — 2 of 8 experts compute, 6 stay idle',
    honesty:
      'scores and expert labels are illustrative; real experts are not human-legible specialists — the routing is learned, and expert roles come out smeared, the same superposition effect as everywhere else in the network. only the mechanism is real: score every expert, keep the top-k, run only those.',
    guess: {
      question: "Which 2 of the 8 experts will 'iff' light up?",
      options: [
        'E1 + E7',
        'E3 + E8',
        'E5 + E6',
        'no way to tell from the labels',
      ],
      correctIndex: 1,
      payoff:
        "here it's E3 + E8 — but 'no way to tell' was the honest pick: real expert roles are learned, smeared, and not human-legible.",
    },
  },
  uk: {
    pickLabel: 'оберіть токен:',
    tokensAria: 'токен для маршрутизації',
    expertsAria:
      'вісім експертів з оцінками маршрутизатора для обраного токена',
    expertHints: [
      'тяжіє до службових слів',
      'тяжіє до фрагментів з великої літери',
      'тяжіє до рідкісних фрагментів усередині слова',
      'тяжіє до типових закінчень слів',
      'тяжіє до конкретних іменників',
      'тяжіє до пунктуації',
      'без чіткої теми',
      'тяжіє до рідкісних токенів',
    ],
    readout:
      'маршрутизатор надсилає «{token}» до {first} і {second} — 2 з 8 експертів рахують, 6 простоюють',
    honesty:
      'оцінки й підписи експертів — ілюстративні; справжні експерти не є зрозумілими людині спеціалістами — маршрутизація вивчається, і ролі експертів виходять розмазаними: той самий ефект суперпозиції, що й усюди в мережі. справжній тут лише механізм: оцінити кожного експерта, лишити top-k, запустити тільки їх.',
    guess: {
      question: "які 2 з 8 експертів засвітить 'iff'?",
      options: ['E1 + E7', 'E3 + E8', 'E5 + E6', 'за підписами не визначити'],
      correctIndex: 1,
      payoff:
        "тут це E3 + E8 — але 'за підписами не визначити' було чесним вибором: справжні ролі експертів вивчені, розмазані й не зрозумілі людині.",
    },
  },
} as const;
