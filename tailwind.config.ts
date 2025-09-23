import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  // Remove darkMode config for v4 - should work automatically
  plugins: [require('@tailwindcss/typography')],
} as const;

export default config;
