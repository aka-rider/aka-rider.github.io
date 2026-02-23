import * as React from 'react';

import clsx from '@/lib/clsxm';

import { NAV_CONTAINER_CLASSES, NavigationItem } from '@/components/layout/NavigationPrimitives';

interface TabNavigationProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (id: string) => void;
  onSectionClick?: () => void; // Callback for mobile menu close
  className?: string;
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
      className={clsx(NAV_CONTAINER_CLASSES, className)}
      aria-label='Blog categories'
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <NavigationItem
            key={tab.id}
            isActive={isActive}
            label={tab.label}
            onClick={(e) => handleTabClick(tab.id, e)}
            role="tab"
            aria-selected={isActive}
          />
        );
      })}
    </nav>
  );
}
