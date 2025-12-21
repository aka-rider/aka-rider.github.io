'use client';

/**
 * Blog category icon component with dynamic imports.
 * Loads icons on-demand based on icon name from _meta.json.
 * No hardcoded registry — just add icon name to _meta.json.
 */
import { useEffect, useState } from 'react';
import { IconType } from 'react-icons';
import { LuFileText } from 'react-icons/lu';

/**
 * Maps icon prefixes to their react-icons module paths.
 * Only prefixes actually used in blog categories need to be listed.
 */
const prefixToModule: Record<string, () => Promise<Record<string, IconType>>> = {
  Fa: () => import('react-icons/fa').then((m) => m as unknown as Record<string, IconType>),
  Pi: () => import('react-icons/pi').then((m) => m as unknown as Record<string, IconType>),
  Si: () => import('react-icons/si').then((m) => m as unknown as Record<string, IconType>),
  Md: () => import('react-icons/md').then((m) => m as unknown as Record<string, IconType>),
  Bi: () => import('react-icons/bi').then((m) => m as unknown as Record<string, IconType>),
  Hi: () => import('react-icons/hi').then((m) => m as unknown as Record<string, IconType>),
  Tb: () => import('react-icons/tb').then((m) => m as unknown as Record<string, IconType>),
  Lu: () => import('react-icons/lu').then((m) => m as unknown as Record<string, IconType>),
  Go: () => import('react-icons/go').then((m) => m as unknown as Record<string, IconType>),
};

function getPrefix(iconName: string): string | null {
  // Match 2-3 letter prefix (e.g., "Fa", "Si", "Tfi")
  for (const prefix of Object.keys(prefixToModule)) {
    if (iconName.startsWith(prefix)) {
      return prefix;
    }
  }
  return null;
}

interface BlogIconProps {
  name: string;
  size?: number;
  className?: string;
}

/**
 * Renders a blog category icon, dynamically imported.
 * Falls back to a generic document icon if not found.
 */
export default function BlogIcon({ name, size = 24, className }: BlogIconProps) {
  const [Icon, setIcon] = useState<IconType | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const prefix = getPrefix(name);
    if (!prefix) {
      setLoaded(true);
      return;
    }

    const loader = prefixToModule[prefix];
    if (!loader) {
      setLoaded(true);
      return;
    }

    loader().then((module) => {
      const IconComponent = module[name];
      if (IconComponent) {
        setIcon(() => IconComponent);
      }
      setLoaded(true);
    });
  }, [name]);

  if (!loaded) {
    return null;
  }

  const FinalIcon = Icon || LuFileText;
  return <FinalIcon size={size} className={className} aria-hidden='true' />;
}
