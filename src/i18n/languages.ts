const LANGUAGE_DATA = {
  'en': {
    name: 'English',
    emoji: '🇬🇧',
  },
  'uk': {
    name: 'Українська',
    emoji: '🇺🇦',
  },
} as const;

export type Lang = keyof typeof LANGUAGE_DATA;
export const defaultLang: Lang = 'en';

type LanguageInfo = typeof LANGUAGE_DATA[Lang];

class Languages {
  // Direct access to the underlying data - behaves like a dict
  static readonly data = LANGUAGE_DATA;

  // Typed helper methods that leverage the dict
  static keys(): Lang[] {
    return Object.keys(this.data) as Lang[];
  }

  static entries(): [Lang, LanguageInfo][] {
    return Object.entries(this.data) as [Lang, LanguageInfo][];
  }

  static values(): LanguageInfo[] {
    return Object.values(this.data);
  }

  // Convenience methods
  static get(lang: Lang): LanguageInfo {
    return this.data[lang];
  }

  static has(lang: string): lang is Lang {
    return lang in this.data;
  }

  static map<T>(fn: (lang: Lang, info: LanguageInfo) => T): T[] {
    return this.keys().map(lang => fn(lang, this.data[lang]));
  }
}

export { Languages };