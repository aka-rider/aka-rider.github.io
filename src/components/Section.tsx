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
    <section id={id} className={clsx('py-8 md:py-16 flex flex-col', className)}>
      <h2 className='p-4 md:p-6'>{title}</h2>
      {children}
    </section>
  );
}
