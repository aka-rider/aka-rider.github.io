import Layout from '@/components/layout/Layout';
import Main from '@/components/layout/Main';
import Nav from '@/components/layout/Nav';
import NotFound from '@/components/NotFound';

import { defaultLang } from '@/i18n';

export default function NotFoundPage() {
  return (
    <Layout lang={defaultLang}>
      <Nav lang={defaultLang} />
      <Main className='wrap'>
        <NotFound lang={defaultLang} />
      </Main>
    </Layout>
  );
}
