import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '@/styles/styles.css';

import { defaultMetadata } from '@/lib/metadata';

import { defaultLang, languages } from '@/i18n';

export default async function DummyLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}

export async function generateMetadata(): Promise<Metadata> {
  return await defaultMetadata({
    params: Promise.resolve({ lang: defaultLang }),
  });
}

export async function generateStaticParams() {
  return Object.keys(languages).map((lang) => ({ lang }));
}
