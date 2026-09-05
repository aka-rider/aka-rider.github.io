'use client';

import { useEffect, useState } from 'react';

import { TocItem } from '@/lib/blog/compile';

export default function TocSidebar({ items, label }: { items: TocItem[]; label: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('.post .hero-img');
    if (!hero) {
      setShow(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setShow(!entry?.isIntersecting),
      { rootMargin: '-80px 0px 0px 0px' },
    );
    observer.observe(hero);

    return () => observer.disconnect();
  }, []);

  return (
    <aside className={show ? 'toc show' : 'toc'}>
      <p className='h'>{label}</p>
      {items.map((item) => (
        <a key={item.id} href={`#${item.id}`} className={item.depth === 3 ? 'sub' : undefined}>
          {item.text}
        </a>
      ))}
    </aside>
  );
}
