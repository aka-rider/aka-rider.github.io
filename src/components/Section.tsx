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
    <section id={id} className={clsx(className, 'pt-3 flex flex-col')}>
      <h2 className='p-4 md:p-6'>{title}</h2>
      {children}
    </section>
  );
}
