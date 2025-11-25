import clsx from '@/lib/clsxm';

export default function Section({
  id,
  title,
  className = '',
  children,
}: {
  id: string;
  title: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={clsx(className, 'pt-10 flex flex-col')}>
      <h2 className='pb-2 md:pb-3'>{title}</h2>
      {children}
    </section>
  );
}
