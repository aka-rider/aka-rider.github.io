import React from 'react';

import Card from '@/components/Card';

interface ServiceCardProps {
  title: string;
  proposition: string;
}

export default function ServiceCard({
  title,
  proposition,
}: ServiceCardProps) {
  return (
    <Card title={title} className='hover:border-transparent hover:bg-transparent hover:shadow-none hover:translate-y-0'>
      <p className='text-slate-600 dark:text-slate-300 leading-relaxed'>
        {proposition}
      </p>
    </Card>
  );
}
