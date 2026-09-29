import { Metadata } from 'next';

import Layout from '@/components/layout/Layout';

import { defaultLang } from '@/i18n';

import HomePage, {
  generateMetadata as generateHomeMetadata,
} from './[lang]/page';

export async function generateMetadata(): Promise<Metadata> {
  return generateHomeMetadata({
    params: Promise.resolve({ lang: defaultLang }),
  });
}

export default async function RootPage() {
  return (
    <Layout lang={defaultLang}>
      <HomePage params={Promise.resolve({ lang: defaultLang })} />
    </Layout>
  );
}
