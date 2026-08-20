import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}', './_posts/**/*.mdx'],
  plugins: [typography],
};

export default config;
