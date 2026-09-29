import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import '@/styles/styles.css';

import { buildMetadata, homeLanguagePaths } from '@/lib/metadata';

import { defaultLang, Languages } from '@/i18n';

export default async function DummyLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    lang: defaultLang,
    path: `/${defaultLang}/`,
    languagePaths: homeLanguagePaths(),
  });
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf8f4' },
    { media: '(prefers-color-scheme: dark)', color: '#151412' },
  ],
};

export async function generateStaticParams() {
  return Languages.keys().map((lang) => ({ lang }));
}
