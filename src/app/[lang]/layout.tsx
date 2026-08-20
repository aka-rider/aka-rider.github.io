import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

import Layout from '@/components/layout/Layout';

import { Languages } from '@/i18n';

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!Languages.has(lang)) {
    notFound();
  }
  return <Layout lang={lang}>{children}</Layout>;
}
