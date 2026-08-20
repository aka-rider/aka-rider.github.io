export const ladderStrings = {
  en: {
    rungs: {
      distribution: 'distribution over vocab',
      logits: 'logits',
      blocks: 'stacked transformer blocks (×N)',
      block: 'one block: attention + MLP',
      head: 'attention head: Q·K → weights → V',
      matmuls: 'matrix multiplies',
      floats: 'floats',
    },
    arrows: {
      softmax: 'softmax',
      projected: 'projected to vocab',
      repeated: 'repeated ×N',
      partOf: 'is part of',
      computedBy: 'computed by',
      arrangedInto: 'arranged into',
    },
    annotation: ['you are usually', 'reading the page', 'at THIS rung ↑'],
    caption:
      'Each rung is boring given the rung below it. The interesting emergent fact is that stacking enough boring rungs, trained on enough text, yields the behavior at the top.',
    aria: 'Vertical ladder diagram from floats at the base up to a distribution over the vocabulary at the top; each rung is built from the rung below.',
  },
  uk: {
    rungs: {
      distribution: 'розподіл по словнику',
      logits: 'логіти',
      blocks: 'стос трансформерних блоків (×N)',
      block: 'один блок: увага + MLP',
      head: 'голова уваги: Q·K → ваги → V',
      matmuls: 'матричні множення',
      floats: 'числа з рухомою комою',
    },
    arrows: {
      softmax: 'softmax',
      projected: 'проєкція на словник',
      repeated: 'повторено ×N',
      partOf: 'частина',
      computedBy: 'обчислюється через',
      arrangedInto: 'зібрані в',
    },
    annotation: ['зазвичай ви читаєте', 'сторінку на', 'ЦЬОМУ щаблі ↑'],
    caption:
      'Кожен щабель нудний, якщо дивитися зі щабля під ним. Цікавий емерджентний факт: стос достатньої кількості нудних щаблів, навчений на достатній кількості тексту, дає поведінку нагорі.',
    aria: 'Вертикальна діаграма-драбина: від чисел з рухомою комою внизу до розподілу по словнику нагорі; кожен щабель побудований зі щабля під ним.',
  },
} as const;
