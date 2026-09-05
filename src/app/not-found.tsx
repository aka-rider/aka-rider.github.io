import Layout from '@/components/layout/Layout';
import Nav from '@/components/layout/Nav';
import NotFound from '@/components/NotFound';

import { defaultLang } from '@/i18n';

export default function NotFoundPage() {
  return (
    <Layout lang={defaultLang}>
      <Nav lang={defaultLang} />
      <main id='main-content' className='wrap'>
        <NotFound lang={defaultLang} />
      </main>
    </Layout>
  );
}
