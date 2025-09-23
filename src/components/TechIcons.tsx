import React from 'react';
import { IconType } from 'react-icons';

interface TechIconsProps {
  icons: {
    icon: IconType;
    size: number;
    title: string;
  }[];
}

export default function TechIcons({ icons }: TechIconsProps) {
  return (
    <div className='flex flex-wrap gap-4 justify-center p-4'>
      {icons.map((icon, index) => (
        <div key={index} className='flex flex-col items-center gap-2'>
          <icon.icon size={icon.size} />
          <span className='text-sm text-center leading-tight w-16 break-words'>
            {icon.title || '\u00A0'}
          </span>
        </div>
      ))}
    </div>
  );
}
