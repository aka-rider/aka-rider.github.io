export const chatTranscriptStrings = {
  en: {
    roles: {
      system: 'SYSTEM',
      user: 'USER',
      assistant: 'ASSISTANT',
      tool: 'TOOL',
      thinking: 'THINKING',
    },
    resent: '(re-sent)',
    showRaw: 'show what the model actually sees',
    showReadable: 'back to readable view',
    transcriptAria: 'Chat transcript',
    rawAria:
      'The same transcript serialized as one flat string, the way the model receives it',
  },
  uk: {
    roles: {
      system: 'СИСТЕМА',
      user: 'КОРИСТУВАЧ',
      assistant: 'АСИСТЕНТ',
      tool: 'ІНСТРУМЕНТ',
      thinking: 'МІРКУВАННЯ',
    },
    resent: '(надіслано повторно)',
    showRaw: 'показати, що модель бачить насправді',
    showReadable: 'назад до читабельного вигляду',
    transcriptAria: 'Стенограма чату',
    rawAria:
      'Та сама стенограма, серіалізована в один плаский рядок — саме так її отримує модель',
  },
} as const;
