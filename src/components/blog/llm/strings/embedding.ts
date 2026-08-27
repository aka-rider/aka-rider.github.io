export const embeddingStrings = {
  en: {
    svgAria:
      'Two-part figure. Top: the token " sky" with id 13180 indexes the embedding table; row 13180 is highlighted among its neighbor rows and zoomed out into a vector of eight shaded cells out of 12,288. Bottom: meaning space drawn as a ground plane receding into the distance. Why, is, the and the question mark huddle in a grammar-words corner; sky and blue sit near cloud and sun; two parallel arrows show that sky-to-blue points the same way as grass-to-green.',
    tableLabel: 'the embedding table: ~100,000 rows × 12,288 numbers',
    vectorNote: 'row 13180 = ␣sky’s coordinates (8 of 12,288 shown)',
    spaceTitle: '12,288 dimensions flattened to 2 (hand-drawn)',
    relationNote: 'thing → its colour',
    grammarNote: 'grammar words, used alike',
    caption:
      'Hand-placed to illustrate what training produces: interchangeable words drift together (the grammar corner), related words sit near (sky with cloud and sun), and one relation, a thing and its colour, is the same arrow in two places. Amber points are our six tokens; cyan points are other vocabulary entries. Real learned geometry is only statistically this tidy.',
  },
  uk: {
    svgAria:
      'Фігура з двох частин. Угорі: токен " sky" з id 13180 індексує таблицю ембедінгів; рядок 13180 підсвічено серед сусідніх рядків і розгорнуто у вектор із восьми затінених комірок із 12 288. Унизу: простір значень намальовано як площину, що віддаляється вглиб. Why, is, the і знак питання туляться в кутку службових слів; sky і blue лежать поруч із cloud і sun; дві паралельні стрілки показують, що напрямок від sky до blue збігається з напрямком від grass до green.',
    tableLabel: 'таблиця ембедінгів: ~100 000 рядків × 12 288 чисел',
    vectorNote: 'рядок 13180 = координати ␣sky (показано 8 із 12 288)',
    spaceTitle: '12 288 вимірів сплющено до 2 (намальовано від руки)',
    relationNote: 'річ → її колір',
    grammarNote: 'взаємозамінні службові слова',
    caption:
      'Розставлено вручну, щоб показати, що виробляє навчання: взаємозамінні слова дрейфують докупи (куток службових слів), пов’язані слова лежать поруч (sky біля cloud і sun), а одне відношення, річ і її колір, — та сама стрілка у двох місцях. Бурштинові точки — наші шість токенів; бірюзові — інші записи словника. Справжня вивчена геометрія лише статистично така охайна.',
  },
} as const;
