import React from 'react';

import Card from '@/components/Card';
import FontIcon from '@/components/FontIcon';

interface ServiceCardProps {
  title: string;
  proposition: string;
  icons: {
    lvl1?: readonly { readonly icon: string; readonly title: string }[];
    lvl2?: readonly { readonly icon: string; readonly title: string }[];
    lvl3?: readonly { readonly icon: string; readonly title: string }[];
  };
}

export default function ServiceCard({
  title,
  proposition,
  icons,
}: ServiceCardProps) {
  return (
    <Card title={title}>
      <p className='text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed'>
        {proposition}
      </p>

      <div className='space-y-4'>
        {/* Level 1 Icons - Largest */}
        {icons.lvl1 && icons.lvl1.length > 0 && (
          <div className='flex flex-wrap gap-4 justify-center'>
            {icons.lvl1.map((item, index) => (
              <div key={index} className='flex flex-col items-center gap-1'>
                <FontIcon
                  iconName={item.icon}
                  size={48}
                  className='text-neutral-800 dark:text-neutral-200 transition-colors duration-200'
                />
                <span className='text-xs text-neutral-700 dark:text-neutral-300 text-center max-w-20'>
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Level 2 Icons - Medium */}
        {icons.lvl2 && icons.lvl2.length > 0 && (
          <div className='flex flex-wrap gap-2 justify-center'>
            {icons.lvl2.map((item, index) => (
              <div key={index} className='flex flex-col items-center gap-1'>
                <FontIcon
                  iconName={item.icon}
                  size={36}
                  className='text-neutral-600 dark:text-neutral-400 transition-colors duration-200'
                />
                <span className='text-xs text-neutral-600 dark:text-neutral-400 text-center max-w-20'>
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Level 3 Icons - Smallest */}
        {icons.lvl3 && icons.lvl3.length > 0 && (
          <div className='flex flex-wrap gap-2 justify-center'>
            {icons.lvl3.map((item, index) => (
              <div key={index} className='flex flex-col items-center gap-1'>
                <FontIcon
                  iconName={item.icon}
                  size={24}
                  className='text-neutral-500 dark:text-neutral-500 transition-colors duration-200'
                />
                <span className='text-xs text-neutral-500 dark:text-neutral-500 text-center max-w-20'>
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
