import * as React from 'react';
import { IconType } from 'react-icons';

import clsxm from '@/lib/clsxm';

import UnstyledLink, {
  UnstyledLinkProps,
} from '@/components/links/UnstyledLink';

type ButtonLinkVariant = 'primary' | 'outline' | 'ghost' | 'light' | 'dark';
type ButtonLinkSize = 'sm' | 'base';

type ButtonLinkProps = {
  variant?: ButtonLinkVariant;
  size?: ButtonLinkSize;
  leftIcon?: IconType;
  rightIcon?: IconType;
  leftIconClassName?: string;
  rightIconClassName?: string;
} & UnstyledLinkProps;

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'base',
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      leftIconClassName,
      rightIconClassName,
      ...rest
    },
    ref,
  ) => {
    return (
      <UnstyledLink
        ref={ref}
        {...rest}
        className={clsxm(
          'inline-flex items-center rounded font-medium',
          'focus-visible:ring-primary-500 focus:outline-none focus-visible:ring',
          'shadow-sm',
          'transition-colors duration-150',
          //#region  //*=========== Size ===========
          [
            size === 'base' && ['px-3 py-1.5', 'text-sm md:text-base'],
            size === 'sm' && ['px-2 py-1', 'text-xs md:text-sm'],
          ],
          //#endregion  //*======== Size ===========
          //#region  //*=========== Variants ===========
          [
            variant === 'primary' && [
              'bg-primary-500 text-white',
              'border-sky-600 border',
              'hover:bg-sky-600 hover:text-white',
              'active:bg-primary-700',
              'disabled:bg-primary-700',
            ],
            variant === 'outline' && [
              'text-primary-500',
              'border-primary-500 border',
              'hover:bg-primary-50 dark:hover:bg-slate-800',
              'active:bg-primary-100 dark:active:bg-slate-700',
              'disabled:bg-primary-100 dark:disabled:bg-slate-700',
            ],
            variant === 'ghost' && [
              'text-primary-500',
              'shadow-none',
              'hover:bg-primary-50 dark:hover:bg-slate-800',
              'active:bg-primary-100 dark:active:bg-slate-700',
              'disabled:bg-primary-100 dark:disabled:bg-slate-700',
            ],
            variant === 'light' && [
              'bg-white text-slate-700',
              'border border-slate-200',
              'hover:text-dark hover:bg-slate-100',
              'active:bg-white/80 disabled:bg-slate-200',
            ],
            variant === 'dark' && [
              'bg-slate-950 text-white',
              'border border-slate-600',
              'hover:bg-slate-800 active:bg-slate-700 disabled:bg-slate-700',
            ],
          ],
          //#endregion  //*======== Variants ===========
          'disabled:cursor-not-allowed',
          className,
        )}
      >
        {LeftIcon && (
          <div
            className={clsxm([
              size === 'base' && 'mr-1',
              size === 'sm' && 'mr-1.5',
            ])}
          >
            <LeftIcon
              className={clsxm(
                [
                  size === 'base' && 'md:text-md text-md',
                  size === 'sm' && 'md:text-md text-sm',
                ],
                leftIconClassName,
              )}
            />
          </div>
        )}
        {children}
        {RightIcon && (
          <div
            className={clsxm([
              size === 'base' && 'ml-1',
              size === 'sm' && 'ml-1.5',
            ])}
          >
            <RightIcon
              className={clsxm(
                [
                  size === 'base' && 'text-md md:text-md',
                  size === 'sm' && 'md:text-md text-sm',
                ],
                rightIconClassName,
              )}
            />
          </div>
        )}
      </UnstyledLink>
    );
  },
);

export default ButtonLink;
