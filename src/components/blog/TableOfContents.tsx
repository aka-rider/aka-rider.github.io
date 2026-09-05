import { TocItem } from '@/lib/blog/compile';

export default function TableOfContents({ items, label }: { items: TocItem[]; label: string }) {
  return (
    <details className='toc-m'>
      <summary>{label}</summary>
      {items.map((item) => (
        <a key={item.id} href={`#${item.id}`} className={item.depth === 3 ? 'sub' : undefined}>
          {item.text}
        </a>
      ))}
    </details>
  );
}
