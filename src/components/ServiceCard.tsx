import React from 'react';
import { IconType } from 'react-icons';

import Card from '@/components/Card';

interface ServiceCardProps {
  title: string;
  proposition: string;
  icons: {
    lvl1?: readonly { readonly icon: IconType; readonly title: string }[];
    lvl2?: readonly { readonly icon: IconType; readonly title: string }[];
    lvl3?: readonly { readonly icon: IconType; readonly title: string }[];
  };
}

export default function ServiceCard({
  title,
  proposition,
  icons,
}: ServiceCardProps) {
  return (
    <Card title={title}>
      <p className='text-slate-600 dark:text-slate-300 mb-4 leading-relaxed'>
        {proposition}
      </p>

      <div className='space-y-4'>
        {/* Level 1 Icons - Largest */}
        {icons.lvl1 && icons.lvl1.length > 0 && (
          <div className='flex flex-wrap gap-4 justify-center'>
            {icons.lvl1.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className='flex flex-col items-center gap-1'>
                  <Icon
                    className='w-12 h-12 text-slate-800 dark:text-slate-200 transition-colors duration-200'
                    aria-hidden='true'
                  />
                  <span className='text-xs text-slate-700 dark:text-slate-300 text-center max-w-20'>
                    {item.title}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Level 2 Icons - Medium */}
        {icons.lvl2 && icons.lvl2.length > 0 && (
          <div className='flex flex-wrap gap-2 justify-center'>
            {icons.lvl2.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className='flex flex-col items-center gap-1'>
                  <Icon
                    className='w-8 h-8 text-slate-600 dark:text-slate-400 transition-colors duration-200'
                    aria-hidden='true'
                  />
                  <span className='text-xs text-slate-600 dark:text-slate-400 text-center max-w-20'>
                    {item.title}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Level 3 Icons - Smallest */}
        {icons.lvl3 && icons.lvl3.length > 0 && (
          <div className='flex flex-wrap gap-2 justify-center'>
            {icons.lvl3.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className='flex flex-col items-center gap-1'>
                  <Icon
                    className='w-6 h-6 text-slate-500 dark:text-slate-500 transition-colors duration-200'
                    aria-hidden='true'
                  />
                  <span className='text-xs text-slate-500 dark:text-slate-500 text-center max-w-20'>
                    {item.title}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
