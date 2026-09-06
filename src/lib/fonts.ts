import {
  Atkinson_Hyperlegible_Next,
  JetBrains_Mono,
  Wix_Madefor_Text,
} from 'next/font/google';

export const fontEn = Atkinson_Hyperlegible_Next({
  subsets: ['latin', 'latin-ext'],
  style: ['normal', 'italic'],
  variable: '--f-en',
  display: 'swap',
});

export const fontUk = Wix_Madefor_Text({
  subsets: ['latin', 'cyrillic'],
  style: ['normal', 'italic'],
  variable: '--f-uk',
  display: 'swap',
});

export const fontMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  variable: '--mono',
  display: 'swap',
  preload: false,
});

export const fontClassName = [fontEn, fontUk, fontMono]
  .map((f) => f.variable)
  .join(' ');
