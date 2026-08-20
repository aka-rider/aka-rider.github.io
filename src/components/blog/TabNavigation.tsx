import * as React from 'react';

import clsx from '@/lib/clsxm';

import {
  NAV_CONTAINER_CLASSES,
  NavigationItem,
} from '@/components/layout/NavigationPrimitives';

import { common, Lang } from '@/i18n';

interface TabNavigationProps {
  lang: Lang;
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (id: string) => void;
  onSectionClick?: () => void;
  className?: string;
}

export default function TabNavigation({
  lang,
  tabs,
  activeTab,
  onTabChange,
  onSectionClick,
  className,
}: TabNavigationProps) {
  const handleTabClick = (id: string, event?: React.MouseEvent) => {
    onSectionClick?.();

    window.scrollTo({ top: 0, behavior: 'smooth' });

    onTabChange(id);

    if (event) {
      (event.currentTarget as HTMLElement).blur();
    }
  };

  return (
    <nav
      className={clsx(NAV_CONTAINER_CLASSES, className)}
      aria-label={common[lang].blogCategories}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <NavigationItem
            key={tab.id}
            isActive={isActive}
            label={tab.label}
            onClick={(e) => handleTabClick(tab.id, e)}
          />
        );
      })}
    </nav>
  );
}
