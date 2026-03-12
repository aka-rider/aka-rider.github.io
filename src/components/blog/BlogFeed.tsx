'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';

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

export default function BlogFeed({ lang, categories }: BlogFeedProps) {
  // Default to the first category, will be updated by useEffect on mount if hash exists
  const [activeTab, setActiveTab] = useState<string>(() => {
    return categories[0]?.slug || '';
  });

  // Sync state if URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && categories.some(c => c.slug === hash)) {
        setActiveTab(hash);
      }
    };

    // Run once on mount to capture initial hash
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [categories]);

  const activeCategory = categories.find((c) => c.slug === activeTab) || categories[0];

  if (!activeCategory) return null;

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    window.history.replaceState(null, '', `#${id}`);
  };

  // We define the navigation logic here so we can pass it to the Nav component
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
          {/*
            Using a key on the container force re-render for animation trigger.
            Using simple CSS animation classes from tailwind-animate/standard CSS if available
            or fallback to standard classes
          */}
          <div
            key={activeTab}
            className="animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both"
          >
            {isVisualMode ? (
              /* Visual Grid Layout */
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
              /* Technical List Layout */
              <div className='flex flex-col divide-y divide-gray-200 dark:divide-gray-800'>
                {posts.map((post) => (
                  <BlogPostPreview
                    key={post.slug}
                    lang={lang}
                    post={post}
                    href={post.href}
                    thumbnail={false} // Force minimal text-only mode
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
