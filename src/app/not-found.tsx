import Layout from '@/components/layout/Layout';
import NotFound from '@/components/NotFound';

import { defaultLang } from '@/i18n';

export default async function NotFoundPage() {
  return (
    <Layout lang={defaultLang}>
      <main>
        <NotFound lang={defaultLang} />
      </main>
    </Layout>
  );
}
