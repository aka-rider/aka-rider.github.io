import * as React from 'react';

import { BLOG_NAV_CONTAINER, getBlogNavItemClasses } from '@/lib/blog/styles';
import clsx from '@/lib/clsxm';

interface TabNavigationProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (id: string) => void;
  onSectionClick?: () => void; // Callback for mobile menu close
  className?: string; // Kept for compatibility but might strict it
}

export default function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  onSectionClick,
  className,
}: TabNavigationProps) {
  const handleTabClick = (id: string, event?: React.MouseEvent) => {
    // If we're inside the mobile menu (which Nav usually handles), close it
    onSectionClick?.();

    // Smooth scroll to top when switching tabs, as it changes context
    window.scrollTo({ top: 0, behavior: 'smooth' });

    onTabChange(id);

    // Remove focus to prevent lingering styles
    if (event) {
      (event.currentTarget as HTMLElement).blur();
    }
  };

  return (
    <nav
      className={clsx(
        BLOG_NAV_CONTAINER,
        'gap-4 flex-col md:flex-row',
        className
      )}
      aria-label='Blog categories'
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={(e) => handleTabClick(tab.id, e)}
            type='button'
            className={clsx(getBlogNavItemClasses(isActive), 'cursor-pointer m-0')}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
