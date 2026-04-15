import { JetBrains_Mono, Manrope, Merriweather } from 'next/font/google';

export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'optional',
  preload: false,
});

export const fontHeader = Merriweather({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-header',
  display: 'swap',
});

export const fontBody = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-body',
  display: 'swap',
});
