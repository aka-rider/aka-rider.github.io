'use client';
import React, { useEffect, useState } from 'react';
import * as BiIcons from 'react-icons/bi';
import * as BsIcons from 'react-icons/bs';
import * as CgIcons from 'react-icons/cg';
import * as DiIcons from 'react-icons/di';
import * as FaIcons from 'react-icons/fa';
import * as FiIcons from 'react-icons/fi';
import * as GiIcons from 'react-icons/gi';
import * as GoIcons from 'react-icons/go';
import * as HiIcons from 'react-icons/hi';
import * as ImIcons from 'react-icons/im';
import * as IoIcons from 'react-icons/io';
import { IconType } from 'react-icons/lib';
import * as LuIcons from 'react-icons/lu';
import * as MdIcons from 'react-icons/md';
import * as PiIcons from 'react-icons/pi';
import * as RiIcons from 'react-icons/ri';
// Import all the icon packages statically
import * as SiIcons from 'react-icons/si';
import * as TbIcons from 'react-icons/tb';
import * as TfiIcons from 'react-icons/tfi';
import * as TiIcons from 'react-icons/ti';
import * as VscIcons from 'react-icons/vsc';
import * as WiIcons from 'react-icons/wi';

// Mapping of icon prefixes to their modules
const prefixToModule: Record<string, any> = {
  Si: SiIcons, // SimpleIcons
  Fa: FaIcons, // FontAwesome
  Md: MdIcons, // Material Design
  Io: IoIcons, // Ionicons
  Fi: FiIcons, // Feather Icons
  Gi: GiIcons, // Game Icons
  Bi: BiIcons, // Bootstrap Icons
  Ti: TiIcons, // Typicons
  Go: GoIcons, // Github Octicons
  Hi: HiIcons, // Heroicons
  Ri: RiIcons, // Remix Icons
  Di: DiIcons, // Devicons
  Wi: WiIcons, // Weather Icons
  Bs: BsIcons, // Bootstrap Icons (alternate)
  Cg: CgIcons, // CSS.gg
  Vsc: VscIcons, // VS Code Icons
  Tb: TbIcons, // Tabler Icons
  Im: ImIcons, // IcoMoon
  Lu: LuIcons, // Lucide Icons
  Tfi: TfiIcons, // Themify Icons
  Pi: PiIcons, // Phosphor Icons
};

type FontIconProps = {
  iconName: string;
  size?: number;
  className?: string;
};

const FontIcon = ({ iconName, size = 24, className = '' }: FontIconProps) => {
  const [Icon, setIcon] = useState<IconType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadIcon = () => {
      try {
        // Determine the module based on the icon prefix
        let iconModule = null;

        // Find matching prefix
        for (const p of Object.keys(prefixToModule)) {
          if (iconName.startsWith(p)) {
            iconModule = prefixToModule[p];
            break;
          }
        }

        if (!iconModule) {
          setIsLoading(false);
          return;
        }

        // Check if the icon exists in the loaded module
        if (iconModule[iconName]) {
          setIcon(() => iconModule[iconName]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadIcon();
  }, [iconName]);

  if (isLoading) {
    return (
      <div className='animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary'></div>
    );
  }

  if (!Icon) {
    return <></>;
  }

  // Render just the icon
  return React.createElement(Icon, { size, className });
};

export default FontIcon;
