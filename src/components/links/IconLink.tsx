import * as React from 'react';
import { IconType } from 'react-icons';

import clsxm from '@/lib/clsxm';

import UnstyledLink, {
  UnstyledLinkProps,
} from '@/components/links/UnstyledLink';

type IconLinkVariant = 'primary' | 'outline' | 'ghost' | 'light' | 'dark';

type IconLinkProps = {
  isDarkBg?: boolean;
  variant?: IconLinkVariant;
  icon?: IconType;
  iconClassName?: string;
} & Omit<UnstyledLinkProps, 'children'>;

const IconLink = React.forwardRef<HTMLAnchorElement, IconLinkProps>(
  (
    {
      className,
      icon: Icon,
      variant = 'outline',
      isDarkBg = false,
      iconClassName,
      ...rest
    },
    ref,
  ) => {
    return (
      <UnstyledLink
        ref={ref}
        type='button'
        className={clsxm(
          'inline-flex items-center justify-center rounded font-medium',
          'focus-visible:ring-primary-500 focus:outline-none focus-visible:ring',
          'shadow-sm',
          'transition-colors duration-150',
          'min-h-[28px] min-w-[28px] p-1 md:min-h-[34px] md:min-w-[34px] md:p-2',
          //#region  //*=========== Variants ===========
          [
            variant === 'primary' && [
              'bg-primary-500 text-white',
              'border-primary-600 border',
              'hover:bg-primary-600 hover:text-white',
              'active:bg-primary-700',
              'disabled:bg-primary-700',
            ],
            variant === 'outline' && [
              'text-primary-500',
              'border-primary-500 border',
              'hover:bg-primary-50 active:bg-primary-100 disabled:bg-primary-100',
              isDarkBg &&
              'hover:bg-neutral-800 active:bg-neutral-700 disabled:bg-neutral-700',
            ],
            variant === 'ghost' && [
              'text-primary-500',
              'shadow-none',
              'hover:bg-primary-50 active:bg-primary-100 disabled:bg-primary-100',
              isDarkBg &&
              'hover:bg-neutral-800 active:bg-neutral-700 disabled:bg-neutral-700',
            ],
            variant === 'light' && [
              'bg-white text-neutral-700',
              'border border-neutral-300',
              'hover:text-dark hover:bg-neutral-100',
              'active:bg-white/80 disabled:bg-neutral-200',
            ],
            variant === 'dark' && [
              'bg-neutral-900 text-white',
              'border border-neutral-600',
              'hover:bg-neutral-800 active:bg-neutral-700 disabled:bg-neutral-700',
            ],
          ],
          //#endregion  //*======== Variants ===========
          'disabled:cursor-not-allowed',
          className,
        )}
        {...rest}
      >
        {Icon && <Icon className={clsxm(iconClassName)} />}
      </UnstyledLink>
    );
  },
);

export default IconLink;
