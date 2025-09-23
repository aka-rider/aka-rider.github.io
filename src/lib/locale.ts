import { NextRouter } from 'next/router';
export default function useLocale(router: NextRouter): string {
  const { locale, defaultLocale } = router;
  if (!locale && !defaultLocale) {
    throw new Error("Both 'locale' and 'defaultLocale' are undefined.");
  }
  return (locale || defaultLocale) as string;
}
