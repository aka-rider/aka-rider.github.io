import Link from 'next/link';

export interface TabNavigationProps {
  rootHref: string;
  rootLabel: string;
  tabs: { id: string; label: string }[];
  activeTab: string;
  onSelect: (id: string) => void;
}

export default function TabNavigation({
  rootHref,
  rootLabel,
  tabs,
  activeTab,
  onSelect,
}: TabNavigationProps) {
  return (
    <nav className='navlinks' aria-label={rootLabel}>
      <Link className='root' href={rootHref}>
        {rootLabel}
      </Link>
      <span className='sep'>/</span>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type='button'
            className={isActive ? 'on' : undefined}
            role='tab'
            aria-selected={isActive}
            onClick={() => onSelect(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
