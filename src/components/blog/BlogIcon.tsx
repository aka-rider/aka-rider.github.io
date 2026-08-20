'use client';

import { useEffect, useState } from 'react';
import { IconType } from 'react-icons';
import { LuFileText } from 'react-icons/lu';

const prefixToModule: Record<string, () => Promise<Record<string, IconType>>> =
  {
    Fa: () =>
      import('react-icons/fa').then(
        (m) => m as unknown as Record<string, IconType>,
      ),
    Pi: () =>
      import('react-icons/pi').then(
        (m) => m as unknown as Record<string, IconType>,
      ),
    Si: () =>
      import('react-icons/si').then(
        (m) => m as unknown as Record<string, IconType>,
      ),
    Md: () =>
      import('react-icons/md').then(
        (m) => m as unknown as Record<string, IconType>,
      ),
    Bi: () =>
      import('react-icons/bi').then(
        (m) => m as unknown as Record<string, IconType>,
      ),
    Hi: () =>
      import('react-icons/hi').then(
        (m) => m as unknown as Record<string, IconType>,
      ),
    Tb: () =>
      import('react-icons/tb').then(
        (m) => m as unknown as Record<string, IconType>,
      ),
    Lu: () =>
      import('react-icons/lu').then(
        (m) => m as unknown as Record<string, IconType>,
      ),
    Go: () =>
      import('react-icons/go').then(
        (m) => m as unknown as Record<string, IconType>,
      ),
  };

function getPrefix(iconName: string): string | null {
  for (const prefix of Object.keys(prefixToModule)) {
    if (iconName.startsWith(prefix)) {
      return prefix;
    }
  }
  return null;
}

interface BlogIconProps {
  name: string;
  className?: string;
}

export default function BlogIcon({
  name,
  className = 'w-6 h-6',
}: BlogIconProps) {
  const [Icon, setIcon] = useState<IconType | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const prefix = getPrefix(name);
    const loader = prefix ? prefixToModule[prefix] : undefined;
    if (!loader) {
      setIcon(null);
      setLoaded(true);
      return;
    }

    loader()
      .then((module) => {
        if (cancelled) return;
        setIcon(() => module[name] ?? null);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error(`BlogIcon failed to load "${name}"`, error);
        setIcon(null);
      })
      .finally(() => {
        if (cancelled) return;
        setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [name]);

  if (!loaded) {
    return null;
  }

  const FinalIcon = Icon || LuFileText;
  return <FinalIcon className={className} aria-hidden='true' />;
}
