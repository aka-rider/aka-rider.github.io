'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { Suspense, useCallback } from 'react';

import { Post } from '@/lib/blog/types';

import BlogPostPreview from '@/components/blog/BlogPostPreview';
import TabNavigation from '@/components/blog/TabNavigation';
import VisualPostPreview from '@/components/blog/VisualPostPreview';
import Nav from '@/components/layout/Nav';

import { Lang } from '@/i18n';

// Simplified category interface for client-side consumption
export interface FeedCategory {
  slug: string;
  title: string;
  thumbnails: boolean;
  posts: Array<Post & { href: string }>;
}

type BlogFeedProps = {
  lang: Lang;
  categories: FeedCategory[];
};

function BlogFeedInner({ lang, categories }: BlogFeedProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const categoryParam = searchParams.get('category');

  const activeTab = (categoryParam && categories.some(c => c.slug === categoryParam))
    ? categoryParam
    : categories[0]?.slug || '';

  const activeCategory = categories.find((c) => c.slug === activeTab) || categories[0];

  const handleTabChange = useCallback((id: string) => {
    router.push(`${pathname}?category=${id}`, { scroll: false });
  }, [router, pathname]);

  if (!activeCategory) return null;

  const navigation = (
    <TabNavigation
      tabs={categories.map((c) => ({ id: c.slug, label: c.title }))}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    />
  );

  const isVisualMode = activeCategory.thumbnails === true;
  const posts = activeCategory.posts;

  return (
    <>
      <Nav lang={lang}>
        {navigation}
      </Nav>

      <div className='min-h-screen pb-20 mt-8'>
        <div className='layout'>
          <div
            key={activeTab}
            className="animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both"
          >
            {isVisualMode ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8'>
                {posts.map((post) => (
                  <VisualPostPreview
                    key={post.slug}
                    lang={lang}
                    post={post}
                    href={post.href}
                  />
                ))}
              </div>
            ) : (
              <div className='flex flex-col divide-y divide-gray-200 dark:divide-gray-800'>
                {posts.map((post) => (
                  <BlogPostPreview
                    key={post.slug}
                    lang={lang}
                    post={post}
                    href={post.href}
                    thumbnail={false}
                    className='py-6 first:pt-0 last:pb-0'
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function BlogFeed(props: BlogFeedProps) {
  return (
    <Suspense fallback={<Nav lang={props.lang}>{null}</Nav>}>
      <BlogFeedInner {...props} />
    </Suspense>
  );
}
