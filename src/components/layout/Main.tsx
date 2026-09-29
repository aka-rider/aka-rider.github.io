import type { ReactNode } from 'react';

export default function Main({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main id='main-content' tabIndex={-1} className={className}>
      {children}
    </main>
  );
}
