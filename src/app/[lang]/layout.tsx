import { ReactNode } from 'react';

import Layout from '@/components/layout/Layout';

import { Lang } from '@/i18n';

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <Layout lang={lang as Lang}>{children}</Layout>;
}
