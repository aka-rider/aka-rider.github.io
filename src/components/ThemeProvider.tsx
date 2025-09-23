'use client';

import { ThemeProvider as ThemeProviderNext } from 'next-themes';

export default function ThemeProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <ThemeProviderNext
      attribute='class'
      enableSystem={true}
      defaultTheme='system'
      enableColorScheme={false}
      disableTransitionOnChange={false}
      storageKey='theme'
    >
      {children}
    </ThemeProviderNext>
  );
}
