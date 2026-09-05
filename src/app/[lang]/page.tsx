import Nav from '@/components/layout/Nav';
import About from '@/components/root-page/About';
import BlogPreview from '@/components/root-page/BlogPreview';
import Foss from '@/components/root-page/Foss';
import Services from '@/components/root-page/Services';

import { common, Lang } from '@/i18n';
import { rootPage } from '@/i18n/root-page';

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const content = rootPage[lang];

  return (
    <>
      <Nav lang={lang}>
        <nav className='navlinks' aria-label={common[lang].pageSections}>
          <a href='#blog'>{content.blog.name}</a>
          <a href='#services'>{content.services.name}</a>
          <a href='#foss'>{content.foss.name}</a>
        </nav>
      </Nav>
      <main id='main-content' className='wrap'>
        <About lang={lang} {...content.about} />
        <BlogPreview lang={lang} title={content.blog.name} />
        <Services title={content.services.name} items={content.services.items} foot={content.services.foot} />
        <Foss title={content.foss.name} items={content.foss.items} />
      </main>
    </>
  );
}
