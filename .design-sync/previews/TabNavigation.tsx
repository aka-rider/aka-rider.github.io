import * as React from 'react';

import { TabNavigation } from 'iurii.net';

const blogCategories = [
  { id: 'engineering', label: 'Engineering' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'career', label: 'Career' },
  { id: 'reviews', label: 'Reviews' },
];

function ControlledTabs({ initial }: { initial: string }) {
  const [activeTab, setActiveTab] = React.useState(initial);
  return (
    <TabNavigation
      rootHref='/en/blog/'
      rootLabel='Blog'
      tabs={blogCategories}
      activeTab={activeTab}
      onSelect={setActiveTab}
    />
  );
}

export const Default = () => (
  <div className='max-w-lg'>
    <ControlledTabs initial='engineering' />
  </div>
);

export const LaterTabActive = () => (
  <div className='max-w-lg'>
    <ControlledTabs initial='career' />
  </div>
);

export const Narrow = () => (
  <div className='max-w-[220px]'>
    <ControlledTabs initial='infrastructure' />
  </div>
);
