const LANGUAGE_DATA = {
  en: {
    name: 'English',
    emoji: '🇬🇧',
  },
  uk: {
    name: 'Українська',
    emoji: '🇺🇦',
  },
} as const;

export type Lang = keyof typeof LANGUAGE_DATA;
export const defaultLang: Lang = 'en';

type LanguageInfo = (typeof LANGUAGE_DATA)[Lang];

class Languages {
  static readonly data = LANGUAGE_DATA;

  static keys(): Lang[] {
    return Object.keys(this.data) as Lang[];
  }

  static has(lang: string): lang is Lang {
    return lang in this.data;
  }

  static map<T>(fn: (lang: Lang, info: LanguageInfo) => T): T[] {
    return this.keys().map((lang) => fn(lang, this.data[lang]));
  }
}

export { Languages };
