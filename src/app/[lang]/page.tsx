import Nav from '@/components/layout/Nav';
import About from '@/components/root-page/About';
import BlogPreview from '@/components/root-page/BlogPreview';
import Foss from '@/components/root-page/Foss';
import Services from '@/components/root-page/Services';
import SectionNavigation from '@/components/SectionNavigation';

import { Lang } from '@/i18n';
import { rootPage } from '@/i18n/root-page';

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;

  const content = rootPage[lang];

  const navSections = (['blog', 'services', 'foss'] as const).map(
    (sectionId) => ({
      key: sectionId,
      name: content[sectionId].name,
    }),
  );

  return (
    <main>
      <Nav lang={lang}>
        <SectionNavigation lang={lang} sections={navSections} />
      </Nav>

      <About
        lang={lang}
        title={content.about.name}
        items={content.about.items}
      />

      <BlogPreview title={content.blog.name} lang={lang} />

      <Services
        title={content.services.name}
        services={content.services.items}
      />

      <Foss title={content.foss.name} foss={content.foss.items} />
    </main>
  );
}
