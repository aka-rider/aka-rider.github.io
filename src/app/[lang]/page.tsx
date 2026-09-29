import { Metadata } from 'next';

import { getLocalImageDimensions } from '@/lib/images';
import { buildMetadata, homeLanguagePaths, PERSON_ID } from '@/lib/metadata';

import JsonLd from '@/components/JsonLd';
import Main from '@/components/layout/Main';
import Nav from '@/components/layout/Nav';
import UnstyledLink from '@/components/links/UnstyledLink';
import About from '@/components/root-page/About';
import BlogPreview from '@/components/root-page/BlogPreview';
import Foss from '@/components/root-page/Foss';
import Services from '@/components/root-page/Services';

import { common, Lang } from '@/i18n';
import { rootPage } from '@/i18n/root-page';

import config from '../../../config';

const AVATAR_URL = `${config.SITE_URL}/images/iurii-avatar.webp`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dimensions = await getLocalImageDimensions(AVATAR_URL);

  return buildMetadata({
    lang,
    path: `/${lang}/`,
    languagePaths: homeLanguagePaths(),
    image: {
      url: AVATAR_URL,
      alt: common[lang].profilePhoto,
      ...dimensions,
    },
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const content = rootPage[lang];
  const pageUrl = `${config.SITE_URL}/${lang}/`;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Person',
              '@id': PERSON_ID,
              name: common[lang].authorName,
              url: config.SITE_URL,
              image: AVATAR_URL,
              sameAs: [config.LINKED_IN, config.GIT_HUB, config.MASTODON],
            },
            {
              '@type': 'WebSite',
              name: common[lang].title,
              description: common[lang].description,
              url: pageUrl,
              inLanguage: lang,
            },
          ],
        }}
      />
      <Nav lang={lang}>
        <nav className='navlinks' aria-label={common[lang].pageSections}>
          <UnstyledLink href='#blog'>{content.blog.name}</UnstyledLink>
          <UnstyledLink href='#services'>{content.services.name}</UnstyledLink>
          <UnstyledLink href='#foss'>{content.foss.name}</UnstyledLink>
        </nav>
      </Nav>
      <Main className='wrap'>
        <About lang={lang} {...content.about} />
        <BlogPreview lang={lang} title={content.blog.name} />
        <Services
          title={content.services.name}
          items={content.services.items}
          foot={content.services.foot}
        />
        <Foss title={content.foss.name} items={content.foss.items} />
      </Main>
    </>
  );
}
