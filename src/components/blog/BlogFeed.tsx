'use client';

import { useEffect, useState } from 'react';

import { PostSummary } from '@/lib/blog/summary';

import PostCard from '@/components/blog/PostCard';
import PostRow from '@/components/blog/PostRow';
import TabNavigation from '@/components/blog/TabNavigation';
import Nav from '@/components/layout/Nav';

import { Lang } from '@/i18n';

export interface FeedCategory {
  slug: string;
  title: string;
  thumbnails: boolean;
  posts: PostSummary[];
}

export default function BlogFeed({
  lang,
  rootTitle,
  categories,
}: {
  lang: Lang;
  rootTitle: string;
  categories: FeedCategory[];
}) {
  const firstCategory = categories[0];
  if (!firstCategory) {
    throw new Error('BlogFeed requires at least one category');
  }

  const [active, setActive] = useState(firstCategory.slug);

  useEffect(() => {
    const category = new URLSearchParams(window.location.search).get('category');
    if (category && categories.some((c) => c.slug === category)) {
      setActive(category);
    }
  }, [categories]);

  const handleSelect = (id: string) => {
    setActive(id);
    window.history.replaceState(null, '', `?category=${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const rootHref = `/${lang}/blog/`;

  return (
    <>
      <Nav lang={lang}>
        <TabNavigation
          rootHref={rootHref}
          rootLabel={rootTitle}
          tabs={categories.map((c) => ({ id: c.slug, label: c.title }))}
          activeTab={active}
          onSelect={handleSelect}
        />
      </Nav>
      <main id='main-content' className='wrap'>
        {categories.map((category) => (
          <section
            key={category.slug}
            id={category.slug}
            className={category.slug === active ? 'panel on' : 'panel'}
            hidden={category.slug !== active}
          >
            <div className='blog-head'>
              <h1>{category.title}</h1>
            </div>
            {category.thumbnails ? (
              <div className='grid'>
                {category.posts.map((post) => (
                  <PostCard key={post.slug} lang={lang} post={post} />
                ))}
              </div>
            ) : (
              <div className='list'>
                {category.posts.map((post) => (
                  <PostRow key={post.slug} lang={lang} post={post} />
                ))}
              </div>
            )}
          </section>
        ))}
      </main>
    </>
  );
}
