import { JetBrains_Mono } from 'next/font/google';

export const fontMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  variable: '--mono',
  display: 'swap',
  preload: false,
});

export const fontClassName = fontMono.variable;
