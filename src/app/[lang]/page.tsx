import Nav from '@/components/Nav';
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

  // Define section order - single source of truth
  const sectionOrder = [
    'about',
    'blog',
    'foss',
    'services',
  ] as const;

  // Prepare navigation items from section order
  const navSections = sectionOrder.slice(1).map((sectionId) => ({
    key: sectionId,
    name: content[sectionId].name,
  }));

  return (
    <main>
      <Nav lang={lang}>
        <SectionNavigation sections={navSections} />
      </Nav>

      {sectionOrder.map((sectionId) => {
        const sectionContent = content[sectionId];

        // Handle each section with proper props
        switch (sectionId) {
          case 'about':
            return (
              <About
                key={sectionId}
                title={sectionContent.name}
                content={(sectionContent as any).content}
              />
            );

          case 'blog':
            return (
              <BlogPreview key={sectionId} title={sectionContent.name} lang={lang} />
            );

          case 'services':
            return (
              <Services
                key={sectionId}
                title={sectionContent.name}
                services={(sectionContent as any).items}
              />
            );

          case 'foss':
            return <Foss key={sectionId} title={sectionContent.name} foss={(sectionContent as any).items} />;

          default:
            return null;
        }
      })}
    </main>
  );
}
