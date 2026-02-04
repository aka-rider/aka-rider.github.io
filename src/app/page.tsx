import Layout from '@/components/layout/Layout';

import { defaultLang } from '@/i18n';

import HomePage from './[lang]/page';

export default async function RootPage() {
  return (
    <Layout lang={defaultLang}>
      <HomePage params={Promise.resolve({ lang: defaultLang })} />
    </Layout>
  );
}
