import UnstyledLink from '@/components/links/UnstyledLink';

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
      <UnstyledLink className='root' href={rootHref}>
        {rootLabel}
      </UnstyledLink>
      <span className='sep'>/</span>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <a
            key={tab.id}
            href={`?category=${tab.id}`}
            className={isActive ? 'on' : undefined}
            aria-current={isActive ? 'true' : undefined}
            onClick={(event) => {
              event.preventDefault();
              onSelect(tab.id);
            }}
          >
            {tab.label}
          </a>
        );
      })}
    </nav>
  );
}
